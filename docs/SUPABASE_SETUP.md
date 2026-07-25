# Supabase Local Runbook For Codex

Last updated: 2026-07-25

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
- Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- Inbucket: `http://127.0.0.1:54324`
- Migration history contains `20260707202000`.
- The MVP migration creates 23 `public` tables.
- RLS is enabled on all 23 `public` tables.
- There are 29 `public` RLS policies.
- `.env.local` exists with frontend-safe local URL and publishable key. It is ignored by Git.
- `supabase/seed.sql` exists and has been applied successfully.
- Seeded Auth sign-in verified for teacher and student through `@supabase/supabase-js`.
- Seeded teacher/student sessions can read the published OCR GCSE Computer Science course through RLS.
- Frontend sign-in helpers now load role/display name from `public.profiles` after Supabase Auth succeeds.

## Current Known Issue

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

## Current Database Test Caveat

- `supabase/tests/rls_policies.sql` is currently a checklist/comment file, not executable pgTAP.
- `npx.cmd supabase test db --local supabase\tests` fails until that file is converted to a real TAP-producing test.
- Treat that failure as a test-suite implementation gap, not evidence that migrations failed.

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
units=2
topics=3
tests=2
versions=2
questions=8
options=20
assignments=1
leaderboard_rows=5
```

## Next Backend Tasks

- Confirm `supabase db reset --local` replays `supabase/seed.sql` cleanly from scratch.
- Convert `supabase/tests/rls_policies.sql` to executable pgTAP.
- Verify student isolation, teacher ownership boundaries, hidden-answer protection, and assigned-attempt enforcement.
- Exercise Edge Functions locally against the local Supabase stack.

## Official Reference URLs

- Supabase local development CLI guide: `https://supabase.com/docs/guides/local-development/cli/getting-started`
- Supabase CLI workflows: `https://supabase.com/docs/guides/deployment/managing-environments`
- Supabase CLI reference: `https://supabase.com/docs/reference/cli/introduction`
