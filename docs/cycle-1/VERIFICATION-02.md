# Independent Cycle 1 verification 02 — PASS, local proof only

Tested repaired candidate: **86b49fd9d43a95a50448568afded57fb5ef51992**. Exact baseline: **a8c40fe74163b3273f603cab93453d86fb54bd1d**; accepted Cycle 0 merge: **16e9f187c72a441aa1be30a466514b9f0d43ebe4**. Both are ancestors of the tested candidate. Original candidate **498b9ea27dbd3f8c2bf4a8f04f92de9925a7fd89** and its [HELD audit](VERIFICATION-01.md) remain preserved. Date: 2026-10-25, Windows, Node 22.22.3 / npm 10.9.8.

**Verdict: PASS for the authorized local synthetic functional proof.** No material defect was found in this successor audit. The original F1 owner-switch schedule is now fenced in both interfaces. This is an independent fresh-context execution and source review, not owner acceptance, a production security certification or a memory/provider-quality verdict. Final PR/evidence delivery and Work closure remain the accountable stage manager's responsibility.

## Independence and authority

Fresh detached clone: `C:\Users\RZ1\Desktop\RZ\261024-Quellight-ii\tmp\c1-independent-02`. All installation and execution below occurred there at the exact candidate. Read AGENTS, STATE, HANDOFF, Work protocol, acceptance, setup, implementation, UI-STACK, original verification/retained probe, repairs, builder evidence and report, then reviewed the selected/native UI, streaming route, server, gateway, database schema/transactions, fake model, worker and tests. Live read-only Work confirmed II-002 assigned to the accountable Cycle 1 manager in progress, dependency II-001 done, pinned execution standard revision 2, explicit launch discussion and subsequent owner-directed UI scope. No Work mutation was made by this verifier.

The tracked candidate stayed unchanged: final `git diff --exit-code HEAD` and `git status --short` were empty. This report is the only root-worktree file written by this verifier; its later verifier/report commit SHA and final delivery SHA must be recorded by the stage manager rather than invented here. The original audit's Git blob remained `e4f42c6f6862478651c34df52f5b22d27dde0dfa` in both the checkout and candidate tree.

Only newly generated local synthetic fixtures and their credentials were used. No hosted/source Supabase calls, private source records, real provider credentials/inference, deployment, merge, resource retirement or fixture deletion occurred. The pre-existing untracked root setup document was not read or changed.

## Reproduction and results

```powershell
git clone --no-hardlinks . tmp/c1-independent-02
git -C tmp/c1-independent-02 checkout --detach 86b49fd9d43a95a50448568afded57fb5ef51992
# In the fresh detached clone:
node --version
npm --version
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run check
node docs/cycle-1/verification-probes/independent-01.mjs
npm run build
$env:QL_BROWSER_NATIVE='1'
$env:QL_EVIDENCE_DIR='tmp/qa02-native'
npm run test:browser
Remove-Item Env:QL_BROWSER_NATIVE
$env:QL_EVIDENCE_DIR='tmp/qa02-selected'
npm run test:browser
git rev-parse HEAD
git diff --exit-code HEAD
git status --short
```

The native and selected browser invocations actually used separate fresh shell environments, so native mode was absent from the selected run. Each runner creates its own database; build completed before the selected production-mode browser run. All commands exited 0.

| Check | Independent observation |
| --- | --- |
| Fresh installation | PASS: 283 packages, about three minutes, lifecycle scripts disabled. No dependency tree copied from the builder. |
| Integration | PASS: 8/8, zero failures/skips, 31.197 seconds overall. Real SCRAM/RLS and all eight forced-RLS tables; generic primitives/atomic rollback; two-turn fake Mastra discovery/stream/abort; actual after-effect process kill/reclaim; duplicate dispatch/stale-generation fence; cancellation/forged worker/failure/retry; v2 rollback/v1 compatibility; separate empty-database up/down/up; HTTP auth/CSRF/SSE/IDOR/privacy and actual HTTP restart/source reload. The new mismatched owner-context request returned 409 `owner_context_changed`. |
| Check | PASS: checkJs, generated Next route types, strict Next TS/TSX, and 36 foundation documents/link/authority checks. |
| Build | PASS: preserved native syntax/copy build and optimized Next.js 16.4.3 production build, including TypeScript and static/dynamic route generation. A nested-clone warning says the parent repository lockfile is outside this clone and was ignored; it did not prevent the build or route execution. |
| Retained reviewer probe, unchanged | PASS: seven groups, empty findings. Direct DB role/session/DDL/RLS-off/composite-FK/all-table negatives; same-key conflicting race; independent owner key namespace; twelve duplicate edits yield one new revision with original source; actual before-effect kill/stall/stale renew-effect-finish/recovery; twenty cancellation/effect races; forged HTTP envelopes/write IDOR; live SSE closes on logout; source/password sentinel privacy; original F1 schedule now fenced. |
| Preserved native browser | PASS: eight assertions, 17.952 seconds, Chromium 156.0.8078.4. Stream/save/source/correction; lost acknowledgment retry; separate queued-to-finished worker; mobile; ordinary owner switch/reload; seed v2; delayed-save F1; no JavaScript page errors. |
| Selected Next/assistant-ui browser | PASS: ten assertions, 15.840 seconds, same Chromium. All retained ordinary walkthrough behaviors, plus Companion-first default/secondary inspection and assistant-ui stop/error behavior. Delayed-save F1 is rejected. No JavaScript page errors. |

The retained independent-01 probe prints a **hardcoded original-candidate label** (`498b9ea...`) in its JSON. It was deliberately run unchanged against the detached **86b49fd...** checkout; that stale label is not the tested revision. The actual final HEAD and unchanged source were checked separately. Its `findings: []` and seven successful groups are the new execution result; its earlier HELD evidence is not rewritten.

## Repair and selected UI review

F1 schedule: pause Alice's save during `crypto.subtle.digest`, sign Alice out, sign Bob in, then release the digest. The unchanged original probe directly queried Bob and found no stale Alice record. Both browser runners independently repeated the delayed-save schedule and found no migrated Alice title after reload. Native payload/handler guards capture owner and epoch before the await; selected UI captures the owner, payload and abort scope before it, aborts/unmounts on sign-out and checks the scope before pending-key access or dispatch. The expected-owner header is compared with an authenticated session; it is a precondition, never a source of identity. The selected proxy forwards that header and cookies without a privileged database client. The matching enqueue paths share these guarded payload/save functions; the executable delayed-switch schedules specifically exercised foreground save.

The selected source uses assistant-ui `useLocalRuntime`, runtime provider and Thread/Message/Composer primitives; the adapter yields cumulative text from the local NDJSON stream and forwards cancellation. Next actually builds and serves the App Router page and streaming Route Handler in the selected browser proof. Stop and synthetic HTTP failure return control to the composer and show the interruption message without a saved-record claim. These are integrated runtime observations, beyond dependency/package presence.

Default visible content contains conversation and Your space; records, schema/JSON, revisions, save controls and Steward details are hidden until that secondary view opens. The same walkthrough then saves, corrects and inspects original source and human/Steward revisions there. Independently viewed the newly generated selected conversation, desktop-inspection and mobile screenshots, plus native mobile: clear Quellight naming, honest synthetic-response labels, readable inspection, no horizontal overflow at 390px. Temporary notices can cover a small form area until they expire; this did not block the tested interactions and is a minor presentation limit rather than a functional gate failure.

`git diff 498b9ea27dbd3f8c2bf4a8f04f92de9925a7fd89 HEAD -- db src/gateway.mjs src/db.mjs src/worker-runtime.mjs src/model.mjs` was empty. Source review and rerun probes preserve server-authorized strict primitives, owner/session-derived DB roles, forced RLS, owner-bound foreign keys, transaction receipts/provenance, row-locked generation/lease fencing and one applied local effect. The server changes are the local frontend origin/default-port integration and optional authenticated-owner precondition. The Next adapter bounds request bodies, restricts forwarding to the fixed loopback gateway, checks Host/POST Origin, disables authenticated caching and streams upstream responses. This is scoped functional review, not an exhaustive new-framework security audit.

## Criterion verdicts at this audit boundary

| Criterion | Verdict | Evidence / remaining responsibility |
| --- | --- | --- |
| C1-01 | PASS reconstructed local scope | Exact candidate/base/C0 ancestry and environment verified; live assignment/dependency/pin/discussion read. Historical preimplementation actions are attributable to the stage-manager record. |
| C1-02 | PASS local scope | Fresh multi-turn stream, before/after-effect kills, duplicates, cancellation and stale fences. App-owned SQL durability; beta Mastra durable wrapper NOT DEMONSTRATED. |
| C1-03 | PASS local scope | Real SCRAM, forced RLS/direct negatives, API/SSE isolation, both two-owner UIs and repaired intention separation. Hosted Supabase Auth/Realtime NOT DEMONSTRATED. |
| C1-04 | PASS local scope | Eight owner-bearing tables, provenance/receipts, atomic rollback, migrations/up-down-up and guarded v2 downgrade. |
| C1-05 | PASS local scope | Five strict generic operations, conflicts/duplicates/versions and source/history; no model SQL/admin interface. |
| C1-06 | PASS local scope | UI create/correction/lost-ack retry, direct API/source/history after actual restart and F1 repair in both UIs. Unsaved conversation remains intentionally ephemeral. |
| C1-07 | PASS local scope | Separate worker/queue and visible state; before/after-effect recovery, cancelled/stalled/failed/retry, at most one applied local effect. |
| C1-08 | PASS bounded exercise | Definition/skill-reference seed v2, generic dynamic UI, v1 compatibility and safe rollback refusal. Arbitrary future domains or model-driven JIT skill loading NOT DEMONSTRATED. |
| C1-09 | PASS local challenge | Fresh retained adversarial DB/API/race/privacy/recovery probes plus repaired selected/native owner-switch schedule. |
| C1-10 | PASS planning artifact only | Hosted gate documents exact prerequisites and honestly pending identity/entitlement/cost/backup/restore/disposition/rollback/approval. Actual hosted readiness is NOT DEMONSTRATED; no external action authorized. |
| C1-11 | PASS technical verification; delivery pending | Exact successor independently installed/tested/checked/built/browser-probed; original failure retained and repair confirmed. Stage manager must commit/link this report, record verifier/delivery SHAs, and finalize PR/owner report. |
| C1-12 | PENDING stage manager | No verifier Work write. All-criteria reconciliation, final outputs/discussion/run, Review transition and exact-ticket persistence re-read remain required before delivery completion. |

## Evidence retention and limits

Synthetic browser JSON/screenshots remain ignored at `tmp/c1-independent-02/tmp/qa02-selected` and `tmp/c1-independent-02/tmp/qa02-native`. Retained isolated fixture directories: `test-1792862538445-23072`, `independent-1792862563312-27396`, `browser-1792862576873-16656` and `browser-1792862623954-16464`, under that clone's `tmp`. Runner cleanup completed, with no `postmaster.pid` remaining in the fresh clone's fixtures; directories were preserved. Generated runtime credentials are deliberately excluded from this report/public artifacts.

No new dependency audit was run here; builder audit claims are not independently extended. Linux/macOS, hosted auth/realtime/restore, TLS/production hardening, multi-instance sessions, distributed operation, full conversation persistence, historical import, semantic memory/JIT retrieval, actual provider behavior/quality/cost and V1 readiness remain **NOT DEMONSTRATED**. The local fake response ignores semantic input. The 1.5-second lease and reproduction durations are test fixtures, not production targets. Only Radzi accepts Cycle 1; this PASS grants no Cycle 2 or external-resource authority.
