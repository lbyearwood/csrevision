# Testing

Audience: Codex agents. Keep this file as executable verification state, not user-facing explanation.

Local checks:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Unit tests cover:

- Username sanitization.
- Synthetic student email format.
- Username suggestions.
- Public Student ID generation.
- Leaderboard privacy.
- Points/status rules.
- Server-side marking helper behavior.

Supabase database tests:

- Run `npx.cmd supabase test db --local supabase\tests`.
- Verify students cannot read other students, correct answers, mark schemes, unrelated classes, or hidden feedback.
- Verify teachers can update owned classes and cannot access or update unrelated classes.
- Verify assigned-attempt reset preserves original attempts.
- Verify test version immutability triggers block edits after attempts exist.

Current database test state:

- Local Supabase stack has been verified with the MVP migration.
- `supabase/tests/rls_policies.sql` is executable pgTAP.
- Latest local result: 25 passing RLS/integrity tests.

Browser QA:

- Mobile student dashboard.
- Active test with watermark and event deterrents.
- Teacher dashboard at tablet/desktop widths.
- Student leaderboard privacy.
- Teacher class details edit/save/re-sign-in persistence.
