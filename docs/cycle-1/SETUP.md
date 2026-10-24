# Run the local Quellight proof

Node >=22.13, npm, Windows x64 tested. No Docker, Supabase account, provider API key or personal data is needed. Use a trusted local checkout and keep runtime files ignored. Do not point this proof at hosted databases. Tests create new disposable local clusters and retain their ignored fixture directories for diagnosis; they never reset the developer cluster.

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npm run db
```

Leave the database process running. In a second terminal:

```powershell
npm run setup
npm start
```

Open `http://127.0.0.1:4317`. Choose Alice or Bob. Their **generated local fixture passwords** are in ignored `local-data/c1/runtime.json`, under users. Never paste that file into Git, Work, a PR or a report. It also holds local admin/worker secrets. Login checks real database authentication; there is no passwordless demo bypass. Records persist, while login sessions and unsaved conversation text are intentionally ephemeral.

In separate terminals, launch per-owner background workers:

```powershell
npm run worker -- alice
npm run worker -- bob
```

Enter a source thought, optionally send it to the fixed fake stream, select note/task or seed experiment, fill the fields and use Save now or Ask Steward to save. Inspect original source, versions and changes; edit a title to demonstrate a correction. A queued run stays queued until the relevant worker runs. Failure/retry/cancel/stalled statuses are truthful; a cancellation may preserve an already committed effect. A process kill can be recovered after the test lease expires.

```powershell
npm test
npm run check
npm run build
npx playwright install chromium
node scripts/browser-proof.mjs
```

`npm test` boots isolated real PostgreSQL and HTTP/worker processes, including kill/restart, auth/RLS and direct DB/API negatives. `check` runs TypeScript checkJs over server/scripts/tests and documentation links; `build` syntax-checks/copies native server/browser assets to ignored dist. There is no transpiler or production deployment artifact. Browser script uses an isolated synthetic cluster, generated passwords without printing them, and local screenshots/JSON under ignored tmp/browser-evidence. It checks streaming, save/correction, lost acknowledgment retry, two-owner UI isolation, separate worker and 390px layout. Optional QL_EVIDENCE_DIR selects a synthetic evidence directory. It does not use a preexisting app or private user data.

Stop app/workers with Ctrl+C; stop the developer database with `npm run db:stop`. QL_DATA_DIR/QL_DB_PORT/QL_PORT can isolate a separate local proof. No automatic deletion of database folders occurs. Dispose only of an exact, resolved fixture directory after its own database is stopped. Linux/macOS/root setup, production TLS, multi-instance sessions, hosted Supabase Auth/Realtime and beta Mastra durable-engine recovery remain unverified. Inspect third-party embedded binary tooling before approving lifecycle/symlink scripts on another platform.
