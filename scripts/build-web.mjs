import {execFileSync} from 'node:child_process';
process.env.NEXT_TELEMETRY_DISABLED='1';
execFileSync(process.execPath,['node_modules/next/dist/bin/next','build','web','--webpack'],{stdio:'inherit'});
