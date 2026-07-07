# Data Model

See `DATABASE_SCHEMA.md` for implementation details.

The central model is:

```text
Subject -> Unit -> Topic -> Test -> Test Version -> Question
```

Attempts always link to the exact `test_version_id` used by the student. Results, answers, points, events, and feedback remain tied to that version.
