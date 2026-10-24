import {execFileSync} from 'node:child_process';
process.env.NEXT_TELEMETRY_DISABLED='1';
execFileSync(process.execPath,['node_modules/next/dist/bin/next','typegen','web','--webpack'],{stdio:'inherit'});
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','--noEmit','-p','web/tsconfig.json'],{stdio:'inherit'});
