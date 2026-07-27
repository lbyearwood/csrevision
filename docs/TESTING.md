# Testing

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

Browser QA:

- Mobile student dashboard.
- Active test with watermark and event deterrents.
- Teacher dashboard at tablet/desktop widths.
- Student leaderboard privacy.
- Teacher class details edit/save/re-sign-in persistence.
- Teacher student edit panel renders active roster, name inputs, class membership checkboxes, status dropdown, password actions, and archive action with no console errors.
- Targeted student-account QA covered multi-class membership save, unchecked-membership removal, Non-class fallback, inactive login block, manual password login, generated 8-character password, and archive-style delete. Restore seed roster after destructive archive QA.
- Targeted class-code QA covered protected `Non-class` archive rejection, class-code regeneration, accepting-off join rejection, accepting-on join success, idempotent repeat join, and reset of the seeded accepting flag.
- Targeted archive QA covered a temporary classless student being moved to the teacher's `Non-class`; temporary rows were cleaned up afterwards.
