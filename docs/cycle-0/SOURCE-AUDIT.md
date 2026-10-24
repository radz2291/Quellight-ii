# Legacy source audit — aggregate evidence

Observed 2026-10-24 (Asia/Kuala_Lumpur). Source: **ARA-Light**, explicitly confirmed by owner in this session. Project/person identifiers remain in private coordination/tool records, not this public report. The owner confirmed staging is not the historical source and requested its replacement be prepared for the next cycle only.

## Method and boundary

Connected Supabase plugin account inventory succeeded. Public-schema metadata and catalog/grant queries succeeded on the confirmed source. A known owner name/handle predicate returned exactly one candidate person ID; all subsequent message/attachment/resource aggregates used that ID. Ownership mapping is a discovery match, not authorization to migrate every person or all rooms.

SQL content checks ran in explicit `BEGIN READ ONLY` transactions with a 15-second local statement timeout; extended aggregate inventory used REPEATABLE READ. A read-only check returned `transaction_read_only=on`. Calls used `list_projects`, `list_tables` and SELECT-only `execute_sql` transactions; no DDL/DML, functions with side effects, source files, exports or application transcript bodies were requested. `SET LOCAL` affected transaction configuration only. No source mutation was issued by this run. This does not prove other clients were inactive or that the plugin itself is permanently read-only: write-capable tools are exposed. A separate server-enforced least-privilege source connection remains desirable before later import.

An earlier local setup note reported staging database timeouts. This run did not repeat those staging checks; it verified that ARA-Light schema and aggregate SQL are reachable. Do not generalize staging's historical timeout to source unavailability.

The connector exposed one result set from a multi-SELECT discovery transaction; follow-ups consolidated independent results into one JSON object. No absent result was interpreted as an empty table. [Core reproduction query](source-aggregate.sql) and [detailed reproduction query](source-detail.sql) require a privately verified owner binding and contain no real person/project IDs. The detailed file consolidates the executed structural SELECT expressions into one result so every public aggregate below has retained reproduction SQL. It was assembled from the recorded discovery sequence, not rerun as one new source query. Original builder observations remain the factual evidence; future reruns can differ if the live source changes. Private grant exceptions stay in II-001, with only a redacted count query published. No raw connector dumps are included.

Evidence precision after independent challenge: the original `missing_id` expression alone cannot distinguish absent keys from JSON null. The separately executed grouped key inventory returned only role/content/timestamp/attachments from its allowlist and no `id` key, supporting the absence conclusion. Original cached-count comparisons used `<>`; metadata explicitly listed message_count as non-nullable. The published templates now include explicit id-key/null checks, cached-null checks and `IS DISTINCT FROM` comparisons to prevent either ambiguity on a later source shape. These strengthened expressions were not run as new source queries and no new observed count is claimed from them. [First independent findings](VERIFICATION-01.md) are retained.

## Schema and ownership

Public schema has **28 ordinary tables**. Main source structure:

| Table family | Observed structure | Import treatment |
| --- | --- | --- |
| `persons` | UUID identity; legacy handle/name/role/auth-related fields | Private owner mapping only; no credential/PIN/session transfer |
| `sessions` | UUID PK, person_id FK, optional room_id FK, title, JSONB data/metadata, timestamptz created_at/last_modified, message_count, soft-delete marker | Approved owner's original message arrays are primary candidate |
| `rooms` | UUID PK, person_id FK, metadata/settings; some security-sensitive fields | Preserve eligible grouping IDs/labels only after private mapping review; exclude secrets/settings |
| `resources` | UUID PK, person_id and optional session link, text body/type/state, timestamps | Four owner-linked resource entries; transfer requires explicit content scope |
| `captures`, `memory_digests`, `brain_*`, `attunement_*`, `room_intent_*`, `room_purpose_*` | Derived summaries/profile/current-version relations | Excluded from initial authoritative-memory import; possible reviewed source material later |
| `events`, `plugin_*`, `auth_sessions`, `config_*`, `room_subscriptions`, `person_settings`, `desk_*`, `room_exports` | Runtime, auth, configuration, derived or domain records | No wholesale cloning, secrets, jobs or runtime dependency |

Global structural counts: metadata reported 19 persons; exact aggregate found 218 sessions across 9 session-owning persons. All 218 `data` values are objects and all `data.messages` values are arrays. Global counts are not the eligible import scope. Catalog estimates differ from exact counts and must not be used for reconciliation.

Owner-scoped checks: **203 sessions**, all active (0 soft-deleted), **13 distinct referenced rooms**, 0 orphan room references and 0 foreign-owner room references. Four resources have session links. Their text/content was not fetched. This is not a complete ownership audit of every derived table.

## Messages, roles and time

| Check | Observed result |
| --- | --- |
| Actual array entries / sum cached `message_count` | **11,475 / 11,475**; 0 mismatched sessions |
| Session creation UTC range | 2026-06-19T16:37:14.034Z to 2026-09-15T22:23:33.792Z |
| Latest session modification UTC | 2026-09-15T22:25:40.967Z |
| Serialized owner session JSON size | 30,611,073 bytes of `data::text`; not an export size or total project size |
| Message object / missing message IDs | 11,475 objects; **all lack an `id` field** |
| Timestamp presence | All entries have a non-null timestamp |
| Numeric timestamp entries | 10,982; range 1781887025340–1789511014502; compatible with Unix milliseconds |
| Numeric range converted locally as milliseconds | 2026-06-19T16:37:05.340Z to 2026-09-15T22:23:34.502Z |
| String timestamps | 493, all match an ISO-shaped prefix; lexical range 2026-06-23T07:25:34.809Z–2026-09-15T22:23:33.769Z |
| Duplicate timestamp groups within a session | **12** groups; cannot use timestamp as message ID |

Numeric scale is a strongly supported interpretation, not verified old application code semantics. ISO-prefix checks do not constitute strict parsing of every string; later importer must validate all timestamps and preserve raw originals. Some numeric message times precede parent session creation, so never substitute session time silently. Dates above are UTC; user-facing relative dates use confirmed Asia/Kuala_Lumpur, retaining original time basis.

| Role classification | Entries | Candidate treatment |
| --- | --- | --- |
| `user` | 2,889 | User-authored source, not necessarily confirmed commitment |
| `assistant` | 5,260 | Assistant-authored source, not user belief |
| `user-with-attachments` | 14 | User role with separately reviewed attachment mapping |
| `notes-marker` | 69 | Marker/metadata, no automatic promotion to belief |
| `time-marker` | 415 | Time metadata, not a human utterance |
| `artifact` | 9 | Quarantine/review before any transfer |
| Other role strings | 2,819 | Not returned verbatim by bounded label filter; mapping unresolved |

The seven categories sum to 11,475. Nonstandard role labels were deliberately not emitted; they require a later bounded format audit, not a guess that all are assistant or tool messages. The eligible human dialogue count cannot be declared equal to the total array count.

## Content and attachments

10,991 entries have `content`: 10,968 arrays and 23 strings; 484 entries lack content. Arrays contain 16,473 object parts: 9,663 `text`, 3,984 `thinking`, and 2,826 types outside the bounded simple-label filter. `text` keys exist on the 9,663 text parts. No part had the tested `inlineData`, `inline_data`, `fileData`, or `image_url` keys. This limited key check is not proof of text-only content or absence of every possible attachment representation.

Fourteen messages contain attachment arrays with **25 entries**. All 25 expose keys `id`, `type`, `mimeType`, `size`, `content`; no attachment bytes, filenames, URLs or content strings were fetched. Storage catalog contains 0 buckets and 0 objects matching the legacy person ID. That ID may differ from a storage auth owner; the zero bucket result is stronger evidence that this project currently has no Supabase Storage files, but not proof attachments are gone. Embedded attachment `content` and external storage may still exist. Recoverability, licenses, total bytes, MIME validity and transfer scope remain **NOT DEMONSTRATED**.

Thinking/tool/artifact parts must not flow into ordinary user-facing memory or become claims about user identity. Preserve provenance under an explicit retention/access policy; review unknown kinds privately. Do not promise a lossless conversation importer before those formats are mapped and all excluded/quarantined counts reconcile.

## Security observations and gaps

RLS is enabled on sessions, but force-RLS is false and the inspected policies contain no session policies. Privileged connector reads succeed; this does not demonstrate user-token access or old application auth security. The source appears to depend on privileged/backend authorization paths; actual app behavior was not tested.

A material legacy access-control exception was confirmed from RLS/grant metadata and reported privately on II-001. Exact affected table/grants remain in the private ticket to avoid publishing an unnecessary vulnerability recipe. No remediation was applied: changing the source would exceed read-only authority. The owner should scope a separate legacy security assessment/remediation before assuming public API safety. See [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) for the distinction between grants and row policies. Anonymous HTTP access/exploitation was not attempted.

Remaining facts: explicit source-owner-to-destination-auth mapping, unknown role/part formats, strict timestamp validity, embedded attachment reality, export rights/selection, live source edit rate, source enforced read-only credentials, backup completeness and destination budget/account/region. None blocks this structural inventory; each is a required later import/provisioning gate. No import or source cleanup is authorized by this report.
