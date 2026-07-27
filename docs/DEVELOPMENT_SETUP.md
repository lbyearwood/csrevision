# Development Setup For Codex

Last updated: 2026-07-27

Audience: Codex agents bootstrapping this repository on a new machine. The user does not plan to read this. Keep this file operational and dependency-focused.

## Read Order

1. `docs/HANDOVER.md` for the latest continuation state.
2. `docs/CODEX_START_PROCESS.md` for the required pull/read/install/run/report startup sequence.
3. `docs/CODEX_DEVELOPMENT_PROCESS.md` for the per-task QA rule.
4. `docs/CODEX_END_PROCESS.md` for the user-triggered end-of-day commit and push sequence.
5. `docs/PROJECT_TASKS.md` for live tasks and blockers.
6. `PROJECT_BRIEF.md` for product rules and architecture constraints.
7. This file for machine setup.
8. `docs/TROUBLESHOOTING.md` if local commands fail or Windows/Codex behaves oddly.
9. `docs/SUPABASE_SETUP.md` before any backend, Auth, RLS, seed, or Edge Function work.

## Required Dependencies

Install these on any development computer that needs to run the project:

- Git with access to `https://github.com/lbyearwood/csrevision`.
- Node.js 22 LTS or newer. Current verified machine uses Node.js `24.16.0`.
- npm from the Node.js install. On Windows PowerShell, use `npm.cmd` and `npx.cmd`, not `npm` or `npx`, because script execution policy can block `.ps1` shims.
- A Chromium-based browser for local visual QA.
- Docker Desktop.
- WSL 2 / Linux containers enabled in Docker Desktop.
- Virtualization enabled in BIOS/UEFI and Windows features.
- Supabase CLI from the pinned project dependency in `package.json`; do not require a global Supabase install.

Optional:

- GitHub CLI `gh` only if a future Codex task needs PR creation, PR checks, or GitHub auth diagnostics. Normal `git pull`, `git commit`, and `git push` do not require `gh`.

## Fresh Machine Bootstrap

Clone or pull the branch:

```powershell
git clone https://github.com/lbyearwood/csrevision.git
cd csrevision
git checkout agent/csrevision-accounts-mvp
git pull
```

Install project packages:

```powershell
npm.cmd install
```

## Local Supabase Bootstrap

Use this path for all development and QA until launch. The app has no frontend-only/demo fallback.

1. Start Docker Desktop and wait until Docker Engine is running.
2. Start local Supabase:

```powershell
npx.cmd supabase start
```

3. Create `.env.local` in the repo root. This file is ignored by Git.

```text
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<local anon/publishable key from npx.cmd supabase status>
VITE_APP_NAME=csrevision
```

4. If the local database is empty or stale, reset from migrations and seed:

```powershell
npx.cmd supabase db reset --local
```

5. If the stack is already running and only the seed needs reapplying, use the direct seed apply command documented in `docs/SUPABASE_SETUP.md`:

```powershell
docker cp supabase\seed.sql supabase_db_csrevision:/tmp/csrevision_seed.sql
docker exec supabase_db_csrevision psql -v ON_ERROR_STOP=1 -U postgres -d postgres -f /tmp/csrevision_seed.sql
```

6. Run the app:

```powershell
npm.cmd run dev
```

Default local URLs:

```text
Frontend: http://127.0.0.1:5173/
Supabase API: http://127.0.0.1:54321
Supabase Functions: http://127.0.0.1:54321/functions/v1
Supabase Studio: http://127.0.0.1:54323
Postgres: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Inbucket: http://127.0.0.1:54324
```

After `npx.cmd supabase start`, run:

```powershell
npx.cmd supabase status
```

The output must include `FUNCTIONS_URL` before testing active assessments. If it does not, see `docs/TROUBLESHOOTING.md`.

## Local Seed Accounts

Password for all seeded accounts:

```text
Localdev1!
```

Teacher:

```text
j.doe@school.example
```

Students log in through username UI. Internally the app maps usernames to synthetic `@students.local` Auth emails.

```text
asingh5827
rmehta4120
dpatel9144
vkumar3021
mkhan7712
```

## Verification Commands

Run these before completing relevant functional changes:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

Functional changes also require targeted QA of the changed workflow against local Supabase. Examples:

- UI changes: use the browser to perform the workflow with seeded local accounts.
- Edge Function changes: call the function locally with the appropriate seeded role and payload.
- RLS/schema changes: run pgTAP or direct SQL checks proving allowed and denied access.
- Persistence changes: save data, navigate or reload, and prove the saved state is still present.

Do not mark the task complete until this behavioural QA passes. If it cannot be run, document the gap and leave the task blocked or partially verified.

Database verification after seed:

```powershell
docker exec supabase_db_csrevision psql -U postgres -d postgres -c "select (select count(*) from public.units where slug like 'unit-%') as units, (select count(*) from public.topics where slug ~ '^[0-9]-') as topics, (select count(*) from public.tests where slug like '%-test-1') as tests, (select count(*) from public.questions q join public.test_versions tv on tv.id = q.test_version_id join public.tests t on t.id = tv.test_id where t.slug like '%-test-1') as questions, (select count(*) from public.question_options qo join public.questions q on q.id = qo.question_id join public.test_versions tv on tv.id = q.test_version_id join public.tests t on t.id = tv.test_id where t.slug like '%-test-1') as options;"
```

Expected current seed counts:

```text
units=8
topics=41
tests=41
questions=205
options=820
```

## Generated Placeholder Content

The current OCR placeholder content is generated from:

```text
scripts/generate-placeholder-resources.mjs
```

That script writes:

```text
supabase/seed.sql
```

Run it only when the confirmed OCR topic map or placeholder seed structure changes:

```powershell
node scripts\generate-placeholder-resources.mjs
```

The generated questions are not production content. They exist so the UI and local backend can exercise the full Subject -> Unit -> Topic -> Test -> Question shape.

## Known Machine Issues

- For detailed fixes, see `docs/TROUBLESHOOTING.md`.
- If Docker Desktop reports virtualization support missing, enable virtualization in BIOS/UEFI and ensure WSL 2 / Linux containers are available.
- If PowerShell blocks `npm.ps1` or `npx.ps1`, use `npm.cmd` and `npx.cmd`.
- If `Start-Process` fails with duplicate `Path` / `PATH` keys, normalize the current process environment using the command in `docs/TROUBLESHOOTING.md`.
- `supabase_vector_csrevision` may restart locally because the Vector log collector cannot access Docker logs. Core local services have still worked while API, Studio, DB, Auth, and Inbucket are healthy.
- Do not commit `.env.local`, service-role keys, AI keys, or production credentials.
