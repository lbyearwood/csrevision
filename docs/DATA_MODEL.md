# Data Model

See `DATABASE_SCHEMA.md` for implementation details.

The central model is:

```text
Subject -> Unit -> Topic -> Test -> Test Version -> Question
```

Attempts always link to the exact `test_version_id` used by the student. Results, answers, points, events, and feedback remain tied to that version.

Class membership rule:

- Current class memberships live in active `class_memberships` rows.
- A student can belong to more than one real class.
- A student cannot have two active memberships for the same class.
- Teacher student editing uses class membership checkboxes, not a single class dropdown.
- Saving those checkboxes adds missing memberships and ends unchecked teacher-owned memberships.
- Every teacher has one protected `Non-class` holding class.
- Students in `Non-class` can still use courses and practice tests while their account is active.
- Assignments are shown from every active real class membership.
- Historical class reporting uses `test_attempts.class_id_at_attempt`.
- Do not rewrite old attempts when a student changes class or joins another class.
- Class archive ends memberships for that class and moves otherwise-classless students to the teacher's `Non-class`.
- Student archive ends all memberships and makes the account non-active, but preserves attempts, answers, points, events, and audit logs.
- Class join links use `/#/join/<CODE>` and require the student to sign in before joining.
