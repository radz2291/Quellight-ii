# Independent Cycle 1 verification 01 — HELD

Tested candidate: **498b9ea27dbd3f8c2bf4a8f04f92de9925a7fd89**. Baseline: **a8c40fe74163b3273f603cab93453d86fb54bd1d**, containing accepted Cycle 0 merge **16e9f187c72a441aa1be30a466514b9f0d43ebe4**. Date: 2026-10-25, Windows, Node 22.22.3 / npm 10.9.8. This is the original candidate audit; a successor must retain this failed finding and receive exact-commit revalidation.

Fresh verifier context and detached clone: `C:\Users\RZ1\Desktop\RZ\261024-Quellight-ii\tmp\c1-independent-01`. The verifier read AGENTS, STATE, HANDOFF, acceptance, setup, implementation, builder evidence, report, SQL, server/gateway/model/worker code, UI and tests. Tracked candidate implementation remained unchanged. The only new clone source is the reviewer-owned probe. Work state/owner acceptance and external accounts were not mutated or independently reverified. No hosted/source Supabase calls, private credential files, real inference, deployment or merge occurred. Generated credentials were read only from newly created local synthetic fixtures and never printed or committed.

## Material finding F1 — pending save crosses owner switch

**HELD.** In `public/app.js`, `payload()` captures Alice's form/source, then awaits `crypto.subtle.digest`. The save handler calls `op()` only after that await; `request()` captures the session epoch too late. If Alice signs out and Bob signs in during the await, the pending Alice intention is submitted with Bob's cookie and committed to Bob's records/sources. The key is also stored under the then-current owner. Database RLS correctly isolates the current authenticated owner; it cannot detect the UI's stale intention.

The independent Chromium probe deterministically delayed the digest, clicked Alice Save, signed out, logged in Bob, released the digest, and directly queried Bob's records. **Alice's synthetic private title and original source were committed under Bob.** The same shared payload path also serves enqueue. No implementation repair was made by this verifier. Required repair: bind the entire save/enqueue intention to the initiating owner and session generation, reject stale work before transmission and before touching another owner's pending key/UI. Add a regression probe that preserves this schedule. A successor UI replacing the affected code must demonstrate equivalent protection.

Reproduce from a checkout containing the retained [probe](verification-probes/independent-01.mjs):

```powershell
node docs/cycle-1/verification-probes/independent-01.mjs
```

The digest delay is synthetic fault injection of an existing asynchronous boundary; no server code or permission was changed. It establishes a possible session-switch race, not a claim of ordinary digest latency or a hostile user's ability to bypass RLS.

## Executed commands and observed evidence

```powershell
git clone --no-hardlinks . tmp/c1-independent-01
git -C tmp/c1-independent-01 checkout --detach 498b9ea27dbd3f8c2bf4a8f04f92de9925a7fd89
# Remaining commands in the detached clone:
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run check
npm run build
npm run test:browser
node docs/cycle-1/verification-probes/independent-01.mjs
npm audit --omit=dev --json
git rev-parse HEAD
git diff --name-only HEAD
```

- Install PASS: 169 packages, lifecycle scripts disabled. Audit PASS: zero reported production dependency vulnerabilities at audit time. This is not a comprehensive security guarantee.
- Integration PASS: **8/8**, zero skips/failures, approximately 42.6 seconds. Actual SCRAM authentication, all eight forced-RLS tables, idempotency/version guards, Mastra two-turn fake streaming/abort, actual after-effect worker kill/restart, stale generation, cancellation/failure/retry, v2 guarded rollback, separate empty database up/down/up, HTTP session/CSRF/SSE/IDOR and actual HTTP restart/source reload passed.
- Check PASS: checkJs plus 33 foundation documents/link/authority checks. Build PASS: native syntax-check/copy build. No production artifact or full frontend typechecking claim.
- Browser PASS for the supplied ordinary walkthrough: Chromium **156.0.8078.4**, 1440×1050 and 390×844, approximately 38.0 seconds. Stream, note/correction/provenance, lost-ack retry, separate worker, ordinary Alice→Bob logout/login, reload and schema-v2 dynamic fields passed, zero JavaScript page errors. Independent visual inspection of its actual desktop/mobile screenshots found readable source/history and honest fake/local labels; mobile screenshot had no horizontal clipping. These ordinary scenarios missed F1.
- Fresh probe PASS: actual database role/session impersonation, DDL/grant failures, `row_security=off`, cross-owner composite-FK IDOR, and zero Alice rows across **all eight** owner tables as Bob.
- Fresh probe PASS: simultaneous same-key/different-payload requests yielded one success/one conflict; identical key across owners was independent; **12** same-key edit deliveries yielded one revision and retained original source.
- Fresh probe PASS: actual **before-effect** worker process kill left zero effect; expired run showed stalled; stale renew/effect/finish all failed; successor recovered and committed once. Builder's independently rerun integration also exercised actual **after-effect** kill and recovery without a duplicate effect.
- Fresh probe PASS: **20** simultaneous cancel/effect races serialized. Cancellation fenced all later effects, with at most one already committed effect retained. The contract correctly does not promise cancellation can undo that effect.
- Fresh probe PASS: HTTP owner/role/SQL envelope forgery and write IDOR denied. An open SSE subscription closed after logout. SSE/activity contained no raw source sentinel. Captured local database/HTTP/worker child logs contained neither synthetic source sentinel nor generated Alice/admin passwords.
- Fresh probe **F1 material failure**: delayed pending save committed Alice's source under Bob after owner switch, as above.

Fixtures and synthetic screenshots remain ignored under the fresh clone's `tmp/`; no private fixture configuration belongs in public evidence. An initial reviewer harness cleanup waited again on an already SIGKILLed child because `exitCode` remains null for signal termination; the reproducible probe checks `signalCode` as well. This was a verifier cleanup defect, not a candidate failure. No fixture directories were deleted.

## Criterion verdicts, limited to this audit

| Criterion | Verdict | Basis and limit |
| --- | --- | --- |
| C1-01 | PARTIAL / root confirmation pending | Exact baseline/candidate ancestry and package execution verified. Live Work assignment, dependency and standard were supplied by stage manager; verifier made no Work calls. |
| C1-02 | PASS local scope | Real Mastra two-turn fake stream, process kills before/after effect, duplicate recovery, cancellation and fencing. App-owned SQL durability; beta Mastra durable engine and paid provider NOT DEMONSTRATED. |
| C1-03 | HELD | Database SCRAM/RLS and API/SSE isolation pass; F1 violates UI owner-intention separation. Hosted Supabase Auth/Realtime not tested. |
| C1-04 | PASS local scope | Eight owner-bearing tables, atomic writes, receipts, composite owner keys, tested migrations/rollback guards. |
| C1-05 | PASS local scope | Five narrow validated generic primitives, key/version conflicts, source/revision provenance. No model SQL/admin capability. |
| C1-06 | HELD | Normal UI/API/restart/source/history passes; pending save must remain attached to its originating owner. |
| C1-07 | PASS local scope | Separate worker and durable queue, truthful states, actual kill/reclaim, cancellation race fences and at-most-once local applied effect. |
| C1-08 | PASS bounded exercise | Seed definition/skill version 2, dynamic fields, v1 compatibility and safe rollback refusal. JIT skill loading and arbitrary future domains not claimed. |
| C1-09 | HELD | Independent negatives largely pass, but F1 remains material and requires repaired exact-candidate revalidation. |
| C1-10 | PASS planning artifact only | Checklist honestly records missing live target/account/cost/region/disposition/backup/restore/rollback/approval evidence. Hosted readiness remains NOT DEMONSTRATED and external actions unauthorized. |
| C1-11 | HELD | Reproducible install/tests/build/browser/direct probes and exact original candidate audited. Repaired successor, verifier/delivery SHA, PR and final owner report remain stage-manager work. |
| C1-12 | PENDING root responsibility | No verifier Work mutation. All-criteria evidence sync, final run/discussion/Review persistence re-read and owner acceptance are not established by this audit. |

The owner introduced evaluation of mature UI packages during this audit. The stage manager is handling that change; this report makes no successor-framework claim. Production security, distributed sessions, multi-instance durability, real model quality, semantic memory, historical import and hosted restore remain NOT DEMONSTRATED. Only Radzi accepts the stage. Overall original-candidate verdict: **HELD pending F1 repair and revalidation**.
