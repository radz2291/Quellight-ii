# Quellight II — current project state

**2026-10-25 — Cycle 0 accepted and merged; Cycle 1 ticket prepared, NOT STARTED.** The owner accepted `II-001` in Rolladice Work (status `done`), and [PR #1](https://github.com/radz2291/Quellight-ii/pull/1) was merged to `main` at `16e9f187c72a441aa1be30a466514b9f0d43ebe4`. This later documentation-only preparation sets up `II-002` with pinned standard revision 2 and [HANDOFF](HANDOFF.md). There is **no implemented Quellight II application** yet, no historical import, and no new hosted Supabase project. The owner must explicitly launch Codex on `II-002` before Cycle 1 implementation begins.

## Delivered and accepted — Cycle 0 / II-001

- Read-only structural inventory of owner-authorized ARA-Light history: **203 sessions / 11,475 entries**, mixed roles/parts/timestamps and **25 attachment entries**; no raw transcript import. Source facts were builder-observed; independent verifier did not requery private database.
- [Owner report](cycle-0/REPORT.md), [typed contracts](cycle-0/CONTRACTS.md), [source audit](cycle-0/SOURCE-AUDIT.md), [technology/probes](cycle-0/TECHNOLOGY.md), [import/operations plan](cycle-0/IMPORT-AND-OPERATIONS.md), [evolution tests](cycle-0/EVOLUTION-AND-TEST-PLAN.md), and [original Cycle 1 proposal](cycle-0/CYCLE-1-PROPOSAL.md).
- Original research candidate `34acfcc04152ed5570d1e7449e1df648226b1ea6` HELD; repaired candidate `0a1c0aa71688cd52680cb8498f0cf7ab377f7d70` independently **PASS** at research scope, supported by [verifier report](cycle-0/VERIFICATION-02.md). Verifier evidence `0d7b1328f94eb50deecc87c6efe74a137f9332d5`; delivery `6672e646e869fbdb5f098d9c0395b0d6ddd3a701`, accepted/merged via PR #1. Four synthetic API probe groups and 28 documentation/link checks passed.
- **NOT DEMONSTRATED:** production memory quality, durable execution at app level, recovery across real workers, real DB RLS/HTTP isolation, UI/streaming behavior, verified historical import/attachment recovery, privacy of exported traces, full backup restore.
- A legacy database access-control exception remains recorded **privately** in Work; no source mutation/remediation performed. Staging replacement/new project is a separately gated capacity/backup/approval decision, not authorized by owner acceptance of Cycle 0.

## Current Work / gates

| Item | Status | Authority/evidence |
| --- | --- | --- |
| `II-001` Cycle 0 | **DONE; owner accepted** | Work ticket; [merged PR](https://github.com/radz2291/Quellight-ii/pull/1), exact lineage above |
| `II-002` Cycle 1 | **PREPARED; execution NOT STARTED** | Work ticket with standard rev 2, depends on done `II-001`; [HANDOFF](HANDOFF.md) |
| Local runnable app, permissions, worker durability | **NOT BUILT / NOT DEMONSTRATED** | Next stage acceptance [C1-01…C1-12](09-ACCEPTANCE.md) |
| Live/new Supabase account, staging retirement, legacy fixes | **NOT AUTHORIZED / NOT PERFORMED** | Need separate verification and explicit owner approval |
| Cycle 2+ memory/Companion/Steward expansion | **NOT STARTED** | [Stages](08-STAGES.md) roadmap only |

## Next action

Radzi may **launch Codex manually on `II-002`** after reading the new ticket and [Cycle 1 handoff](HANDOFF.md); only that launch starts the local synthetic-data core work. The Codex stage manager must claim the Work task, preserve boundaries, complete independent verification, update all checkboxes/outputs/run/discussion, and stop in `review` for Radzi. No additional cycles, live provisioning/import, paid usage, staging deletion, legacy remediation or deployment are preauthorized.
