# Edge Functions

MVP functions:

- `create-student-account`
- `suggest-usernames`
- `reset-student-password`
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
