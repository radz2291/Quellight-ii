# Proposed contracts v0.1

Cycle 0 design proposal, 2026-10-24. These are interfaces to implement and test after authorization, not a running gateway or database schema. Owner product decisions remain in [Decisions](../10-DECISIONS.md).

## Store boundaries

Use an application-owned source ledger and typed records as truth. Mastra history, working memory, summaries and vector indexes are replaceable projections; never let a vendor working-memory update silently become a confirmed personal fact. One owner can have many conversations. Resource/thread IDs are server-derived mappings, never model-selected ownership credentials.

| Relation | Required typed fields and integrity |
| --- | --- |
| `sources` | UUID id, owner_id, source_kind, origin_alias, original_container_id, original_item_key, source_snapshot, import_batch_id?, content_digest, observed_at, original_timestamp_raw?, occurred_at?, timestamp_basis, visibility, retention_class. Unique owner/origin/container/item/source_snapshot. Opaque IDs stay private; no public signed links. |
| `messages` | UUID id, owner_id, source_id, conversation_id, source_snapshot, ordinal, original_role, normalized_role, versioned content_parts, created_at?, timestamp_basis. Unique owner/conversation/ordinal/source_snapshot. Immutable source preservation; corrections are separate records. |
| `record_definitions` | owner scope or reviewed system scope, kind, integer definition_version, validated JSON Schema, allowed link types, indexed field mapping, migration/read compatibility. Immutable published versions. Models cannot register definitions. |
| `records` | UUID id, owner_id, kind, definition_version, integer revision, typed lifecycle/authority, title, created_at/updated_at, valid_from/valid_until?, source refs, bounded validated payload. No arbitrary SQL/filter expressions. |
| `record_revisions` | owner_id, record_id, revision, actor_id/type, operation_id, run_id?, reason, before/after or redacted delta, evidence refs, committed_at. Unique owner/record/revision. Written atomically with mutation. |
| `links` | owner_id, id, from_id, to_id, typed relation, revision, evidence refs, created_at. Composite owner foreign keys prevent cross-owner endpoints. |
| `events` | owner_id, id, record_id?, event_kind, actor, occurred_at?, recorded_at, timezone?, evidence refs, operation_id. Observation and target remain different kinds. |
| `operations` | owner_id, operation_id, canonical request digest, status, result references, committed_at. Unique owner/operation. Same key with different input is an error, not a replay. |
| `runs`, `run_steps` | owner_id, run_id, attempt, trigger ref, agent/skill/schema versions, status, lease generation, heartbeat, checkpoint ref, redacted step/result, error code, budget reservation and actual usage. Durable application ledger independent of vendor telemetry. |
| `outbox`, `schedule_occurrences` | owner_id, stable dedupe key, payload ref, dispatch status/attempt/time; schedule_id/version, occurrence local date, timezone and resolved UTC instant. Insert outbox in same transaction as triggering state. |
| `approvals`, `retention_requests` | owner_id, action/request digest, scope, actor, decision, expiry, record revision binding; deletion propagation status across sources, projections, backups. Cannot be minted by a skill. |

Critical query fields are typed columns or reviewed typed projections: deadline_date (date), due_at (timestamptz), timezone (IANA ID), observed_at, target count and interval. Use UTC instants plus original date/timezone/raw timestamp; never replace an unknown message time with the session creation time without a marked fallback. Do not convert a date-only task into midnight UTC. Definition versions control bounded JSON fields; reject unknown properties by default. Index `(owner_id, kind, lifecycle, updated_at)`, owner/source keys, due fields, and owner/run/state/heartbeat. Measure before partitioning.

`source_snapshot` is the immutable canonical source-container digest/version recorded by an import manifest, not a worker attempt or import timestamp. Repeating the same snapshot reuses identity/receipts. A changed source array requires an explicit reconciled successor snapshot; preserve old sources and link replacements instead of silently moving ordinals or reimporting all messages as current duplicates. Source and message snapshot fields must match, enforced by a composite owner/source/snapshot FK or equivalent transaction validation. Snapshot serialization and unchanged-item reconciliation are importer contracts to test before real import.

Authority is orthogonal to provenance and lifecycle: `author_kind=user|assistant|agent|importer`, `claim_kind=assertion|suggestion|inference|commitment|observation`, `authority=tentative|confirmed|disputed`, `lifecycle=active|superseded|removed`. A confidence number never promotes an assistant suggestion into user confirmation. Supersession points to both prior record/revision and correcting evidence.

## Primitive envelope

Illustrative TypeScript shapes, not a published SDK:

```ts
type EvidenceRef = { sourceId: string; part?: number; start?: number; end?: number };
type RequestContext = { // constructed server-side, absent from model input
  ownerId: string; actorId: string; actorKind: "user" | "companion" | "steward";
  permissions: readonly string[]; runId?: string; leaseGeneration?: number; requestId: string;
};
type MutationBase = {
  apiVersion: "0.1"; operationId: string; reason: string;
  evidence: EvidenceRef[]; approvalId?: string;
};
type Result<T> =
  | { ok: true; value: T; operationId?: string; revision?: number; replayed?: boolean }
  | { ok: false; code: "DENIED" | "INVALID" | "CONFLICT" | "STALE_SCHEMA" |
      "APPROVAL_REQUIRED" | "NOT_FOUND" | "BUDGET_EXCEEDED" | "RETRYABLE";
      retryable: boolean; currentRevision?: number; requestId: string };
```

No request accepts ownerId, SQL, executable code, arbitrary fetch URLs or role elevation from the model. Authenticated owner IDs are derived and checked independently at gateway and database boundaries. Cross-owner lookup returns non-enumerating NOT_FOUND/DENIED responses without exposing the existence of other records.

| Primitive | Model input beyond apiVersion | Result / constraints |
| --- | --- | --- |
| `discover` | kinds?, definitionVersion?, cursor? | Authorized definitions/operations, current revision; 20 definitions/page. Read only. |
| `query` | kind, definitionVersion, allowlisted field/operator/value filters, sort, cursor, limit | Typed records; 50/page, 64 KiB response. Signed cursor bound to owner/filter/version. No arbitrary expressions. |
| `search` | text?, sourceKinds?, timeWindow?, timezone?, mode exact/semantic/hybrid, limit | Ranked source refs, permitted bounded excerpts, applied filters and timestamp basis. 20 results, 32 KiB. Always filter owner and removal/supersession before returning context. |
| `create` | MutationBase + kind, definitionVersion, payload, claim metadata | Stable id/revision and action receipt only after commit. Definition allowlist and evidence ownership validated. |
| `update` | MutationBase + id, expectedRevision, definitionVersion, allowlisted patch | New revision; optimistic conflict instead of overwrite. Cannot mutate owner/source identity. |
| `connect` | MutationBase + endpoints, relation, expectedRevision? | Typed link; owner/kind compatibility checked for both ends. |
| `recordEvent` | MutationBase + target?, eventKind, occurredAt?, timestampBasis, payload | Immutable event; cannot claim completed practice from a target/plan alone. |
| `transact` | MutationBase + 1..20 create/update/connect/event operations with local temp refs | Atomic bounded transaction, 128 KiB input, stable lock ordering, one receipt and per-item revisions. No nested transactions or external side effects. |
| `history` | recordId or runId, cursor, limit | Owner-readable redacted provenance/revisions, 50/page; permission checks also on cited sources. |

Hard limits above are proposed initial validation bounds, not measured performance. Inputs use JSON Schema/Zod equivalents with maximum text lengths, explicit enum/format checks and additionalProperties=false. Limit exhaustion is visible; never silently truncate an exact-history answer. Forget/export/pause settings use authenticated user control routes, not an agent privilege hidden inside update.

## Atomicity, idempotency and races

1. Authenticate, bind context, validate schema and policy including approval digest/revision/expiry. Bind canonical input hash to `(owner, operationId)`.
2. In one DB transaction, reserve operation, lock the run row when this is worker-originated, verify current leaseGeneration, unexpired lease using database time, owner and non-cancelled status, then lock touched records in stable order. Verify expected revisions/source ownership, apply data+revision+event+outbox and persist receipt. A stale worker may read an existing receipt but cannot create a new effect. Lease generation is trusted worker context, not model input. The same fenced transaction guards renewal/terminal writes; never check the lease only before inference. Roll back everything on failure.
3. Duplicate concurrent operation keys wait for the first transaction; after commit return the stored receipt. Different hash returns CONFLICT. Crashed uncommitted transaction leaves no partial reservation; expired execution lease cannot bypass DB checks.
4. Different operation keys editing the same revision: one commits, the other conflicts. Re-read and reconsider; do not blindly replay a stale patch with the new revision.
5. Queue acknowledgement happens after application commit. Crash before ack permits redelivery; receipt deduplication prevents a second effect. Never claim exactly-once execution or delivery beyond the queue visibility window.
6. Privileged worker access is a separate trust boundary: use a narrowly granted role/capability, bind job owner from a validated ledger record, and test malicious queue payloads. Service-role bypass means RLS alone is insufficient. Client code and model tools never receive service credentials.

## Durable Steward lifecycle

`queued -> leased -> running -> succeeded|failed|cancelled`; `running -> waiting_for_approval|retry_wait|stalled`; explicit retry/resume creates a new attempt under the same logical run. Lease renewal/claim uses compare-and-swap generation; only the current generation may checkpoint or mark terminal. A dispatcher recovers expired leases; a heartbeat-lost worker is shown stalled. Terminal writes are monotonic per attempt. Cancellation revokes future operations; a committed action remains committed and is shown honestly.

Each run may perform many model/tool turns. Persist trigger, prompt/procedure versions, evidence refs, turn/step, tool operation IDs, approved budgets, checkpoint pointer and outcome. Mastra durable recovery must be explicitly enabled/configured as verified in [Technology](TECHNOLOGY.md); default in-memory caches do not establish cross-host durability. The worker owns inference/steps. Queue owns delivery; scheduler owns deterministic occurrences; application ledger owns inspectable status. A stable effect ID derives from run + logical step, not attempt number, so recovery replays safely. Reserve any paid budget before dispatch; current Cycle 0 budget is zero.

Persist DB changes+outbox together; publisher can safely resend after crash. Drain/dead-letter after proposed 3 automatic attempts with jittered backoff (5s/30s/120s), then expose failed and allow owner retry. Proposed heartbeat 15s, lease 90s, stalled display after 120s; test clock skew and load before fixing production values. Queue visibility must exceed a claim/renew interval and be extended during long work. Transport expiry never grants permission for a stale worker to commit.

## JIT and memory flow

Always-on constitution stays small. Discover procedural metadata first; load only authorized immutable skill versions, required schema definitions and bounded personal evidence. Cache key includes owner, permission epoch, memory revision, skill version and definition version; a correction/removal invalidates derived indexes and cached context. Sources and skills are untrusted text, never authority. Skill manifests have content digest, version, required operations, max context budget and tests. Executable skill scripts/shell tools are excluded from the product gateway until separately authorized.

Proposed per-turn context allocation: 2k constitution, 4k skills/schema, 8k evidence, 2k recent dialogue = 16k input tokens before provider overhead. Prefer explicit overflow and follow-up retrieval; record actual provider token counts. Foreground writes acknowledge persistence independently of background enrichment. A committed source message may enqueue curation; failed curation never loses the original or makes a save claim false.

Retrieval first scopes owner/visibility/time, resolves source date in confirmed timezone, then combines exact match + full-text + semantic candidates. Preserve rank/evidence receipts. Exact quote requests use original parts. Tentative/disputed/superseded records are labeled and never silently promoted. Removed sources and projections are excluded synchronously from retrieval even while asynchronous reindexing is pending. A logical deletion fence/generation must also reject stale worker writes based on removed evidence.

## Evolution and scheduling

Definition v2 adds a field through expand/backfill/validate/switch/contract, with resumable owner-scoped batches, backward reader or deliberate migration, dry-run counts and rollback to retained v1 reader. Do not rewrite immutable sources. Cache/version mismatch yields STALE_SCHEMA. A definition may require a new typed projection/index when bounded JSON cannot support integrity or query load.

Recurrence stores rule version, IANA timezone, local time/date and explicit DST gap/fold/missed-run policy. Generate deterministic `(owner, schedule, ruleVersion, localOccurrence, fold)` keys; duplicate dispatch is harmless. Editing a rule cancels pending old-version occurrences but preserves observed history. Scheduler never fabricates completion. The daily brief reads persisted due data and makes no external notification promise.
