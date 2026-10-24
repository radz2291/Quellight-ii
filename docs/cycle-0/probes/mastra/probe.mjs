import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Agent } from '@mastra/core/agent';
import { createDurableAgent, createEventedAgent } from '@mastra/core/agent/durable';
import { InMemoryStore } from '@mastra/core/storage';
import { Workspace, LocalFilesystem } from '@mastra/core/workspace';
import { SkillSearchProcessor } from '@mastra/core/processors';
import { Memory } from '@mastra/memory';
import { SensitiveDataFilter } from '@mastra/observability';

const results = [];
const memory = new Memory({storage: new InMemoryStore(), options: {semanticRecall: false, generateTitle: false}});
await memory.createThread({threadId:'a1',resourceId:'owner-a'});
await memory.createThread({threadId:'a2',resourceId:'owner-a'});
await memory.createThread({threadId:'b1',resourceId:'owner-b'});
for (const [threadId,resourceId] of [['a1','owner-a'],['a2','owner-a'],['b1','owner-b']]) {
  await memory.saveMessages({messages:[{id:threadId+'-message',role:'user',threadId,resourceId,createdAt:new Date(),content:{format:2,parts:[{type:'text',text:threadId+' synthetic fixture'}]}}]});
}
const a = await memory.listThreads({filter:{resourceId:'owner-a'}});
assert.deepEqual(a.threads.map(t=>t.id).sort(),['a1','a2']);
const own = await memory.recall({threadId:'a1',resourceId:'owner-a'});
assert.equal(own.messages.length,1);
assert.equal(own.messages[0].id,'a1-message');
let wrongOwnerDenied = false;
let wrongOwnerOutcome;
try { const wrong = await memory.recall({threadId:'a1',resourceId:'owner-b'}); wrongOwnerDenied=wrong.messages.length===0; }
catch (error) { wrongOwnerOutcome=String(error); wrongOwnerDenied=/resource|owner/i.test(wrongOwnerOutcome); }
assert.equal(wrongOwnerDenied,true);
results.push({check:'synthetic resource-thread retrieval isolation with InMemoryStore',status:'PASS',wrongOwnerOutcome:wrongOwnerOutcome ?? 'empty result'});

const agent = new Agent({id:'probe',name:'Probe',instructions:'Synthetic probe only',model:'openai/gpt-4o-mini'});
const durable = createDurableAgent({agent});
const evented = createEventedAgent({agent});
for (const key of ['stream','observe','resume','recover','recoverActiveRuns','listActiveRuns']) assert.equal(typeof durable[key],'function',key);
assert.equal(typeof evented.stream,'function');
results.push({check:'durable/evented constructors and lifecycle API exports, no execution',status:'PASS'});

assert.match(await readFile(new URL('./workspace/skills/temporal/SKILL.md',import.meta.url),'utf8'), /name: temporal/);
const workspace = new Workspace({filesystem:new LocalFilesystem({basePath:fileURLToPath(new URL('./workspace/',import.meta.url))}),skills:['skills'],bm25:true});
await workspace.init();
const processor = new SkillSearchProcessor({workspace,ttl:60000,blockingRefresh:true});
assert.equal(typeof processor.processInputStep,'function');
const catalog=await workspace.skills.list();
assert(catalog.some(s=>s.name==='temporal'));
const matches=await workspace.skills.search('relative dates timezones');
assert(matches.some(s=>s.skillName==='temporal'));
const skill=await workspace.skills.get('temporal');
assert(skill);
results.push({check:'local BM25 skill catalog, keyword discovery and skill read; processor constructor',status:'PASS'});
await workspace.destroy();

const span={traceId:'synthetic',attributes:{apiKey:'synthetic-secret',authToken:'synthetic-unmatched'},input:{message:'synthetic private prose'},metadata:{}};
const filtered = new SensitiveDataFilter().process(span);
assert.equal(filtered.attributes.apiKey,'[REDACTED]');
assert.equal(filtered.attributes.authToken,'synthetic-unmatched');
assert.equal(filtered.input.message,'synthetic private prose');
results.push({check:'default field-name redaction and negative prose/unmatched-name counterexamples',status:'PASS'});
console.log(JSON.stringify({node:process.version,paidCalls:0,externalDatabaseConnections:0,results},null,2));
