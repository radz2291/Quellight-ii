import { claim,processRun } from './worker-runtime.mjs';
import { closePools } from './db.mjs';
const owner=process.argv[2]||'alice';
if(!['alice','bob'].includes(owner))throw Error('Unknown synthetic owner');
const principal='worker_'+owner;
let stopping=false;process.on('SIGINT',()=>{stopping=true;});process.on('SIGTERM',()=>{stopping=true;});
console.log('Synthetic Steward ready');
do {
 const run=await claim(principal);
 if(run)await processRun(principal,run,{
  fail:process.env.QL_TEST_FAIL==='1',
  pause:async point=>{if(process.env.QL_TEST_PAUSE===point){process.send?.({point,runId:run.id});console.log('Test boundary reached: '+point);await new Promise(()=>{});}}
 });
 else if(process.env.QL_WORKER_ONCE==='1')break;
 else await new Promise(r=>setTimeout(r,250));
}while(!stopping && process.env.QL_WORKER_ONCE!=='1');
await closePools();
