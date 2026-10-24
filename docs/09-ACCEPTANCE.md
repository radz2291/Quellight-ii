# 09 — Acceptance scenarios and evidence standard

**Status:** Cycle 0 research/documentation criteria are owner-accepted; V1 product-level behavior remains NOT DEMONSTRATED. The implementation stage that proves each scenario is listed for planning, not assumed complete. Use synthetic multi-user fixtures in the repository; personal historical evaluation data remains private.

| ID | Stage target | User-visible scenario | Negative or failure check |
| --- | --- | --- | --- |
| PRD-01 | 3 | Deep conversation stays natural while a Steward job runs in the background | No repetitive “shall I save this?” or premature success claim |
| ONB-01 | 4 | Unknown user is asked a few relevant, optional introductory questions | No interrogation, unnecessary sensitive questions or mandatory long form |
| ONB-02 | 4 | Imported/known user is recognized and only gaps are checked | No repetitive cold-start questions or unsupported claims of knowing user |
| MEM-01 | 2 | From a fresh session, recall a topic discussed in another session with source | No false unrelated matching thread |
| MEM-02 | 2 | “What exactly did I say last Tuesday?” retrieves date-filtered original messages | No paraphrase presented as verbatim quotation; timezone handled |
| MEM-03 | 2 | New confirmed preference supersedes an older one while preserving history | Old value is not treated as equally current |
| MEM-04 | 2 | Conflicting or unsupported memory is treated as uncertain | No invented provenance, diagnosis or identity assertion |
| MEM-05 | 2/5 | User corrects or forgets information; future replies stop using invalid memory | No resurfacing through stale vector index or cached summary |
| IMP-01 | 2 | Authorized historical data import is repeatable and count-verified | No source database writes, duplicate import or cross-user records |
| AGT-01 | 3 | One Steward run performs multiple model/tool turns and reaches correct recorded outcome | Not reduced to a single queue invocation |
| AGT-02 | 3 | Stop/restart or failure resumes/retries with durable progress | No duplicate task/memory mutation or perpetual false-running status |
| ACT-01 | 4 | “Tomorrow I need to review the video” creates a task shown in next-day brief | “Saved” only after durable write; no phantom push alert |
| ACT-02 | 4 | Twice-weekly practice target and actual completions are independently visible | No invented completed sessions or guilt-based interpretation |
| INS-01 | 3/5 | Open a background run; view status, tools, skills, evidence and result | Missing/failed work is not hidden; secrets are not exposed |
| INS-02 | 5 | Inspect any retained personal record, original source, edits and related run | User is not forced to rely on opaque AI summary |
| SEC-01 | 1/5 | Owner isolation, permission denials and review gates work across read/write/subscribe | Prompt or skill cannot bypass server permission |
| EVO-01 | 1/5 | Add unexpected 90-day experiment via definitions/skills with bounded changes | No core rearchitecture or regression to tasks/practices |
| EVO-02 | 5 | Alternate memory retrieval implementation preserves data and recall evidence | No loss of old source identifiers or owner corrections |
| EVO-03 | 3/5 | Worker restart/duplicate-delivery simulation preserves correct final effects | No twice-applied transaction |
| EVO-04 | 5 | Introduce a second unforeseen user domain late in development using documented extensions and versioned migrations | No breaking existing memory, task/routine, audit or inspection behavior |

## Stage 0 acceptance (documentation and read-only evidence only)

- **C0-01:** Verify repository identity, branch, remote, current SHA, installed tools and documented stage scope.
- **C0-02:** Produce an owner-safe, aggregate source-schema inventory or an explicit BLOCKED report with exact access limitation; prove no source mutations.
- **C0-03:** Independently check the chosen Mastra memory, durable-agent, skill-search and observation facilities against primary docs and (if possible) isolated no-paid-call spikes.
- **C0-04:** Propose the new data model, validated primitive API shapes, concurrency/versioning, JIT context plan and accountable background lifecycle.
- **C0-05:** Give a new-project provisioning and import plan with permissions, data segregation, backups/restore and rollback boundaries; do not provision or import.
- **C0-06:** Run the first architecture evolution thought experiment (new personal domain) and show how few contracts actually change; identify any counterexamples honestly.
- **C0-07:** Update foundation documents consistently, enumerate all outstanding implementation risks and prepare a bounded Cycle 1 candidate handoff **without self-authorizing Cycle 1**.

## Cycle 1 acceptance — local functional proof (II-002)

The checks below are a **local synthetic-data** gate, not historical import, production readiness or permission to spend money. Every criterion requires direct source-linked evidence and fresh independent challenge; do not check it merely because a feature is planned.

- **C1-01 — Baseline and authority:** Verify accepted Cycle 0 merge, exact Cycle 1 baseline, current Work assignment/dependency/standard, package compatibility and full stage exclusions before implementation.
- **C1-02 — Recovery spike:** Reproduce fake-model multi-turn/streaming and local persistent effect with kill/restart, duplicates, cancellation and lease fencing; honest fallback/HELD for unsupported runtime behavior. No paid inference.
- **C1-03 — Auth and RLS:** Run the local app with two **synthetic authenticated owners** and independently test real database row-level read/write/subscribe permissions. A fake-only auth gate cannot PASS.
- **C1-04 — Durable model:** Deliver versioned schemas for sources, records, revisions, operations/effects, runs, receipts and outbox with tested migration/rollback and owner-bound keys.
- **C1-05 — Generic primitives:** Implement `discover/create/query/update/history` server-authorized operations, constrained parameters, idempotency/conflict guards and source provenance; deny model-origin SQL or admin access.
- **C1-06 — Foreground path:** Create and later reload a source-linked note/task in the UI and through API after process restart; inspect source, revision and changes; never acknowledge uncommitted writes as saved.
- **C1-07 — Background path:** Demonstrate non-blocking, separately dispatched and recoverable Steward execution with truthful queue/run/failure states and no duplicate committed effect after retry.
- **C1-08 — Evolution:** Add an unforeseen seed-domain definition/skill through a bounded extension and version-2 compatibility/rollback exercise without breaking existing note/task behavior; document required core changes honestly.
- **C1-09 — Negative security/recovery:** Fresh verifier tests read/write/subscribe isolation, IDOR, forged identity, stale leases, races, cancelling/stalled runs, privacy sentinels and restart/duplicate delivery on deterministic fixtures.
- **C1-10 — Hosted-resource gate:** Prepare verified staging/destination account, backup/restore, cost/region, retention/rollback checklist. **No** legacy mutation/remediation, staging deletion, hosted provisioning, import, payment or deploy without separate approval.
- **C1-11 — Independent evidence:** Reproducible commands, lockfile, local setup, build/typecheck, browser + direct DB/API checks, exact candidate SHA, independent verdict, preserved failed findings, repaired and reverified successor, PR and owner report.
- **C1-12 — Persistent ticket closure:** Before saying “done,” reconcile all Work checkboxes to evidence, attach SHA/PR/report/outputs, finish run, post final discussion, ensure `review`, then re-read exact ticket and confirm updates. Only Radzi accepts as `done`.

## Verification contract

Cycle 1 reproduction details: [local setup](cycle-1/SETUP.md), [implemented boundaries](cycle-1/IMPLEMENTATION.md), [builder results and preserved failures](cycle-1/BUILD-EVIDENCE.md), [hosted gate checklist](cycle-1/HOSTED-RESOURCE-GATE.md). Only [STATE](STATE.md) carries the current verdict; implementation claims require exact-commit independent verification.

For each claim, save command/reproduction steps, the exact tested SHA, data fixtures, observed behavior, known limitations and a PASS/FAIL/NOT DEMONSTRATED result. Independent verification uses a fresh context/session/checkout where practical and challenges the candidate. A builder's self-report is not a final gate. Repaired candidates are reverified and prior failures retained. Verdicts: PASS; PASS WITH NON-BLOCKING FINDINGS; HELD; FAIL; BLOCKED. The stage manager reports a truthful verdict and stops at the accepted stage boundary.

## Real-world memory evaluation

Before declaring V1 ready, evaluate recall from real historical conversations through a private, owner-authorized test set with positive, ambiguous, stale-preference and negative questions. Track retrieval source correctness, grounded answer quality, false-memory rate, timezone accuracy, correction persistence and privacy isolation. **No numerical quality target is invented yet**; Cycle 0 should propose thresholds and owner review procedure.

Cycle 0's [test/quality proposal](cycle-0/EVOLUTION-AND-TEST-PLAN.md) now supplies candidate benchmark sizes, acceptance thresholds, fault cases and resource targets. They require owner review and later measurement; they are not accepted quality guarantees. The Cycle 0 report must distinguish documentation/API feasibility from application memory, RLS, multi-turn recovery and browser behavior, all of which require later runtime proof.

