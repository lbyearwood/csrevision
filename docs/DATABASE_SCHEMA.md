# Database Schema

The MVP schema is defined in `supabase/migrations/20260707202000_mvp_v1_schema.sql`.

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

Attempt integrity:

- Assigned attempts are consumed at start.
- A partial unique index prevents more than one unvoided assigned attempt per student/assignment.
- Teacher/admin reset preserves the original attempt as `voided`.

Published test version immutability:

- `test_versions`, `questions`, and `question_options` are protected by triggers once attempts exist for a version.
- Content changes after attempts require a new test version.
