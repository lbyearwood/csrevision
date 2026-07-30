# Testing

Last updated: 2026-07-30

Audience: Codex agents. Keep this file as executable verification state, not user-facing explanation.

## Per-Development QA Rule

Functional work is not complete until the changed workflow has been tested successfully.

Use automated checks and targeted manual/browser/backend QA together:

- Static checks confirm code quality: typecheck, lint, unit tests, and build.
- Behaviour checks confirm the feature works: browser QA, Edge Function calls, database/RLS tests, or direct local Supabase verification.
- Test against local Supabase data until launch. Do not use frontend-only/demo assumptions.
- Record the exact checks and result in the task response. Also update `docs/HANDOVER.md` when the project state materially changes or when the user asks to end development.
- If a workflow cannot be tested, do not mark it complete. Mark it blocked or partially verified and explain the missing check.

See `docs/CODEX_DEVELOPMENT_PROCESS.md` for the required per-task development QA process.

## Standalone Sequential Regression Plan

Source of truth:

```text
docs/planning/csrevision-full-test-plan-checklist.html
```

Current rules:

- The artifact contains 236 individually numbered tests in the exact intended execution order.
- The page is read-only for the user. Codex updates statuses/evidence by editing the HTML artifact.
- No page filters, search controls, editable checkboxes, editable notes, or internal table scrollbars should be reintroduced.
- Run only the requested stage. Do not skip ahead.
- Update every completed test row with `Pass`, `Fail`, or `Blocked` and concise evidence.

Current staged status:

```text
Stage 1: complete after reset/reseed and fixture fixes.
Stage 2: complete.
Stage 3: fixed after user approval.
Stage 4: 37 pass, 1 blocked, 0 fail as of 2026-07-30.
Stage 5: next stage to run when user asks.
```

Stage 4 blocker:

```text
Test 94: PDF download button clicked with no console errors, but the in-app browser did not expose the downloaded PDF file for visual inspection.
```

## Local Checks

Local checks:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

Unit tests cover:

- Username sanitization.
- Synthetic student email format.
- Username suggestions.
- Public Student ID generation.
- Leaderboard privacy.
- Archived student exclusion from rebuilt leaderboards.
- Points/status rules.
- Server-side marking helper behavior.

Supabase database tests:

- Run `npx.cmd supabase test db --local supabase\tests`.
- Verify students cannot read other students, correct answers, mark schemes, unrelated classes, or hidden feedback.
- Verify teachers can update owned classes and cannot access or update unrelated classes.
- Verify teachers cannot directly update student profile rows or directly move students into another teacher's class through RLS.
- Verify students can have multiple active class memberships and cannot duplicate an active membership in the same class.
- Verify assigned-attempt reset preserves original attempts.
- Verify test version immutability triggers block edits after attempts exist.

Current database test state:

- Local Supabase stack has been verified with the MVP migration.
- `supabase/tests/rls_policies.sql` is executable pgTAP.
- Latest local result: 29 passing RLS/integrity tests.

Bulk QA fixture verification on 2026-07-30:

```text
active_students=250
active_real_classes=10
test_assignments=94
test_attempts=3142
assignment_recipients=51
bulk_seed_audits=1
```

Targeted fixture checks:

- `qa10acomputing07` has no current OCR learning gaps in the bulk fixture.
- `qa10acomputing12` has a completed open selected-recipient assignment for `1.11 IDEs test 1`; it is excluded from outstanding My assignments.
- `qa10acomputing07` has a past-due outstanding selected-recipient assignment for `1.5 Procedures and functions test 1`; due dates remain planning metadata and do not block access.

Browser QA:

- Mobile student dashboard.
- Active test with watermark and event deterrents.
- Teacher dashboard at tablet/desktop widths.
- Student leaderboard privacy.
- Teacher Assignments `Active Assignments` and `Expired Assignments` render as separate tabs with shared class/course/unit/topic filters, columns ordered Date created -> Class -> Topic -> Assignment deadline, Active containing current/no-deadline rows, and Expired showing only past-deadline rows or its empty state.
- Teacher class details edit/save/re-sign-in persistence.
- Teacher student edit panel renders active roster, name inputs, class membership checkboxes, status dropdown, password actions, and archive action with no console errors.
- Targeted student-account QA covered multi-class membership save, unchecked-membership removal, Non-class fallback, inactive login block, manual password login, generated 8-character password, and archive-style delete. Restore seed roster after destructive archive QA.
- Targeted class-code QA covered protected `Non-class` archive rejection, class-code regeneration, accepting-off join rejection, accepting-on join success, idempotent repeat join, and reset of the seeded accepting flag.
- Targeted archive QA covered a temporary classless student being moved to the teacher's `Non-class`; temporary rows were cleaned up afterwards.
- Stage 4 student QA on 2026-07-30 covered Home no-learning-gaps, Practice course/unit/topic drilldown, topic test naming, no hidden future-resource buttons, test start/resume/reload, keyboard answer selection, unanswered-submit warning, completed summary/review, My Results points column, Profile class-code join validation, and class/all-time leaderboards. Temporary QA attempts and temporary class-code membership were cleaned up.
