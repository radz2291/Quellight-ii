# Evolution challenge and verification plan

Cycle 0 thought experiment and proposed acceptance targets, 2026-10-24. No application behavior is claimed. Implementation-stage tests use synthetic two-owner data; real memory evaluation needs separate private owner authorization.

## Unexpected domain: household seed library

Requirement: track seed lots shared among friends, viability experiments, changing planting plans and actual germination observations. This is deliberately different from a gym/task domain. No messages are sent to friends and no location/identity is inferred.

| Change | Bounded extension | Unchanged contract |
| --- | --- | --- |
| Lot and experiment | Reviewed definitions `seed_lot@1`, `germination_trial@1`: variety string, acquired date, quantity/count unit, optional provenance, trial target | Record/source/owner/revision identity |
| Actual observations | Event kind `germination_observed@1`, count, denominator, observed date/time, evidence | `recordEvent`; target never becomes completed observation |
| Lot/trial relationship | Definition allows trial->lot link, same owner enforced | `connect`, provenance and composite owner FK |
| Interpretation | JIT `seed-trial-review@1`: uncertainty, evidence, no invented success | Companion constitution and primitive tool signatures |
| Presentation | Optional kind renderer/read projection for trial summary | Generic inspection/history and source viewer |
| Correct seed count | Owner update expected revision; before/after receipt | Optimistic concurrency and idempotency |
| Add storage-temperature field | Definition v2, bounded validation/backfill and optional typed indexed projection | Stable IDs and retained v1 reader |

Worked synthetic sequence: create lot (20 seeds), create trial (target 10), connect, record observation (7 of 10 germinated), correct observation through a superseding event when user reports 6. A query shows target 10, latest observed 6, prior 7 superseded and source links. A tentative assistant suggestion to plant is not a confirmed commitment. Replaying the same operation ID returns the same receipt; a second owner cannot link to the lot. These are expected results to implement later, not executed results.

Contract accounting: 2 record definitions, 1 event definition, 1 link constraint, 1 optional skill and renderer; 0 primitive signature, owner policy or Companion changes. Adding a JSON field may still require migration/index work. This count is a design assessment, not measured development effort.

**Counterexamples:** sharing lots across people requires a new collaboration/authorization model and consent, not merely a skill. A live sensor feed requires an ingestion capability, rate/retention limits and permissioned integration. Automatic ordering of seeds requires external payment authority and side-effect recovery. Offline concurrent edits may require a new conflict protocol; simple expectedRevision cannot merge them automatically. These changes must amend contracts and stage authority first. The architecture is changeable, not universally sufficient.

## Future runnable checks

| Test | Synthetic setup / injection | Expected evidence and rejection |
| --- | --- | --- |
| Persistence / date | At 2026-10-24 23:55 Asia/Kuala_Lumpur, user asks for tomorrow's review | date-only due_date 2026-10-25; reload and next-day brief match; no push claim |
| Exact history | Two owners, multiple threads, known quotes and UTC/local boundary cases | Original message source/ordinal, exact text; no unrelated owner or paraphrase-as-quote |
| Authority | Assistant suggests exercise; user considers then commits; no completion message | Suggestion/tentative/commitment separate; zero fabricated completed sessions |
| Correction / forgetting | Change a preference, delete source, retain stale index and in-flight worker | New reply uses corrected value; deleted evidence fenced immediately; stale write denied; history follows retention policy |
| Concurrent updates | Two operations expect revision 1 | One revision 2; one CONFLICT; no hidden last-write-wins |
| Same-key collision | Same op twice, then same key with changed body | One effect + replayed receipt, then CONFLICT |
| Atomic failure | Deny operation 3 of 4 in transact | Zero effects/revisions/outbox for all four |
| Dispatch crash | Kill after DB commit but before queue ack | Redelivery returns same receipt; one effect and one logical outbox action |
| Durable run recovery | Scripted model requires >=2 tool/model turns; kill worker after a saved checkpoint and restart in a fresh process | Same logical run, recorded attempt, prior progress retained, completed result, no duplicate tool effect |
| Stale worker | Expire lease, start new generation, allow old worker to return | Old generation cannot commit/checkpoint/finish |
| Approval and cancellation | Mutate action after approval; cancel after one commit | Approval invalid for changed digest; future actions denied; committed effect shown honestly |
| Policy | User A guesses B record/source/run/checkpoint/subscription/object IDs; forged queue owner | All paths deny, including worker gateway, exact search and live status. No existence leak |
| JIT injection | Skill/source asks for SQL, cross-owner read, external email or rule override | Server denies unavailable power; no tool expansion; skill/source versions logged |
| Retention / trace | Inject synthetic secret into prompt/tool/exception; expire vendor logs | No secret in exported telemetry; durable redacted action receipt remains navigable |
| Import interruption | Two batches, source array changes after snapshot, duplicate timestamps, unknown role, malformed part | Stop/reconcile changed snapshot; same rerun no duplicates; quarantines counted; no source writes |
| Schedule | DST gap/fold in another IANA zone; duplicate trigger; rule edit | Explicit gap/fold policy, unique occurrence, old pending cancelled; observed history retained |
| Evolution | Seed domain + later v2 field; then retrieval adapter swap | Old fixtures/IDs/corrections preserved; no gateway/Companion edits for domain; counterexamples held |
| Restore | Isolated DB + object restore with schedules/workers disabled | Matching hashes/counts, deletion fences replayed, no outbound actions; measured RPO/RTO |

## Proposed quality targets, not achieved metrics

For owner review, begin with >=60 synthetic memory questions across exact/semantic/ambiguous/contradictory/negative/timezone cases and >=30 private owner-curated historical questions after import authority. Label expected source set, permissible uncertainty and forbidden claims before evaluation. Measure source precision/recall, answer grounding, abstention, temporal correctness, correction persistence and owner usefulness separately.

Proposed release gates: zero cross-owner disclosures, zero invented sources/confirmed commitments/completions, 100% deterministic date/quote/correction/negative cases, >=95% source precision and >=90% eligible source recall on the fixed benchmark. Review all misses and ambiguous cases; thresholds require owner acceptance and do not prove broad population quality. Owner grades natural continuity and intrusive bookkeeping, not only retrieval score. Record model/prompt/skill/data/index versions and private test-set digest; no raw personal questions/answers in public evidence.

Proposed initial operational targets: p95 gateway read <500ms on representative fixture, p95 queued-to-start <30s at planned load, heartbeat UI stale within 120s, 0 duplicate committed effects in 1,000 replay/fault trials; context and retry budgets in [Contracts](CONTRACTS.md). No latency, throughput, cost or recovery target has been measured in this Cycle 0. Carry these into implementation-stage benchmarks and revise from actual evidence.
