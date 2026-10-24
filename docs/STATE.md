# Quellight — current project state

**2026-10-25 — II-002 actively implementing the owner-launched local Cycle 1 proof.** Dedicated branch codex/c1-core-vertical, pinned baseline a8c40fe74163b3273f603cab93453d86fb54bd1d. No owner acceptance of Cycle 1 or independent candidate verdict yet. Authority: [HANDOFF](HANDOFF.md). Current product/project display name is Quellight by owner direction; existing repository URL and ticket identifiers remain stable references.

## Implemented candidate

- [Local setup](cycle-1/SETUP.md): selected Next.js + assistant-ui shell with preserved API/worker, real PostgreSQL SCRAM owner authentication, distinct per-owner runtime/worker roles and actual ENABLED/FORCED RLS. [UI choice and integration](cycle-1/UI-STACK.md) follows the owner's additional instruction.
- [Contract](cycle-1/IMPLEMENTATION.md): five strict primitives; original sources, records, revisions, receipts and events; atomic foreground commits; persisted queue and separate worker; generation/lease checks and unique effect receipts; cancellation/failure/retry.
- Real Mastra two-turn fake-model discovery/streaming. No real model inference, semantic memory or claim that the beta durable wrapper has been proved.
- Definition/skill-based seed v2 extension, dynamic fields and guarded rollback; note/task v1 compatibility. Original candidate 498b9ea independently [HELD](cycle-1/VERIFICATION-01.md) for a delayed save crossing an owner switch. Both selected and preserved UIs now reject that regression; successor exact-commit independent verification pending. [Builder evidence and retained failures](cycle-1/BUILD-EVIDENCE.md).

## Accepted history and boundaries

II-001 Cycle 0 is owner-accepted/done. PR #1 merged at 16e9f187c72a441aa1be30a466514b9f0d43ebe4; research delivery 6672e646e869fbdb5f098d9c0395b0d6ddd3a701, verified core 0a1c0aa71688cd52680cb8498f0cf7ab377f7d70. Immutable [C0 report](cycle-0/REPORT.md) and [independent verdict](cycle-0/VERIFICATION-02.md) retain scope and earlier HELD lineage. Historical aggregate source inventory is not live import or C1 source access evidence.

No C1 Supabase connector/source query, legacy mutation/remediation, real staging retirement, new hosted project, personal import, paid inference or deployment. [Hosted prerequisites](cycle-1/HOSTED-RESOURCE-GATE.md) remain pending specific authority and verified backup/restore/account/cost evidence. V1 continuity, production security/hosting, multi-instance operations, actual provider quality and full JIT/semantic memory remain NOT DEMONSTRATED. Next action: exact candidate verification, in-scope repairs, Work checklist/evidence synchronization and owner Review. No Cycle 2 authority.
