# Database Schema

The MVP schema is defined by SQL migrations under `supabase/migrations`.

Current baseline migrations:

- `20260707202000_mvp_v1_schema.sql`
- `20260726223830_add_student_account_management.sql`

Content hierarchy:

```text
Subject -> Unit -> Topic -> Test -> Test Version -> Question
```

Stable slug and uniqueness rules:

- `subjects.slug`
- `units.subject_id + units.slug`
- `topics.unit_id + topics.slug`
- `tests.topic_id + tests.slug`
- `test_versions.test_id + version_number`

Identity constraints:

- `profiles.auth_user_id` unique
- `profiles.username` unique
- `student_profiles.student_id` unique
- `student_profiles.internal_auth_email` unique
- `class_memberships` has a partial unique index on `student_id` where `status = 'active'`, so each student can have only one active class membership.

Student movement and archive rules:

- Moving a student ends the old active membership and inserts a new active membership.
- Archiving a student sets profile/student status to `archived` and ends active membership rows.
- Old attempts are not rewritten when a student moves class or is archived.
- Historical class reporting uses `test_attempts.class_id_at_attempt`.
- Current roster, future assignments, and default class leaderboard membership use the student's active `class_memberships` row.

Attempt integrity:

- Assigned attempts are consumed at start.
- A partial unique index prevents more than one unvoided assigned attempt per student/assignment.
- Teacher/admin reset preserves the original attempt as `voided`.
- `test_attempts.class_id_at_attempt` stores the class context at the time of the attempt and must not be overwritten by later class moves.

Published test version immutability:

- `test_versions`, `questions`, and `question_options` are protected by triggers once attempts exist for a version.
- Content changes after attempts require a new test version.
