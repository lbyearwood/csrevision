# Testing

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

- Run RLS cases from `supabase/tests/rls_policies.sql`.
- Verify students cannot read other students, correct answers, mark schemes, unrelated classes, or hidden feedback.
- Verify teachers cannot access unrelated classes.
- Verify assigned-attempt reset preserves original attempts.
- Verify test version immutability triggers block edits after attempts exist.

Browser QA:

- Mobile student dashboard.
- Active test with watermark and event deterrents.
- Teacher dashboard at tablet/desktop widths.
- Student leaderboard privacy.
