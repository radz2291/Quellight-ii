import { chromium } from 'playwright';
import { fork,execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { mkdir,writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.resolve(process.env.QL_EVIDENCE_DIR||'tmp/browser-evidence');await mkdir(root,{recursive:true});
process.env.QL_DATA_DIR=path.resolve('tmp/browser-'+Date.now()+'-'+process.pid);
process.env.QL_DB_PORT=String(61000+process.pid%1000);process.env.QL_PORT=String(44000+process.pid%1000);
const {config}=await import('../src/config.mjs');
const children=[];let browser;
async function start(file,args,ready){const child=fork(file,args,{silent:true});children.push(child);await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('start timeout: '+file)),30000);child.stdout.on('data',b=>{if(String(b).includes(ready)){clearTimeout(timer);resolve();}});child.once('exit',code=>{clearTimeout(timer);reject(Error('child failed '+file+' '+code));});});return child;}
async function stop(child){if(child?.exitCode===null){child.kill('SIGKILL');await once(child,'exit');}}
const started=Date.now();const errors=[];const passed=[];
try {
 await start('scripts/local-db.mjs',['start'],'listening');execFileSync(process.execPath,['scripts/setup.mjs'],{stdio:'pipe'});
 await start('src/server.mjs',[],'synthetic proof');const c=await config();
 browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1050}});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+process.env.QL_PORT);
 async function login(owner){await page.locator('#username').selectOption(owner);await page.locator('#password').fill(c.users[owner]);await page.getByRole('button',{name:'Enter your space'}).click();await page.locator('#workspace').waitFor({state:'visible'});await page.locator('#field-title').waitFor();}
 await login('alice');
 await page.locator('#message').fill('Synthetic source: make room for a quiet walk tomorrow.');
 await page.getByRole('button',{name:'Send thought',exact:true}).click();await page.getByText('This is a synthetic Companion response.',{exact:false}).waitFor();
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
 assert.equal(await page.locator('#records .record').count(),0);assert.ok(!(await page.locator('#workspace').innerText()).includes('quiet walk'));await page.locator('#message').fill('Synthetic Bob source: review the seedlings on Friday.');await page.locator('#kind').selectOption('task');await page.locator('#field-title').fill('Review seedlings');await page.locator('#field-due').fill('2026-10-30');await page.getByRole('button',{name:'Save now',exact:true}).click();await page.locator('#inspect h3').filter({hasText:'Review seedlings'}).waitFor();
 await page.reload();await page.locator('#records .record').filter({hasText:'Review seedlings'}).waitFor();assert.equal(await page.locator('#records .record').count(),1);passed.push('Sign-out clears Alice UI; Bob isolated task persists across page reload');
 await page.setViewportSize({width:1440,height:1050});await page.locator('#message').fill('Synthetic observed seed trial: basil, day 2, not yet germinated.');await page.locator('#kind').selectOption('seed_experiment');await page.locator('#field-title').fill('90 day seed experiment');await page.locator('#field-variety').fill('Synthetic basil');await page.locator('#field-day').fill('2');await page.getByRole('button',{name:'Save now',exact:true}).click();await page.getByText('Version 1 · schema 2',{exact:true}).waitFor();passed.push('Seed v2 definition dynamically renders and saves without domain UI changes');
 assert.deepEqual(errors,[]);passed.push('No browser JavaScript errors');
 const report={verdict:'PASS',passed,durationMs:Date.now()-started,browser:await browser.version(),viewport:[1440,1050],mobile:[390,844]};await writeFile(path.join(root,'browser.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{
 await browser?.close();for(const child of children.slice(1).reverse())await stop(child);
 try{execFileSync(process.execPath,['scripts/local-db.mjs','stop'],{stdio:'pipe'});}catch{}
 await stop(children[0]);
}
