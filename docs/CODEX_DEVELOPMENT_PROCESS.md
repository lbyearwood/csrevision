# Codex Development Process

Last updated: 2026-07-30

Audience: every Codex agent making product, code, Supabase, or documentation changes in this repository. The user does not plan to read this.

Use this after each development task or meaningful implementation step. This is not the end-of-day process.

## Required Development QA Gate

Do not say functional work is complete until the changed workflow has been tested in the way a real user or backend caller will use it.

Static checks are required, but they are not enough for behaviour changes:

- `typecheck`, `lint`, unit tests, and `build` prove the code shape.
- Browser QA, Edge Function calls, database/RLS checks, or persistence checks prove the feature works.

Use local Supabase for all functional QA until launch. Do not verify against frontend-only/demo assumptions.

When UI labels, page names, or workflow names change, run a case-insensitive docs/code sweep for the old wording before finalizing. Update Codex-facing docs in the same task so the next agent does not preserve stale product language.

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

## Standalone Sequential Test Plan

The staged regression source of truth is:

```text
docs/planning/csrevision-full-test-plan-checklist.html
```

Rules for this artifact:

- It is standalone documentation, not app source or build input.
- It contains 236 discrete tests in dependency-aware execution order.
- It is read-only for the user; only Codex updates status/evidence by editing the HTML file.
- Do not add browser-side editing controls, filters, search, or internal scrollbars back into the artifact.
- When the user asks for a stage, run only that stage in displayed order.
- Update each test with `Pass`, `Fail`, or `Blocked` plus concise evidence immediately after verification.
- Do not fix app code during a staged run unless the user explicitly asks to fix the failures. Record failures first.
- Latest recorded Stage 4 state on 2026-07-30: 37 pass, 1 blocked, 0 fail. The remaining blocked test is PDF file inspection after download because the in-app browser did not expose the downloaded file.

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
