# Independent verification 01 — Cycle 0

Dated 2026-10-24 (Asia/Kuala_Lumpur). Fresh verifier context; documentation/research acceptance only. **Independent verdict: HELD for reproducibility evidence completion (F-01).** No production/application failure is alleged. The tested synthetic probes passed. The builder must repair the evidence gap at a new exact candidate and obtain affected re-verification before reporting the stage independently verified.

## Exact candidate and scope

- Repository: `https://github.com/radz2291/Quellight-ii.git`.
- Branch inspected: `codex/c0-foundation-discovery`.
- Base/main: `bf872f90986cd50da9109a610e5abe45b4bf5682`.
- Exact candidate: **`34acfcc04152ed5570d1e7449e1df648226b1ea6`**; its parent equals the base.
- Independent fresh local clone: ignored `tmp/c0-independent-01`, detached at the candidate. This is a separate checkout/context on the same machine, not an independent operating system or registry.
- This report is the verifier artifact; its containing commit is to be assigned by the stage manager. The verifier created no Git commit and did not repair the audited candidate.
- No source database query/write, model inference, Work mutation, provisioning, import, deletion, deployment or main merge was performed by this verifier. Work lifecycle and private source tool evidence remain the manager's responsibility.
- The pre-existing untracked `Supabase-Codex-Setup.md` was not opened, edited, copied into the clone or staged.

## Acceptance verdicts

| Criterion | Independent result | Evidence and limit |
| --- | --- | --- |
| C0-01 | PASS | Repository/branch/base/HEAD/remote and stage boundaries reconstructed; main unchanged. Foundation check passes in both original and fresh detached checkout. Historical Work/tool observations are manager evidence, not independently replayed connector actions. |
| C0-02 | HELD | Aggregate arithmetic, owner predicates, privacy and SELECT/read-only template inspected successfully. Detailed timestamp/part/attachment/catalog/grant claims cannot be exactly reproduced from the retained template; F-01. No source query was repeated, so actual source counts and no-mutation history are builder observations, not independent database attestation. |
| C0-03 | PASS WITH NON-BLOCKING FINDING | Current primary docs and all 11 registry version/peer/engine observations checked. Fresh lock installation and four synthetic probe groups pass. Hash instructions need line-ending clarification (F-02). No runtime recovery, SQL/RLS, UI or memory quality proof is inferred. |
| C0-04 | PASS WITH NON-BLOCKING FINDINGS | Owner-derived context, validated primitives, authority/provenance separation, bounded transactions, revision conflicts, atomic receipts/outbox, scheduling and lifecycle are concrete proposals. F-03/F-04 identify contract details to settle before implementation. |
| C0-05 | PASS, planning only | Import conservation/quarantine, identity mapping, immutable snapshots, backup/object split, restore/deletion fences, retirement target checks, spend/authority gates and batch rollback are specified. No execution authority is implied. |
| C0-06 | PASS, thought experiment only | Seed-lot/trial extension counts its definitions, event/link constraint and optional skill/renderer; collaboration, sensors, payment and offline conflict are honest counterexamples. No runtime extensibility result is claimed. |
| C0-07 | HELD with C0-02 | Foundation cross-links resolve; risks/quality targets and bounded Cycle 1 proposal supplied. Current HANDOFF remains Cycle 0, and owner acceptance remains separate. This independent challenge is complete but its evidence finding requires a revised candidate. |

## Reproduction and observations

Commands below were run against the exact candidate. Commands separated into steps retain exit status semantics; no production credentials are required.

```powershell
git status --short
git branch --show-current
git rev-parse HEAD
git remote -v
git rev-parse main
git rev-parse 34acfcc04152ed5570d1e7449e1df648226b1ea6^
git merge-base --is-ancestor bf872f90986cd50da9109a610e5abe45b4bf5682 34acfcc04152ed5570d1e7449e1df648226b1ea6
git diff --check bf872f90986cd50da9109a610e5abe45b4bf5682 34acfcc04152ed5570d1e7449e1df648226b1ea6
node scripts/check-foundation.mjs
node --version
npm --version
git --version
```

Results: ancestry/diff checks exit 0; foundation PASS for 25 documents. Node `v22.22.3`, npm `10.9.8`, Git `2.54.0.windows.1`. Original tracked tree was clean before this report; only the preserved setup note was untracked. The candidate is a direct successor of the base; main still resolves to the base.

```powershell
git clone --no-hardlinks . tmp/c0-independent-01
Push-Location tmp/c0-independent-01
try {
  git checkout --detach 34acfcc04152ed5570d1e7449e1df648226b1ea6
  node scripts/check-foundation.mjs
  $probeSource = (Resolve-Path 'docs/cycle-0/probes/mastra').Path
  $probeReplay = Join-Path (Get-Location) 'tmp/probe replay'
  New-Item -ItemType Directory -Path $probeReplay -Force | Out-Null
  Copy-Item -Path (Join-Path $probeSource '*') -Destination $probeReplay -Recurse -Force
  git check-ignore 'tmp/probe replay/package.json'
  Push-Location $probeReplay
  try {
    npm ci --ignore-scripts --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw 'npm ci failed' }
    node probe.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Probe failed' }
    npm ls --depth=0
    Get-FileHash package-lock.json,probe.mjs,package.json,workspace/skills/temporal/SKILL.md -Algorithm SHA256
  } finally { Pop-Location }
  git status --short
} finally { Pop-Location }
```

Results: clone/checkouts/foundation/install/probe/package listing exit 0; 175 packages installed. Fresh clone tracked tree remains clean. Replay path deliberately contains a space. All four groups passed:

1. Two resource-filtered synthetic threads for owner A, one for B; own-thread recall returns expected message, wrong-resource recall throws an ownership error.
2. Durable/evented constructors and selected lifecycle methods exist; no execution invoked.
3. BM25 finds and reads the checked-in temporal fixture; processor construction succeeds.
4. Default filter redacts `apiKey`, preserves the deliberately unmatched `authToken` and private prose counterexamples.

Direct installed pins match the candidate: core `1.79.0`, LibSQL `1.27.0`, memory `1.39.0`, observability `1.21.0`. Script inspection found no `generate`/`stream` invocation or external database setup. Its zero-call counters are self-reported constants; the stronger evidence here is the inspected narrow API path. This was not packet-capture/network-isolation verification. npm contacted the public registry.

Arithmetic was independently recomputed with Node: role categories total **11,475**; content arrays + strings + missing total **11,475**; numeric + string timestamps total **11,475**; part categories total **16,473**. Numeric epoch conversions match the reported UTC endpoints. None of these checks establishes the underlying private query's accuracy.

The complete base-to-candidate diff and probe/lock/fixtures were inspected. Additional pattern checks returned zero private UUIDs, PostgreSQL connection URLs, recognized provider-token prefixes, private-key blocks and project-specific Supabase hostnames. Lock inspection confirms 184 package records and only `registry.npmjs.org` resolved hosts. No transcript bodies, attachment bytes, credentials or real owner IDs were found. Pattern searches are supporting evidence, not a mathematical secret-detection guarantee. Public structural aggregates/dates and synthetic labels are intentionally present.

## Findings

### F-01 — Retain exact reproduction for expanded source claims (acceptance blocker)

`SOURCE-AUDIT.md` says expanded key/type/grant checks were additional SELECT aggregates whose sequence/results are recorded there. The retained `source-aggregate.sql` contains core owner sessions, bounded roles/basic shapes, resources and room ownership, but not the exact queries for the 28-table catalog, global data/message shapes, timestamp ranges/duplicates, absent-ID key assertion, part counts/types, attachment cardinality/keys, storage inventory, or security/catalog/grants observations. Narrative results alone do not supply the missing command/reproduction steps required by `09-ACCEPTANCE.md`.

The supplied `missing_id` expression (`msg->>'id' IS NULL`) also conflates an absent key with a present JSON null. Likewise, `message_count <> actual` does not count NULL cached values as mismatches. No defect in the observed source is proven, but this template by itself cannot prove the stronger wording that every object lacks the field and every cached count agrees.

Repair: retain the actual redacted SELECT templates used for expanded checks, privately bound by the same owner ID, or provide a concrete private evidence reference for sensitive catalog checks with public coverage clearly delimited. Add explicit key-presence and cached-null checks or qualify those statements. Never publish the affected private security object names merely to make a public recipe. Existing private results can support documentation repair; fresh source access is not required by this finding. Reverify the new exact candidate and retain this report.

### F-02 — Fixture digests need Git/LF versus checkout-byte distinction (non-blocking)

The published digests match the committed Git blobs exactly, and the current original checkout matches them. A fresh Windows clone inherited `core.autocrlf=true`; normal checkout converted LF to CRLF. The three multiline fixture byte hashes consequently differed, despite content-equivalent files and successful npm/probe execution. `npm ci` did not change the replay lock: replay and fresh-clone source files were byte-identical.

| Artifact | Fresh checkout SHA-256 | Canonical Git blob SHA-256 |
| --- | --- | --- |
| probe.mjs | `30CAEF370A0A6EF1A93B70EC47BF8987BEAA003472F5B6821C5DF78B0848EAD9` | `4A137FD6338AC294098B8328EBFE413EA6F8B573C2FDAE9009F4C1DC38B58389` |
| package-lock.json | `A9094871B0A2449BCF466EA67A5EB595FBB084C9C8049D56A6FE2095E0FC0944` | `DBCE3DD78EA42B709DDE6156E9DB17EE45ECC43B7922FD7C9CD6148A9984C4B8` |
| temporal/SKILL.md | `D2E47B705CC9BA3D81C1FDD2CF23AE73805ECC292ECE72BD828B5555DACE70BF` | `057AAD72E240F1889D044F4EE325AB046633C6E070466FA4E8F4852533A57702` |

The one-line package.json digest matches unchanged. Independent byte comparison confirmed normalizing CRLF to LF equals each committed blob. Clarify canonical hashing or pin LF with `.gitattributes`; do not treat this as dependency tampering or a failed behavioral replay.

### F-03 — Make worker mutation fencing explicit before implementation (non-blocking design clarification)

The lifecycle explicitly fences checkpoints and terminal writes by lease generation. The primitive `RequestContext` carries run ID but no generation; the atomic mutation sequence does not explicitly lock/recheck the active run's generation, cancellation and expiry alongside the effect. Prose correctly forbids stale-worker commits and the future test plan requires rejection. Tighten the context and transaction contract so a stale worker cannot commit a previously unused operation after takeover simply because its record revision still matches. Existing dedupe keys alone do not prevent that case. This is a proposed-contract clarity issue, not a failed running implementation.

### F-04 — Name the snapshot identity field consistently (non-blocking design clarification)

`messages` declares a uniqueness rule involving `source_snapshot` without defining that field; `sources` declares uniqueness by owner/origin/container/item while the import design requires snapshot digest + ordinal. State explicitly whether `original_item_key` includes snapshot identity or add a defined snapshot relation/field and composite key. Demonstrate two different snapshots at the same ordinal coexist without overwriting evidence. The import plan already identifies the correct invariant; the typed table sketch needs to make its representation unambiguous.

## Primary-source challenge

Current official material was retrieved independently on the verification date. The following support the candidate's bounded reading; they do not establish implemented behavior:

- [Mastra durable agents](https://mastra.ai/docs/harness/durable-agents): beta; default process-local replay and disabled automatic crash recovery require deliberate persistence/recovery configuration. Replayed tool effects require application deduplication.
- [Memory](https://mastra.ai/docs/memory/overview) and [semantic recall](https://mastra.ai/docs/memory/semantic-recall): resource/thread distinctions, immutable thread owner, delegation scope and embedding-metadata staleness support the identified ownership/correction caveats.
- [SkillSearchProcessor](https://mastra.ai/reference/processors/skill-search-processor) and [Workspace](https://mastra.ai/reference/workspace/workspace-class): on-demand tool loading, TTL/refresh and request-scoped filesystem options agree with the proposal.
- [SensitiveDataFilter](https://mastra.ai/reference/observability/tracing/processors/sensitive-data-filter): field-name matching is not general prose privacy; the independent replay confirms the narrow counterexamples.
- [assistant-ui full-stack integration](https://www.assistant-ui.com/docs/integrations/frameworks/mastra/full-stack): Node server packaging and explicit v7 stream adapter guidance match; compiling the whole UI graph remains untested.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [backups](https://supabase.com/docs/guides/platform/backups), [queues](https://supabase.com/docs/guides/queues), and [Edge limits](https://supabase.com/docs/guides/functions/limits): grant/row-policy separation, object-backup limitation, irreversible hosted-backup deletion, bounded queue delivery window and finite function runtime justify the planned boundaries.
- Supabase changelog Markdown was unavailable through the web reader but fetched successfully via PowerShell HTTPS. Reviewed [TLS change](https://supabase.com/changelog/cbc-tls-ciphers-deprecated), [Postgres minor compatibility change](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes), and [API grant-default change](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically). No upgrade, reindex or project query was attempted.

All 11 version-table entries and relevant ranges matched an independent `Invoke-RestMethod` request to `https://registry.npmjs.org/<package>/latest` for the listed package names. These endpoints are mutable; the recorded candidate lock, not a future `latest`, defines the probe.

## Remaining limits and next allowed action

Actual source query execution/mutation history, owner selection, private security exception and live Work state are manager evidence. This verifier inspected the sanitized report/templates and deliberately did not fetch personal data or reproduce a vulnerability. Product memory accuracy, browser integration, paid inference, PostgreSQL/RLS isolation, subscriptions, attachment recovery, process-kill recovery and real effects remain **NOT DEMONSTRATED** as expected in Cycle 0.

The next allowed action is bounded documentation/evidence repair, a new candidate SHA and affected independent re-verification. Then submit the stage branch and owner report for human review. This verdict is neither owner acceptance nor authority to merge, retire staging, provision, import or begin Cycle 1.
