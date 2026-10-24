import pg from 'pg';
import { config } from './config.mjs';
const pools=new Map();
export async function pool(principal) {
 if(!['alice','bob','worker_alice','worker_bob'].includes(principal)) throw Error('Invalid principal');
 if(!pools.has(principal)) {const c=await config();pools.set(principal,new pg.Pool({host:c.host,port:c.port,database:c.database,user:principal,password:c.users[principal],max:4,statement_timeout:5000}));}
 return pools.get(principal);
}
export async function transaction(principal,fn) {
 const client=await (await pool(principal)).connect();
 try {await client.query('BEGIN'); const result=await fn(client);await client.query('COMMIT');return result;}
 catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
}
export async function closePools(){await Promise.all([...pools.values()].map(p=>p.end()));pools.clear();}
