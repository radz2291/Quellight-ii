# Development cycles and gates

**Status:** roadmap accepted as a proposed sequence, **not** blanket authority to implement all cycles. The current authorization is in [HANDOFF](HANDOFF.md). Each stage must end with an observable result, verified negative cases, exact commit evidence and explicit owner handoff/acceptance.

## Cycle 0 — Foundation and historical discovery

**Goal:** make a technically credible, safe implementation plan and inspect the previous Supabase conversation source without modifying it.

**Scope:** repository-state reconstruction; redacted/read-only source inventory; primary-documentation validation for Mastra/Supabase/chat UI; proposed record/primitive/memory/worker/security contracts; changeability challenge; amended stage plan; verification evidence and owner report.

**Exclusions:** new app implementation, new Supabase project provisioning, production changes, source database mutations, conversation import, paid inference, deployment and merges to main without owner direction.

**Demo:** a fresh developer can read the reports and explain how a historical conversation would be preserved and recalled, how a job survives restart, and how a new unforeseen personal domain would be added. Show source-schema evidence and explicit uncertainties.

**Pass:** C0-01 through C0-07 in [Acceptance](ACCEPTANCE.md); independent challenge on exact candidate. **Stop:** source access rights missing, destructive requirement, unresolved privacy/ownership, material product fork or inability to support required architecture under selected packages. Report HELD/BLOCKED honestly.

## Cycle 1 — Core foundation and vertical proof

**Goal:** deliver a runnable minimal app with identity-isolated durable records, constrained primitives, change history and one thin end-to-end path.

**Scope candidate:** new Supabase environment after authorization; app shell; authenticated user; record/source/event/revision contracts; server-side permissions; foreground create/query; queue→worker status→Inspection stub; architecture evolution drill.

**Demo:** request a simple note/task, confirm durable write, inspect source/action, restart processes, verify no cross-owner access; add a hypothetical new record kind without changing core composition.

**Exclusions:** large-scale historical import, advanced memory, all V1 habits and polished Inspector.

**Gate:** negative security, version/concurrency, idempotency, restart and extensibility checks all pass.

## Cycle 2 — Memory intelligence and historical import

**Goal:** source-grounded cross-session personal continuity, validated historical import, exact retrieval and memory correction.

**Demo:** return in a new session and recall an old dated discussion, source link, changed preference and corrected record; import repeatably without source writes.

**Gate:** MEM-01–MEM-05, IMP-01; source counts/ownership, recall quality and retention checks.

## Cycle 3 — Companion, durable Steward and JIT skills

**Goal:** smooth conversational experience alongside a multi-step, recoverable and inspectable background worker.

**Demo:** natural discussion, asynchronous background enrichment, visible live progress, model/tool iteration, restart and safe retry; skill discovered only when needed.

**Gate:** PRD-01, AGT-01, AGT-02, INS-01 and EVO-03; failure and permission probes.

## Cycle 4 — Daily Desk, Living Book and gentle onboarding

**Goal:** meaningful everyday utility and first-user orientation.

**Demo:** tomorrow's task appears in briefing, exercise twice weekly target differs from actual completions, personal record is browsable, new user receives minimal optional discovery, imported user does not repeat it.

**Gate:** ACT-01, ACT-02, ONB-01, ONB-02 and relevant corrections.

## Cycle 5 — Owner inspection and V1 acceptance

**Goal:** product-level reliability and transparent ownership, not the first time we implement activity logging.

**Demo:** owner walks through a complete life cycle—from conversation to memory/task to Steward execution to correction and history—while inspection accurately exposes successes, failures and sources.

**Gate:** INS-02, SEC-01, EVO-02, EVO-04, full regressions, accessible browser walkthrough, memory-quality review, restore rehearsal and a truthful final V1 verdict.

## Stage operation

One accountable stage manager owns integrated candidates, evidence and end-to-end repair. An independent fresh-context verifier challenges exact commits; no implementation change inherits an old verification verdict. Keep earlier failures and findings; do not silently mark incomplete acceptance checks PASS. Stops at each accepted boundary, not after every routine repair. See [AGENTS.md](../AGENTS.md), [STATE](STATE.md), [HANDOFF](HANDOFF.md).

