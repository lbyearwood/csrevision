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

When UI labels, page names, or workflow names change, run a case-insensitive documentation/code sweep for the old wording before finalizing. Update Codex-facing planning files in the same task so the next agent does not preserve stale product language.

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

For Supabase/backend changes, also run the relevant local checks from `Planning/Setup/SUPABASE_SETUP.md`. Examples:

```powershell
npx.cmd supabase status
npx.cmd supabase test db --local supabase\tests
docker exec supabase_db_csrevision psql -U postgres -d postgres -c "<verification query>"
```

For UI workflows, use browser QA against seeded local accounts and local Supabase data.

For persistence workflows, save the data, navigate or reload, and prove the saved state is still present.

For Edge Functions, call the function locally with the appropriate seeded role and payload.

## Test Watchdog And Stall Recovery

Every manual, browser, service, or command test must declare a time budget before it starts. Do not wait indefinitely for a loading state, background process, network request, or command.

Default budgets:

- UI state change or browser interaction: 10 seconds.
- Local server readiness or Edge Function response: 20 seconds.
- Unit, lint, typecheck, or ordinary database command: 60 seconds.
- Build, Supabase start/reset, or intentionally slow suite: 180 seconds.

Before starting a test, identify the next observable checkpoint, such as a URL change, new DOM text, database row, HTTP response, process exit, or listening port. Poll that checkpoint at a bounded interval. Treat the test as stalled when the checkpoint is unchanged for its full budget.

When a stall is detected:

1. Stop waiting and record the elapsed time and last observed checkpoint.
2. Capture the cheapest useful evidence: DOM snapshot, URL, console output, process status, HTTP status, or database query.
3. Mark the test `Fail` when the product is stuck, or `Blocked` when the test harness/environment cannot proceed.
4. Run the test cleanup in a `finally`-style step: restore fixtures, restart stopped services, remove temporary rows, and stop only temporary processes started by the test.
5. Verify the normal app and local Supabase health before continuing.
6. Retry at most once, and only after changing the setup or identifying a concrete transient cause.

For finite shell commands, use the repository watchdog instead of an unbounded process:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\run-with-watchdog.ps1 `
  -FilePath npm.cmd `
  -Arguments "run test -- --run" `
  -TimeoutSeconds 60
```

The watchdog emits start/progress/end markers, exits with code `124` on timeout, and terminates only the process tree it started.

For browser tests, use the same rule operationally: after an action, poll the expected URL/DOM state until the budget expires. Repeated identical loading text for the full budget is a detected stall, not a reason to keep waiting.

## Standalone Sequential Test Plan

The staged regression source of truth is:

```text
Planning/Testing/csrevision-full-test-plan-checklist.html
```

Rules for this artifact:

- It is standalone documentation, not app source or build input.
- It contains 236 discrete tests in dependency-aware execution order.
- It is read-only for the user; only Codex updates status/evidence by editing the HTML file.
- Do not add browser-side editing controls, filters, search, or internal scrollbars back into the artifact.
- When the user asks for a stage, run only that stage in displayed order.
- Update each test with `Pass`, `Fail`, or `Blocked` plus concise evidence immediately after verification.
- Do not fix app code during a staged run unless the user explicitly asks to fix the failures. Record failures first.
- Apply the watchdog budgets above to every staged test. A detected stall receives a result and cleanup immediately; it must not hold up the rest of the stage.
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

Those belong to `Planning/Process/CODEX_END_PROCESS.md` and only happen when the user explicitly says `end`, asks to commit, or asks to push.
