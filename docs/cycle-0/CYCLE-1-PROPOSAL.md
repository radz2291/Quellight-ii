# Cycle 1 candidate handoff — PROPOSAL ONLY

This document grants no execution authority. [HANDOFF](../HANDOFF.md) remains Cycle 0. Owner review/acceptance and a new bounded handoff are required before Cycle 1. Owner's latest direction is to prepare staging replacement for that next cycle; no deletion/provisioning was authorized during II-001.

## Proposed outcome and order

Deliver one local authenticated vertical proof: preserve a synthetic source message, create a source-linked note/task through the gateway, query it after process restart, and inspect its action/history. Two synthetic owners must remain isolated. Prove queue dispatch, worker lease/status, durable receipts and the seed-domain extension before broader product features.

1. Resolve owner acceptance of Cycle 0 and stage-specific account/organization, retirement, budget, region, secrets and hosting authority. Use [retirement/provisioning checklist](IMPORT-AND-OPERATIONS.md); no legacy writes. No staging deletion until disposition/backup checks and exact identity verification are complete.
2. Run a local pinned mock-model worker recovery spike first. Kill/restart at an effect/ack boundary and test duplicate delivery, shared storage/cache/PubSub, lease fencing and checkpoint replay. Mastra beta/API availability is not recovery proof. If it cannot pass, compare evented/workflow or a dedicated durable runtime behind the same execution contract; do not silently weaken requirements.
3. Choose/pin framework/UI adapter versions after compiling and streaming with a fake model. Validate cancel, restore, thread ownership and error states. No paid inference until explicit budget approval. Avoid accidental telemetry export.
4. After provisioning authority, implement versioned source/record/revision/operation/run/outbox schema, narrow grants/RLS and authenticated primitive slice (`discover`, `create`, `query`, `update`, `history`; bounded transaction path). Add other primitives only as required by the proof. Models never receive SQL or privileged credentials.
5. Minimal UI shows saved record, source, revision and queued/running/stalled/finished/failed activity. Success acknowledgement follows durable commit. A fake multi-turn Steward may organize a synthetic source while conversation remains independent.
6. Integrate one exact candidate commit. Fresh verifier independently attacks read/write/subscribe ownership, IDOR, queue owner forgery, transactions, races, recovery, trace privacy and evolution. Repair in scope, retain failures, reverify and stop for owner review.

## Required evidence

- Exact base/candidate/verifier SHAs, lockfile, migrations, setup instructions without secrets, synthetic fixtures and deterministic tests.
- Authenticated two-owner browser walkthrough plus direct API/database negative tests; no mock-only RLS claim.
- One committed effect after duplicate delivery and process kill/restart; accurate attempt/lease/terminal status and visible failures.
- Seed-domain definitions/skill extension without gateway/Companion edits; version-2 migration/read compatibility and rollback exercise.
- Trace sentinel tests; sources, record changes, run IDs and applied skill versions inspectable after raw vendor traces expire.
- Actual timings/resource usage and a bounded cost forecast; proposed thresholds in [test plan](EVOLUTION-AND-TEST-PLAN.md) reviewed against measurements.

## Exclusions and stop gates

No real history import, full semantic memory rollout, polished Living Book/Daily Desk, production deployment, outbound integrations, payments or autonomous account operations unless the next handoff explicitly adds them. Unknown attachment/role mapping is a later private source audit before Cycle 2 import. Legacy security remediation is a separate authorized task, not destination implementation. Stage main merge and owner acceptance remain human-controlled.

Block for missing data rights/critical credentials or incomplete staging disposition; hold material product/budget decisions. Routine in-scope implementation repairs should proceed without involving the owner at every iteration.
