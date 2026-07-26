# Codex Start Process

Last updated: 2026-07-26

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

1. `docs/CODEX_START_PROCESS.md`
2. `docs/CODEX_END_PROCESS.md`
3. `docs/HANDOVER.md`
4. `docs/PROJECT_TASKS.md`
5. `PROJECT_BRIEF.md`
6. `docs/DEVELOPMENT_SETUP.md`
7. `docs/TROUBLESHOOTING.md`
8. `docs/SUPABASE_SETUP.md` before any backend, Auth, RLS, seed, Edge Function, or persistence work

Use `docs/PROJECT_TASKS.md` as the live source for current focus, open blockers, and next actions.

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
- the next recommended task from `docs/PROJECT_TASKS.md`

Pick the next task from `Current Focus` first, then from the most relevant incomplete section. If blocked, state the unblock action rather than inventing a new task.

## Current Next Task Rule

As of 2026-07-26, the next recommended task is:

```text
Continue test naming and topic-level bulk selection on the local Supabase-backed Assignments flow.
```

Reason:

- Runtime fallback/demo data has been removed.
- Local Supabase is now mandatory until launch.
- The product decision is to support multiple tests per topic and topic-level selection.

Secondary task after that:

```text
Continue backend wiring for save-answer, submit-test-attempt, result detail, suspicious activity detail, and student/account management flows.
```

## Do Not Skip

- Do not start coding before syncing Git when the tree is clean.
- Do not reintroduce frontend-only/demo fallback data or demo login paths.
- Do not run destructive local database resets unless needed for the task and clearly appropriate.
- Do not expose service-role keys, correct answers, hidden mark schemes, or privileged marking logic to the frontend.
- Do not leave docs stale after completing or changing project direction.
- After making changes, follow `docs/CODEX_END_PROCESS.md` before the final response.
