# Acceptance scenarios and evidence standard

**Status:** V1 quality contracts; not executed. The implementation stage that proves each scenario is listed for planning, not assumed complete. Use synthetic multi-user fixtures in the repository; personal historical evaluation data remains private.

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

## Stage 0 acceptance (documentation and read-only evidence only)

- **C0-01:** Verify repository identity, branch, remote, current SHA, installed tools and documented stage scope.
- **C0-02:** Produce an owner-safe, aggregate source-schema inventory or an explicit BLOCKED report with exact access limitation; prove no source mutations.
- **C0-03:** Independently check the chosen Mastra memory, durable-agent, skill-search and observation facilities against primary docs and (if possible) isolated no-paid-call spikes.
- **C0-04:** Propose the new data model, validated primitive API shapes, concurrency/versioning, JIT context plan and accountable background lifecycle.
- **C0-05:** Give a new-project provisioning and import plan with permissions, data segregation, backups/restore and rollback boundaries; do not provision or import.
- **C0-06:** Run the first architecture evolution thought experiment (new personal domain) and show how few contracts actually change; identify any counterexamples honestly.
- **C0-07:** Update foundation documents consistently, enumerate all outstanding implementation risks and prepare a bounded Cycle 1 candidate handoff **without self-authorizing Cycle 1**.

## Verification contract

For each claim, save command/reproduction steps, the exact tested SHA, data fixtures, observed behavior, known limitations and a PASS/FAIL/NOT DEMONSTRATED result. Independent verification uses a fresh context/session/checkout where practical and challenges the candidate. A builder's self-report is not a final gate. Repaired candidates are reverified and prior failures retained. Verdicts: PASS; PASS WITH NON-BLOCKING FINDINGS; HELD; FAIL; BLOCKED. The stage manager reports a truthful verdict and stops at the accepted stage boundary.

## Real-world memory evaluation

Before declaring V1 ready, evaluate recall from real historical conversations through a private, owner-authorized test set with positive, ambiguous, stale-preference and negative questions. Track retrieval source correctness, grounded answer quality, false-memory rate, timezone accuracy, correction persistence and privacy isolation. **No numerical quality target is invented yet**; Cycle 0 should propose thresholds and owner review procedure.

