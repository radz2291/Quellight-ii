# 05 — Trust, user authority and Inspection Room

**Status:** product and security design requirements, not implemented features.

## Two experiences, one underlying system

The **Companion** should remain calm and conversational. The optional **Inspection Room** exposes what the system did and retained. Owner transparency does not mean spamming the chat with background bookkeeping.

## Inspection surfaces

| Surface | What the owner can see |
| --- | --- |
| Live activity | Queued, running, waiting for approval, completed, failed, cancelled, stalled or unknown jobs; last update/heartbeat |
| Run detail | Trigger, agent/run identity, ordered steps, skill versions, retrieved evidence references, tool/action summaries, attempts, outcome and bounded costs |
| Personal knowledge | Conversations, extracted memories, projects, people, practices, tasks, documents and their relationships |
| Record detail | Current value, authority status, original source, relevant dates, connections and revision history |
| Change history | Actor, before/after (with privacy controls), reason/source, time, approval and related job |
| System | Available skills and versions, permissions, errors, retention/export settings and operational health |

These are linked: a recalled preference opens its memory record, the original conversation, and the background operation that created it. A failed run remains inspectable even if it wrote no durable personal record.

## Trust contract

1. **Traceability:** meaningful writes and consequential automated proposals link to an owner, source evidence and run/action identity. No silent replacement of identity statements.
2. **Truthful status:** a queue item alone is not “working”; distinguish queued, leased/running, heartbeat-lost/stalled and finished. Error/retry states are visible.
3. **Correctability:** owner may dispute, correct, supersede, remove, export and inspect memories; reversibility must be explicit where deletion is permanent.
4. **Understandable explanations:** show a concise reason and actual evidence used. Do not claim to expose complete private model reasoning or log secrets.
5. **Minimal data exposure:** sensitive inputs, access tokens, private context and full internal prompts must not be copied indiscriminately into observability systems or public repo logs.
6. **Memory consent:** make remembering controls discoverable; support a conversation that is not added to long-term memory when policy and available product modes permit.

## Default agent autonomy

| Operation | Default authorization |
| --- | --- |
| Read authorized user data for current work | Allowed |
| Extract ordinary low-risk sourced observations | Allowed; status and source inspectable |
| Save a user's explicit task/practice request | Allowed after validated write; show compact confirmation |
| Infer an unspoken commitment or sensitive identity conclusion | Tentative only; review before promotion to important persistent belief |
| Reconcile contradictory assertions | Evidence-backed, with history; ask when meaning is material/unclear |
| Delete meaningful user data permanently | Explicit authorization with clear scope |
| Contact a third party, spend money or act in external services | Separate explicit permission/approval and integration rules |

Policies are enforced outside prompts and skills. All data access is scoped to the authenticated person; cross-user leaks fail acceptance. The owner must be able to inspect and revoke delegated permissions where applicable.

## Engineering controls

Use a durable activity ledger distinct from raw vendor tracing; records must be navigable after logs expire according to an explicit retention policy. Realtime notifications update the UI; database state is authoritative. Cancellation is honest: a requested stop may not undo an already committed external action. Maintain user-visible errors, idempotent retries and approval records.

The repository was **public** on 2026-10-24. Never commit actual personal history, unredacted captures or secrets, even to a private branch. Keep private evaluation data in controlled storage.

Cycle 0 found that default vendor sensitive-field filtering can leave transcript prose and nonmatching secret field names intact; see [technology counterexample](cycle-0/TECHNOLOGY.md). The proposed exporter therefore allowlists redacted operational fields, while source evidence stays in protected storage. [Failure tests](cycle-0/EVOLUTION-AND-TEST-PLAN.md) cover sentinel leaks, stale retrieval after forgetting, authorization across live subscriptions and privileged worker boundaries. These are required tests, not demonstrated product security.

