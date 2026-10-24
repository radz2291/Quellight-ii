# II-001 — Cycle 0 owner report

Dated research snapshot: 2026-10-24 (Asia/Kuala_Lumpur). **Independent verdict: PASS for Cycle 0 documentation/read-only research, with explicit evidence limits.** Owner acceptance is pending. Current operational status is only in [STATE](../STATE.md); authority only in [HANDOFF](../HANDOFF.md).

## Candidate and evidence lineage

- Repository: `radz2291/Quellight-ii`.
- Base fetched from origin/main before stage edits: **bf872f90986cd50da9109a610e5abe45b4bf5682**.
- Branch: **codex/c0-foundation-discovery**; main preserved.
- Original candidate: **34acfcc04152ed5570d1e7449e1df648226b1ea6** — independently HELD for source reproduction completeness; [original findings](VERIFICATION-01.md) retained unchanged.
- Repaired candidate and exact independently verified SHA: **0a1c0aa71688cd52680cb8498f0cf7ab377f7d70** — PASS, all C0-01..C0-07 at research/proposal scope; [repairs](REPAIRS-01.md), [independent verdict](VERIFICATION-02.md).
- Verifier evidence commit: **0d7b1328f94eb50deecc87c6efe74a137f9332d5**, adding only the second independent report. The final report/state closure follows this commit without changing audited contracts/probes. Final delivery SHA is the containing branch HEAD pinned in the PR/Work handoff; no self-referential SHA is asserted here.
- Independent review used a fresh verifier context and detached local clone on the same machine, public primary-source/registry checks and independent probe replay. It did not requery the private database or independently attest the source command history; source observations remain builder tool evidence. Reverification checked unchanged probe blob identity and repaired documentation.
- Versions, hashes and reproduction: [Baseline](BASELINE.md), [Technology](TECHNOLOGY.md), [published synthetic probe](probes/mastra/probe.mjs), [source query template](source-aggregate.sql).
- Pre-existing untracked `Supabase-Codex-Setup.md` preserved/excluded. No private records or credentials included.

## Evidence by criterion

| Criterion | Independently challenged result | Evidence and practical limit |
| --- | --- | --- |
| C0-01 | PASS | Repo/branch/remote/tool/ticket/scope reconstructed; [baseline](BASELINE.md); foundation check. No production readiness claim. |
| C0-02 | PASS, structural only | [Audit](SOURCE-AUDIT.md): owner-confirmed source, owner-scoped shape/time/role/attachment/ownership aggregates. READ ONLY observed on; no source mutations issued. Mapping/recovery are later gates. |
| C0-03 | PASS, docs/API feasibility | [Technology](TECHNOLOGY.md): independent primary research and four synthetic API groups. Actual recovery, memory quality, DB/HTTP security and UI behavior NOT DEMONSTRATED. |
| C0-04 | PASS, proposal | [Contracts](CONTRACTS.md): typed source/claim/revision model, primitive envelopes, authorization, atomic receipts/outbox, idempotency/races, worker/JIT/recurrence. No implementation. |
| C0-05 | PASS, plan | [Operations](IMPORT-AND-OPERATIONS.md): retirement/provisioning, identity mapping, importer/quarantine, reconciliation, retention/backup/rollback/spend gates. Nothing provisioned/imported. |
| C0-06 | PASS, thought experiment | [Seed challenge](EVOLUTION-AND-TEST-PLAN.md): bounded extension, unchanged primitives, explicit collaboration/sensor/payment/offline counterexamples. No runtime extensibility claim. |
| C0-07 | PASS, documentation gate | Foundation amended; risks/test plan and [Cycle 1 proposal](CYCLE-1-PROPOSAL.md) supplied. Original HELD, repairs and exact-candidate PASS retained. No owner acceptance or Cycle 1 authority. |

## Findings and next proposed action

1. Importing all 11,475 entries as ordinary user/assistant text would corrupt semantics. Preserve source snapshot/ordinal/raw time/role/parts, quarantine unsupported kinds and review attachments privately.
2. Mastra remains feasible as a candidate. Durable beta/default process-local facilities need a kill/restart proof with mock model, persisted effects and lease fencing. Default sensitive-field filtering is insufficient for private prose; use allowlisted exports and sentinel tests.
3. Legacy access-control exception is in private II-001 discussion; no remediation attempted. Legacy security and attachment/auth mapping are later gates, not assumed safe because privileged connector reads succeed.
4. Owner's staging replacement direction is **planning for next cycle only**. Retirement needs exact identity, data/dependency disposition, backup/restore checks, selected account/organization/region and verified cost. Two-project capacity is owner-reported, not independently verified.
5. Proposed quality/resource thresholds need owner review and later measurement. No application, product memory performance, user-token RLS, full trace privacy, production recovery, import or browser experience is demonstrated.

Next allowed action: owner review of Cycle 0 and the bounded Cycle 1 proposal. Stage branch is submitted without main merge. A new owner-accepted handoff is required for implementation, staging retirement/provisioning or paid calls. No next-stage execution in this attempt.

## Verification summary and residual risk

Foundation/relative-link/authority checks pass; whitespace checks pass. Independent fresh-clone pinned install and all four synthetic API groups pass. Private-data/credential pattern checks plus manual diff review found no private transcript bodies, attachment bytes, real person/project IDs or credentials in stage artifacts. No production application tests were possible because no application was built. Full source SQL re-execution, PostgreSQL policy enforcement, semantic memory quality, multi-turn crash recovery, trace-export privacy, browser behavior and importer correctness remain NOT DEMONSTRATED. Detailed SQL is consolidated reproduction material, explicitly not a newly executed aggregate audit. These are next-stage gates, not hidden Cycle 0 runtime PASS claims.
