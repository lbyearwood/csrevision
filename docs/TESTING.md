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

Supabase follow-up tests:

- Convert `supabase/tests/rls_policies.sql` from checklist comments into executable pgTAP.
- Then run `npx.cmd supabase test db --local supabase\tests`.
- Verify students cannot read other students, correct answers, mark schemes, unrelated classes, or hidden feedback.
- Verify teachers cannot access unrelated classes.
- Verify assigned-attempt reset preserves original attempts.
- Verify test version immutability triggers block edits after attempts exist.

Current database test state:

- Local Supabase stack has been verified with the MVP migration.
- `supabase/tests/rls_policies.sql` currently has no TAP plan, so the Supabase DB test command fails until the test file is implemented.
- Treat the failure as missing test implementation, not as schema failure.

Browser QA:

- Mobile student dashboard.
- Active test with watermark and event deterrents.
- Teacher dashboard at tablet/desktop widths.
- Student leaderboard privacy.
