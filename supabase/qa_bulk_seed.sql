-- Local-only bulk fixture for classroom-scale QA. Loaded from seed.sql.
-- It deliberately contains fictional accounts and must never be promoted to production data.

create table public.qa_fixture_classes (
  class_id uuid primary key,
  slug text not null,
  class_name text not null,
  current_year smallint not null,
  subject_id uuid not null,
  status text not null,
  expected_new_students integer not null,
  class_order integer not null
);

insert into public.qa_fixture_classes
select * from (values
  ('40000000-0000-4000-8000-000000000001'::uuid, '10a-computing', '10A Computing', 10::smallint, '50000000-0000-4000-8000-000000000001'::uuid, 'active', 20, 1),
  ('40000000-0000-4000-8000-000000000002'::uuid, '10b-computing', '10B Computing', 10::smallint, '50000000-0000-4000-8000-000000000001'::uuid, 'active', 25, 2),
  (gen_random_uuid(), '10c-computing', '10C Computing', 10::smallint, '50000000-0000-4000-8000-000000000001'::uuid, 'active', 25, 3),
  (gen_random_uuid(), '11a-computing', '11A Computing', 11::smallint, '50000000-0000-4000-8000-000000000001'::uuid, 'active', 25, 4),
  (gen_random_uuid(), '11b-computing', '11B Computing', 11::smallint, '50000000-0000-4000-8000-000000000001'::uuid, 'active', 25, 5),
  (gen_random_uuid(), '12a-it', '12A IT', 12::smallint, '50000000-0000-4000-8000-000000000002'::uuid, 'active', 25, 6),
  (gen_random_uuid(), '12b-it', '12B IT', 12::smallint, '50000000-0000-4000-8000-000000000002'::uuid, 'active', 25, 7),
  (gen_random_uuid(), '13a-it', '13A IT', 13::smallint, '50000000-0000-4000-8000-000000000002'::uuid, 'active', 25, 8),
  (gen_random_uuid(), '13b-it', '13B IT', 13::smallint, '50000000-0000-4000-8000-000000000002'::uuid, 'active', 25, 9),
  (gen_random_uuid(), '13c-it', '13C IT', 13::smallint, '50000000-0000-4000-8000-000000000002'::uuid, 'active', 25, 10),
  (gen_random_uuid(), '11c-computing-archive', '11C Computing (2023/24)', 11::smallint, '50000000-0000-4000-8000-000000000001'::uuid, 'archived', 25, 11),
  (gen_random_uuid(), '13d-it-archive', '13D IT (2023/24)', 13::smallint, '50000000-0000-4000-8000-000000000002'::uuid, 'archived', 25, 12)
) as classes(class_id, slug, class_name, current_year, subject_id, status, expected_new_students, class_order);

insert into public.classes (id, slug, class_name, academic_year, year_group, owner_teacher_id, status, join_code, accepting_students, is_system)
select class_id, slug, class_name,
  case when status = 'active' then '2025/26' else '2023/24' end,
  current_year::text,
  '20000000-0000-4000-8000-000000000001'::uuid,
  status,
  null, false, false
from public.qa_fixture_classes
on conflict (id) do update set
  slug = excluded.slug, class_name = excluded.class_name, academic_year = excluded.academic_year,
  year_group = excluded.year_group, status = excluded.status, join_code = null, accepting_students = false,
  updated_at = now();

insert into public.class_courses (class_id, subject_id)
select class_id, subject_id
from public.qa_fixture_classes
on conflict (class_id, subject_id) do nothing;

update public.student_profiles
set initial_year_group = 10, joined_on = date '2025-09-01', updated_at = now()
where id in (
  '30000000-0000-4000-8000-000000000101'::uuid,
  '30000000-0000-4000-8000-000000000102'::uuid,
  '30000000-0000-4000-8000-000000000103'::uuid,
  '30000000-0000-4000-8000-000000000104'::uuid,
  '30000000-0000-4000-8000-000000000105'::uuid
);

create table public.qa_fixture_students (
  student_id uuid primary key,
  profile_id uuid not null,
  auth_id uuid not null,
  class_id uuid,
  class_order integer,
  row_number integer not null,
  first_name text not null,
  surname text not null,
  username text not null,
  email text not null,
  public_id text not null,
  initial_year_group smallint not null,
  joined_on date not null,
  account_status text not null
);

insert into public.qa_fixture_students
select
  gen_random_uuid(),
  gen_random_uuid(),
  gen_random_uuid(),
  class.class_id,
  class.class_order,
  generated.member_number,
  (array['Alex','Amelia','Arjun','Ava','Bilal','Chloe','Daniel','Elena','Ethan','Fatima','Grace','Harrison','Imani','Isaac','Jasmine','Kai','Layla','Leo','Mia','Noah','Olivia','Priya','Ravi','Sofia','Zara'])[((generated.global_number - 1) % 25) + 1],
  (array['Ahmed','Bennett','Clarke','Das','Evans','Foster','Green','Hughes','Iqbal','Jones','Kaur','Lewis','Morgan','Naylor','Osei','Patel','Reed','Shah','Taylor','Usman','Walker','Xu','Young','Zaman','Brooks'])[((generated.global_number - 1) % 25) + 1],
  'qa_' || replace(class.slug, '-', '_') || '_' || lpad(generated.member_number::text, 2, '0'),
  'qa_' || replace(class.slug, '-', '_') || '_' || lpad(generated.member_number::text, 2, '0') || '@students.local',
  'Q' || lpad((class.class_order * 100 + generated.member_number)::text, 5, '0'),
  case
    when class.current_year = 10 then 10
    when class.current_year = 11 then 10
    when class.current_year = 12 then 12
    else 12
  end,
  case
    when class.status = 'archived' and class.current_year = 11 then date '2022-09-01'
    when class.status = 'archived' then date '2022-09-01'
    when class.current_year in (10, 12) then date '2025-09-01'
    else date '2024-09-01'
  end,
  case when class.status = 'archived' then 'archived' else 'active' end
from public.qa_fixture_classes class
cross join lateral (
  select series as member_number,
    row_number() over (order by class.class_order, series) as global_number
  from generate_series(case when class.class_order = 1 then 6 else 1 end, case when class.class_order = 1 then 25 else class.expected_new_students end) series
) generated;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  email_change_token_current, reauthentication_token, phone_change, phone_change_token,
  email_change_confirm_status, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous
)
select
  '00000000-0000-0000-0000-000000000000'::uuid, auth_id, 'authenticated', 'authenticated', email,
  extensions.crypt('Localdev1!', extensions.gen_salt('bf')), now(), '', '', '', '', '', '', '', '', 0,
  '{"provider":"email","providers":["email"],"app_role":"student"}'::jsonb, '{}'::jsonb,
  joined_on::timestamptz, now(), false, false
from public.qa_fixture_students
on conflict (id) do update set email = excluded.email, encrypted_password = excluded.encrypted_password, updated_at = now();

insert into auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), auth_id, auth_id,
  jsonb_build_object('sub', auth_id::text, 'email', email, 'email_verified', true, 'phone_verified', false),
  'email', now(), joined_on::timestamptz, now()
from public.qa_fixture_students
on conflict (provider_id, provider) do update set user_id = excluded.user_id, identity_data = excluded.identity_data, updated_at = now();

insert into public.profiles (id, auth_user_id, role, display_name, username, account_status)
select profile_id, auth_id, 'student', left(first_name, 1) || ' ' || surname, username, account_status
from public.qa_fixture_students
on conflict (id) do update set auth_user_id = excluded.auth_user_id, display_name = excluded.display_name, username = excluded.username, account_status = excluded.account_status, updated_at = now();

insert into public.student_profiles (id, profile_id, first_name, surname, student_id, initial_year_group, joined_on, internal_auth_email, account_status, created_by)
select student_id, profile_id, first_name, surname, public_id, initial_year_group, joined_on, email, account_status,
  '10000000-0000-4000-8000-000000000001'::uuid
from public.qa_fixture_students
on conflict (id) do update set profile_id = excluded.profile_id, first_name = excluded.first_name, surname = excluded.surname,
  student_id = excluded.student_id, initial_year_group = excluded.initial_year_group, joined_on = excluded.joined_on,
  internal_auth_email = excluded.internal_auth_email, account_status = excluded.account_status, updated_at = now();

insert into public.class_memberships (id, class_id, student_id, start_date, end_date, status)
select gen_random_uuid(), class_id, student_id, joined_on,
  case when account_status = 'archived' then date '2024-07-31' else null end,
  case when account_status = 'archived' then 'ended' else 'active' end
from public.qa_fixture_students
on conflict (id) do update set class_id = excluded.class_id, student_id = excluded.student_id, start_date = excluded.start_date,
  end_date = excluded.end_date, status = excluded.status, updated_at = now();

create table public.qa_fixture_learners (student_id uuid primary key, profile_id uuid not null, class_id uuid not null, class_order integer not null, row_number integer not null, account_status text not null);

insert into public.qa_fixture_learners
select id, profile_id, '40000000-0000-4000-8000-000000000001'::uuid, 1, row_number() over (order by id), 'active'
from public.student_profiles
where id in (
  '30000000-0000-4000-8000-000000000101'::uuid,
  '30000000-0000-4000-8000-000000000102'::uuid,
  '30000000-0000-4000-8000-000000000103'::uuid,
  '30000000-0000-4000-8000-000000000104'::uuid,
  '30000000-0000-4000-8000-000000000105'::uuid
);

insert into public.qa_fixture_learners
select student_id, profile_id, class_id, class_order, row_number, account_status from public.qa_fixture_students;

create table public.qa_fixture_assignments (id uuid primary key, class_id uuid not null, class_order integer not null, test_id uuid not null, test_version_id uuid not null, sequence integer not null, status text not null, start_at timestamptz, due_at timestamptz);

insert into public.qa_fixture_assignments
select gen_random_uuid(), class.class_id, class.class_order,
  selected.test_id, selected.test_version_id, sequence,
  case when class.status = 'archived' then 'closed' when sequence = 8 then 'scheduled' when sequence in (1, 2) then 'open' else 'closed' end,
  case when class.status = 'archived' then timestamp with time zone '2024-04-01 08:00:00+00'
       when sequence = 8 then now() + interval '7 days'
       else now() - ((sequence + 2) || ' days')::interval end,
  case when class.status = 'archived' then timestamp with time zone '2024-04-15 16:00:00+00'
       when sequence = 1 then now() + interval '6 days'
       when sequence = 2 then now() + interval '14 days'
       when sequence = 8 then now() + interval '21 days'
       else now() - ((sequence + 3) || ' days')::interval end
from public.qa_fixture_classes class
cross join lateral generate_series(1, case when class.status = 'archived' then 6 else 8 end) sequence
cross join lateral (
  select test.id as test_id, version.id as test_version_id
  from public.test_versions version
  join public.tests test on test.id = version.test_id
  join public.topics topic on topic.id = test.topic_id
  join public.units unit on unit.id = topic.unit_id
  where unit.subject_id = class.subject_id and version.status = 'published' and test.status = 'published'
  order by test.id
  offset ((class.class_order + sequence - 2) % greatest(1, (select count(*) from public.test_versions version2 join public.tests test2 on test2.id = version2.test_id join public.topics topic2 on topic2.id = test2.topic_id join public.units unit2 on unit2.id = topic2.unit_id where unit2.subject_id = class.subject_id and version2.status = 'published' and test2.status = 'published')))
  limit 1
) selected;

insert into public.test_assignments (id, test_version_id, assigned_by, class_id, start_at, due_at, time_limit_seconds, attempt_limit, feedback_policy, status)
select id, test_version_id, '10000000-0000-4000-8000-000000000001'::uuid, class_id, start_at, due_at, 900, null,
  case when status = 'closed' then 'score_and_summary' else 'score_only' end, status
from public.qa_fixture_assignments
on conflict (id) do update set test_version_id = excluded.test_version_id, class_id = excluded.class_id, start_at = excluded.start_at,
  due_at = excluded.due_at, status = excluded.status, updated_at = now();

insert into public.test_attempts (
  id, student_id, class_id_at_attempt, test_id, test_version_id, assignment_id, attempt_type, attempt_number, status,
  started_at, expires_at, submitted_at, duration_seconds, time_limit_seconds, timed_out, submitted_late,
  score, max_score, percentage, marking_status, feedback_status, points_awarded, suspicious_event_count
)
select
  gen_random_uuid(),
  learner.student_id, learner.class_id, assignment.test_id, assignment.test_version_id, assignment.id, 'assigned', 1,
  case when assignment.status = 'open' and learner.row_number % 4 = 0 then 'in_progress'
       when assignment.status = 'open' then 'not_started'
       when (learner.row_number + assignment.sequence) % 13 = 0 then 'timed_out'
       when (learner.row_number + assignment.sequence) % 11 = 0 then 'abandoned'
       when (learner.row_number + assignment.sequence) % 7 = 0 then 'submitted'
       when (learner.row_number + assignment.sequence) % 3 = 0 then 'marked'
       else 'feedback_released' end,
  assignment.start_at + ((learner.row_number % 4) || ' hours')::interval,
  assignment.due_at,
  case when assignment.status = 'closed' then assignment.start_at + ((learner.row_number % 4 + 1) || ' hours')::interval else null end,
  case when assignment.status = 'closed' then 360 + ((learner.row_number * 19) % 420) else null end,
  900,
  assignment.status = 'closed' and (learner.row_number + assignment.sequence) % 13 = 0,
  assignment.status = 'closed' and (learner.row_number + assignment.sequence) % 9 = 0,
  case when assignment.status = 'closed' then greatest(0, floor(version.total_marks * (45 + ((learner.row_number * 7 + assignment.sequence * 11) % 56)) / 100.0)) else null end,
  case when assignment.status = 'closed' then version.total_marks else null end,
  case when assignment.status = 'closed' then 45 + ((learner.row_number * 7 + assignment.sequence * 11) % 56) else null end,
  case when assignment.status = 'closed' and (learner.row_number + assignment.sequence) % 11 <> 0 then 'marked' else 'not_required' end,
  case when assignment.status = 'closed' and (learner.row_number + assignment.sequence) % 3 <> 0 then 'released' else 'hidden' end,
  case when assignment.status = 'closed' and (learner.row_number + assignment.sequence) % 11 <> 0 then 20 + ((learner.row_number * 13 + assignment.sequence * 5) % 81) else 0 end,
  case when learner.row_number % 9 = 0 then 1 else 0 end
from public.qa_fixture_assignments assignment
join public.qa_fixture_learners learner on learner.class_id = assignment.class_id and learner.row_number % 5 <> 0
join public.test_versions version on version.id = assignment.test_version_id
where assignment.status <> 'scheduled'
  and not (assignment.status = 'open' and learner.row_number % 4 <> 0)
on conflict (id) do update set status = excluded.status, submitted_at = excluded.submitted_at, score = excluded.score,
  max_score = excluded.max_score, percentage = excluded.percentage, marking_status = excluded.marking_status,
  feedback_status = excluded.feedback_status, points_awarded = excluded.points_awarded, updated_at = now();

insert into public.test_attempts (
  id, student_id, class_id_at_attempt, test_id, test_version_id, attempt_type, attempt_number, status,
  started_at, submitted_at, duration_seconds, time_limit_seconds, score, max_score, percentage,
  marking_status, feedback_status, points_awarded, suspicious_event_count
)
select
  gen_random_uuid(),
  learner.student_id, learner.class_id, selected.test_id, selected.test_version_id, 'practice', practice_number, 'feedback_released',
  now() - ((practice_number * 18 + learner.row_number) || ' days')::interval,
  now() - ((practice_number * 18 + learner.row_number) || ' days')::interval + interval '11 minutes',
  660, 900,
  greatest(0, floor(selected.total_marks * (48 + ((learner.row_number * 9 + practice_number * 7) % 51)) / 100.0)),
  selected.total_marks, 48 + ((learner.row_number * 9 + practice_number * 7) % 51),
  'marked', 'released', 25 + ((learner.row_number * 11 + practice_number * 3) % 76), 0
from public.qa_fixture_learners learner
cross join lateral generate_series(1, 6) practice_number
join public.qa_fixture_classes class on class.class_id = learner.class_id
cross join lateral (
  select test.id as test_id, version.id as test_version_id, version.total_marks
  from public.test_versions version
  join public.tests test on test.id = version.test_id
  join public.topics topic on topic.id = test.topic_id
  join public.units unit on unit.id = topic.unit_id
  where unit.subject_id = class.subject_id and version.status = 'published' and test.status = 'published'
  order by test.id
  offset ((learner.row_number + practice_number - 2) % greatest(1, (select count(*) from public.test_versions version2 join public.tests test2 on test2.id = version2.test_id join public.topics topic2 on topic2.id = test2.topic_id join public.units unit2 on unit2.id = topic2.unit_id where unit2.subject_id = class.subject_id and version2.status = 'published' and test2.status = 'published')))
  limit 1
) selected
on conflict (id) do update set submitted_at = excluded.submitted_at, score = excluded.score, percentage = excluded.percentage,
  points_awarded = excluded.points_awarded, updated_at = now();

insert into public.points_transactions (id, student_id, related_attempt_id, points, reason, created_by, metadata, created_at)
select gen_random_uuid(), attempt.student_id, attempt.id, attempt.points_awarded,
  'Bulk QA fixture points', 'system', '{"fixture":"bulk-classroom-qa"}'::jsonb, coalesce(attempt.submitted_at, attempt.started_at)
from public.test_attempts attempt
join public.qa_fixture_learners learner on learner.student_id = attempt.student_id and learner.class_id = attempt.class_id_at_attempt
where attempt.points_awarded > 0
  and (
    attempt.assignment_id in (select id from public.qa_fixture_assignments)
    or (attempt.attempt_type = 'practice' and attempt.started_at >= now() - interval '180 days')
  )
on conflict (id) do update set points = excluded.points, related_attempt_id = excluded.related_attempt_id, created_at = excluded.created_at;

delete from public.leaderboard_snapshots
where student_id in (select student_id from public.qa_fixture_learners);

insert into public.leaderboard_snapshots (id, period_type, class_id, student_id, display_name, student_public_id, points, status_name, rank, calculated_at)
select gen_random_uuid(), 'all_time', learner.class_id, learner.student_id,
  profile.display_name, student.student_id, coalesce(sum(points.points), 0),
  case when coalesce(sum(points.points), 0) >= 1200 then 'Champion' when coalesce(sum(points.points), 0) >= 700 then 'Learner' else 'Starter' end,
  rank() over (order by coalesce(sum(points.points), 0) desc, profile.display_name), now()
from public.qa_fixture_learners learner
join public.student_profiles student on student.id = learner.student_id
join public.profiles profile on profile.id = learner.profile_id
left join public.points_transactions points on points.student_id = learner.student_id
group by learner.student_id, learner.class_id, profile.display_name, student.student_id
on conflict (id) do update set class_id = excluded.class_id, points = excluded.points, status_name = excluded.status_name, rank = excluded.rank, calculated_at = now();

insert into public.activity_sessions (id, profile_id, role, started_at, last_active_at, ended_at)
select profile_id, profile_id, 'student', now() - interval '2 days', now() - interval '90 minutes', now() - interval '90 minutes'
from public.qa_fixture_learners
where row_number % 3 = 0
on conflict (id) do update set last_active_at = excluded.last_active_at, ended_at = excluded.ended_at;

insert into public.activity_events (id, session_id, profile_id, event_type, route, created_at)
select gen_random_uuid(), learner.profile_id, learner.profile_id,
  'page_view', '/student', now() - interval '2 days'
from public.qa_fixture_learners learner where learner.row_number % 3 = 0
on conflict (id) do update set route = excluded.route, created_at = excluded.created_at;

insert into public.activity_events (id, session_id, profile_id, event_type, route, created_at)
select gen_random_uuid(), learner.profile_id, learner.profile_id,
  'page_view', '/student/practice', now() - interval '100 minutes'
from public.qa_fixture_learners learner where learner.row_number % 3 = 0
on conflict (id) do update set route = excluded.route, created_at = excluded.created_at;

insert into public.audit_logs (id, actor_profile_id, action, target_type, target_id, detail, created_at)
values (
  gen_random_uuid(),
  '10000000-0000-4000-8000-000000000001'::uuid,
  'bulk_classroom_qa_seed_applied', 'database', null,
  '{"classes":12,"active_classes":10,"active_students":250,"fixture":"bulk-classroom-qa"}'::jsonb, now()
)
on conflict (id) do update set detail = excluded.detail, created_at = excluded.created_at;


drop table if exists public.qa_fixture_assignments;
drop table if exists public.qa_fixture_learners;
drop table if exists public.qa_fixture_students;
drop table if exists public.qa_fixture_classes;
