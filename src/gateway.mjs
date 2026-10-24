import { z } from 'zod';
import { randomUUID, createHash } from 'node:crypto';
import { transaction } from './db.mjs';
export class AppError extends Error { constructor(code,status=400){super(code);this.code=code;this.status=status;} }
const key=z.string().min(8).max(100).regex(/^[a-zA-Z0-9_.:-]+$/);
const id=z.string().uuid();
const data=z.record(z.string().max(80),z.union([z.string().max(16000),z.number().finite(),z.boolean()]));
const create=z.object({key,kind:z.string().max(60),data,source:z.string().min(1).max(16000)}).strict();
const schemas={
 discover:z.object({}).strict(), create, enqueue:create,
 query:z.object({kind:z.string().max(60).optional()}).strict(),
 update:z.object({key,id,expectedVersion:z.number().int().positive(),data}).strict(),
 history:z.object({id}).strict(), cancel:z.object({key,id}).strict(),retry:z.object({key,id}).strict()
};
function canonical(v){return JSON.stringify(v && typeof v==='object' && !Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(canonical(v[k]))])):v);}
export function fingerprint(v){return createHash('sha256').update(canonical(v)).digest('hex');}
export async function definitions(db){return (await db.query('SELECT kind,version,definition,skill FROM ql.definitions ORDER BY kind')).rows;}
export async function validateData(db,kind,value) {
 const def=(await db.query('SELECT * FROM ql.definitions WHERE kind=$1',[kind])).rows[0];
 if(!def) throw new AppError('unknown_kind');
 const {required,properties}=def.definition;
 if(required.some(k=>value[k]===undefined)||Object.keys(value).some(k=>!Object.hasOwn(properties,k))) throw new AppError('invalid_fields');
 for(const [k,v] of Object.entries(value)) {
  const t=properties[k];
  if(t==='date') {if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||Number.isNaN(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v) throw new AppError('invalid_date');}
  else if(t==='integer'? !Number.isSafeInteger(v)||v<0||v>100000 : typeof v!==t) throw new AppError('invalid_fields');
 }
 if(typeof value.title!=='string'||!value.title.trim()||value.title.length>200)throw new AppError('invalid_title');
 return def;
}
export async function event(db,{record=null,run=null,action,actor='human',detail={}}){await db.query('INSERT INTO ql.events(id,record_id,run_id,action,actor,detail) VALUES($1,$2,$3,$4,$5,$6)',[randomUUID(),record,run,action,actor,detail]);}
export async function insertRecord(db,{kind,data,sourceId,operationKey,actor='human',run=null}) {
 const def=await validateData(db,kind,data);const recordId=randomUUID();
 await db.query('INSERT INTO ql.records(id,source_id,kind,schema_version,data) VALUES($1,$2,$3,$4,$5)',[recordId,sourceId,kind,def.version,data]);
 await db.query('INSERT INTO ql.revisions(record_id,version,data,actor,operation_key) VALUES($1,1,$2,$3,$4)',[recordId,data,actor,operationKey]);
 await event(db,{record:recordId,run,action:'created',actor,detail:{schemaVersion:def.version,skill:def.skill}});
 return {id:recordId,sourceId,version:1};
}
export async function gateway(principal,operation,raw) {
 if(!['alice','bob'].includes(principal)) throw new AppError('forbidden',403);
 if(!Object.hasOwn(schemas,operation))throw new AppError('unknown_operation');
 const parsed=schemas[operation].safeParse(raw);
 if(!parsed.success) throw new AppError('invalid_request');const p=parsed.data;
 return transaction(principal,async db=>{
  if(operation==='discover')return {operations:['discover','create','query','update','history'],definitions:await definitions(db)};
  if(operation==='query')return {records:(await db.query('SELECT * FROM ql.records WHERE ($1::text IS NULL OR kind=$1) ORDER BY created_at DESC LIMIT 100',[p.kind??null])).rows};
  if(operation==='history') {
   const record=(await db.query('SELECT * FROM ql.records WHERE id=$1',[p.id])).rows[0];
   if(!record)throw new AppError('not_found',404);
   return {record,source:(await db.query('SELECT * FROM ql.sources WHERE id=$1',[record.source_id])).rows[0],
    revisions:(await db.query('SELECT * FROM ql.revisions WHERE record_id=$1 ORDER BY version',[p.id])).rows,
    events:(await db.query('SELECT * FROM ql.events WHERE record_id=$1 ORDER BY created_at',[p.id])).rows};
  }
  // Same owner+key serializes competing requests before checking receipt; receipt and effect commit together.
  await db.query('SELECT pg_advisory_xact_lock(hashtextextended(ql.owner()||$1,0))',[p.key]);
  const fp=fingerprint({operation,...p});
  const previous=(await db.query('SELECT * FROM ql.operations WHERE key=$1',[p.key])).rows[0];
  if(previous){if(previous.fingerprint!==fp)throw new AppError('idempotency_conflict',409);return previous.result;}
  let result;
  if(operation==='create'||operation==='enqueue') {
   await validateData(db,p.kind,p.data);const sourceId=randomUUID();
   await db.query('INSERT INTO ql.sources(id,body) VALUES($1,$2)',[sourceId,p.source]);
   if(operation==='create')result=await insertRecord(db,{kind:p.kind,data:p.data,sourceId,operationKey:p.key});
   else {
    const runId=randomUUID();await db.query('INSERT INTO ql.runs(id,source_id,kind,data) VALUES($1,$2,$3,$4)',[runId,sourceId,p.kind,p.data]);
    await db.query('INSERT INTO ql.outbox(run_id) VALUES($1)',[runId]);
    await event(db,{run:runId,action:'queued'});result={runId,status:'queued',sourceId};
   }
  } else if(operation==='update') {
   const old=(await db.query('SELECT * FROM ql.records WHERE id=$1 FOR UPDATE',[p.id])).rows[0];
   if(!old)throw new AppError('not_found',404);
   if(old.version!==p.expectedVersion)throw new AppError('version_conflict',409);
   await validateData(db,old.kind,p.data);const version=old.version+1;
   await db.query('UPDATE ql.records SET data=$1,version=$2 WHERE id=$3',[p.data,version,p.id]);
   await db.query('INSERT INTO ql.revisions(record_id,version,data,actor,operation_key) VALUES($1,$2,$3,\'human\',$4)',[p.id,version,p.data,p.key]);
   await event(db,{record:p.id,action:'updated',detail:{version}});result={id:p.id,version};
  } else {
   const name=operation==='cancel'?'cancel_run':'retry_run';
   const changed=(await db.query(`SELECT ql.${name}($1) AS changed`,[p.id])).rows[0].changed;
   if(!changed)throw new AppError('not_pending_or_not_found',409);
   await event(db,{run:p.id,action:operation==='cancel'?'cancelled':'retry_queued'});result={id:p.id,status:operation==='cancel'?'cancelled':'queued'};
  }
  await db.query('INSERT INTO ql.operations(key,fingerprint,result) VALUES($1,$2,$3)',[p.key,fp,result]);return result;
 });
}
export async function snapshot(principal){return transaction(principal,async db=>({
 runs:(await db.query("SELECT id,status,CASE WHEN status='running' AND lease_until<clock_timestamp() THEN 'stalled' ELSE status END AS visible_status, generation,attempt,step,lease_until,error_code,record_id,created_at FROM ql.runs ORDER BY created_at DESC LIMIT 100")).rows,
 events:(await db.query('SELECT id,record_id,run_id,action,actor,detail,created_at FROM ql.events ORDER BY created_at DESC LIMIT 100')).rows
}));}
