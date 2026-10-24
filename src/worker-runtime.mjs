import { transaction } from './db.mjs';
import { event,insertRecord,definitions } from './gateway.mjs';
import { streamCompanion } from './model.mjs';
const leaseMs=1500;
export async function claim(principal) {
 return transaction(principal,async db=>{
  const r=(await db.query(`SELECT r.* FROM ql.runs r JOIN ql.outbox o ON (o.owner_id=r.owner_id AND o.run_id=r.id)
   WHERE (r.status='queued' OR (r.status='running' AND r.lease_until<clock_timestamp()))
   ORDER BY r.created_at FOR UPDATE OF r SKIP LOCKED LIMIT 1`)).rows[0];
  if(!r)return null;
  const run=(await db.query("UPDATE ql.runs SET status='running',generation=generation+1,attempt=attempt+1,lease_until=clock_timestamp()+$2::int*interval '1 millisecond' WHERE id=$1 RETURNING *",[r.id,leaseMs])).rows[0];
  await db.query('UPDATE ql.outbox SET delivered=true WHERE run_id=$1',[r.id]);
  await event(db,{run:r.id,action:r.status==='running'?'recovered':'running',actor:'steward',detail:{generation:run.generation,attempt:run.attempt}});return run;
 });
}
export async function fenced(principal,run,fn) {
 return transaction(principal,async db=>{
  const live=(await db.query('SELECT *,lease_until>clock_timestamp() AS valid FROM ql.runs WHERE id=$1 FOR UPDATE',[run.id])).rows[0];
  if(!live||live.status!=='running'||live.generation!==run.generation||!live.valid)throw new Error('lease_lost');
  return fn(db,live);
 });
}
export async function renew(principal,run){return fenced(principal,run,async db=>{await db.query("UPDATE ql.runs SET lease_until=clock_timestamp()+$2::int*interval '1 millisecond' WHERE id=$1",[run.id,leaseMs]);});}
export async function applyEffect(principal,run){return fenced(principal,run,async db=>{
 const prior=(await db.query('SELECT record_id FROM ql.effects WHERE run_id=$1',[run.id])).rows[0];
 if(prior)return prior.record_id;
 const result=await insertRecord(db,{kind:run.kind,data:run.data,sourceId:run.source_id,operationKey:'run:'+run.id,actor:'steward',run:run.id});
 await db.query('INSERT INTO ql.effects(run_id,record_id) VALUES($1,$2)',[run.id,result.id]);
 await db.query('UPDATE ql.runs SET step=2,record_id=$2 WHERE id=$1',[run.id,result.id]);return result.id;
});}
export async function finish(principal,run){return fenced(principal,run,async(db,live)=>{
 if(!live.record_id)throw new Error('missing_effect');
 await db.query("UPDATE ql.runs SET status='finished',step=3,lease_until=NULL WHERE id=$1",[run.id]);
 await event(db,{run:run.id,record:live.record_id,action:'finished',actor:'steward',detail:{generation:run.generation}});
});}
/** @param {string} principal @param {any} run @param {{pause?:(point:string,run:any)=>Promise<void>,fail?:boolean}} options */
export async function processRun(principal,run,{pause,fail=false}={}) {
 const abort=new AbortController();let leaseLost=false;
 let renewing=Promise.resolve();
 const timer=setInterval(()=>{renewing=renewing.then(()=>renew(principal,run)).catch(()=>{leaseLost=true;abort.abort();});},400);
 try {
  if(fail)throw new Error('synthetic_worker_failure');
  if(run.step<1){
   const model=await streamCompanion({signal:abort.signal,discover:()=>transaction(principal,definitions)});
   await fenced(principal,run,async db=>{
    await db.query('UPDATE ql.runs SET step=1 WHERE id=$1',[run.id]);
    await event(db,{run:run.id,action:'model_completed',actor:'steward',detail:{model:'synthetic-c1-v1',turns:model.modelCalls,tools:model.tools}});
   });
  }
  await pause?.('before-effect',run);
  if(leaseLost)throw new Error('lease_lost');
  await applyEffect(principal,run);
  await pause?.('after-effect',run);
  await finish(principal,run);
 } catch(e) {
  // Never log input, source, model output, SQL errors, tokens or exception prose.
  await fenced(principal,run,async db=>{
   await db.query("UPDATE ql.runs SET status='failed',error_code='worker_failed',lease_until=NULL WHERE id=$1",[run.id]);
   await event(db,{run:run.id,action:'failed',actor:'steward',detail:{code:'worker_failed'}});
  }).catch(()=>{});
 }finally{clearInterval(timer);await renewing;}
}
