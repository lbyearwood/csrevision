-- Repair pre-existing non-archived assignments before enforcing the invariant.
-- Keeping the assignment and granting its course is the least destructive repair.
insert into public.class_courses (class_id, subject_id)
select distinct assignment.class_id, unit.subject_id
from public.test_assignments as assignment
join public.test_versions as version on version.id = assignment.test_version_id
join public.tests as test on test.id = version.test_id
join public.topics as topic on topic.id = test.topic_id
join public.units as unit on unit.id = topic.unit_id
where assignment.status <> 'archived'
on conflict (class_id, subject_id) do nothing;

create index if not exists test_assignments_active_class_version_idx
on public.test_assignments (class_id, test_version_id)
where status <> 'archived';

create or replace function app_private.require_assignment_course_entitlement()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  assignment_subject_id uuid;
begin
  if new.status = 'archived' then
    return new;
  end if;

  select unit.subject_id
  into assignment_subject_id
  from public.test_versions as version
  join public.tests as test on test.id = version.test_id
  join public.topics as topic on topic.id = test.topic_id
  join public.units as unit on unit.id = topic.unit_id
  where version.id = new.test_version_id;

  if assignment_subject_id is null or not exists (
    select 1
    from public.class_courses as entitlement
    where entitlement.class_id = new.class_id
      and entitlement.subject_id = assignment_subject_id
  ) then
    raise exception using
      errcode = '23514',
      message = 'Cannot assign a test from a course that is not assigned to the class.',
      constraint = 'test_assignments_require_class_course';
  end if;

  return new;
end
$$;

create or replace function app_private.prevent_removing_course_with_assignments()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.test_assignments as assignment
    join public.test_versions as version on version.id = assignment.test_version_id
    join public.tests as test on test.id = version.test_id
    join public.topics as topic on topic.id = test.topic_id
    join public.units as unit on unit.id = topic.unit_id
    where assignment.class_id = old.class_id
      and assignment.status <> 'archived'
      and unit.subject_id = old.subject_id
  ) then
    raise exception using
      errcode = '23514',
      message = 'Cannot remove this course while the class has active assignments for it. Archive or delete those assignments first.',
      constraint = 'class_courses_required_by_assignments';
  end if;

  return old;
end
$$;

drop trigger if exists test_assignments_require_class_course on public.test_assignments;

create trigger test_assignments_require_class_course
before insert or update of class_id, test_version_id, status
on public.test_assignments
for each row execute function app_private.require_assignment_course_entitlement();

drop trigger if exists class_courses_prevent_required_removal on public.class_courses;

create trigger class_courses_prevent_required_removal
before delete on public.class_courses
for each row execute function app_private.prevent_removing_course_with_assignments();

revoke all on function app_private.require_assignment_course_entitlement() from public;
revoke all on function app_private.prevent_removing_course_with_assignments() from public;
grant execute on function app_private.require_assignment_course_entitlement() to service_role;
grant execute on function app_private.prevent_removing_course_with_assignments() to service_role;
