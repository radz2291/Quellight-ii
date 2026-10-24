// Fresh verifier probes, run from repository root: node docs/cycle-1/verification-probes/independent-01.mjs
import assert from 'node:assert/strict';
import {fork,execFileSync} from 'node:child_process';
import {once} from 'node:events';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import pg from 'pg';
import {chromium} from 'playwright';
process.env.QL_DATA_DIR=path.resolve('tmp/independent-'+Date.now()+'-'+process.pid);
process.env.QL_DB_PORT=String(53000+process.pid%1000);process.env.QL_PORT=String(42000+process.pid%1000);
const {config}=await import('../../../src/config.mjs');
const {gateway,snapshot}=await import('../../../src/gateway.mjs');
const {pool,closePools}=await import('../../../src/db.mjs');
const {claim,applyEffect,finish,renew,processRun}=await import('../../../src/worker-runtime.mjs');
const children=[];let browser,admin;const logs=[];const passed=[];const findings=[];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const fixture=(extra={})=>({key:randomUUID(),kind:'note',data:{title:'Independent synthetic record'},source:'Independent synthetic source',...extra});
async function start(file,args=[],env={}){const child=fork(file,args,{silent:true,env:{...process.env,...env}});children.push(child);child.stdout.on('data',b=>logs.push(String(b)));child.stderr.on('data',b=>logs.push(String(b)));return child;}
async function stop(child){if(child?.exitCode===null&&child.signalCode===null){child.kill('SIGKILL');await once(child,'exit');}}
async function ready(file,args=[],env={}){const child=await start(file,args,env);await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('start timeout')),30000);child.stdout.on('data',b=>{if(/listening|synthetic proof/.test(String(b))){clearTimeout(t);resolve();}});child.once('exit',()=>{clearTimeout(t);reject(Error('early exit'));});});return child;}
try{
 await ready('scripts/local-db.mjs',['start']);execFileSync(process.execPath,['scripts/setup.mjs'],{stdio:'pipe'});const c=await config();admin=new pg.Client({host:c.host,port:c.port,user:'postgres',password:c.admin,database:c.database});await admin.connect();
 const sentinel='SYNTHETIC_VERIFIER_PRIVATE_'+randomUUID();const a=await gateway('alice','create',fixture({source:sentinel,data:{title:sentinel}}));const bp=await pool('bob');
 for(const sql of ['SET ROLE worker_alice','SET SESSION AUTHORIZATION alice','ALTER TABLE ql.records DISABLE ROW LEVEL SECURITY','DELETE FROM ql.sources','UPDATE ql.definitions SET version=99'])await assert.rejects(bp.query(sql));
 await bp.query('SET row_security=off');await assert.rejects(bp.query('SELECT * FROM ql.records'));await bp.query('SET row_security=on');
 await assert.rejects(bp.query('INSERT INTO ql.records(id,source_id,kind,data) VALUES($1,$2,$3,$4)',[randomUUID(),a.sourceId,'note',{title:'IDOR'}]));
 for(const table of ['sources','records','revisions','operations','runs','outbox','effects','events'])assert.equal((await bp.query('SELECT * FROM ql.'+table+" WHERE owner_id='alice'")).rowCount,0);
 passed.push('Direct database role/session/DDL/RLS-off/IDOR and all eight owner tables deny cross-owner access');
 const same=fixture();const races=await Promise.allSettled([gateway('alice','create',same),gateway('alice','create',{...same,source:'different'})]);assert.equal(races.filter(r=>r.status==='fulfilled').length,1);assert.equal(races.filter(r=>r.status==='rejected'&&r.reason.message==='idempotency_conflict').length,1);
 const foreign=await gateway('bob','create',{...same,source:'Bob independent same key'});assert.ok(foreign.id);const update={key:randomUUID(),id:a.id,expectedVersion:1,data:{title:'A corrected'}};
 const duplicates=await Promise.all(Array.from({length:12},()=>gateway('alice','update',update)));assert.ok(duplicates.every(v=>v.version===2));const h=await gateway('alice','history',{id:a.id});assert.equal(h.revisions.length,2);assert.equal(h.source.body,sentinel);assert.equal(h.events.length,2);
 passed.push('Concurrent conflicting keys serialize; owner key namespace isolated; twelve duplicate edits create one revision with original provenance');
 // Actual process crash before effect, then stale renewal/effect/completion rejected.
 const q=await gateway('alice','enqueue',fixture());const worker=await start('src/worker.mjs',['alice'],{QL_TEST_PAUSE:'before-effect',QL_WORKER_ONCE:'1'});await Promise.race([once(worker,'message'),wait(20000).then(()=>{throw Error('worker timeout');})]);
 const wp=await pool('worker_alice');const stale=(await wp.query('SELECT * FROM ql.runs WHERE id=$1',[q.runId])).rows[0];await stop(worker);assert.equal((await wp.query('SELECT * FROM ql.effects WHERE run_id=$1',[q.runId])).rowCount,0);await wait(1800);
 for(const fn of [renew,applyEffect,finish])await assert.rejects(fn('worker_alice',stale),/lease_lost/);assert.equal((await snapshot('alice')).runs.find(r=>r.id===q.runId).visible_status,'stalled');const revived=await claim('worker_alice');await processRun('worker_alice',revived);assert.equal((await wp.query('SELECT * FROM ql.effects WHERE run_id=$1',[q.runId])).rowCount,1);
 passed.push('Actual before-effect process kill leaves zero effect; expiry stalls; stale renew/effect/finish denied; recovery commits once');
 // Simultaneous cancel/effect serializes on live run; no effect after successful cancellation.
 for(let i=0;i<20;i++){const queued=await gateway('alice','enqueue',fixture());const r=await claim('worker_alice');await Promise.allSettled([gateway('alice','cancel',{key:randomUUID(),id:queued.runId}),applyEffect('worker_alice',r)]);const state=(await snapshot('alice')).runs.find(x=>x.id===queued.runId);assert.equal(state.status,'cancelled');await assert.rejects(applyEffect('worker_alice',r),/lease_lost/);assert.ok((await wp.query('SELECT * FROM ql.effects WHERE run_id=$1',[r.id])).rowCount<=1);}
 passed.push('Twenty concurrent cancel/effect races preserve cancelled fence and at most one pre-cancel committed effect');
 await ready('src/server.mjs');const origin='http://127.0.0.1:'+process.env.QL_PORT;
 const req=(route,body,cookie='')=>fetch(origin+route,{method:body===undefined?'GET':'POST',headers:{Cookie:cookie,...(body===undefined?{}:{Origin:origin,'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body)});
 const login=async owner=>{const res=await req('/api/login',{username:owner,password:c.users[owner]});assert.equal(res.status,200);return res.headers.get('set-cookie').split(';')[0];};
 let ac=await login('alice'),bc=await login('bob');
 for(const payload of [{...fixture(),owner:'alice'},{...fixture(),role:'postgres'},{...fixture(),sql:'SELECT *'}])assert.equal((await req('/api/ops/create',payload,bc)).status,400);
 assert.equal((await req('/api/ops/update',{key:randomUUID(),id:a.id,expectedVersion:2,data:{title:'stolen'}},bc)).status,404);
 const streamAbort=new AbortController();const sse=await fetch(origin+'/api/events',{headers:{Cookie:ac},signal:streamAbort.signal});const reader=sse.body.getReader();let text=new TextDecoder().decode((await reader.read()).value);assert.ok(!text.includes(sentinel));await req('/api/logout',{},ac);const closed=await Promise.race([reader.read(),wait(2500).then(()=>({done:false}))]);assert.equal(closed.done,true);streamAbort.abort();
 passed.push('HTTP owner/role/SQL envelope forgery and write IDOR denied; live SSE closes after logout and never exposes raw source');
 browser=await chromium.launch({headless:true});const page=await browser.newPage();await page.goto(origin);
 async function uiLogin(owner){await page.locator('#username').selectOption(owner);await page.locator('#password').fill(c.users[owner]);await page.getByRole('button',{name:'Enter your space'}).click();await page.locator('#field-title').waitFor();}
 await uiLogin('alice');await page.locator('#message').fill(sentinel);await page.locator('#field-title').fill('Alice delayed synthetic private thought');
 await page.evaluate(()=>{const original=crypto.subtle.digest.bind(crypto.subtle);crypto.subtle.digest=(...args)=>new Promise(resolve=>{window.releaseDigest=()=>original(...args).then(resolve);});});
 await page.getByRole('button',{name:'Save now',exact:true}).click();await page.waitForFunction(()=>typeof window.releaseDigest==='function');await page.locator('#logout').click();await page.locator('#loginView').waitFor({state:'visible'});await uiLogin('bob');await page.evaluate(()=>window.releaseDigest());await page.waitForFunction(()=>!document.getElementById('save').disabled);await wait(100);
 const bob=await gateway('bob','query',{});if(bob.records.some(r=>r.data.title==='Alice delayed synthetic private thought'))findings.push({id:'F1',severity:'material',detail:'Alice save paused during async digest, logout/login Bob, digest resumed: Alice source and record committed under Bob session.'});else passed.push('Delayed pending-save owner switch is fenced');
 assert.ok(!logs.join('').includes(sentinel));assert.ok(!logs.join('').includes(c.users.alice));assert.ok(!logs.join('').includes(c.admin));passed.push('Captured HTTP/database/worker child logs contain neither synthetic source nor generated password sentinels');
 console.log(JSON.stringify({candidate:'498b9ea27dbd3f8c2bf4a8f04f92de9925a7fd89',passed,findings},null,2));
}finally{await browser?.close();await closePools();await admin?.end();for(const child of children.slice(1).reverse())await stop(child);try{execFileSync(process.execPath,['scripts/local-db.mjs','stop'],{stdio:'pipe'});}catch{}await stop(children[0]);}
