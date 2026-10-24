# 07 — Previous Quellight conversation import — pre-audit contract

**Current state: NOT INSPECTED.** Owner reports months of conversations in a previous Supabase project. Its identity, schema, authorization model, data quality and exports have not been verified.

## Permanent decisions

- Create a **new, independent Supabase project** for Quellight II.
- Retain the old database intact. Cycle 0 is **read-only**, with no mutations or broad copy of application schemas and runtime configuration.
- Selectively import owner-authorized conversations and related permitted material only after an explicit later-stage import gate.
- Do not require old application code or behavior to run the new product.

## Cycle 0 read-only inventory

Record **aggregate/redacted** evidence for:

1. Source project identity and permitted account scope, verified without copying credentials to docs.
2. Candidate conversation/session/message/attachment tables and relationships.
3. Row counts, author roles, format/content shapes, chronological coverage, null/duplicate IDs, timezone representation.
4. Foreign keys, source ownership and authorization constraints, sensitive or multi-user content boundaries.
5. Attachments and external references (actual file objects may require a separate licensed/authorized transfer).
6. Export choices, estimated size/cost and a reversible, repeatable import strategy.

**Never include raw personal transcripts, private content, secrets or unredacted row samples in this public repository.** Report structural SQL/schema facts and redacted examples only. An absence of read-only access is a BLOCKED discovery finding, not permission to request/write broader credentials.

## Later import acceptance outline

- Preserve role, message order, original timestamp and source session identity.
- Map source ownership to destination identities with explicit validation.
- Use deterministic source IDs/import batch IDs for idempotency and resumability.
- Reconcile counts, missing dates, mixed roles, duplicates and partial failures.
- Keep the original source available and unchanged for rollback/review.
- Curate personal knowledge in a **separate** evidence-backed Steward pass; do not treat old assistant-generated suggestions as confirmed user facts.

Cycle 0 should amend this file with the verified source inventory and precise later-stage import recommendations, without performing the import.

