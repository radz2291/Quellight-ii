import { test,before,after } from 'node:test';
import assert from 'node:assert/strict';
import { fork,execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';
import { randomUUID } from 'node:crypto';
// Each test invocation owns a new cluster; no destructive reset of developer state.
process.env.QL_DATA_DIR=path.resolve('tmp/test-'+Date.now()+'-'+process.pid);
process.env.QL_DB_PORT=String(56000+(process.pid%5000));
const { config }=await import('../src/config.mjs');
const { gateway,snapshot }=await import('../src/gateway.mjs');
const { pool,transaction,closePools }=await import('../src/db.mjs');
const { claim,applyEffect,finish,processRun }=await import('../src/worker-runtime.mjs');
const { streamCompanion }=await import('../src/model.mjs');
let dbProcess,c,admin;
let httpChild;const httpPort=45000+(process.pid%5000);
const fixture=(extra={})=>({key:randomUUID(),kind:'note',data:{title:'Synthetic note',body:'Synthetic data only'},source:'Synthetic original source',...extra});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
before(async()=>{
 dbProcess=fork('scripts/local-db.mjs',['start'],{silent:true});
 await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('Local database start timeout')),30000);
  dbProcess.stdout.on('data',b=>{if(String(b).includes('listening')){clearTimeout(timer);resolve();}});
  dbProcess.on('exit',code=>{clearTimeout(timer);reject(Error('Database exited '+code));});
 });
 execFileSync(process.execPath,['scripts/setup.mjs'],{stdio:'pipe'});
 c=await config();admin=new pg.Client({host:c.host,port:c.port,database:c.database,user:'postgres',password:c.admin});await admin.connect();
});
after(async()=>{
 if(httpChild&&httpChild.exitCode===null){httpChild.kill('SIGKILL');await once(httpChild,'exit');}
 await closePools();await admin?.end();
 execFileSync(process.execPath,['scripts/local-db.mjs','stop'],{stdio:'pipe'});
 dbProcess?.kill();
});
test('real roles: authentication, RLS read/write, owner forgery, SET ROLE/GUC and table permissions',async()=>{
 const bad=new pg.Client({host:c.host,port:c.port,database:c.database,user:'alice',password:'synthetic-wrong'});
 await assert.rejects(bad.connect(),/password authentication failed/);await bad.end();
 const a=await gateway('alice','create',fixture());
 const ap=await pool('alice'),bp=await pool('bob');
 const role=(await ap.query('SELECT rolbypassrls,rolsuper FROM pg_roles WHERE rolname=current_user')).rows[0];assert.equal(role.rolbypassrls,false);assert.equal(role.rolsuper,false);
 assert.equal((await bp.query('SELECT * FROM ql.records WHERE id=$1',[a.id])).rowCount,0);
 await assert.rejects(bp.query('INSERT INTO ql.sources(owner_id,id,body) VALUES($1,$2,$3)',['alice',randomUUID(),'forged']),/row-level security/);
 await assert.rejects(ap.query('SET ROLE bob'),/permission denied/);
 await transaction('bob',async db=>{await db.query("SELECT set_config('app.owner_id','alice',true)");assert.equal((await db.query('SELECT * FROM ql.records WHERE id=$1',[a.id])).rowCount,0);});
 await assert.rejects(ap.query('TRUNCATE ql.sources'),/permission denied/);
 await assert.rejects(ap.query("UPDATE ql.runs SET status='finished'"),/permission denied/);
 await assert.rejects(gateway('bob','history',{id:a.id}),/not_found/);
 await assert.rejects(gateway('worker_bob','create',fixture()),/forbidden/);
 const tables=await admin.query("SELECT relname,relrowsecurity,relforcerowsecurity FROM pg_class JOIN pg_namespace n ON n.oid=relnamespace WHERE n.nspname='ql' AND relname=ANY($1)",[['sources','records','revisions','operations','runs','outbox','effects','events']]);assert.equal(tables.rowCount,8);assert.ok(tables.rows.every(r=>r.relrowsecurity&&r.relforcerowsecurity));
});
test('generic validated primitives: receipts, concurrent duplicates, conflicts, revisions, atomic rollback and data provenance',async()=>{
 const p=fixture();const results=await Promise.all(Array.from({length:8},()=>gateway('alice','create',p)));assert.equal(new Set(results.map(r=>r.id)).size,1);
 await assert.rejects(gateway('alice','create',{...p,data:{title:'Changed payload'}}),/idempotency_conflict/);
 await assert.rejects(gateway('alice','create',{...fixture(),owner_id:'bob'}),/invalid_request/);
 await assert.rejects(gateway('alice','create',fixture({data:{title:'x',sql:'DROP TABLE'}})),/invalid_fields/);
 await assert.rejects(gateway('alice','create',fixture({kind:'task',data:{title:'x',due:'2026-02-30'}})),/invalid_date/);
 const record=results[0];
 const updates=await Promise.allSettled([gateway('alice','update',{key:randomUUID(),id:record.id,expectedVersion:1,data:{title:'Edit A'}}),gateway('alice','update',{key:randomUUID(),id:record.id,expectedVersion:1,data:{title:'Edit B'}})]);
 assert.equal(updates.filter(r=>r.status==='fulfilled').length,1);assert.ok(updates.some(r=>r.status==='rejected'&&r.reason.message==='version_conflict'));
 const h=await gateway('alice','history',{id:record.id});assert.equal(h.source.body,p.source);assert.equal(h.revisions.length,2);assert.equal(h.record.version,2);assert.equal(h.events.length,2);
 const ap=await pool('alice');const count=Number((await ap.query('SELECT count(*) FROM ql.sources')).rows[0].count);
 await assert.rejects(transaction('alice',async db=>{await db.query('INSERT INTO ql.sources(id,body) VALUES($1,$2)',[randomUUID(),'rollback']);throw Error('abort');}),/abort/);
 assert.equal(Number((await ap.query('SELECT count(*) FROM ql.sources')).rows[0].count),count);
});
test('Mastra streaming: two fake model turns, discovery and abort',async()=>{
 const chunks=[];const result=await streamCompanion({discover:async()=>({kinds:['note','task']}),onText:t=>chunks.push(t)});
 assert.equal(result.modelCalls,2);assert.equal(result.tools,1);assert.ok(chunks.length>=2);assert.ok(!result.text.includes('Saved'));
 const controller=new AbortController();
 await assert.rejects(streamCompanion({discover:async()=>({}),signal:controller.signal,onText:()=>controller.abort()}),/abort/);
});
test('worker spike: kill after committed effect, restart, duplicate dispatch and stale fence',async()=>{
 const queued=await gateway('alice','enqueue',fixture());
 const child=fork('src/worker.mjs',['alice'],{silent:true,env:{...process.env,QL_TEST_PAUSE:'after-effect',QL_WORKER_ONCE:'1'}});
 const [message]=await Promise.race([once(child,'message'),wait(20000).then(()=>{throw Error('Worker did not reach effect boundary');})]);assert.equal(message.runId,queued.runId);
 const stale=(await (await pool('worker_alice')).query('SELECT * FROM ql.runs WHERE id=$1',[queued.runId])).rows[0];
 child.kill('SIGKILL');await once(child,'exit');
 await wait(1700);
 const stalled=(await snapshot('alice')).runs.find(r=>r.id===queued.runId);assert.equal(stalled.visible_status,'stalled');
 const successor=await claim('worker_alice');assert.equal(successor.id,queued.runId);assert.equal(successor.generation,stale.generation+1);
 await assert.rejects(applyEffect('worker_alice',stale),/lease_lost/);
 await processRun('worker_alice',successor);
 assert.equal((await snapshot('alice')).runs.find(r=>r.id===queued.runId).status,'finished');
 assert.equal((await (await pool('alice')).query('SELECT * FROM ql.effects WHERE run_id=$1',[queued.runId])).rowCount,1);
 // Late duplicate outbox delivery cannot re-open terminal runs.
 await (await pool('worker_alice')).query('UPDATE ql.outbox SET delivered=false WHERE run_id=$1',[queued.runId]);
 assert.equal(await claim('worker_alice'),null);
});
test('worker cancellation, before-effect loss, forged worker, sanitized failure and retry',async()=>{
 const q=await gateway('alice','enqueue',fixture());const run=await claim('worker_alice');assert.equal(run.id,q.runId);
 await assert.rejects(applyEffect('worker_bob',run),/lease_lost/);
 await assert.rejects(gateway('bob','cancel',{key:randomUUID(),id:q.runId}),/not_pending/);
 await gateway('alice','cancel',{key:randomUUID(),id:q.runId});
 await assert.rejects(applyEffect('worker_alice',run),/lease_lost/);
 assert.equal((await (await pool('alice')).query('SELECT * FROM ql.effects WHERE run_id=$1',[q.runId])).rowCount,0);
 const failed=await gateway('alice','enqueue',fixture());const f=await claim('worker_alice');await processRun('worker_alice',f,{fail:true});
 let state=(await snapshot('alice')).runs.find(r=>r.id===failed.runId);assert.equal(state.status,'failed');assert.equal(state.error_code,'worker_failed');
 await gateway('alice','retry',{key:randomUUID(),id:failed.runId});await processRun('worker_alice',await claim('worker_alice'));
 state=(await snapshot('alice')).runs.find(r=>r.id===failed.runId);assert.equal(state.status,'finished');assert.equal(state.attempt,2);
});
test('seed v2 extension and safe migration rollback, v1 read compatibility',async()=>{
 const sql=await readFile('db/002-seed.down.sql','utf8');
 await admin.query('BEGIN');await admin.query(sql);assert.equal((await admin.query("SELECT 1 FROM ql.definitions WHERE kind='seed_experiment'")).rowCount,0);await admin.query('ROLLBACK');
 const created=await gateway('bob','create',fixture({kind:'seed_experiment',data:{title:'90 day experiment',variety:'Synthetic basil',day:2,germinated:false}}));
 const h=await gateway('bob','history',{id:created.id});assert.equal(h.record.schema_version,2);assert.equal(h.record.data.germinated,false);
 await admin.query('BEGIN');await assert.rejects(admin.query(sql),/disposition/);await admin.query('ROLLBACK');
 const defs=await gateway('bob','discover',{});assert.equal(defs.definitions.length,3);assert.ok((await gateway('alice','query',{})).records.some(r=>r.kind==='note'));
});
test('versioned SQL up/down on a separate empty local database and retained core integrity',async()=>{
 await admin.query('CREATE DATABASE ql_migration_drill');const drill=new pg.Client({host:c.host,port:c.port,user:'postgres',password:c.admin,database:'ql_migration_drill'});await drill.connect();
 try {
  await drill.query(await readFile('db/001-core.up.sql','utf8'));await drill.query(await readFile('db/002-seed.up.sql','utf8'));
  assert.equal((await drill.query('SELECT max(version) AS v FROM ql.schema_version')).rows[0].v,2);
  await drill.query(await readFile('db/002-seed.down.sql','utf8'));await drill.query(await readFile('db/001-core.down.sql','utf8'));
  assert.equal((await drill.query("SELECT to_regclass('ql.records') AS t")).rows[0].t,null);
  await drill.query(await readFile('db/001-core.up.sql','utf8'));await drill.query(await readFile('db/002-seed.up.sql','utf8'));
  assert.equal((await drill.query('SELECT count(*) FROM ql.definitions')).rows[0].count,'3');
 }finally{await drill.end();}
});
async function startHttp(){
 httpChild=fork('src/server.mjs',[],{silent:true,env:{...process.env,QL_PORT:String(httpPort)}});
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('HTTP start timeout')),10000);httpChild.stdout.on('data',b=>{if(String(b).includes('synthetic proof')){clearTimeout(timeout);resolve();}});httpChild.once('exit',code=>{clearTimeout(timeout);reject(Error('HTTP exited '+code));});});
}
test('HTTP auth/session/CSRF, owner SSE, foreground restart, IDOR, cancellation, privacy and honest stream',async()=>{
 await startHttp();const origin='http://127.0.0.1:'+httpPort;
 async function req(route,body,cookie='',originHeader=origin){return fetch(origin+route,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json','Origin':originHeader}),Cookie:cookie},body:body===undefined?undefined:JSON.stringify(body)});}
 async function login(owner){const r=await req('/api/login',{username:owner,password:c.users[owner]});assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);return r.headers.get('set-cookie').split(';')[0];}
 assert.equal((await req('/api/ops/query',{})).status,401);
 assert.equal((await req('/api/login',{username:'alice',password:'bad'})).status,401);
 let a=await login('alice');let b=await login('bob');
 assert.equal((await req('/api/ops/create',fixture(),a,'http://evil.invalid')).status,403);
 const sentinel='SYNTHETIC_PRIVATE_SOURCE_'+randomUUID();const payload=fixture({source:sentinel,data:{title:'Persistent HTTP note',body:sentinel}});
 const r=await req('/api/ops/create',payload,a);assert.equal(r.status,200);const created=await r.json();
 assert.equal((await req('/api/ops/history',{id:created.id},b)).status,404);
 assert.equal((await req('/api/ops/create',{...fixture(),owner_id:'bob'},a)).status,400);
 assert.equal((await req('/api/ops/create',{...fixture(),principal:'worker_bob'},a)).status,400);
 assert.equal((await req('/api/worker',{owner:'alice'},b)).status,404);
 const q=await (await req('/api/ops/enqueue',fixture(),a)).json();
 const streamAbort=new AbortController();const response=await fetch(origin+'/api/events',{headers:{Cookie:b},signal:streamAbort.signal});assert.equal(response.status,200);
 const reader=response.body.getReader();const first=new TextDecoder().decode((await reader.read()).value);streamAbort.abort();
 assert.ok(!first.includes(q.runId));assert.ok(!first.includes(sentinel));
 assert.equal((await req('/api/events?owner=alice',undefined,b)).status,400);
 const activity=JSON.stringify(await (await req('/api/activity',undefined,a)).json());assert.ok(!activity.includes(sentinel));
 const invalid=await req('/api/ops/create',{...fixture(),data:{title:'sentinel',sql:sentinel}},a);assert.deepEqual(await invalid.json(),{error:'invalid_fields'});
 const chat=await req('/api/chat',{message:sentinel},a);const text=await chat.text();assert.ok(text.includes('synthetic Companion'));assert.ok(text.includes('"done":true'));assert.ok(!text.includes(sentinel));
 const cancel=await req('/api/ops/cancel',{key:randomUUID(),id:q.runId},a);assert.equal(cancel.status,200);
 // Real server process restart: old session invalid, source and history survive.
 httpChild.kill('SIGKILL');await once(httpChild,'exit');httpChild=null;await startHttp();
 assert.equal((await req('/api/me',undefined,a)).status,401);a=await login('alice');b=await login('bob');
 const history=await (await req('/api/ops/history',{id:created.id},a)).json();assert.equal(history.source.body,sentinel);assert.equal(history.revisions.length,1);
 const foreign=await (await req('/api/ops/query',{},b)).json();assert.ok(!foreign.records.some(r=>r.id===created.id));
 assert.equal((await req('/api/logout',{},a)).status,200);assert.equal((await req('/api/me',undefined,a)).status,401);
 const html=await fetch(origin);assert.match(html.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.ok(!(await html.text()).includes(c.users.alice));
});
