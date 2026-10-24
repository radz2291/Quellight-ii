import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { z } from 'zod';
import { config } from './config.mjs';
import { gateway,snapshot,AppError } from './gateway.mjs';
import { closePools } from './db.mjs';
import { streamCompanion } from './model.mjs';
const port=Number(process.env.QL_PORT||4318),origin='http://127.0.0.1:'+port;
const frontend=process.env.QL_FRONTEND_ORIGIN;
if(frontend&&!/^http:\/\/127\.0\.0\.1:\d+$/.test(frontend))throw Error('Local frontend required');
const sessions=new Map(),subscribers=new Set();
let attempts=0,windowStart=Date.now();
function session(req){const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('ql_session='))?.slice(11);const s=sessions.get(token);if(!s||s.expires<Date.now()){sessions.delete(token);return null;}return {...s,token};}
async function body(req){let bytes=0;const chunks=[];for await(const b of req){bytes+=b.length;if(bytes>32768)throw new AppError('request_too_large',413);chunks.push(b);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new AppError('invalid_json');}}
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));}
const loginSchema=z.object({username:z.enum(['alice','bob']),password:z.string().min(1).max(200)}).strict();
export const server=http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
 try {
  if(req.headers.host!==new URL(origin).host)throw new AppError('invalid_host',403);
  const url=new URL(req.url,origin);
  if(url.search)throw new AppError('unexpected_parameters');
  if(req.method==='POST') {
   if(![origin,frontend].filter(Boolean).includes(req.headers.origin)||!/^application\/json(?:;|$)/.test(req.headers['content-type']||''))throw new AppError('origin_or_content_type',403);
  }
  if(req.method==='GET'&&['/','/app.js','/style.css'].includes(url.pathname)) {
   const file=url.pathname==='/'?'index.html':url.pathname.slice(1);
   res.setHeader('Content-Type',file.endsWith('html')?'text/html; charset=utf-8':file.endsWith('css')?'text/css':'text/javascript');res.end(await readFile('public/'+file));return;
  }
  if(req.method==='GET'&&url.pathname==='/health'){json(res,200,{mode:'local-synthetic',ok:true});return;}
  if(req.method==='POST'&&url.pathname==='/api/login') {
   if(Date.now()-windowStart>60000){attempts=0;windowStart=Date.now();}
   if(++attempts>20)throw new AppError('try_later',429);
   const result=loginSchema.safeParse(await body(req));if(!result.success)throw new AppError('invalid_credentials',401);
   const {username,password}=result.data;const c=await config();
   const check=new pg.Client({host:c.host,port:c.port,database:c.database,user:username,password,connectionTimeoutMillis:3000});
   try {await check.connect();const who=(await check.query('SELECT session_user AS principal')).rows[0].principal;if(who!==username)throw Error('mismatch');}
   catch {throw new AppError('invalid_credentials',401);}finally{await check.end();}
   const old=session(req);if(old)sessions.delete(old.token);
   const token=randomBytes(32).toString('hex');sessions.set(token,{owner:username,expires:Date.now()+8*3600000});
   res.setHeader('Set-Cookie',`ql_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`);json(res,200,{owner:username});return;
  }
  const s=session(req);if(!s)throw new AppError('unauthenticated',401);
  // Optional UI precondition detects stale intents after an owner switch. It grants no identity.
  if(req.headers['x-ql-owner-context']&&req.headers['x-ql-owner-context']!==s.owner)throw new AppError('owner_context_changed',409);
  if(req.method==='GET'&&url.pathname==='/api/me'){json(res,200,{owner:s.owner});return;}
  if(req.method==='POST'&&url.pathname==='/api/logout') {await body(req);sessions.delete(s.token);res.setHeader('Set-Cookie','ql_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');json(res,200,{ok:true});return;}
  if(req.method==='GET'&&url.pathname==='/api/activity'){json(res,200,await snapshot(s.owner));return;}
  if(req.method==='GET'&&url.pathname==='/api/events') {
   res.writeHead(200,{'Content-Type':'text/event-stream','Connection':'keep-alive'});subscribers.add(res);
   let active=true,busy=false,last='';
   const send=async()=>{
    if(!active||busy)return;busy=true;
    try {
     if(!session(req)){res.end();return;}
     const value=JSON.stringify(await snapshot(s.owner));if(value!==last){res.write('data: '+value+'\n\n');last=value;}
    }catch{res.end();}finally{busy=false;}
   };
   const timer=setInterval(send,700);res.on('close',()=>{active=false;clearInterval(timer);subscribers.delete(res);});await send();return;
  }
  if(req.method==='POST'&&url.pathname==='/api/chat') {
   const parsed=z.object({message:z.string().min(1).max(16000)}).strict().safeParse(await body(req));if(!parsed.success)throw new AppError('invalid_request');
   // Intentionally fixed fake response: do not misrepresent this as model reasoning/memory.
   const abort=new AbortController();res.on('close',()=>abort.abort());res.writeHead(200,{'Content-Type':'application/x-ndjson'});
   try {const result=await streamCompanion({signal:abort.signal,discover:()=>gateway(s.owner,'discover',{}),onText:chunk=>{if(!res.destroyed)res.write(JSON.stringify({text:chunk})+'\n');}});
    if(!res.destroyed)res.end(JSON.stringify({done:true,modelCalls:result.modelCalls})+'\n');
   }catch{if(!res.destroyed)res.end(JSON.stringify({error:'stream_interrupted'})+'\n');}return;
  }
  if(req.method==='POST'&&url.pathname.startsWith('/api/ops/')) {json(res,200,await gateway(s.owner,url.pathname.slice('/api/ops/'.length),await body(req)));return;}
  throw new AppError('not_found',404);
 }catch(e){if(!res.headersSent)json(res,e instanceof AppError?e.status:500,{error:e instanceof AppError?e.code:'request_failed'});else res.end();}
});
server.requestTimeout=10000;server.headersTimeout=5000;
server.listen(port,'127.0.0.1',()=>console.log('Quellight synthetic proof: '+origin));
async function shutdown(){for(const res of subscribers)res.end();server.closeAllConnections();server.close();await closePools();process.exit(0);}
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
