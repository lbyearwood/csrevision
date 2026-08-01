# Codex Start Process

Last updated: 2026-07-30

Audience: every Codex agent starting or resuming work on this repository. The user does not plan to read this. Follow this process before making product/code changes unless the user explicitly asks for a narrower action.

## Required Start Sequence

### 1. Sync Git Safely

Check branch and working tree:

```powershell
git status -sb
git branch --show-current
```

Expected branch:

```text
agent/csrevision-accounts-mvp
```

If the working tree is clean, pull before doing anything else:

```powershell
git pull
```

If the working tree is dirty:

- Inspect `git status -sb` and relevant diffs first.
- Do not overwrite or revert user/local changes.
- Pull only when it is safe, or ask the user if local changes make the sync ambiguous.

### 2. Read Project Docs

Read these in order:

1. `Planning/Process/CODEX_START_PROCESS.md`
2. `Planning/Process/CODEX_DEVELOPMENT_PROCESS.md`
3. `Planning/Process/CODEX_END_PROCESS.md`
4. `Planning/Process/HANDOVER.md`
5. `Planning/Process/PROJECT_TASKS.md`
6. `PROJECT_BRIEF.md`
7. `Planning/Setup/DEVELOPMENT_SETUP.md`
8. `Planning/Testing/TESTING.md`
9. `Planning/Setup/TROUBLESHOOTING.md`
10. `Planning/Setup/SUPABASE_SETUP.md` before any backend, Auth, RLS, seed, Edge Function, or persistence work
11. `Planning/Testing/csrevision-full-test-plan-checklist.html` when continuing staged QA or fixing failures from the sequential test plan

Use `Planning/Process/PROJECT_TASKS.md` as the live source for current focus, open blockers, and next actions.

### 3. Install Or Refresh Dependencies

Use Windows-safe commands:

```powershell
npm.cmd install
```

Do not use bare `npm` / `npx` in PowerShell; execution policy can block the `.ps1` shims. Use `npm.cmd` and `npx.cmd`.

### 4. Start Required Local Supabase Mode

Local Supabase is required for all development and QA until launch. There is no frontend-only/demo fallback mode.

Local Supabase is mandatory for:

- Auth
- student/teacher accounts
- assignments
- attempts
- answers
- results
- points
- RLS/security
- Edge Functions
- all page-level visual QA, because visible data must come from the local seed/database

Start/check local Supabase:

```powershell
npx.cmd supabase start
npx.cmd supabase status
```

After every `git pull`, apply pending local migrations before running or testing the app:

```powershell
npx.cmd supabase migration up --local
npx.cmd supabase migration list --local
```

Do not treat `migration list` alone as proof that migrations are applied. If newly pulled code references new database columns or functions, verify the relevant schema directly with SQL or run pgTAP before reporting the site as ready.

If the next task is a staged regression/test-plan task, verify the expected seed state before browser QA. Do not run a destructive `db reset` unless the user has explicitly approved it for that task.

Bulk QA seed presence check:

```powershell
docker exec supabase_db_csrevision psql -U postgres -d postgres -c "select (select count(*) from public.student_profiles where account_status = 'active') as active_students, (select count(*) from public.classes where is_system = false and status = 'active') as active_real_classes, (select count(*) from public.test_assignments) as assignments, (select count(*) from public.assignment_recipients) as assignment_recipients, (select count(*) from public.audit_logs where action = 'bulk_classroom_qa_seed_applied') as bulk_seed_audits;"
```

Expected after the consolidated `supabase/seed.sql`:

```text
active_students=300
active_real_classes=12
assignments=98
assignment_recipients=61
bulk_seed_audits=1
```

The status output must include:

```text
FUNCTIONS_URL: http://127.0.0.1:54321/functions/v1
```

If Edge Runtime is stopped:

```powershell
docker start supabase_edge_runtime_csrevision
```

If `.env.local` is missing, create it with frontend-safe local values from `npx.cmd supabase status`. The app will not sign in or fall back to demo data without these values. Never put service-role keys, AI keys, or production credentials in frontend env files.

### 5. Run The Site

Use port `5173` unless the user asks for another port.

If no dev server is running:

```powershell
npm.cmd run dev -- --port 5173
```

If launching in the background from Codex, use `Start-Process` with `-WindowStyle Hidden`, write stdout/stderr to temp logs, then verify the URL.

Verify:

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:5173/ -UseBasicParsing -TimeoutSec 10
```

Expected frontend URL:

```text
http://127.0.0.1:5173/
```

### 6. State The Next Work Task

After the repo is synced, docs are read, dependencies are refreshed, and the site is running, report:

- current branch
- whether the working tree is clean
- site URL
- whether local Supabase is running
- the next recommended task from `Planning/Process/PROJECT_TASKS.md`

Pick the next task from `Current Focus` first, then from the most relevant incomplete section. If blocked, state the unblock action rather than inventing a new task.

## Current Next Task Rule

As of 2026-07-30, the next recommended task is:

```text
Continue the standalone sequential test plan at Stage 5.
```

Reason:

- The test plan at `Planning/Testing/csrevision-full-test-plan-checklist.html` is the source of truth for staged regression QA.
- Stage 4 is recorded as 37 pass, 1 blocked, 0 fail.
- The only Stage 4 blocker is Test 94: PDF download was triggered without console errors, but the in-app browser did not expose the downloaded file for visual inspection.
- Do not skip ahead; run tests in displayed order and update the HTML artifact after each test.

Secondary task after that:

```text
Merge teacher Courses and Assignments into one Resources workflow, then plan/build Class views for assigned resources and class performance by unit/topic.
```

## Do Not Skip

- Do not start coding before syncing Git when the tree is clean.
- Do not skip `npx.cmd supabase migration up --local` after pulling changes.
- Do not reintroduce frontend-only/demo fallback data or demo login paths.
- Do not run destructive local database resets unless needed for the task and clearly appropriate.
- Do not expose service-role keys, correct answers, hidden mark schemes, or privileged marking logic to the frontend.
- Do not leave docs stale after completing or changing project direction.
- After each development task, follow the QA gate in `Planning/Process/CODEX_DEVELOPMENT_PROCESS.md` before saying the task is complete.
- Follow `Planning/Process/CODEX_END_PROCESS.md` only when the user explicitly says to end or wrap up development.
