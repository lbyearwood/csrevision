begin;

create extension if not exists pgtap with schema extensions;

grant usage on schema extensions to authenticated, anon;
grant execute on all functions in schema extensions to authenticated, anon;

select plan(25);

create temp table rls_test_refs as
select
  t.id as test_id,
  tv.id as test_version_id,
  q.id as question_id,
  qo.id as question_option_id,
  a.id as assignment_id,
  a.class_id as assignment_class_id
from public.test_assignments a
join public.test_versions tv on tv.id = a.test_version_id
join public.tests t on t.id = tv.test_id
join public.questions q on q.test_version_id = tv.id
join public.question_options qo on qo.question_id = q.id
where q.question_order = 1
  and qo.option_order = 1
limit 1;

insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
values
  (
    '00000000-0000-4000-8000-000000000201',
    'authenticated',
    'authenticated',
    'outside.teacher@rls.local',
    extensions.crypt('Localdev1!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"app_role":"teacher"}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  ),
  (
    '00000000-0000-4000-8000-000000000202',
    'authenticated',
    'authenticated',
    'outside.student@rls.local',
    extensions.crypt('Localdev1!', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"app_role":"student"}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  );

insert into public.profiles (id, auth_user_id, role, display_name, username, account_status)
values
  (
    '10000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000201',
    'teacher',
    'Outside Teacher',
    null,
    'active'
  ),
  (
    '10000000-0000-4000-8000-000000000202',
    '00000000-0000-4000-8000-000000000202',
    'student',
    'Outside Student',
    'outsider202',
    'active'
  );

insert into public.teacher_profiles (id, profile_id, email)
values (
  '20000000-0000-4000-8000-000000000201',
  '10000000-0000-4000-8000-000000000201',
  'outside.teacher@rls.local'
);

insert into public.student_profiles (
  id,
  profile_id,
  first_name,
  surname,
  student_id,
  internal_auth_email,
  account_status,
  created_by
)
values (
  '30000000-0000-4000-8000-000000000202',
  '10000000-0000-4000-8000-000000000202',
  'Outside',
  'Student',
  '9202',
  'outside.student@rls.local',
  'active',
  '10000000-0000-4000-8000-000000000201'
);

insert into public.classes (id, slug, class_name, academic_year, year_group, owner_teacher_id, status)
values (
  '40000000-0000-4000-8000-000000000201',
  'outside-teacher-class',
  'Outside Teacher Class',
  '2026/27',
  '9',
  '20000000-0000-4000-8000-000000000201',
  'active'
);

insert into public.class_memberships (id, class_id, student_id, status)
values (
  '41000000-0000-4000-8000-000000000202',
  '40000000-0000-4000-8000-000000000201',
  '30000000-0000-4000-8000-000000000202',
  'active'
);

insert into public.test_attempts (
  id,
  student_id,
  class_id_at_attempt,
  test_id,
  test_version_id,
  attempt_type,
  attempt_number,
  status,
  feedback_status,
  score,
  max_score,
  percentage
)
select
  '58000000-0000-4000-8000-000000000202',
  '30000000-0000-4000-8000-000000000202',
  '40000000-0000-4000-8000-000000000201',
  test_id,
  test_version_id,
  'practice',
  1,
  'feedback_released',
  'released',
  1,
  1,
  100
from rls_test_refs;

insert into public.student_answers (
  id,
  attempt_id,
  question_id,
  answer,
  answer_text,
  is_correct,
  marks_awarded,
  max_marks,
  marked_by
)
select
  '62000000-0000-4000-8000-000000000202',
  '58000000-0000-4000-8000-000000000202',
  question_id,
  jsonb_build_object('option_id', question_option_id),
  'A',
  true,
  1,
  1,
  'system'
from rls_test_refs;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000101', true);

select is(
  (select count(*)::integer from public.student_profiles where id = '30000000-0000-4000-8000-000000000101'),
  1,
  'student can read their own student profile'
);

select is(
  (select count(*)::integer from public.student_profiles where id = '30000000-0000-4000-8000-000000000102'),
  0,
  'student cannot read another seeded student profile'
);

select is(
  (select count(*)::integer from public.student_profiles where id = '30000000-0000-4000-8000-000000000202'),
  0,
  'student cannot read an unrelated class student profile'
);

select is(
  (select count(*)::integer from public.questions),
  0,
  'student cannot read staff-only questions'
);

select is(
  (select count(*)::integer from public.question_options),
  0,
  'student cannot read staff-only question options'
);

select ok(
  (select count(*) from public.test_attempts where student_id = '30000000-0000-4000-8000-000000000101') > 0,
  'student can read their own attempts'
);

select is(
  (select count(*)::integer from public.test_attempts where student_id = '30000000-0000-4000-8000-000000000102'),
  0,
  'student cannot read another seeded student attempt'
);

select is(
  (
    select count(*)::integer
    from public.student_answers sa
    join public.test_attempts ta on ta.id = sa.attempt_id
    where ta.student_id = '30000000-0000-4000-8000-000000000102'
  ),
  0,
  'student cannot read another seeded student answers'
);

select is(
  (select count(*)::integer from public.classes where id = '40000000-0000-4000-8000-000000000201'),
  0,
  'student cannot read unrelated class'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

select is(
  (select count(*)::integer from public.classes where id = '40000000-0000-4000-8000-000000000001'),
  1,
  'teacher can read their owned class'
);

with updated as (
  update public.classes
  set
    class_name = '8A Computing Edited',
    academic_year = '2027/28',
    year_group = '10',
    updated_at = now()
  where id = '40000000-0000-4000-8000-000000000001'
  returning id
)
select is(
  (select count(*)::integer from updated),
  1,
  'teacher can update their owned class'
);

select is(
  (select class_name from public.classes where id = '40000000-0000-4000-8000-000000000001'),
  '8A Computing Edited',
  'teacher can read their owned class update'
);

select ok(
  (select count(*) from public.student_profiles) >= 5,
  'teacher can read students in their owned class'
);

select ok(
  (select count(*) from public.questions) > 0,
  'teacher can read staff-only questions'
);

select ok(
  (select count(*) from public.question_options) > 0,
  'teacher can read staff-only question options'
);

select is(
  (select count(*)::integer from public.classes where id = '40000000-0000-4000-8000-000000000201'),
  0,
  'teacher cannot read another teacher class'
);

with updated as (
  update public.classes
  set class_name = 'Blocked Outside Class'
  where id = '40000000-0000-4000-8000-000000000201'
  returning id
)
select is(
  (select count(*)::integer from updated),
  0,
  'teacher cannot update another teacher class'
);

select is(
  (select count(*)::integer from public.student_profiles where id = '30000000-0000-4000-8000-000000000202'),
  0,
  'teacher cannot read another teacher student'
);

select is(
  (select count(*)::integer from public.test_attempts where id = '58000000-0000-4000-8000-000000000202'),
  0,
  'teacher cannot read another teacher student attempt'
);

select is(
  (select count(*)::integer from public.student_answers where id = '62000000-0000-4000-8000-000000000202'),
  0,
  'teacher cannot read another teacher student answer'
);

reset role;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);

select throws_ok(
  $$select count(*) from public.student_profiles$$,
  '42501'::char(5),
  null,
  'anon cannot read private student profiles'
);

reset role;

insert into public.test_attempts (
  id,
  student_id,
  class_id_at_attempt,
  test_id,
  test_version_id,
  assignment_id,
  attempt_type,
  attempt_number,
  status,
  feedback_status
)
select
  '59000000-0000-4000-8000-000000000201',
  '30000000-0000-4000-8000-000000000202',
  assignment_class_id,
  test_id,
  test_version_id,
  assignment_id,
  'assigned',
  1,
  'in_progress',
  'hidden'
from rls_test_refs;

select throws_ok(
  format(
    $sql$
      insert into public.test_attempts (
        id,
        student_id,
        class_id_at_attempt,
        test_id,
        test_version_id,
        assignment_id,
        attempt_type,
        attempt_number,
        status,
        feedback_status
      )
      select
        %L::uuid,
        %L::uuid,
        assignment_class_id,
        test_id,
        test_version_id,
        assignment_id,
        'assigned',
        2,
        'in_progress',
        'hidden'
      from rls_test_refs
    $sql$,
    '59000000-0000-4000-8000-000000000202',
    '30000000-0000-4000-8000-000000000202'
  ),
  '23505'::char(5),
  null,
  'a second unvoided assigned attempt is rejected'
);

select throws_ok(
  format(
    'update public.test_versions set version_notes = version_notes where id = %L::uuid',
    (select test_version_id from rls_test_refs)
  ),
  'P0001'::char(5),
  'Published test versions with attempts are immutable. Create a new test version instead.',
  'test versions with attempts cannot be updated'
);

select throws_ok(
  format(
    'delete from public.questions where id = %L::uuid',
    (select question_id from rls_test_refs)
  ),
  'P0001'::char(5),
  'Published test versions with attempts are immutable. Create a new test version instead.',
  'questions on attempted test versions cannot be deleted'
);

select throws_ok(
  format(
    'delete from public.question_options where id = %L::uuid',
    (select question_option_id from rls_test_refs)
  ),
  'P0001'::char(5),
  'Published test versions with attempts are immutable. Create a new test version instead.',
  'question options on attempted test versions cannot be deleted'
);

select * from finish();

rollback;
