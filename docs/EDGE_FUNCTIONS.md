# Edge Functions

MVP functions:

- `create-student-account`
- `suggest-usernames`
- `reset-student-password`
- `update-student-account`
- `start-test-attempt`
- `save-answer`
- `submit-test-attempt`
- `log-attempt-event`
- `reset-assigned-attempt`

Function rules:

- Require JWT verification.
- Resolve the authenticated Supabase user.
- Load the controlled `profiles` row.
- Check role and class/student access before privileged work.
- Use the service-role client only after permission checks.
- Never return hidden answer keys, mark schemes, or teacher-only data to students.

`start-test-attempt` returns only student-safe payloads:

- question ID
- question text
- question type
- student-safe options
- mark value
- display order
- permitted media reference

Assignment due dates are informational metadata only. `start-test-attempt` must validate assignment status, class membership, start time, and one-attempt/resume rules, but it must not reject a start because `due_at` has passed.

`submit-test-attempt` performs marking server-side and records points/status effects.

Student account management:

- `reset-student-password` must use Supabase Auth Admin from the Edge Function only.
- `reset-student-password` accepts a manual password with at least 8 characters or returns an exact 8-character generated temporary password.
- `update-student-account` must verify staff role and teacher access to the student before using the service-role client for profile/student/membership writes.
- `update-student-account` must verify the target class is active and owned by the requester unless the requester is admin.
- `update-student-account` archives students instead of hard-deleting them: set profile/student status to `archived`, end active membership, keep attempts/answers/points/events/audit logs.
- Required audit actions: `student_updated`, `student_class_changed`, `student_status_changed`, `student_archived`, `student_password_reset`.
