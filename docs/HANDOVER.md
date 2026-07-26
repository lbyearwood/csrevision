# Codex Handover

Last updated: 2026-07-26

Audience: a new Codex agent continuing `csrevision` on a different development computer.

## Start Here

Read these files in order:

1. `docs/CODEX_START_PROCESS.md`
2. `docs/CODEX_END_PROCESS.md`
3. `docs/HANDOVER.md`
4. `docs/PROJECT_TASKS.md`
5. `PROJECT_BRIEF.md`
6. `docs/DEVELOPMENT_SETUP.md`
7. `docs/SUPABASE_SETUP.md`
8. `docs/TROUBLESHOOTING.md`

The active branch is:

```powershell
agent/csrevision-accounts-mvp
```

Clone and enter the branch:

```powershell
git clone https://github.com/lbyearwood/csrevision.git
cd csrevision
git checkout agent/csrevision-accounts-mvp
git pull
```

## Current Product State

`csrevision` is a React/Vite/TypeScript/Tailwind app backed by local Supabase for real persistence during development.

Current working mode is persist mode:

- Use local Supabase for Auth, Postgres, RLS, seed data, Edge Functions, assignments, attempts, answers, points, and results.
- Do not treat teacher actions as UI-only mocks.
- There is no frontend-only/demo fallback. Missing `.env.local` or local Supabase config must block sign-in and surface a local Supabase required message.

Recent completed work:

- `supabase/tests/rls_policies.sql` is now an executable pgTAP suite with 25 passing local database tests.
- The RLS suite verifies student isolation, staff-only question/option protection, teacher ownership boundaries, teacher class-update ownership, anon denial, assigned-attempt uniqueness, and immutability after attempts exist.
- Teacher Classes now supports inline editing for class name, academic year, year group, and status. Saves go through local Supabase `public.classes`; no frontend-only fallback is allowed.
- Frontend demo fallback was removed. `src/data/demoData.ts` was deleted, auth no longer returns fake users, and `scripts/generate-placeholder-resources.mjs` now writes only `supabase/seed.sql`.
- Placeholder test resources now use `<topic> test 1` titles and `*-test-1` slugs. There should be zero generated `*-check` test slugs.
- Teacher assignment creation has topic-level `Select all` / `Clear topic` controls for all tests under a topic.
- Teacher Assignments contrast was fixed: light dropdowns/date inputs and light nested topic/test rows now explicitly use dark `text-ink` inside dark panels.
- Codex start and end process docs now define the standard session lifecycle: pull/read/install/run/report at start, then update docs/write handover/commit/push at end.
- Teacher Tests page is organized like the student Practice page.
- Teacher Assignments page is split into `Create assignment` and `Existing assignments`.
- Teachers can select a class, course, one or more published tests, and an optional due date.
- Assignment creation inserts real rows into `public.test_assignments`.
- Existing assignments shows every unit/topic for the selected course, available test names, times assigned, and the last five saved due dates.
- Student Assigned page shows persisted assignments for the student's class.
- Assignment due dates are planning metadata only. They do not block starting or completing a test.
- `start-test-attempt` no longer checks `due_at`.

## Fresh PC Bootstrap

Install prerequisites:

- Git
- Node.js 22 LTS or newer
- Docker Desktop with Linux containers / WSL 2 enabled
- A Chromium-based browser

Install packages:

```powershell
npm.cmd install
```

Start local Supabase:

```powershell
npx.cmd supabase start
```

Create `.env.local` from `npx.cmd supabase status` output:

```text
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<PUBLISHABLE_KEY from npx.cmd supabase status>
VITE_APP_NAME=csrevision
```

Do not put service-role keys, secret keys, AI keys, or production credentials in frontend env files.

Reset database from migrations and seed:

```powershell
npx.cmd supabase db reset --local
```

Run the frontend:

```powershell
npm.cmd run dev -- --port 5173
```

Open:

```text
http://127.0.0.1:5173/
```

## Seed Accounts

Password for all seeded accounts:

```text
Localdev1!
```

Teacher:

```text
j.doe@school.example
```

Students use username login in the UI:

```text
asingh5827
rmehta4120
dpatel9144
vkumar3021
mkhan7712
```

## Required Local Service Check

Before testing Edge Functions, run:

```powershell
npx.cmd supabase status
```

The output must include:

```text
FUNCTIONS_URL: http://127.0.0.1:54321/functions/v1
```

If `supabase_edge_runtime_csrevision` is listed as stopped, start it:

```powershell
docker start supabase_edge_runtime_csrevision
```

This fixed `Edge Function returned a non-2xx status code` with response body:

```text
{"message":"name resolution failed"}
```

`supabase_imgproxy_csrevision` and `supabase_pooler_csrevision` being stopped did not block the app during the latest QA. Edge Runtime being stopped did block test starts.

## Validation Commands

Run before committing functional changes:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

Latest verified checks on this branch:

```text
2026-07-26 class details editing update:
npm.cmd run typecheck: passed
npm.cmd run lint: passed
npm.cmd run test: passed, 4 files / 11 tests
npm.cmd run build: passed
```

Latest diff hygiene verification on 2026-07-26:

```text
git diff --check: passed
```

Latest backend verification on 2026-07-26:

```text
npx.cmd supabase test db --local supabase\tests: passed, 25 tests
New class-update coverage: owned teacher class update allowed; unrelated teacher class update denied.
```

Latest frontend visual QA on 2026-07-26:

```text
Teacher Assignments in in-app Browser with local Supabase data: `1.1 Programming fundamentals test 1` rendered; topic `Select all` changed the summary to `1 tests selected`, topic state to `1/1 selected`, checkbox to checked, and the row to blue; `Clear topic` returned the summary to `0 tests selected`, topic state to `0/1 selected`, and create button to disabled; no console warnings/errors.
Teacher Classes in in-app Browser with local Supabase data: editing `8A Computing` to temporary details saved, the edited value persisted after re-sign-in, and the seed values were restored to `8A Computing`, `2026/27`, Year `8`; no console warnings/errors.
```

Browser QA that passed:

- Teacher created assignments for `8A Computing`.
- Assignment rows persisted after reload/login.
- Existing assignments table showed saved due dates.
- Student `asingh5827` saw newly created assignments.
- A deliberately past-due assignment for `1.10 Translators and facilities` could start.
- Active test screen loaded with five questions.

The QA-created local rows are only in this machine's local Supabase database. They are not in Git and will not appear after a fresh `db reset` unless added to `supabase/seed.sql`.

## Important Code Hotspots

- App state and persistence:
  - `src/app/AppState.tsx`
  - `src/lib/supabaseData.ts`
- Student UI:
  - `src/features/student/StudentApp.tsx`
- Teacher UI:
  - `src/features/teacher/TeacherApp.tsx`
- Domain types:
  - `src/types/domain.ts`
- Supabase schema and seed:
  - `supabase/migrations/20260707202000_mvp_v1_schema.sql`
  - `supabase/seed.sql`
- Edge Functions:
  - `supabase/functions/start-test-attempt/index.ts`
  - `supabase/functions/save-answer/index.ts`
  - `supabase/functions/submit-test-attempt/index.ts`

## Current Known Gaps

- Clean reset replay has not been reverified after the pgTAP conversion. Next backend check should run `npx.cmd supabase db reset --local`, then `npx.cmd supabase test db --local supabase\tests`.
- Browser QA is targeted, not a full regression suite.
- Student result detail, submit confirmation, timeout auto-submit, offline/interrupted-attempt handling, and accessibility pass are still open.
- Teacher student creation/editing, password reset, class creation, result detail, and suspicious activity detail need more real backend wiring.
- Hard browser reload currently returns to the sign-in screen instead of restoring the existing Supabase auth session into `AppState`. This does not block the class-edit flow, but session restoration should be fixed before wider QA.
- Placeholder tests are not production content. They exist to exercise the data shape.
- Production Supabase setup, Edge Function deployment, GitHub Pages env wiring, and production smoke testing are not done.

## Next Recommended Task

Merge teacher `Tests` and `Assignments` into one `Resources` workflow, then plan/build Class views for assigned resources and class performance by unit/topic.

## Development Rules To Preserve

- Use `npm.cmd` and `npx.cmd` in PowerShell.
- Use local Supabase for backend/security/persistence work.
- Do not reintroduce frontend-only/demo fallback data or demo login paths before launch.
- Keep migrations as the schema source of truth.
- Keep RLS enabled on all exposed `public` tables.
- Do not authorize from user-editable metadata.
- Frontend must never receive service-role keys, hidden answers, correct answers, mark schemes, or privileged marking logic.
- Due dates are informational only unless the product owner explicitly changes that rule.
