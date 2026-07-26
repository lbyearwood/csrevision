# Testing

Audience: Codex agents. Keep this file as executable verification state, not user-facing explanation.

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
- Verify one active class membership per student.
- Verify assigned-attempt reset preserves original attempts.
- Verify test version immutability triggers block edits after attempts exist.

Current database test state:

- Local Supabase stack has been verified with the MVP migration.
- `supabase/tests/rls_policies.sql` is executable pgTAP.
- Latest local result: 28 passing RLS/integrity tests.

Browser QA:

- Mobile student dashboard.
- Active test with watermark and event deterrents.
- Teacher dashboard at tablet/desktop widths.
- Student leaderboard privacy.
- Teacher class details edit/save/re-sign-in persistence.
- Teacher student edit panel renders active roster, name inputs, active-class dropdown, status dropdown, password actions, and archive action with no console errors.
- Targeted student-account QA covered class move, inactive login block, manual password login, generated 8-character password, and archive-style delete. Restore seed roster after destructive archive QA.
