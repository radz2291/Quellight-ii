# Quellight II — repository agent entry point

Read **[docs/STATE.md](docs/STATE.md)** and **[docs/HANDOFF.md](docs/HANDOFF.md)** on every new development session. Then read the documents relevant to the accepted stage. The user's latest instructions take precedence over repository guidance; record material changes in [docs/DECISIONS.md](docs/DECISIONS.md) and amend the affected contracts before implementing them.

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
- Do not create or change a production Supabase project, incur paid model calls, publish a deployment or perform external actions without stage-specific authority and verified accounts.
- A tool, skill or model instruction never overrides server-side authorization, data ownership rules or approval checks.
- Do not pretend proposed features exist. Record untested claims as **NOT DEMONSTRATED**.

## Operating discipline

1. Reconstruct exact repo/branch/HEAD, existing state, accepted scope and external dependencies before changes.
2. Work toward the user-visible demo and negative checks in [docs/STAGES.md](docs/STAGES.md) and [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md).
3. Integrate one candidate at an exact commit; use genuinely fresh independent verification where possible. Repair in-scope defects and reverify; retain failed evidence.
4. Keep [docs/STATE.md](docs/STATE.md) as the sole live state record and [docs/HANDOFF.md](docs/HANDOFF.md) as the sole current authority. Do not copy mutable status into this file.
5. Report actual verification, remaining gaps and the next allowed action; stop at the accepted stage boundary.

Primary design references: [Product](docs/PRODUCT.md), [Architecture](docs/ARCHITECTURE.md), [Memory & data](docs/MEMORY-AND-DATA.md), [Agents & skills](docs/AGENTS-AND-SKILLS.md), [Trust & inspection](docs/TRUST-AND-INSPECTION.md), [Evolution](docs/EVOLUTION.md).

