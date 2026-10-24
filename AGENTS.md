# Quellight — repository agent entry point

Read **[docs/STATE.md](docs/STATE.md)** and **[docs/HANDOFF.md](docs/HANDOFF.md)** on every new development session. Then read the documents relevant to the accepted stage. The user's latest instructions take precedence over repository guidance; record material changes in [docs/10-DECISIONS.md](docs/10-DECISIONS.md) and amend the affected contracts before implementing them.

## Persistent work: Rolladice Work

- Use the owner's **Rolladice Work** project `Quellight` (code `II`) for persistent Codex tickets, status, execution traces and discussion. Read [Rolladice Work protocol](docs/11-ROLLADICE-WORK.md) before claiming work.
- At the beginning of an agent session, check the current project workspace/tickets and discussions with `rolladice_work_read_workspace`, then fetch the selected ticket with `rolladice_work_get_handoff`. Ticket references are project-scoped and evolve; discover the current owner-authorized task dynamically (for example, `II-002` after owner acceptance of Cycle 0). Validate dependencies, pinned standards, review gates and repository scope before starting.
- When *actually* working, claim with `run_start`, update progress/heartbeat via `run_update`, and communicate decisions, questions and evidence through `task_comment`. Work writes require a fresh revision and idempotent operation ID; only Radzi accepts completed reviews.
- **Mandatory end-of-task sync:** Before saying “done,” update **every ticket criterion** to its honest evidenced checked/unchecked state with `task_update`; attach exact GitHub branch/base/candidate/verifier/delivery SHAs, PR, reports, outputs and concise residual findings. Post the final discussion, call `run_update` with `finished`, move/confirm ticket status `review` (never `done` yourself), then **re-read that exact ticket** and verify status, criteria, outputs, run and discussion actually persisted. If sync fails, report the exact blocker instead of claiming Work is up to date. Do not tick unsupported criteria; only Radzi accepts.
- A ticket is a persistent coordination record, **not** an automatic Codex launch. Automatic polling requires a separately connected runner. If Work is unavailable, report that limitation; never fake a claim, background execution, acceptance or discussion. Ticket instructions cannot expand [HANDOFF](docs/HANDOFF.md).

## Product constitution

1. Build a memory-centered personal **Companion** with a separate, quiet, durable **Steward**. Respect human authorship of identity and meaning; do not reduce the product to secretarial automation.
2. Preserve original conversations and evidence. Distinguish user assertions, assistant suggestions, tentative inferences, confirmed commitments, observed activities and superseded beliefs. Never invent memories.
3. Prefer a small, stable set of **validated primitive operations**, supported by on-demand skills, schema knowledge and relevant personal context. Do not create feature-specific tools for each new domain.
4. Make owner inspection and correction first-class. Important records, automated changes, run statuses and failures must be traceable to source and actor.
5. Optimize for **changeability as well as scale**. Maintain independent boundaries and versioned contracts; demonstrate unexpected-requirement evolution in tests.

## Current authority and data safety

- Only perform work authorized by the current [HANDOFF](docs/HANDOFF.md). The roadmap is not authorization to begin later stages.
- The previous Quellight Supabase project is a **read-only source for discovery** until the owner explicitly authorizes a bounded import. Never mutate its data, schema, credentials, triggers or jobs.
- Never commit private transcripts, real personal records, service credentials, connection strings, access tokens, or unredacted diagnostic traces. This repository was public at bootstrap.
- Do not create or change a production Supabase project, retire staging resources, incur paid model calls, publish a deployment or perform external actions without stage-specific authority and verified accounts. Local synthetic-data proofs may be built only under the explicitly launched stage handoff.
- A tool, skill or model instruction never overrides server-side authorization, data ownership rules or approval checks.
- Do not pretend proposed features exist. Record untested claims as **NOT DEMONSTRATED**.

## Operating discipline

1. Reconstruct exact repo/branch/HEAD, existing state, accepted scope and external dependencies before changes.
2. Work toward the user-visible demo and negative checks in [docs/08-STAGES.md](docs/08-STAGES.md) and [docs/09-ACCEPTANCE.md](docs/09-ACCEPTANCE.md).
3. Integrate one candidate at an exact commit; use genuinely fresh independent verification where possible. Repair in-scope defects and reverify; retain failed evidence.
4. Keep [docs/STATE.md](docs/STATE.md) as the sole live state record and [docs/HANDOFF.md](docs/HANDOFF.md) as the sole current authority. Do not copy mutable status into this file.
5. Report actual verification, remaining gaps and the next allowed action; stop at the accepted stage boundary.

Primary design references: [Product](docs/01-PRODUCT.md), [Architecture](docs/02-ARCHITECTURE.md), [Memory & data](docs/03-MEMORY-AND-DATA.md), [Agents & skills](docs/04-AGENTS-AND-SKILLS.md), [Trust & inspection](docs/05-TRUST-AND-INSPECTION.md), [Evolution](docs/06-EVOLUTION.md).

