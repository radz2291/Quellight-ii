import EmbeddedPostgres from 'embedded-postgres';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { dataDir } from '../src/config.mjs';
await mkdir(dataDir, {recursive:true});
const file = path.join(dataDir,'runtime.json');
let c;
try { c=JSON.parse(await readFile(file,'utf8')); }
catch(error) {
  if(error.code !== 'ENOENT') throw error;
  c={host:'127.0.0.1', port:Number(process.env.QL_DB_PORT || 55439), database:'quellight',
    admin:randomBytes(24).toString('hex'), users:Object.fromEntries(['alice','bob','worker_alice','worker_bob'].map(n=>[n,randomBytes(24).toString('hex')]))};
  await writeFile(file, JSON.stringify(c,null,2), {mode:0o600,flag:'wx'});
}
const pg = new EmbeddedPostgres({databaseDir:path.join(dataDir,'postgres'),user:'postgres',password:c.admin,
  port:c.port,persistent:true,authMethod:'scram-sha-256',postgresFlags:['-h','127.0.0.1'],
  onLog:()=>{},onError:()=>{}});
if(process.argv[2]==='stop') { await pg.stop(); console.log('Local database stopped'); }
else {
  try { await readFile(path.join(dataDir,'postgres','PG_VERSION')); } catch { await pg.initialise(); }
  await pg.start();
  console.log('Disposable local PostgreSQL listening on loopback; credentials remain in ignored local-data.');
}
