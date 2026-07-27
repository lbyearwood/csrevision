# Database Schema

The MVP schema is defined by SQL migrations under `supabase/migrations`.

Current baseline migrations:

- `20260707202000_mvp_v1_schema.sql`
- `20260726223830_add_student_account_management.sql`
- `20260727140326_class_archive_non_class_join_codes.sql`
- `20260727142641_class_code_trigger_hardening.sql`

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
- `class_memberships` has a partial unique index on `(class_id, student_id)` where `status = 'active'`, so each student can join multiple classes but cannot have a duplicate active membership in the same class.
- `classes.join_code` is a unique six-letter code for real classes.
- `classes.accepting_students` controls whether students can join by code.
- `classes.is_system` marks teacher-owned system classes such as `Non-class`.

Student movement and archive rules:

- Each teacher has a protected active `Non-class` holding class.
- Archiving a real class sets `classes.status = archived`, ends active memberships in that class, and moves affected active students into that teacher's `Non-class` only if they have no other active real class for that teacher.
- Editing a student's class memberships through the teacher edit flow reconciles the teacher-owned membership set from checked real-class boxes; students can still hold multiple active real class memberships.
- Archiving a student sets profile/student status to `archived` and ends all active membership rows, including `Non-class`.
- Old attempts are not rewritten when a student moves class or is archived.
- Historical class reporting uses `test_attempts.class_id_at_attempt`.
- Current rosters, future assignments, and class leaderboard membership use active `class_memberships` rows.
- `Non-class` is hidden from assignment creation and cannot be archived.

Attempt integrity:

- Assigned attempts are consumed at start.
- A partial unique index prevents more than one unvoided assigned attempt per student/assignment.
- Teacher/admin reset preserves the original attempt as `voided`.
- `test_attempts.class_id_at_attempt` stores the class context at the time of the attempt and must not be overwritten by later class moves.

Published test version immutability:

- `test_versions`, `questions`, and `question_options` are protected by triggers once attempts exist for a version.
- Content changes after attempts require a new test version.
