alter table public.student_profiles
  add column initial_year_group smallint,
  add column joined_on date;

update public.student_profiles
set joined_on = created_at::date
where joined_on is null;

update public.student_profiles as student
set initial_year_group = nullif(regexp_replace(class.year_group, '\D', '', 'g'), '')::smallint
from public.class_memberships as membership
join public.classes as class on class.id = membership.class_id
where membership.student_id = student.id
  and membership.status = 'active'
  and student.initial_year_group is null;

alter table public.student_profiles
  alter column joined_on set default current_date,
  alter column joined_on set not null;
