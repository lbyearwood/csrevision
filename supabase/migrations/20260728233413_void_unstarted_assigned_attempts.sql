-- Seeded "not started" rows represent no work having begun. They must not occupy
-- the one live assignment-attempt slot or block a student from starting the test.
update public.test_attempts
set
  status = 'voided',
  voided_at = now(),
  updated_at = now()
where attempt_type = 'assigned'
  and status = 'not_started'
  and voided_at is null;
