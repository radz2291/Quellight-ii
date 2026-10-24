# 03 — Memory and data — durable meaning without invented facts

**Status:** design contract. Target: ChatGPT-like useful personal continuity with stronger owner source inspection and correction; this is not a claim of current parity.

## Distinct kinds of stored information

1. **Original conversations:** immutable-at-source message records grouped into sessions/threads, with author role, timestamps, content and permitted attachments. Original messages are not the same as summaries.
2. **Personal knowledge:** curated, source-linked facts/preferences/goals/decisions, each with confidence/authority, relevance and lifecycle status.
3. **Plans, tasks and practices:** structured objects with explicit commitments and timing. A practice target and a completion event are different records.
4. **Events and revisions:** what happened, what changed, by whom/which agent, and when. Corrections supersede assertions without covertly erasing the change explanation.
5. **Relationships:** typed, source-grounded connections between records, people, projects and conversations.
6. **Background activity:** durable runs, jobs, tool invocations, applied skills, relevant evidence references, results, approvals and failure records.

## Small stable vocabulary, extensible meaning

The foundation should support owners/tenants, objects/records, typed edges, events, provenance, revisions and operation history. Add record types through **versioned definitions with validation**, keeping queryable core fields typed and meaningful. JSON extensions may hold bounded optional properties, but never replace critical integrity, permissions, indexed queries and migrations with unvalidated arbitrary blobs.

Do not build fixed gym/meditation/sleep-specific tables merely because they are initial examples. Similarly, do not force dates, money or recurrence into untyped string fields. A domain-specific read model may be introduced when demonstrably needed while preserving the universal core.

## Fact authority and lifecycle

| State | Meaning | Example |
| --- | --- | --- |
| Observed | Source records an event that actually happened | “I went to the gym today.” |
| Tentative | User is considering something or agent infers a possibility | “Maybe I should exercise twice a week.” |
| Confirmed | Explicit or adequately evidenced current preference/commitment | “I'll begin twice a week on Monday.” |
| Disputed | Conflicting or challenged, awaiting resolution | Two contradictory dates for one appointment |
| Superseded | Replaced by a later correction/change | Former preference after user revises it |
| Removed | User-directed forgetting according to retention policy | Personal memory deletion request |

Never treat one frustrated utterance as an objective personality diagnosis. Never fabricate completion of a habit or task. Preserve assistant proposals separately from user-authored claims.

## Retrieval and context assembly

Retrieval mixes **meaning, exact text, time windows, entity/project relationships and source quality**. Resolve “yesterday/last week” in the user's confirmed timezone (default candidate Asia/Kuala_Lumpur for the owner). If exact wording is requested, retrieve original messages, not a generated reconstruction. Prefer recent confirmed preferences over older superseded ones; show uncertainty and ask for clarification when matches are ambiguous.

Only relevant information reaches each model turn. JIT procedure skills and JIT personal evidence are separate categories. The Companion can naturally recall important context; the Steward can process broader background evidence without bloating foreground conversation. Track what was retrieved so the user can inspect “why did you remember that?”

## Historical Quellight source and selective import

**Decision:** a new Supabase project is the destination. The former Supabase project is a read-only source. [Cycle 0 source audit](cycle-0/SOURCE-AUDIT.md) records observed owner-scoped structure/counts/dates and access limits; unknown role/part mappings, attachment recoverability and destination auth mapping remain explicit later gates. Do not treat aggregate inventory as import authority.

Import approach after authorization:

1. Read-only inventory: tables, message roles, sessions, ids, timestamp semantics, attachments, access rights, data volumes and missing fields. Do not inspect unrelated owners' private content without permission.
2. Define source→destination mapping separately from both application runtimes. Capture original ids, source project, original timestamps, importer version and an idempotency key.
3. Import original messages first; preserve order and roles. Do **not** import old application triggers, service keys, jobs or code.
4. Validate counts, date range, identity isolation, samples, duplicates, interrupted/repeated import, and references before moving on.
5. Run Steward curation as a separately bounded, inspectable process; derived personal memories begin tentative where interpretation is uncertain.
6. Review inferred profile with the owner. Never delete the old source as part of the import.

No legacy data may be embedded in repository tests or documentation. Use synthetic fixtures for public tests; real-user evaluations stay in private, access-controlled storage.

## User controls

Inspect, correct, merge, dispute, export, pause remembering and request removal of retained memory. Clearly distinguish what can be removed from source history, derived memory, embeddings, cached context and diagnostic records; follow an explicit retention policy rather than promising impossible instant erasure of all backup copies.

## Proof requirements

See [Acceptance](09-ACCEPTANCE.md): cross-thread recall, exact source retrieval, temporal queries, contradiction handling, deliberate forgetting, restart/reindex and isolation tests. Data correctness and memory usefulness are both required.

[Proposed typed source/record/authority contracts](cycle-0/CONTRACTS.md) keep claim kind, author, authority and lifecycle independent. [Import plan](cycle-0/IMPORT-AND-OPERATIONS.md) requires source snapshot identity plus array position where legacy message IDs are absent, preserves original timestamps and quarantines unsupported parts. No unreviewed thinking/tool/artifact material becomes ordinary personal memory.

