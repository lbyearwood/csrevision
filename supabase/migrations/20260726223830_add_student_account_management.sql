alter table public.class_memberships
  drop constraint if exists class_memberships_one_active;

create unique index if not exists class_memberships_one_active_student
  on public.class_memberships (student_id)
  where status = 'active';
