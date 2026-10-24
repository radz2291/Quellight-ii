# Builder evidence and retained failures

Baseline `a8c40fe74163b3273f603cab93453d86fb54bd1d`; synthetic local proof only. Exact integrated/verifier lineage belongs in the final report. Commands run in this Windows checkout; source/API/browser evidence does not imply production/V1 acceptance.

| Check | Observed result |
| --- | --- |
| Initial recovery spike | Six groups PASS: real SCRAM/RLS, receipt races/versions, Mastra two-turn stream+abort, process kill after effect/reclaim/fence, cancellation/failure/retry, v2 rollback guard |
| HTTP extension | Seven groups PASS after test harness repair: actual server restart invalidates sessions and retains source/history; API/SSE owner scope, CSRF, forgery and private-source sentinel checks |
| checkJs/build | Server/scripts/tests checkJs and native server/browser syntax/copy build PASS before final docs/evidence additions; rerun final integrated candidate before verdict |
| Browser walkthrough | PASS, Chromium 156.0.8078.4 / Playwright 1.64.1. Desktop 1440x1050 and mobile 390x844; streaming, saves/corrections, lost-ack retry, queue/separate worker, Bob isolation/reload, seed v2 and no page errors. Re-run after display-name update before final evidence. |

Preserved failed attempts (not package failures):

1. Baseline foundation checker still demanded literal II-001 in AGENTS after owner-updated main made the task dynamic. Build passed, docs check failed. Replaced fixed-ticket assertion with the current owner-authorized task contract; later check passed.
2. First HTTP test chose database port +10000, exceeding 65535. Server exited before exercising HTTP, and cleanup waited on an already-exited child. Corrected bounded port range and cleanup exit guard; failed fixture database stopped without deletion, all HTTP assertions then passed.
3. First full browser run passed foreground, lost-ack, separate worker, mobile and owner-switch checks but failed seed save after reload because the test had not supplied the required original source. No unsupported record was committed. Added an explicit synthetic seed source, re-ran, PASS.
4. TypeScript checkJs initially flagged widened model literal, optional callback annotation, a DOM element annotation and Buffer|string docs enumeration. Corrected types; no checkJs suppression or disabled typecheck used. Frontend gets syntax + browser execution checks, not full typed DOM coverage.
5. In-app browser automation failed to initialize with a kernel-assets path error. No screenshot was inferred. Used pinned Playwright instead; kept browser reproduction source and inspected actual screenshots.
6. Dependency audit found the initially pinned Zod 4.3.6 affected by [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). Updated exact pin/lock to 4.6.7 (patched line >=4.6.6); rerun audit and full affected integration/browser checks before final verdict.
7. Original exact candidate 498b9ea independently HELD for a real delayed-digest save crossing an owner switch, despite ordinary browser and DB tests passing. [Original verdict](VERIFICATION-01.md) and [probe](verification-probes/independent-01.mjs) are preserved. Successor captures intent/session before awaiting and rejects stale dispatch; server owner-context precondition is additional protection. Both selected/preserved UIs require regression proof.
8. During owner-requested UI integration, two dependency installs overlapped and left incomplete local node_modules. Stopped the redundant package executor, serialized package installation and rebuilt exact pins; no source/runtime data was removed. Fresh lockfile installation is required in independent successor verification. No claim that the temporary extraction failures were library defects.

No real source records, private auth files or provider keys were read for these tests. The user separately supplied temporary model credential locations and preference, saved only to private memory on explicit request; deterministic proof needed no access or real inference. No connector calls to Supabase, paid model calls, hosted resources or deployment occurred.
