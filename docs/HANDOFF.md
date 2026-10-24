# Current Codex handoff — Cycle 0, read-only foundation and historical discovery

**Authority:** The owner requested the new `https://github.com/radz2291/Quellight-ii` repository be prepared for Codex, previously authorized a read-only assessment of prior Quellight conversations in Supabase, and requested persistent delegation through Rolladice Work. This document authorizes **Cycle 0 only**; later [STAGES](08-STAGES.md) are a roadmap, not automatically authorized execution. Persistent coordination is through Work project `Quellight II` / ticket **`II-001`**, pinned to execution standard revision 1. Resolve private API IDs from the live workspace. The ticket does not expand this authorization.

**Repository:** `radz2291/Quellight-ii` / default `main`. **Baseline:** fetch latest `origin/main` and pin its **exact full SHA in the Cycle 0 evidence before any change**. The remote was initially empty during foundation preparation; do not assume a stale SHA. **Branch:** create an isolated stage branch (suggestion: `codex/c0-foundation-discovery`), preserve main, and open a reviewable handoff without merging unapproved changes.

## You are the accountable Cycle 0 stage manager

Own the whole accepted Cycle 0 outcome: investigate, document, integrate bounded repairs, independently challenge the candidate, and hand off a verified report. You may coordinate non-overlapping research/verification agents where available, but delegation grants no new permissions. Avoid involving the owner in routine repairs. If delegation is unavailable, use truly separate review/check sessions and report the independent-verification limit.

## Read first

1. Root [AGENTS.md](../AGENTS.md), [STATE](STATE.md), this [HANDOFF](HANDOFF.md).
2. [Rolladice Work protocol](11-ROLLADICE-WORK.md). Read the live ticket `II-001`, pinned standard, dependencies, existing discussion and handoff; only then claim actual work.
3. [Product](01-PRODUCT.md), [Architecture](02-ARCHITECTURE.md), [Memory & data](03-MEMORY-AND-DATA.md), [Agents & skills](04-AGENTS-AND-SKILLS.md).
4. [Trust & inspection](05-TRUST-AND-INSPECTION.md), [Evolution](06-EVOLUTION.md), [Legacy import](07-LEGACY-IMPORT.md), [Acceptance](09-ACCEPTANCE.md), [Decisions](10-DECISIONS.md).

## Authorized work

- Verify repository identity, branch/HEAD, clean baseline, tool permissions, and every claimed foundation doc/reference.
- Using **only already-authorized read-only source access**, inventory previous Supabase Quellight schema, permitted conversation scope, counts, role/date coverage and attachment/reference realities. Use aggregate/redacted evidence only. If no permitted access exists, document the exact blocker and do not find alternate unauthorized routes.
- Check current first-party Mastra/Supabase docs and perform isolated **non-destructive, no-paid-inference** feasibility experiments where useful. Validate multi-turn durable agent recovery, memory scope, JIT skill loading, queue/worker separation, auth/RLS and inspectable run traces.
- Propose concrete first-pass record/event/link/source/revision and tool contracts, validation, schema evolution, data ownership, concurrency/idempotency and scheduling strategy.
- Propose destination project provisioning, a selective importer, backup/restore, retention, resource use and cost boundaries; no actual provision or import yet.
- Perform an unanticipated-domain extensibility challenge; include a counterexample if core changes would be necessary.
- Correct and extend docs based on evidence while preserving owner decisions. Prepare a bounded future Cycle 1 handoff as **proposal only**.

## Explicit exclusions and stop conditions

- **Never mutate** the old Supabase project or run schemas/triggers/jobs on it. No “helpful cleanup,” migration, deletion or actual transcript copying into GitHub.
- Do not provision the new Supabase project, connect payment methods, install production secrets, perform paid model/API calls, build the production application or deploy anything in Cycle 0.
- Do not merge to main or start Cycle 1 without explicit owner acceptance and authority.
- Stop with **BLOCKED** for missing data rights/access, protected workflows, private information leakage risk, required external approvals or missing critical credentials. Stop with **HELD** for unresolved material product decisions. Never invent schema facts.

## Required deliverables and final gate

- Source audit report in a new `docs/cycle-0/` directory (only redacted structural evidence; no private sample messages).
- Verified architecture/technology feasibility and alternatives with direct primary sources.
- Proposed typed data and primitive tool contracts; explicit remaining unknowns.
- User test and failure/recovery plan including memory accuracy, dates, no duplicated writes, security and domain-change drill.
- Updated [STATE](STATE.md), [DECISIONS](10-DECISIONS.md), affected docs, and candidate/evidence lineage.
- One final owner report: exact branch/base/candidate/verifier SHA, pass criteria C0-01…C0-07, PASS/FAIL/NOT DEMONSTRATED for each, independent verdict, findings and next *proposed* action.
- Update Work ticket `II-001`: claim and heartbeat during real activity, discuss blockers/important alternatives and post source-linked branch/PR/evidence/final report for **human review**. Work is the durable coordination record, not a substitute for GitHub verification or owner acceptance.

## Verification loop

1. Read the live Work handoff and claim ticket `II-001` only when beginning actual Cycle 0 work; implement the documentation/research candidate on the scoped branch and commit it.
2. Have a fresh independent verifier challenge exact claims/commit; verifier records failures and does not silently repair the audited candidate.
3. Repair in-scope issues, create a new candidate and rerun affected checks. Preserve red evidence and previous candidates.
4. Push authorized stage branch only; update Work discussion/run status with the exact tested evidence and submit for owner review. Only Radzi accepts the ticket and the stage. Stop at Cycle 0.

The user's priority order is **memory quality, truthful continuity, change-tolerant architecture and inspectable autonomy**, ahead of a large feature count.

## Owner scope clarification during II-001 — 2026-10-24

Owner confirmed ARA-Light as the previous Quellight source. Owner requested staging replacement to free account capacity, then explicitly clarified **"Prepare replacement for next cycle"**. This adds retirement/provisioning planning to the future-stage proposal only; no deletion/provisioning now. ARA-Light remains read-only and excluded from retirement. Record account/cost/backup/disposition unknowns in the proposal. Cycle 0 and its review boundary remain unchanged.

