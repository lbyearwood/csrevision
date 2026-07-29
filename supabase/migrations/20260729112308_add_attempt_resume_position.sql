alter table public.test_attempts
  add column if not exists resume_question_index integer not null default 0
  check (resume_question_index >= 0);
