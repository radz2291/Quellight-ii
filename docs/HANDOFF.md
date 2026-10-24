# Current Codex handoff — Cycle 0, read-only foundation and historical discovery

**Authority:** The owner requested the new `https://github.com/radz2291/Quellight-ii` repository be prepared for Codex, and previously authorized a read-only assessment of prior Quellight conversations in Supabase. This document authorizes **Cycle 0 only**; later [STAGES](STAGES.md) are a roadmap, not automatically authorized execution.

**Repository:** `radz2291/Quellight-ii` / default `main`. **Baseline:** fetch latest `origin/main` and pin its **exact full SHA in the Cycle 0 evidence before any change**. The remote was initially empty during foundation preparation; do not assume a stale SHA. **Branch:** create an isolated stage branch (suggestion: `codex/c0-foundation-discovery`), preserve main, and open a reviewable handoff without merging unapproved changes.

## You are the accountable Cycle 0 stage manager

Own the whole accepted Cycle 0 outcome: investigate, document, integrate bounded repairs, independently challenge the candidate, and hand off a verified report. You may coordinate non-overlapping research/verification agents where available, but delegation grants no new permissions. Avoid involving the owner in routine repairs. If delegation is unavailable, use truly separate review/check sessions and report the independent-verification limit.

## Read first

1. Root [AGENTS.md](../AGENTS.md), [STATE](STATE.md), this [HANDOFF](HANDOFF.md).
2. [Product](PRODUCT.md), [Architecture](ARCHITECTURE.md), [Memory & data](MEMORY-AND-DATA.md), [Agents & skills](AGENTS-AND-SKILLS.md).
3. [Trust & inspection](TRUST-AND-INSPECTION.md), [Evolution](EVOLUTION.md), [Legacy import](LEGACY-IMPORT.md), [Acceptance](ACCEPTANCE.md), [Decisions](DECISIONS.md).

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
- Updated [STATE](STATE.md), [DECISIONS](DECISIONS.md), affected docs, and candidate/evidence lineage.
- One final owner report: exact branch/base/candidate/verifier SHA, pass criteria C0-01…C0-07, PASS/FAIL/NOT DEMONSTRATED for each, independent verdict, findings and next *proposed* action.

## Verification loop

1. Implement Cycle 0 documentation/research candidate on the scoped branch and commit it.
2. Have a fresh independent verifier challenge exact claims/commit; verifier records failures and does not silently repair the audited candidate.
3. Repair in-scope issues, create a new candidate and rerun affected checks. Preserve red evidence and previous candidates.
4. Push authorized stage branch only; owner reviews the final gate. Stop at Cycle 0.

The user's priority order is **memory quality, truthful continuity, change-tolerant architecture and inspectable autonomy**, ahead of a large feature count.

