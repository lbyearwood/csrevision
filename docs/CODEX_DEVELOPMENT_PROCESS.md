# Codex Development Process

Last updated: 2026-07-27

Audience: every Codex agent making product, code, Supabase, or documentation changes in this repository. The user does not plan to read this.

Use this after each development task or meaningful implementation step. This is not the end-of-day process.

## Required Development QA Gate

Do not say functional work is complete until the changed workflow has been tested in the way a real user or backend caller will use it.

Static checks are required, but they are not enough for behaviour changes:

- `typecheck`, `lint`, unit tests, and `build` prove the code shape.
- Browser QA, Edge Function calls, database/RLS checks, or persistence checks prove the feature works.

Use local Supabase for all functional QA until launch. Do not verify against frontend-only/demo assumptions.

## What To Run

For frontend or shared TypeScript changes, run the relevant subset of:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

For docs-only changes, run:

```powershell
git diff --check
```

For Supabase/backend changes, also run the relevant local checks from `docs/SUPABASE_SETUP.md`. Examples:

```powershell
npx.cmd supabase status
npx.cmd supabase test db --local supabase\tests
docker exec supabase_db_csrevision psql -U postgres -d postgres -c "<verification query>"
```

For UI workflows, use browser QA against seeded local accounts and local Supabase data.

For persistence workflows, save the data, navigate or reload, and prove the saved state is still present.

For Edge Functions, call the function locally with the appropriate seeded role and payload.

## Reporting

At the end of each development task, report:

- what changed
- what workflow was tested
- what commands/checks ran and whether they passed
- anything not tested or still risky

If the relevant functional QA cannot be run, do not mark the task complete. Say it is blocked or partially verified and explain the missing check.

## What This Is Not

This process does not automatically mean:

- write the full handover
- commit
- push
- end development for the day

Those belong to `docs/CODEX_END_PROCESS.md` and only happen when the user explicitly says `end`, asks to commit, or asks to push.
