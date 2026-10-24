import { execFileSync } from 'node:child_process';
import { readdir,mkdir,copyFile } from 'node:fs/promises';
// The server uses native ES modules; no opaque bundler/provider environment is needed.
for(const dir of ['src','public'])for(const file of await readdir(dir)) {
 if(file.endsWith('.mjs')||file.endsWith('.js'))execFileSync(process.execPath,['--check',dir+'/'+file],{stdio:'pipe'});
 await mkdir('dist/'+dir,{recursive:true});await copyFile(dir+'/'+file,'dist/'+dir+'/'+file);
}
console.log('Built local ES-module server and browser assets.');
