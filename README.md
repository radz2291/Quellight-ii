# Quellight II

An independent, memory-centered personal AI companion. Quellight should know its person over time, hold meaningful conversations, help with everyday commitments and practices, and remain inspectable and correctable by its owner.

**Repository status (2026-10-24): foundation documentation only.** No new Quellight application has been implemented, no previous database has been accessed, and no historical conversations have been imported. A coding agent begins with the read-only Cycle 0 investigation, not feature implementation.

## Start here

| Reader | Read in order |
| --- | --- |
| Owner / product reviewer | [Product](docs/01-PRODUCT.md) → [Stages](docs/08-STAGES.md) → [Current state](docs/STATE.md) |
| New Codex development agent | [AGENTS.md](AGENTS.md) → [Current state](docs/STATE.md) → [Current handoff](docs/HANDOFF.md) → [Rolladice Work protocol](docs/11-ROLLADICE-WORK.md) |
| Architecture reviewer | [Architecture](docs/02-ARCHITECTURE.md) → [Memory & data](docs/03-MEMORY-AND-DATA.md) → [Agents & skills](docs/04-AGENTS-AND-SKILLS.md) → [Evolution](docs/06-EVOLUTION.md) |
| Trust / experience reviewer | [Trust & inspection](docs/05-TRUST-AND-INSPECTION.md) → [Acceptance](docs/09-ACCEPTANCE.md) → [Decisions](docs/10-DECISIONS.md) |

## Agreed product direction

- **Companion:** a calm conversational partner for reflection, thinking and planning, not a secretary performing visible administration while the user talks.
- **Steward:** a separate, durable background worker that organizes evidence and commitments, with multiple reasoning/tool-use steps, recovery and inspectable progress.
- **Memory Intelligence:** accurate cross-session recall combining original conversations, curated personal knowledge and time-aware retrieval, with sources and corrections.
- **Universal primitives + just-in-time skills:** a small validated data-operation vocabulary; reusable, dynamically loaded methods; only relevant personal context loaded for each situation.
- **Daily Desk / Living Book:** usable tasks, routines, habits and personal knowledge, not simply a pile of chat transcripts.
- **Inspection Room:** optional visibility into all stored records, changes, skills, tool actions, background execution and failures.
- **Growth through change:** unexpected requirements should normally add a skill, record definition, UI presentation or integration without redesigning the core.

## Historical data boundary

The previous Quellight conversations are reported to live in an existing Supabase project. **Leave that project unchanged.** A separate new Supabase project has been selected for this product. Cycle 0 must discover source structure using authorized read-only access; any import is a later, explicitly gated stage. Do not clone the old application, schema, credentials, user records or background jobs wholesale.

## Current delivery

The first deliverable is a verified foundation and a read-only source assessment. Future development cycles must produce runnable behavior and independent evidence. Read [HANDOFF](docs/HANDOFF.md) for the presently authorized work; do not interpret the long-term roadmap as blanket authorization.

## Persistent development coordination

The private **Rolladice Work** project `Quellight II` tracks Codex delegation, pinned standards, discussions, execution evidence and human review across sessions. The first AI ticket is **`II-001` — Cycle 0 read-only discovery**. Codex should check Work at session start, use its source-linked handoff and report through the ticket. Ticket creation does not launch a coding agent or grant new authority; see [Work protocol](docs/11-ROLLADICE-WORK.md). Numbered `docs/01-…` through `docs/11-…` files are ordered, stable design references; unnumbered `docs/STATE.md` and `docs/HANDOFF.md` remain the live operational entry points.

