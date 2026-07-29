alter table public.tests
  add column marking_method text not null default 'auto_marked'
  check (marking_method in ('auto_marked', 'ai_reviewed', 'self_marked', 'teacher_marked'));
