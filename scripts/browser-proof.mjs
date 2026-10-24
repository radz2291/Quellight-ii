import { chromium } from 'playwright';
import { fork,execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { mkdir,writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.resolve(process.env.QL_EVIDENCE_DIR||'tmp/browser-evidence');await mkdir(root,{recursive:true});
process.env.QL_DATA_DIR=path.resolve('tmp/browser-'+Date.now()+'-'+process.pid);
process.env.QL_DB_PORT=String(61000+process.pid%1000);process.env.QL_PORT=String(44000+process.pid%1000);
const native=process.env.QL_BROWSER_NATIVE==='1';
process.env.QL_WEB_PORT=String(45000+process.pid%1000);
process.env.QL_FRONTEND_ORIGIN='http://127.0.0.1:'+(native?process.env.QL_PORT:process.env.QL_WEB_PORT);
process.env.NEXT_TELEMETRY_DISABLED='1';
const {config}=await import('../src/config.mjs');
const children=[];let browser;
async function start(file,args,ready){const child=fork(file,args,{silent:true});children.push(child);await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('start timeout: '+file)),30000);child.stdout.on('data',b=>{if(String(b).includes(ready)){clearTimeout(timer);resolve();}});child.once('exit',code=>{clearTimeout(timer);reject(Error('child failed '+file+' '+code));});});return child;}
async function stop(child){if(child?.exitCode===null&&child.signalCode===null){child.kill('SIGKILL');await once(child,'exit');}}
const started=Date.now();const errors=[];const passed=[];
try {
 await start('scripts/local-db.mjs',['start'],'listening');execFileSync(process.execPath,['scripts/setup.mjs'],{stdio:'pipe'});
 await start('src/server.mjs',[],'synthetic proof');const c=await config();
 if(!native)await start('node_modules/next/dist/bin/next',['start','web','-H','127.0.0.1','-p',process.env.QL_WEB_PORT],'Ready');
 browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1050}});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.QL_FRONTEND_ORIGIN);
 async function openInspection(){if(!native&&await page.locator('#open-inspection').getAttribute('aria-expanded')==='false')await page.locator('#open-inspection').click();}
 async function login(owner,inspect=true){await page.locator('#username').selectOption(owner);await page.locator('#password').fill(c.users[owner]);await page.getByRole('button',{name:'Enter your space'}).click();await page.locator('#workspace').waitFor({state:'visible'});if(inspect){await openInspection();await page.locator('#field-title').waitFor();}}
 await login('alice',native);
 if(!native){assert.equal(await page.locator('.library').isVisible(),false);assert.equal(await page.locator('.inspection').isVisible(),false);assert.equal(await page.locator('.save-panel').isVisible(),false);const text=await page.locator('#workspace').innerText();assert.ok(!/records|primitive|Steward|revision|schema|JSON/.test(text));await page.screenshot({path:path.join(root,'conversation.png'),fullPage:true});passed.push('Default is Companion-first; records/JSON/history/runs stay behind Your space');}
 await page.locator('#message').fill('Synthetic source: make room for a quiet walk tomorrow.');
 await page.getByRole('button',{name:'Send thought',exact:true}).click();await page.getByText('This is a synthetic Companion response.',{exact:false}).waitFor();
 await openInspection();
 await page.locator('#field-title').fill('A quiet walk');await page.locator('#field-body').fill('A thought worth returning to.');
 await page.getByRole('button',{name:'Save now',exact:true}).click();await page.locator('#inspect h3').filter({hasText:'A quiet walk'}).waitFor();
 await page.locator('#edit-title').fill('A quiet walk in the morning');await page.getByRole('button',{name:'Save correction',exact:true}).click();await page.getByText('Revision 2 · human',{exact:true}).waitFor();
 assert.equal(await page.locator('#inspect .source').textContent(),'Synthetic source: make room for a quiet walk tomorrow.');passed.push('Alice streaming, committed note, original source and correction revisions');
 // Abort the browser acknowledgement after the server has committed; retry same intention.
 await page.locator('#field-title').fill('Lost acknowledgment fixture');let lost=false;
 await page.route('**/api/ops/create',async route=>{if(!lost){lost=true;await route.fetch();await route.abort();}else await route.continue();});
 await page.getByRole('button',{name:'Save now',exact:true}).click();await page.waitForFunction(()=>!(/** @type {HTMLButtonElement} */(document.getElementById('save'))).disabled);
 await page.getByRole('button',{name:'Save now',exact:true}).click();await page.locator('#inspect h3').filter({hasText:'Lost acknowledgment fixture'}).waitFor();
 assert.equal(await page.locator('#records .record strong').filter({hasText:'Lost acknowledgment fixture'}).count(),1);await page.unroute('**/api/ops/create');passed.push('Lost acknowledgment retries retain browser idempotency key');
 await page.locator('#field-title').fill('Let the Steward keep this');await page.getByRole('button',{name:'Ask Steward to save',exact:true}).click();await page.locator('#runs .status').filter({hasText:'queued'}).waitFor();
 await start('src/worker.mjs',['alice'],'Steward ready');await page.locator('#runs .status').filter({hasText:'finished'}).waitFor();await page.getByRole('button',{name:'Inspect result',exact:true}).click();await page.locator('#inspect h3').filter({hasText:'Let the Steward keep this'}).waitFor();
 passed.push('Queue visibly queued, separate worker finishes, source/result inspectable');
 await page.screenshot({path:path.join(root,'desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await page.screenshot({path:path.join(root,'mobile.png'),fullPage:true});passed.push('390px mobile layout has no horizontal overflow');
 await page.locator('#logout').click();await page.locator('#loginView').waitFor({state:'visible'});await login('bob');
 assert.equal(await page.locator('#records .record').count(),0);assert.ok(!(await page.locator('#workspace').innerText()).includes('quiet walk'));await page.locator(native?'#message':'#source').fill('Synthetic Bob source: review the seedlings on Friday.');await page.locator('#kind').selectOption('task');await page.locator('#field-title').fill('Review seedlings');await page.locator('#field-due').fill('2026-10-30');await page.getByRole('button',{name:'Save now',exact:true}).click();await page.locator('#inspect h3').filter({hasText:'Review seedlings'}).waitFor();
 await page.reload();await page.locator('#workspace').waitFor({state:'visible'});await openInspection();await page.locator('#records .record').filter({hasText:'Review seedlings'}).waitFor();assert.equal(await page.locator('#records .record').count(),1);passed.push('Sign-out clears Alice UI; Bob isolated task persists across page reload');
 await page.setViewportSize({width:1440,height:1050});await page.locator(native?'#message':'#source').fill('Synthetic observed seed trial: basil, day 2, not yet germinated.');await page.locator('#kind').selectOption('seed_experiment');await page.locator('#field-title').fill('90 day seed experiment');await page.locator('#field-variety').fill('Synthetic basil');await page.locator('#field-day').fill('2');if(!native)await page.locator('#field-germinated').selectOption('false');await page.getByRole('button',{name:'Save now',exact:true}).click();await page.getByText('Version 1 · schema 2',{exact:true}).waitFor();passed.push('Seed v2 definition dynamically renders and saves without domain UI changes');
 if(!native){
  await page.route('**/api/chat',async route=>{await new Promise(r=>setTimeout(r,400));await route.continue().catch(()=>{});});
  await page.locator('#message').fill('Synthetic cancellation fixture');await page.getByRole('button',{name:'Send thought',exact:true}).click();await page.getByRole('button',{name:'Stop response',exact:true}).click();await page.unroute('**/api/chat');
  await page.route('**/api/chat',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"synthetic_unavailable"}'}));
  await page.locator('#message').fill('Synthetic error fixture');await page.getByRole('button',{name:'Send thought',exact:true}).click();await page.getByText('Response interrupted. Your saved records are unchanged.',{exact:true}).waitFor();await page.unroute('**/api/chat');passed.push('assistant-ui handles stop and failed response without a saved-record claim');
 }
 // F1 regression: a save intent paused before dispatch must not migrate to a new session.
 await page.locator('#logout').click();await page.locator('#loginView').waitFor({state:'visible'});await login('alice');
 await page.locator(native?'#message':'#source').fill('Synthetic pending Alice source must stay with Alice.');await page.locator('#field-title').fill('Alice delayed synthetic private thought');
 await page.evaluate(()=>{const original=crypto.subtle.digest.bind(crypto.subtle);crypto.subtle.digest=(...args)=>new Promise(resolve=>{window['releaseDigest']=()=>original(...args).then(resolve);});});
 await page.getByRole('button',{name:'Save now',exact:true}).click();await page.waitForFunction(()=>typeof window['releaseDigest']==='function');await page.locator('#logout').click();await page.locator('#loginView').waitFor({state:'visible'});await login('bob');await page.evaluate(()=>window['releaseDigest']());
 await page.waitForTimeout(150);await page.reload();await page.locator('#workspace').waitFor({state:'visible'});await openInspection();await page.locator('#records .record').first().waitFor();assert.equal(await page.locator('#records .record strong').filter({hasText:'Alice delayed synthetic private thought'}).count(),0);passed.push('F1 delayed digest/save followed by owner switch is rejected before dispatch');
 assert.deepEqual(errors,[]);passed.push('No browser JavaScript errors');
 const report={verdict:'PASS',stack:native?'preserved native fixture':'Next.js + assistant-ui',passed,durationMs:Date.now()-started,browser:await browser.version(),viewport:[1440,1050],mobile:[390,844]};await writeFile(path.join(root,'browser.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{
 await browser?.close();for(const child of children.slice(1).reverse())await stop(child);
 try{execFileSync(process.execPath,['scripts/local-db.mjs','stop'],{stdio:'pipe'});}catch{}
 await stop(children[0]);
}
