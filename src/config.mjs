import { readFile } from 'node:fs/promises';
import path from 'node:path';
export const dataDir = path.resolve(process.env.QL_DATA_DIR || 'local-data/c1');
export async function config() {
  const c = JSON.parse(await readFile(path.join(dataDir, 'runtime.json'), 'utf8'));
  if(c.host !== '127.0.0.1' || !Number.isInteger(c.port)) throw new Error('Local configuration required');
  return c;
}
