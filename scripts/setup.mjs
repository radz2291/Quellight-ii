import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { config } from '../src/config.mjs';
const c=await config();
const admin=new pg.Client({host:c.host,port:c.port,user:'postgres',password:c.admin,database:'postgres'});
await admin.connect();
// Names are fixed; only generated hex passwords are interpolated into DDL.
for(const [name,password] of Object.entries(c.users)) {
 if(!['alice','bob','worker_alice','worker_bob'].includes(name)||! /^[a-f0-9]{48}$/.test(password)) throw Error('Invalid local credential');
 const exists=await admin.query('SELECT 1 FROM pg_roles WHERE rolname=$1',[name]);
 if(!exists.rowCount) await admin.query(`CREATE ROLE ${name} LOGIN PASSWORD '${password}' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS`);
}
if(!(await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',[c.database])).rowCount) await admin.query('CREATE DATABASE quellight');
await admin.end();
const db=new pg.Client({host:c.host,port:c.port,user:'postgres',password:c.admin,database:c.database});await db.connect();
if(!(await db.query("SELECT to_regclass('ql.schema_version') AS t")).rows[0].t) {
 await db.query('BEGIN');
 try {await db.query(await readFile('db/001-core.up.sql','utf8'));await db.query(await readFile('db/002-seed.up.sql','utf8'));await db.query('COMMIT');}
 catch(e){await db.query('ROLLBACK');throw e;}
}
await db.end();console.log('Local synthetic roles and versioned schema ready.');
