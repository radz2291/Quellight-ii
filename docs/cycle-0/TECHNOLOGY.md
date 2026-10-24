# Cycle 0 technology feasibility

Research date: **2026-10-24, Asia/Kuala_Lumpur**. Repository baseline: `bf872f90986cd50da9109a610e5abe45b4bf5682`. This is research and a synthetic, isolated API probe, not an application build or production qualification. Documentation and registry observations are current retrievals, not claims about an assumed future release. No model inference, external database connection, account provisioning or deployment was performed.

## Recommendation and evidence boundary

Retain Mastra as a **feasible candidate**, behind application-owned memory, job and primitive-gateway interfaces. Its published APIs cover the intended responsibilities; a local probe confirms selected APIs exist and basic memory filtering, skill search and redaction behave as described. Full durable execution/recovery, semantic memory quality, security isolation through HTTP/PostgreSQL, observability export and UI compatibility remain **NOT DEMONSTRATED**.

Cycle 1 should implement an authenticated thin slice with synthetic owners and a mock model first. A separate continuously running worker remains the recommended Steward execution boundary. Package choice does not replace the application's ownership, idempotency, audit, approval and failure-state contracts.

## Exact retrieved versions

The public npm registry's `/latest` metadata was read on the research date. These are **observed candidate versions**, not production dependencies added to this repository.

| Package | Observed version | Relevant registry constraint |
| --- | --- | --- |
| `@mastra/core` | `1.79.0` | Node `>=22.13.0`; Zod `^3.25.0 || ^4.0.0` |
| `@mastra/memory` | `1.39.0` | Core `>=1.4.1-0 <2.0.0-0` |
| `@mastra/libsql` | `1.27.0` | Core `>=1.76.0-0 <2.0.0-0` |
| `@mastra/pg` | `1.32.0` | Core `>=1.76.0-0 <2.0.0-0` |
| `@mastra/observability` | `1.21.0` | Core `>=1.16.0-0 <2.0.0-0` |
| `@mastra/ai-sdk` | `1.11.2` | Core `>=1.5.0-0 <2.0.0-0` |
| `@assistant-ui/react` | `0.15.31` | React/React DOM `^18 || ^19` |
| `@assistant-ui/ai-sdk` | `0.0.15` | AI SDK `^7.0.101`; React `^18 || ^19` |
| `@assistant-ui/react-ai-sdk` | `1.4.20` | AI SDK `^7.0.101`; React `^18 || ^19` |
| `next` | `16.4.3` | Node `>=20.9.0`; React 18/19 ranges |
| `ai` | `7.0.152` | Node `>=22`; Zod `^3.25.76 || ^4.1.8` |

Primary registry links: [core](https://registry.npmjs.org/@mastra/core/latest), [memory](https://registry.npmjs.org/@mastra/memory/latest), [LibSQL](https://registry.npmjs.org/@mastra/libsql/latest), [Postgres](https://registry.npmjs.org/@mastra/pg/latest), [observability](https://registry.npmjs.org/@mastra/observability/latest), [Mastra AI SDK adapter](https://registry.npmjs.org/@mastra/ai-sdk/latest), [assistant-ui React](https://registry.npmjs.org/@assistant-ui/react/latest), [assistant-ui AI SDK](https://registry.npmjs.org/@assistant-ui/ai-sdk/latest), [older-named assistant-ui adapter](https://registry.npmjs.org/@assistant-ui/react-ai-sdk/latest), [Next.js](https://registry.npmjs.org/next/latest), [AI SDK](https://registry.npmjs.org/ai/latest). Registry aliases can move; reproduce the recorded pins rather than silently substituting `latest`.

## Memory: scopes and limits

Mastra distinguishes a resource (user/entity) from a thread (conversation). Thread ownership is immutable. Directly invoked agents with matching identifiers can share memory; delegation derives subagent resource identifiers and new threads. Semantic recall is disabled by default; when enabled, resource scope can retrieve across the resource's threads. Working memory also supports resource scope. Observations and summaries are derived context, not a substitute for preserved original messages. [Memory overview](https://mastra.ai/docs/memory/overview)

Semantic recall requires a vector backend and embedder, except supported server-side embedding arrangements. Thread metadata filtering uses metadata captured on embeddings; later thread changes do not automatically rewrite old embedding metadata. Correction/deletion therefore needs explicit index/cache invalidation and tests. [Semantic recall](https://mastra.ai/docs/memory/semantic-recall)

**Application implication:** derive owner/resource identity from authenticated server context; verify thread ownership before every read/write/subscribe, and keep primitive permissions independent of model-supplied identifiers. A resource label is a retrieval address, not a security proof. Companion and Steward should share owner evidence intentionally through explicit contracts, without assuming delegated agents automatically share the parent resource. Exact quote/date retrieval should query retained originals with timezone-aware bounds, not rely on vector similarity.

**Runtime evidence:** three synthetic threads across two synthetic resources were created in `InMemoryStore`. Resource-filtered thread listing returned only its two threads; own-thread recall returned its one message; wrong-resource recall threw: `Thread with id a1 is for resource with id owner-a but resource owner-b was queried.` The final probe checks that the thrown error identifies ownership/resource rather than accepting arbitrary exceptions. This proves the narrow in-process retrieval check only. It does not prove HTTP authorization, database RLS, vector isolation, correction propagation or memory answer quality.

## Durable execution: available, with configuration-dependent recovery

The durable-agent guide marks the API **beta**, introduced in core `1.45.0`. `createDurableAgent`, `createEventedAgent` and the separate Inngest implementation have different execution backends. Default replay cache and PubSub are process-local; cross-process reconnect requires shared cache, transport and run storage. Completed replay is normally cleaned after 30 seconds. Crash recovery defaults off; `recovery.durableAgents: 'auto'` enables running checkpoints and boot recovery. Custom snapshot policies can defeat recovery. Replayed steps can repeat model/tool calls, so external effects still require deduplication. [Durable-agent guide](https://mastra.ai/docs/harness/durable-agents)

The API reference exposes `stream`, `observe`, `resume`, `recover`, `recoverActiveRuns` and `listActiveRuns`. Observing a stream and recovering execution are separate operations. Abort/ownership loss requests cooperative cancellation; an external effect already completed cannot be undone by terminating the stream. Application heartbeats and terminal results must remain inspectable. [DurableAgent API](https://mastra.ai/reference/agents/durable-agent)

**Runtime evidence:** both durable/evented factories construct successfully; lifecycle methods exist on the pinned durable instance. No stream was executed and no process was killed. Multi-turn durable operation, restart recovery, orphan discovery, lease fencing, replay correctness and duplicate-effect prevention are **NOT DEMONSTRATED**.

**Required later experiment:** with a fake model and transactional synthetic tool, force two tool/model turns, kill the worker after a persisted effect but before acknowledgement, restart, inject duplicate delivery, and prove one committed effect plus a truthful terminal status. Repeat with recovery disabled, expired leases, a second worker and a failing tool. Verify chosen storage adapter's fencing and storage schema privileges; do not infer them from constructor success.

## JIT skills

`SkillSearchProcessor` is an input processor from `@mastra/core/processors`, with `search_skills` and `load_skill`. Options include `topK`, `minScore`, `ttl` and `blockingRefresh`. The current reference says on-demand mode suppresses automatic eager skill injection; `skill_read` remains available. TTL controls loaded thread-state cleanup. Without blocking refresh, catalog edits can lag a turn plus the staleness cooldown. [Processor reference](https://mastra.ai/reference/processors/skill-search-processor)

A workspace can use BM25 without paid embeddings. The workspace reference also offers request-scoped filesystems and versioned skill sources; direct unscoped calls resolve without request context. Avoid a shared private filesystem/catalog across owners. [Workspace reference](https://mastra.ai/reference/workspace/workspace-class)

**Runtime evidence:** a local synthetic `SKILL.md` was discovered, found by BM25 keywords and read using `workspace.skills.list/search/get`; processor construction succeeded. Model selection of tools, processor injection/reinjection, TTL expiry, staleness refresh and restart behavior are **NOT DEMONSTRATED**. The local skill catalog does not itself enforce primitive permissions. Record published skill version/content digest with every application run; a changed file must not silently change an already-approved operation's authority.

## Observability and personal data

Mastra exposes run/workflow/tool/model traces and correlated logs, usage and feedback. Export destinations are configured separately. Its quickstart includes a platform exporter capable of sending spans externally when credentials are present; copying it blindly would violate an unexamined data boundary. [Observability overview](https://mastra.ai/docs/observability/overview)

`SensitiveDataFilter` matches normalized field names exactly, traverses structured values, and leaves invalid JSON/plain prose unchanged. A custom `sensitiveFields` list replaces defaults. Automatic filtering applies to plain observability configurations; preconstructed instances need explicit attention. [Filter reference](https://mastra.ai/reference/observability/tracing/processors/sensitive-data-filter)

**Runtime counterexample:** default filtering redacted synthetic `apiKey`, while synthetic `authToken` and `input.message` prose remained intact. Therefore default secret filtering does **not** establish transcript privacy. Use an application-owned allowlist processor/exporter that emits owner-safe IDs, timings, status and selected redacted tool metadata; keep original evidence in the protected source store. Test inputs, outputs, errors, nested tool results, structured logs and every export path with synthetic sentinel secrets and private prose. Treat trace/log retention, access checks and deletion as explicit contracts. Local redaction behavior was demonstrated; actual exporters, trace UI and complete privacy enforcement were not.

## UI/framework candidates

**Preferred candidate:** Next.js with assistant-ui, using the Mastra AI SDK stream adapter. The official assistant-ui guide supports both in-process routes and a separate Mastra server. Current examples use `@assistant-ui/ai-sdk`; the older-named `@assistant-ui/react-ai-sdk` is also still published. Resolve the exact adapter path from the chosen package version. [Integration overview](https://www.assistant-ui.com/docs/integrations/frameworks/mastra/overview)

The full-stack guide calls for Node-compatible server execution, external Mastra packages in Next.js bundling, and an explicit AI SDK stream version (`v7` for the observed current AI SDK major). Its examples are integration guidance, not proof that this repository compiles or streams. The observed Node 22.22.3 satisfies the retrieved engine ranges. [Full-stack guide](https://www.assistant-ui.com/docs/integrations/frameworks/mastra/full-stack)

**Alternative:** a conventional React frontend with a separate Mastra service preserves worker/web separation. CopilotKit documents Mastra chat, tools and human-in-the-loop integration, and merits a bounded comparison if a deeply agentic interface becomes necessary. [CopilotKit Mastra integration](https://docs.copilotkit.ai/mastra)

No UI package was installed in the production repository and no browser integration was run. Streaming, tool approvals, attachment authorization, cancellation, thread restoration, accessibility and authenticated reconnect are **NOT DEMONSTRATED**. Do not adopt assistant-ui's optional hosted persistence as an unreviewed second personal-data store.

## Isolated probe evidence and reproduction

Local ignored directory: `C:\Users\RZ1\Desktop\RZ\261024-Quellight-ii\tmp\c0-mastra-spike`. `git check-ignore tmp/c0-mastra-spike/package.json` confirmed the ignore rule. Node `v22.22.3`; npm `10.9.8`. Installation used `--ignore-scripts --no-audit --no-fund` and exact direct package pins. It installed 175 packages and used no inference credentials. `@mastra/libsql` was installed for API availability, but no LibSQL/database connection was made; actual memory storage was the pure in-memory core store.

- Local `package-lock.json` SHA-256: `DBCE3DD78EA42B709DDE6156E9DB17EE45ECC43B7922FD7C9CD6148A9984C4B8`.
- Local final `probe.mjs` SHA-256: `51F52191A34A72945804882D6EA7FDED8BB9678B31BA822A940E1CF0400BA133`.
- First probe attempt exited 1 at the skill-search assertion because the probe assumed `result.name`. Pinned declarations show the actual field is `result.skillName`; the probe was corrected. This is retained failed probe evidence, not a claimed package defect.
- Corrected `node probe.mjs` exited 0: **4 PASS groups** (memory filtering; durable/evented constructors/API; BM25 catalog/search/read; redaction plus negative counterexamples).
- No paid calls; no external database connections; no process-kill recovery test.

The clone now contains the inspected synthetic probe, full npm lock, package manifest and skill fixture under [probes/mastra](probes/mastra/). The published script reads the checked-in skill fixture instead of creating it and uses `fileURLToPath` so paths containing spaces work. The original local run provenance above is retained; the published script is a versioned successor with the same four behavioral checks. The lock contains 184 package records (including optional/platform records); resolved package URLs all use `registry.npmjs.org`. Inspection found no credentials, connection strings or absolute local paths. Dependencies and logs are excluded.

| Published artifact (relative to `docs/cycle-0/`) | SHA-256 |
| --- | --- |
| [probe.mjs](probes/mastra/probe.mjs) | `4A137FD6338AC294098B8328EBFE413EA6F8B573C2FDAE9009F4C1DC38B58389` |
| [package.json](probes/mastra/package.json) | `7206B32B5F84446972AAC73672F90833C8E1E2216FDBCA79F9200A8F1D0ABB6A` |
| [package-lock.json](probes/mastra/package-lock.json) | `DBCE3DD78EA42B709DDE6156E9DB17EE45ECC43B7922FD7C9CD6148A9984C4B8` |
| [workspace/skills/temporal/SKILL.md](probes/mastra/workspace/skills/temporal/SKILL.md) | `057AAD72E240F1889D044F4EE325AB046633C6E070466FA4E8F4852533A57702` |

Published hashes above identify canonical Git blob bytes (LF line endings). A normal Windows clone with `core.autocrlf=true` may materialize CRLF and produce different raw `Get-FileHash` values without a content change. For portable verification, hash the committed blob, for example from the repository root:

```powershell
node -e "const c=require('node:crypto'),p=require('node:child_process'); for(const f of ['probe.mjs','package.json','package-lock.json','workspace/skills/temporal/SKILL.md']) console.log(f,c.createHash('sha256').update(p.execFileSync('git',['show','HEAD:docs/cycle-0/probes/mastra/'+f])).digest('hex'));"
```

The later raw working-file hashes in the replay command are diagnostic only; normalize line endings or use the Git blob command before comparing to the table. Behavior replay is separate from byte identity.

Published-fixture replay on the research date: copied only these four files into ignored `tmp/c0-mastra-published-replay`, ran a fresh `npm ci` (175 installed packages), then `node probe.mjs`; both exited 0 and all four check groups passed. Replayed lock/script hashes matched the table. This replay reused the same machine and is builder verification, not an independent audit.

From the repository root in a fresh clone, copy the fixtures into ignored `tmp/` and execute there:

```powershell
$probeSource = (Resolve-Path 'docs/cycle-0/probes/mastra').Path
$probeReplay = Join-Path (Get-Location) 'tmp/c0-mastra-published-replay'
New-Item -ItemType Directory -Path $probeReplay -Force | Out-Null
Copy-Item -Path (Join-Path $probeSource '*') -Destination $probeReplay -Recurse -Force
Push-Location $probeReplay
try {
  npm ci --ignore-scripts --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { throw 'Pinned dependency installation failed' }
  node probe.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Probe failed' }
  npm ls --depth=0
  Get-FileHash package-lock.json,probe.mjs -Algorithm SHA256
} finally { Pop-Location }
```

The frozen lock pins the full transitive resolution. A future machine still needs a compatible Node runtime, npm registry connectivity and available packages. The script constructs an agent with a model identifier but never calls `generate` or `stream`; no model provider key is needed.

## C0-03 disposition

**Primary-document and selected API feasibility check: PASS WITH LIMITATIONS.** The observed package set is internally compatible by published peer ranges for the tested four-package subset, and that subset's corrected probe passed. This does not claim the complete UI dependency graph, Postgres integration, durable recovery or production product behavior passed. Those claims remain **NOT DEMONSTRATED**, with explicit future tests above. Independent verification must inspect the integrated exact candidate commit and challenge these distinctions before the owner stage gate.
