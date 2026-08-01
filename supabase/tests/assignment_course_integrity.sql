begin;

create extension if not exists pgtap with schema extensions;

select plan(8);

select ok(
  exists (
    select 1 from pg_trigger
    where tgrelid = 'public.test_assignments'::regclass
      and tgname = 'test_assignments_require_class_course'
      and not tgisinternal
  ),
  'assignments have a course-entitlement trigger'
);

select ok(
  exists (
    select 1 from pg_trigger
    where tgrelid = 'public.class_courses'::regclass
      and tgname = 'class_courses_prevent_required_removal'
      and not tgisinternal
  ),
  'class courses have a required-course removal trigger'
);

select is(
  (
    select count(*)::integer
    from public.test_assignments as assignment
    join public.test_versions as version on version.id = assignment.test_version_id
    join public.tests as test on test.id = version.test_id
    join public.topics as topic on topic.id = test.topic_id
    join public.units as unit on unit.id = topic.unit_id
    where assignment.status <> 'archived'
      and not exists (
        select 1 from public.class_courses as entitlement
        where entitlement.class_id = assignment.class_id
          and entitlement.subject_id = unit.subject_id
      )
  ),
  0,
  'every active assignment belongs to a course assigned to its class'
);

select ok(
  exists (
    select 1 from public.class_courses
    where class_id = '40000000-0000-4000-8000-000000000001'
      and subject_id = '50000000-0000-4000-8000-000000000001'
  ),
  'the seeded 8A class has the OCR course required by its assignment'
);

insert into public.classes (
  id, slug, class_name, academic_year, year_group, owner_teacher_id, status, accepting_students
)
values (
  '40000000-0000-4000-8000-000000000099',
  'integrity-test-class',
  'Integrity test class',
  '2026/27',
  '8',
  '20000000-0000-4000-8000-000000000001',
  'active',
  false
);

select throws_ok(
  $$
    insert into public.test_assignments (id, test_version_id, assigned_by, class_id, status)
    select
      '57000000-0000-4000-8000-000000000099',
      assignment.test_version_id,
      assignment.assigned_by,
      '40000000-0000-4000-8000-000000000099',
      'open'
    from public.test_assignments as assignment
    where assignment.id = '57000000-0000-4000-8000-000000000001'
  $$,
  '23514'::char(5),
  'Cannot assign a test from a course that is not assigned to the class.',
  'an active assignment cannot be created without its class course'
);

select throws_ok(
  $$
    delete from public.class_courses
    where class_id = '40000000-0000-4000-8000-000000000001'
      and subject_id = '50000000-0000-4000-8000-000000000001'
  $$,
  '23514'::char(5),
  'Cannot remove this course while the class has active assignments for it. Archive or delete those assignments first.',
  'a course required by an active assignment cannot be removed'
);

insert into public.class_courses (class_id, subject_id)
values (
  '40000000-0000-4000-8000-000000000099',
  '50000000-0000-4000-8000-000000000001'
);

insert into public.test_assignments (id, test_version_id, assigned_by, class_id, status)
select
  '57000000-0000-4000-8000-000000000099',
  assignment.test_version_id,
  assignment.assigned_by,
  '40000000-0000-4000-8000-000000000099',
  'open'
from public.test_assignments as assignment
where assignment.id = '57000000-0000-4000-8000-000000000001';

update public.test_assignments
set status = 'archived'
where id = '57000000-0000-4000-8000-000000000099';

select lives_ok(
  $$
    delete from public.class_courses
    where class_id = '40000000-0000-4000-8000-000000000099'
      and subject_id = '50000000-0000-4000-8000-000000000001'
  $$,
  'a course can be removed after its assignments are archived'
);

select throws_ok(
  $$
    update public.test_assignments
    set status = 'open'
    where id = '57000000-0000-4000-8000-000000000099'
  $$,
  '23514'::char(5),
  'Cannot assign a test from a course that is not assigned to the class.',
  'an archived assignment cannot be reopened after its course is removed'
);

select * from finish();

rollback;
