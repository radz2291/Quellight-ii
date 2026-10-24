# 10 — Product and architecture decisions

This is an append-only record of material choices made in the 2026-10-24 product-design conversation. **Owner-directed** means the owner stated or explicitly accepted the direction; **design recommendation** means a proposed technical implementation still needs Cycle 0 proof. Preserve superseded records and link amendments rather than quietly rewriting history.

| ID | Decision | Basis / rationale | Authority and status |
| --- | --- | --- | --- |
| D-001 | Build a new, independent Quellight application using mature packages | Previous platform work would take longer; deliver a useful companion sooner | Owner-directed |
| D-002 | Product is a reflective personal Companion, not primarily an administrative secretary | Preserve deep natural conversation and human authorship | Owner-directed |
| D-003 | Separate conversational Companion from quiet background Steward | Avoid burdening the user-facing experience with routine extraction/organization | Owner-directed; runtime mechanics to verify |
| D-004 | Background work must support multiple agent/model/tool turns, persistence and recovery | Supabase queue dispatch alone is not an execution engine | Owner challenged one-turn assumption; durable-worker design accepted |
| D-005 | Prefer small, universal, validated data primitives rather than many feature-specific tools | Coding-agent-like flexibility for unforeseen requirements | Owner-directed |
| D-006 | Load skills, available record knowledge and personal evidence just in time | Minimize permanent system-prompt burden and enable procedural evolution without changing tools | Owner-directed |
| D-007 | Support exact conversation history, cross-session recall, curated personal memory and evolving preferences | ChatGPT-like personal continuity and accuracy are central to value | Owner-directed |
| D-008 | Tasks, commitments and recurring practices belong in V1 | User needs tomorrow's tasks, morning brief, gym/meditation/sleep routines | Owner-directed |
| D-009 | All meaningful background work and retained personal records must be inspectable | Owner does not want to be hidden in the dark | Owner-directed |
| D-010 | Use a **new Supabase project** and selective import from prior Supabase Quellight; leave old project intact | Clean independent data model, safe historical preservation | Owner delegated technical choice; design decision accepted for planning |
| D-011 | For unknown new users, dynamically load a gentle “getting to know you” skill | Establish minimum context through natural optional conversation | Owner-directed |
| D-012 | Source-grounded low-risk curation may happen quietly; consequential actions and identity judgments face stricter review | Useful autonomy without assuming authority over user meaning | Owner delegated default policy; proposed for explicit tests |
| D-013 | Changeability and scaling are first-class: unexpected mid-build requests must have a bounded extension path | Avoid rebuilding core as product understanding evolves | Owner-directed, hard acceptance requirement |
| D-014 | New public GitHub repository `radz2291/Quellight-ii` is the product source-of-truth for specifications and stages | New local Codex agent must reconstruct context without this chat | Owner supplied repo and requested foundation push |
| D-015 | Use private **Rolladice Work** project and persistent tickets/discussions to delegate Codex stages | Keep assignment, cross-session questions, execution, criteria and owner review visible outside a single chat; Work ticket does not itself run Codex or override repo authority | Owner-directed 2026-10-24; project `Quellight II`, first ticket `II-001` created; see [Work protocol](11-ROLLADICE-WORK.md) |
| D-016 | Number stable design-reference filenames `01`–`11`, keep live `STATE`/`HANDOFF` unnumbered | Readable ordered context without breaking the location of live operational pointers | Owner-directed 2026-10-24; links/validation to be updated with rename |

## Technical recommendations requiring Cycle 0 verification

- Mastra for agents, memory, durable background operation and searchable skills.
- Supabase for new-project auth, database, queue, storage and live status.
- Separate worker host for long-running jobs; queue only for dispatch.
- Next.js plus an established chat UI kit (e.g. assistant-ui) as candidates, with selection based on actual compatibility and experience proof.
- Versioned hybrid data model: universal records/events/links/sources plus validated typed fields and controlled extensions.

These are not statements that current package APIs, pricing or deployment settings have already been tested. See [Architecture](02-ARCHITECTURE.md) and [Stage 0 acceptance](09-ACCEPTANCE.md).

## Facts not yet established

- Previous Supabase source project id/connection/schema, eligible owner data and attachments.
- Exact new-project provisioning rights, chosen production hosting provider, model credentials and budget.
- Final chat UI framework/library, stable runtime package versions and performance thresholds.
- Any actual implementation, import, external deployment or working product proof.

Future changes must record owner authority, superseded decision, affected contracts, migration effects and next test. See [Evolution](06-EVOLUTION.md).

## Cycle 0 amendments — 2026-10-24

| ID | Decision / amendment | Basis and affected contracts | Authority and status |
| --- | --- | --- | --- |
| D-017 | ARA-Light is the authorized legacy discovery source; staging is not the historical source | Owner answered source-selection question; read-only scope remains D-010/HANDOFF; [source audit](cycle-0/SOURCE-AUDIT.md) | Owner-confirmed; no import authority |
| D-018 | Prepare replacement of ARA-Light staging with a new Quellight II project for the next cycle | Owner reports two-project account limit and requested replacement, then explicitly chose "Prepare replacement for next cycle" when timing was clarified; [retirement/provisioning plan](cycle-0/IMPORT-AND-OPERATIONS.md) | Owner direction for planning only; no deletion/provisioning in II-001; budget/account/backup/disposition still to verify |
| D-019 | Retain Mastra as candidate behind application-owned source/mutation/run boundaries; require configured recovery and privacy proof | Current docs and isolated API evidence; default redaction does not remove arbitrary prose, in-memory API checks do not prove recovery; [technology](cycle-0/TECHNOLOGY.md), [contracts](cycle-0/CONTRACTS.md) | Technical recommendation, not owner acceptance or production selection |
| D-020 | Preserve source snapshot+ordinal identity; quarantine unsupported legacy parts/roles before import | No message IDs, timestamp ties and heterogeneous content observed; [source audit](cycle-0/SOURCE-AUDIT.md), [import plan](cycle-0/IMPORT-AND-OPERATIONS.md) | Evidence-driven import proposal; implementation/import remain later gates |

Historical "Facts not yet established" above is preserved as bootstrap context. Cycle 0 establishes source project identity and structural owner-scoped counts/dates only; destination auth mapping, attachment recovery, exact budget/hosting and production behavior remain unestablished. Current verdict and next allowed action are only in [STATE](STATE.md).

