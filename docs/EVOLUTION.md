# Evolution and scalability contract

**Status:** hard product requirement. Changeability means accommodating unexpected mid-development requirements without repeatedly rebuilding the foundation; operational scalability matters too. No design is guaranteed future-proof.

## Stable spine, replaceable organs

Stable contracts should define the user, source evidence, versioned records/events/relationships, primitive operations, authorization, background run lifecycle and inspectable changes. Implementations for model providers, retrieval, memory curators, workers, UI packages and external integrations should live behind small replaceable boundaries.

Avoid entangling Companion conversation with database layout, vendor response envelopes, chat component internals, specific habit kinds or Steward implementation. Do not create a speculative all-purpose framework just to anticipate imaginary features.

## Change classification

| New requirement | Expected extension path | Core change acceptable? |
| --- | --- | --- |
| New way to reason about existing data | Add/revise a JIT method skill and its tests | Usually no |
| New personal domain (e.g. learning experiment) | Add versioned record definition, relevant skill and UI presentation | Usually no |
| New field or relationship | Versioned data definition + migration + indexing/test updates | Bounded change |
| Different model/provider | Replace provider adapter, re-run behavior and cost tests | No data replatforming |
| New external action (calendar/push/payment) | Add a permissioned integration and approval path | New capability required |
| New retrieval approach | Replace retrieval adapter; preserve sources, record IDs and original conversations | No loss of personal data |
| More users/jobs | Index/partition/scale worker concurrency and queues while preserving isolation | Operations can evolve |

## Data evolution rules

- Stable IDs and source lineage must survive schema and provider changes.
- Record definitions are validated and versioned. Maintain backward readers or deliberate migrations with dry runs and reversibility where possible.
- Favor typed/indexed core fields plus constrained extensions. Neither a rigid one-table-per-new-idea approach nor unvalidated generic blobs satisfy this contract.
- Never silently rebuild or discard original conversations to improve retrieval. Derived indexes and summaries are reproducible.
- When making structural changes, test existing data, migrated data, rollback, partial failure, cache staleness and repeat execution.

## Mid-development change protocol

1. Record the new owner's intent and whether it supersedes an earlier decision in [Decisions](DECISIONS.md).
2. Identify affected product behavior, data, contracts, permissions, tests and current stage.
3. Prefer a small extension path; explain when a genuine new service/integration or wider change is needed.
4. Amend [Architecture](ARCHITECTURE.md), relevant contracts, [Stages](STAGES.md), [Acceptance](ACCEPTANCE.md) and [Handoff](HANDOFF.md) together before changing code.
5. Implement with migration/rollback planning where data is touched; independently verify new and regression behavior.
6. Preserve earlier candidates, failed evidence and the exact current verified SHA.

Stop for a **material product fork** requiring owner judgment; do not stop for routine, in-scope repair. Do not present one agent's implementation claim as independent verification.

## Required architecture evolution drills

- **EVO-01 New domain:** after the core exists, add a hypothetical 90-day personal experiment (records, evidence, changing goals) without editing the Companion or fundamental gateway. Show what changed.
- **EVO-02 Retrieval replacement:** switch a test retrieval strategy and prove existing source IDs, corrections and cross-session recall remain valid.
- **EVO-03 Interrupted worker:** checkpoint/restart a long background run and verify exact-once effects through idempotent mutations (not a false claim of exactly-once queue delivery).
- **EVO-04 User growth/isolation:** test parallel users and concurrent jobs with no cross-owner data reads, writes or activity leaks.

At Cycle 0 decide measurable targets and budgets for context size, per-run cost, memory recall quality, queue lag, job retries, storage growth and live status. Do not invent performance results before a runnable system exists.

