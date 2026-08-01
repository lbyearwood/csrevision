# RLS Policies

Every exposed public table has RLS enabled.

Student access:

- Own profile and student profile.
- Own class membership.
- Published content metadata.
- Own attempts and released answers.
- Own points and leaderboard rows configured for their class.

Teacher access:

- Own profile.
- Classes they own.
- Students, attempts, answers, events, and reports for owned classes.
- Direct writes to student profiles and class moves are not allowed through client RLS paths; they must go through audited Edge Functions.

Admin access:

- All application data through audited admin surfaces and privileged functions.

Protected data:

- Students cannot directly read `questions` or `question_options`.
- Correct answers, mark schemes, model answers, accepted keywords, teacher notes, and `is_correct` are staff/server-only.

RLS test checklist is in `supabase/tests/rls_policies.sql`.
