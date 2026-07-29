-- Timers are temporarily disabled throughout the student assessment flow.
update public.tests
set default_time_limit_seconds = null;

update public.test_assignments
set time_limit_seconds = null;

update public.test_attempts
set
  time_limit_seconds = null,
  expires_at = null
where status = 'in_progress';
