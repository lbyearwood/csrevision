-- Assignments are repeatable by default. A positive attempt limit remains available
-- for a future teacher-configured policy, but existing and newly created assignments
-- do not impose one.
alter table public.test_assignments
  alter column attempt_limit drop not null,
  alter column attempt_limit drop default;

update public.test_assignments
set attempt_limit = null;
