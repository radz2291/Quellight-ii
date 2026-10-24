# 04 — Agents, primitives and just-in-time knowledge

**Status:** runtime design contract. Do not mistake this repository's `AGENTS.md` (coding-agent instructions) for the product's runtime JIT skills.

## Responsibilities

**Companion:** the single user-facing conversational personality; reflection, reasoning, relevant context retrieval and direct explicit actions. Avoid repeatedly asking to file routine statements.

**Steward:** independently scheduled/background organization, evidence inspection, linking, tentative observations, tasks/practices maintenance and periodic reviews. It has a durable run identity, can use several model/tool steps, and remains inspectable. There is no obligation to multiply agents where one worker suffices.

**Memory Intelligence:** a logical responsibility shared by retrieval, curation and review, not necessarily a third model instance.

## Primitive operations (candidate vocabulary)

| Operation | General purpose |
| --- | --- |
| `discover` | Inspect available record definitions, fields and allowed relationships |
| `query` | Read constrained structured records, filters and time ranges |
| `search` | Find relevant exact/semantic conversations, evidence and records |
| `create` | Create a validated, authorized record |
| `update` | Patch with version checks, source and reason |
| `connect` | Add/change a typed evidence-backed relationship |
| `recordEvent` | Record an observed occurrence or meaningful change |
| `transact` | Apply a bounded group of validated, atomic changes |
| `history` | Inspect revisions, provenance and operation history |

This is a **design vocabulary**, not a shipping API. Cycle 1 must validate/merge/split operations based on real proofs; a small stable interface matters more than a predetermined count of nine. Tool schemas, output limits, server permissions, transaction boundaries and version rules are code-level contracts. Never offer unrestricted raw SQL or privileged service credentials to a model/sandbox.

## Four levels of context

1. **Small always-on constitution:** product identity, truthfulness, trust and action boundaries.
2. **JIT procedures:** searchable, versioned skills with methods and examples; load only when necessary.
3. **JIT schema knowledge:** allowed record types/relationships/fields needed for the present task.
4. **JIT personal evidence:** only relevant original messages, records and sources, not an entire lifelong history per turn.

Skills explain *how* to compose authorized powers, not grant the powers. A skill edit cannot bypass permissions or add an external notification/payment ability.

## Initial general-purpose skill candidates

- `getting-to-know-you`: notice insufficient context; ask a few optional respectful questions, memory consent and interaction preferences; skip already-known items.
- `temporal-reasoning`: resolve relative dates, timezones, recurrence and deadlines.
- `evidence-reasoning`: distinguish assertion, inference, contradiction, confidence and source.
- `record-maintenance`: organize, link, correct, supersede and explain information.
- `practice-management`: support any recurring human practice, not gym/sleep-specific features.
- `commitment-management`: distinguish possible intentions from definite tasks or promises.
- `reflection`: examine meaning without diagnosing or claiming identity authority.
- `review-and-brief`: produce a grounded daily overview and progress review.

Start with **documented skill contracts**; implement actual `SKILL.md` files and loading only when their execution tests are ready. Track skill versions used by runs, explicit context budgets, freshness/TTL and cache invalidation. Failed or stale skill discovery must not create authority bypasses.

## Example: “Maybe I should gym twice a week”

The Companion engages naturally. Steward later loads evidence and practice guidance, checks existing records, and may save a source-backed tentative intention. When the user later commits to start Monday, it updates the same practice via versioned primitives. Completed sessions require observed evidence. All steps and resulting records remain inspectable.

## Example: “Let's continue what we said last week”

The Companion resolves the relative date, searches topic + time + source, retrieves original messages, and summarizes only supported points. It opens original sources on request and says when several candidate conversations are plausible.

## Safe background execution

For the bounded local Cycle 1 proof, the separate worker uses a Mastra Agent inside app-owned queue/lease/checkpoint/effect transactions; see [runtime contract](cycle-1/IMPLEMENTATION.md). This demonstrates the recoverable application effect boundary while leaving the beta durable-agent wrapper and model-driven JIT skill loading unproved. The seed skill is a versioned extension artifact and inspection reference, not an authority mechanism.

Queue message ≠ completed one-turn task. A separate durable Mastra worker must own repeated model/tool interactions, checkpoints and recovery. Foreground confirmations must not wait for optional background enrichment, but explicit “saved” acknowledgements require completed persistence. Avoid duplicate jobs/records via idempotency keys and ownership/version checks.

See [Architecture](02-ARCHITECTURE.md), [Trust & inspection](05-TRUST-AND-INSPECTION.md), and [Evolution](06-EVOLUTION.md).

Cycle 0 implementation proposals: [primitive envelopes and worker/JIT protocols](cycle-0/CONTRACTS.md). [Technology evidence](cycle-0/TECHNOLOGY.md) distinguishes direct workspace BM25 skill search from model-driven skill selection, and durable API presence from process-restart recovery. Neither successful local search nor a loaded skill grants filesystem/shell/database authority in the product.

