alter table public.test_assignments
  add column assigned_by_name text not null default 'Teacher';

update public.test_assignments assignment
set assigned_by_name = profile.display_name
from public.profiles profile
where profile.id = assignment.assigned_by;
