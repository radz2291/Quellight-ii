import {fork} from 'node:child_process';
process.env.QL_PORT=process.env.QL_PORT||'4318';
process.env.QL_WEB_PORT=process.env.QL_WEB_PORT||'4317';
process.env.QL_FRONTEND_ORIGIN='http://127.0.0.1:'+process.env.QL_WEB_PORT;
process.env.NEXT_TELEMETRY_DISABLED='1';
const children=[fork('src/server.mjs',[],{stdio:'inherit'}),fork('node_modules/next/dist/bin/next',['start','web','-H','127.0.0.1','-p',process.env.QL_WEB_PORT],{stdio:'inherit'})];
let closing=false;function close(){if(closing)return;closing=true;for(const child of children)child.kill();}
for(const child of children)child.on('exit',()=>{close();});
process.on('SIGINT',close);process.on('SIGTERM',close);
