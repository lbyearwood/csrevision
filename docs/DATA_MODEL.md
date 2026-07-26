# Data Model

See `DATABASE_SCHEMA.md` for implementation details.

The central model is:

```text
Subject -> Unit -> Topic -> Test -> Test Version -> Question
```

Attempts always link to the exact `test_version_id` used by the student. Results, answers, points, events, and feedback remain tied to that version.

Class movement rule:

- Current class membership lives in the active `class_memberships` row.
- Historical class reporting uses `test_attempts.class_id_at_attempt`.
- Do not rewrite old attempts when a student changes class.
- Archive-style delete hides the student from active rosters/leaderboards but preserves attempts, answers, points, events, and audit logs.
