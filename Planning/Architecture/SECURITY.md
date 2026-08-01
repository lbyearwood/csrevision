# Security

This file mirrors the MVP security guardrails for quick review.

- No service-role key in frontend code or committed files.
- No student self-registration.
- No student access to answer keys or mark schemes.
- RLS enabled on exposed tables.
- Edge Functions verify caller and permissions before privileged actions.
- Public leaderboard identity is first initial + surname + public Student ID.
- Points are immutable transactions, not only an editable total.
- Audit logs record teacher/admin/system actions.

Detailed model: `SECURITY_MODEL.md`.
