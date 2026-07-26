# Supabase Local Runbook For Codex

Last updated: 2026-07-26

Audience: Codex agents. The user does not plan to read this. Keep updates direct, stateful, and executable.

## Operating Rules

- Treat Git-tracked SQL migrations as the schema source of truth.
- Do not rely on dashboard-only table edits. If a schema change matters, capture it in `supabase/migrations`.
- Use the local Supabase stack before production Supabase work.
- Use `npx.cmd supabase ...` on Windows PowerShell. `npx.ps1` can be blocked by execution policy.
- Before unfamiliar Supabase CLI commands, run the relevant `--help` command.
- Do not expose `service_role`, secret keys, AI keys, hidden mark schemes, or correct-answer data in frontend code or Vite env files.
- RLS must stay enabled on every table in the exposed `public` schema.
- Do not run destructive remote Supabase commands without explicit user approval.

## Dependency Requirement

- Local Supabase requires Docker Desktop with Linux containers / WSL 2 enabled.
- Every development computer needs local Supabase until launch.
- The app no longer supports frontend-only/demo fallback data or demo login when `.env.local` is absent.
- Fresh-machine setup steps live in `docs/DEVELOPMENT_SETUP.md`.

## Verified Local Tooling

- Docker Desktop installed and running.
- Docker context: `desktop-linux`.
- Docker Engine: `29.6.2`.
- Docker Compose: `v5.3.1`.
- Local Supabase CLI is pinned in `package.json` as dev dependency `supabase@2.109.1`.
- Use project-local CLI: `npx.cmd supabase`.

## Verified Local Supabase State

- Local Supabase has started successfully on this machine.
- Studio: `http://127.0.0.1:54323`
- API: `http://127.0.0.1:54321`
- Functions: `http://127.0.0.1:54321/functions/v1`
- Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- Inbucket: `http://127.0.0.1:54324`
- Migration history contains `20260707202000`.
- The MVP migration creates 23 `public` tables.
- RLS is enabled on all 23 `public` tables.
- There are 29 `public` RLS policies.
- `.env.local` exists with frontend-safe local URL and publishable key. It is ignored by Git.
- `supabase/seed.sql` exists and has been applied successfully.
- `scripts/generate-placeholder-resources.mjs` generates the current placeholder OCR topic map into `supabase/seed.sql`.
- Seeded Auth sign-in verified for teacher and student through `@supabase/supabase-js`.
- Seeded teacher/student sessions can read the published OCR GCSE Computer Science course through RLS.
- Frontend sign-in helpers now load role/display name from `public.profiles` after Supabase Auth succeeds.
- Local `start-test-attempt` was verified through Edge Runtime for an assigned assessment.
- A past-due assigned assessment was verified to start successfully. Due dates are metadata only.
- Local database pgTAP tests pass: `npx.cmd supabase test db --local supabase\tests` runs 22 RLS/integrity checks successfully.

## Current Known Issue

- `supabase_edge_runtime_csrevision` can stop while the API, DB, and Studio remain healthy.
- When this happens, assignment start buttons can show `Edge Function returned a non-2xx status code`; direct function output can include `{"message":"name resolution failed"}`.
- `npx.cmd supabase status` should include `FUNCTIONS_URL`. If it does not, run `docker start supabase_edge_runtime_csrevision`.
- `supabase_vector_csrevision` can restart repeatedly because the Vector log collector cannot reach Docker logs.
- Core services were still usable when this was observed: API, Studio, DB, Auth, and Inbucket.
- Next Codex action: decide whether to disable/exclude the Vector service locally or fix Docker log access.

## Commands

Install dependencies:

```powershell
npm.cmd install
```

Check CLI version:

```powershell
npx.cmd supabase --version
```

Start local stack:

```powershell
npx.cmd supabase start
```

Check local stack:

```powershell
npx.cmd supabase status -o json
```

Check Edge Runtime specifically:

```powershell
docker ps --format "{{.Names}}`t{{.Status}}" | Select-String -Pattern "supabase_edge_runtime_csrevision"
```

Start Edge Runtime if stopped:

```powershell
docker start supabase_edge_runtime_csrevision
```

Stop local stack:

```powershell
npx.cmd supabase stop
```

Reset local database from migrations and seed:

```powershell
npx.cmd supabase db reset --local
```

List migrations:

```powershell
npx.cmd supabase migration list --local
```

Run database tests:

```powershell
npx.cmd supabase test db --local supabase\tests
```

Apply the local seed without resetting the database:

```powershell
docker cp supabase\seed.sql supabase_db_csrevision:/tmp/csrevision_seed.sql
docker exec supabase_db_csrevision psql -v ON_ERROR_STOP=1 -U postgres -d postgres -f /tmp/csrevision_seed.sql
```

Do not use `npx.cmd supabase db query --local --file supabase\seed.sql` for this file. With CLI `2.109.1`, it currently treats the file as a prepared statement and rejects multi-statement SQL.

## Database Tests

- `supabase/tests/rls_policies.sql` is executable pgTAP.
- The suite seeds throwaway rows inside a transaction and rolls them back.
- Current coverage:
  - student self-profile access
  - student isolation from other students' profiles, attempts, answers, and unrelated classes
  - student denial from staff-only questions and question options
  - teacher access to owned class/student/question data
  - teacher denial from another teacher's class, student, attempt, and answer data
  - anon denial from private student data
  - one unvoided assigned attempt per student/assignment
  - immutability for attempted test versions, questions, and question options
- Latest result on 2026-07-26: 22 tests passed.
- `grant_pg_cron_access` / `grant_pg_net_access` warnings can appear because the test transaction grants pgTAP function execution broadly to local roles. They did not fail the suite.

## Current Schema Snapshot

The local MVP migration currently creates these `public` tables:

```text
answer_display_orders
assigned_attempt_resets
attempt_events
audit_logs
class_memberships
classes
leaderboard_snapshots
points_transactions
profiles
question_options
questions
site_settings
status_levels
student_answers
student_profiles
subjects
teacher_profiles
test_assignments
test_attempts
test_versions
tests
topics
units
```

## Local Seed Accounts

Use only for local development.

```text
Teacher email: j.doe@school.example
Student usernames:
  asingh5827
  rmehta4120
  dpatel9144
  vkumar3021
  mkhan7712
Password for all seeded accounts: Localdev1!
```

Student Auth emails are synthetic internal emails using `@students.local`; the student UI should still ask for username, not email.

## Verified Seed Counts

```text
auth_users=6
profiles=6
students=5
classes=2
subjects=1
units=8
topics=41
tests=41
versions=41
questions=205
options=820
assignments=1
leaderboard_rows=5
```

## Next Backend Tasks

- Confirm `supabase db reset --local` replays `supabase/seed.sql` cleanly from scratch.
- Exercise Edge Functions locally against the local Supabase stack.
- Expand database/Edge Function tests for answer save, submit, attempt event logging, reset-assigned-attempt, and student account management.

## Official Reference URLs

- Supabase local development CLI guide: `https://supabase.com/docs/guides/local-development/cli/getting-started`
- Supabase CLI workflows: `https://supabase.com/docs/guides/deployment/managing-environments`
- Supabase CLI reference: `https://supabase.com/docs/reference/cli/introduction`
