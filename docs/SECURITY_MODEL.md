# Security Model

GitHub Pages serves the interface only. Supabase is authoritative for authentication, permissions, marking, attempts, points, audit logs, and protected actions.

Core rules:

- Students cannot self-register.
- Student usernames are private login identifiers.
- Student-facing leaderboards use first initial, surname, and public Student ID.
- Students never receive correct answers, `is_correct`, mark schemes, teacher notes, model answers, or marking prompts.
- `auth.admin.createUser` and service-role operations run only in Edge Functions.
- Student password reset, class movement, status changes, and archive-style delete run only in Edge Functions.
- Edge Functions verify the authenticated caller and data access before using the service-role client.
- Authorization comes from database records, not user-editable metadata.

Screenshot wording:

> The platform deters copying, printing and screenshot-based sharing through watermarking, randomised questions, shuffled answers, timers and activity logging. It cannot fully prevent external screenshots or photographs.
