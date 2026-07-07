create extension if not exists pgcrypto;

create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to authenticated, service_role;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'admin')),
  display_name text not null,
  username text unique,
  account_status text not null default 'active' check (account_status in ('active', 'inactive', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_auth_user_id_unique unique (auth_user_id)
);

create table public.teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  first_name text not null,
  surname text not null,
  student_id text not null unique,
  internal_auth_email text not null unique,
  account_status text not null default 'active' check (account_status in ('active', 'inactive', 'archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  class_name text not null,
  academic_year text,
  year_group text,
  owner_teacher_id uuid not null references public.teacher_profiles(id),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_owner_slug_unique unique (owner_teacher_id, slug)
);

create table public.class_memberships (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  start_date date not null default current_date,
  end_date date,
  status text not null default 'active' check (status in ('active', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_memberships_one_active unique (class_id, student_id, status)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  subject_name text not null,
  exam_board text,
  course_code text,
  year_group text,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  slug text not null,
  unit_name text not null,
  unit_code text,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint units_subject_slug_unique unique (subject_id, slug)
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  slug text not null,
  topic_name text not null,
  description text,
  keywords text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint topics_unit_slug_unique unique (unit_id, slug)
);

create table public.tests (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  slug text not null,
  test_title text not null,
  test_description text,
  default_mode text not null check (default_mode in ('practice', 'assigned')),
  default_time_limit_seconds integer,
  default_feedback_policy text not null default 'score_only' check (
    default_feedback_policy in ('score_only', 'score_and_summary', 'full_review', 'delayed', 'teacher_released', 'hidden')
  ),
  randomise_questions boolean not null default true,
  shuffle_options boolean not null default true,
  question_pool_enabled boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tests_topic_slug_unique unique (topic_id, slug)
);

create table public.test_versions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.tests(id) on delete cascade,
  version_number integer not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  total_marks integer not null default 0,
  estimated_duration_seconds integer,
  published_at timestamptz,
  published_by uuid references public.profiles(id),
  version_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint test_versions_test_version_unique unique (test_id, version_number)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  test_version_id uuid not null references public.test_versions(id) on delete cascade,
  question_order integer not null,
  question_type text not null check (question_type in ('multiple_choice', 'true_false', 'short_fixed', 'written_answer')),
  question_text text not null,
  max_marks numeric not null default 1 check (max_marks > 0),
  difficulty text,
  correct_answer jsonb,
  mark_scheme text,
  model_answer text,
  accepted_keywords text[] not null default '{}',
  common_misconceptions text[] not null default '{}',
  student_explanation text,
  teacher_notes text,
  media_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_version_order_unique unique (test_version_id, question_order)
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  option_order integer not null,
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint question_options_question_order_unique unique (question_id, option_order)
);

create table public.test_assignments (
  id uuid primary key default gen_random_uuid(),
  test_version_id uuid not null references public.test_versions(id),
  assigned_by uuid not null references public.profiles(id),
  class_id uuid not null references public.classes(id),
  start_at timestamptz,
  due_at timestamptz,
  time_limit_seconds integer,
  attempt_limit integer not null default 1 check (attempt_limit >= 1),
  feedback_policy text not null default 'score_only' check (
    feedback_policy in ('score_only', 'score_and_summary', 'full_review', 'delayed', 'teacher_released', 'hidden')
  ),
  status text not null default 'open' check (status in ('scheduled', 'open', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id),
  class_id_at_attempt uuid references public.classes(id),
  test_id uuid not null references public.tests(id),
  test_version_id uuid not null references public.test_versions(id),
  assignment_id uuid references public.test_assignments(id),
  attempt_type text not null check (attempt_type in ('practice', 'assigned')),
  attempt_number integer not null default 1,
  status text not null default 'in_progress' check (
    status in ('not_started', 'in_progress', 'submitted', 'timed_out', 'abandoned', 'voided', 'marked', 'feedback_released')
  ),
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  submitted_at timestamptz,
  duration_seconds integer,
  time_limit_seconds integer,
  timed_out boolean not null default false,
  submitted_late boolean not null default false,
  score numeric,
  max_score numeric,
  percentage numeric,
  marking_status text not null default 'not_required' check (marking_status in ('not_required', 'pending', 'marked')),
  feedback_status text not null default 'hidden' check (feedback_status in ('hidden', 'available', 'released')),
  points_awarded integer not null default 0,
  suspicious_event_count integer not null default 0,
  voided_at timestamptz,
  voided_by uuid references public.profiles(id),
  void_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index test_attempts_one_unvoided_assigned_attempt
  on public.test_attempts (student_id, assignment_id)
  where attempt_type = 'assigned' and assignment_id is not null and voided_at is null;

create table public.student_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  answer jsonb,
  answer_text text,
  is_correct boolean,
  marks_awarded numeric,
  max_marks numeric,
  marked_by text check (marked_by in ('system', 'ai', 'teacher')),
  feedback text,
  last_saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_answers_attempt_question_unique unique (attempt_id, question_id)
);

create table public.answer_display_orders (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  option_ids uuid[] not null,
  created_at timestamptz not null default now(),
  constraint answer_display_orders_unique unique (attempt_id, question_id)
);

create table public.attempt_events (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id),
  event_type text not null check (
    event_type in (
      'copy_attempt',
      'paste_attempt',
      'cut_attempt',
      'right_click_attempt',
      'print_attempt',
      'tab_hidden',
      'window_blur',
      'page_leave_attempt',
      'reload_attempt',
      'fullscreen_exit',
      'suspicious_focus_loss'
    )
  ),
  route text,
  event_detail jsonb not null default '{}',
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.assigned_attempt_resets (
  id uuid primary key default gen_random_uuid(),
  original_attempt_id uuid not null references public.test_attempts(id),
  student_id uuid not null references public.student_profiles(id),
  assignment_id uuid not null references public.test_assignments(id),
  reset_by uuid not null references public.profiles(id),
  reason text not null,
  created_at timestamptz not null default now()
);

create table public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id),
  related_attempt_id uuid references public.test_attempts(id),
  points integer not null,
  reason text not null,
  created_by text not null default 'system' check (created_by in ('system', 'teacher', 'admin')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.status_levels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  min_points integer not null,
  max_points integer,
  display_order integer not null default 0,
  active boolean not null default true
);

create table public.leaderboard_snapshots (
  id uuid primary key default gen_random_uuid(),
  period_type text not null default 'all_time' check (period_type in ('all_time', 'weekly', 'monthly', 'termly')),
  class_id uuid references public.classes(id),
  student_id uuid not null references public.student_profiles(id),
  display_name text not null,
  student_public_id text not null,
  points integer not null,
  status_name text not null,
  rank integer not null,
  calculated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id),
  action text not null,
  target_type text,
  target_id uuid,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index class_memberships_student_idx on public.class_memberships (student_id, status);
create index test_attempts_student_idx on public.test_attempts (student_id, status);
create index test_attempts_assignment_idx on public.test_attempts (assignment_id, student_id);
create index student_answers_attempt_idx on public.student_answers (attempt_id);
create index attempt_events_attempt_idx on public.attempt_events (attempt_id, created_at);
create index points_transactions_student_idx on public.points_transactions (student_id, created_at);

create or replace function app_private.current_profile_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select id
  from public.profiles
  where auth_user_id = (select auth.uid())
    and account_status = 'active'
  limit 1
$$;

create or replace function app_private.current_student_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select sp.id
  from public.student_profiles sp
  join public.profiles p on p.id = sp.profile_id
  where p.auth_user_id = (select auth.uid())
    and p.role = 'student'
    and p.account_status = 'active'
    and sp.account_status = 'active'
  limit 1
$$;

create or replace function app_private.current_teacher_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select tp.id
  from public.teacher_profiles tp
  join public.profiles p on p.id = tp.profile_id
  where p.auth_user_id = (select auth.uid())
    and p.role = 'teacher'
    and p.account_status = 'active'
  limit 1
$$;

create or replace function app_private.has_role(required_role text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where auth_user_id = (select auth.uid())
      and role = required_role
      and account_status = 'active'
  )
$$;

create or replace function app_private.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$ select app_private.has_role('admin') $$;

create or replace function app_private.is_teacher()
returns boolean
language sql
security definer
set search_path = public
as $$ select app_private.has_role('teacher') $$;

create or replace function app_private.teacher_owns_class(class_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.classes c
    where c.id = class_uuid
      and c.owner_teacher_id = app_private.current_teacher_id()
  )
$$;

create or replace function app_private.teacher_can_access_student(student_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_memberships cm
    join public.classes c on c.id = cm.class_id
    where cm.student_id = student_uuid
      and cm.status = 'active'
      and c.owner_teacher_id = app_private.current_teacher_id()
  )
$$;

create or replace function app_private.student_in_class(class_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.class_memberships cm
    where cm.class_id = class_uuid
      and cm.student_id = app_private.current_student_id()
      and cm.status = 'active'
  )
$$;

create or replace function app_private.test_version_has_attempts(version_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.test_attempts ta
    where ta.test_version_id = version_uuid
  )
$$;

create or replace function app_private.prevent_attempted_version_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  version_uuid uuid;
begin
  if tg_table_name = 'test_versions' then
    version_uuid := old.id;
  elsif tg_table_name = 'questions' then
    version_uuid := old.test_version_id;
  elsif tg_table_name = 'question_options' then
    select q.test_version_id into version_uuid
    from public.questions q
    where q.id = old.question_id;
  else
    return new;
  end if;

  if app_private.test_version_has_attempts(version_uuid) then
    raise exception 'Published test versions with attempts are immutable. Create a new test version instead.';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end
$$;

create trigger test_versions_immutable_after_attempt
before update or delete on public.test_versions
for each row execute function app_private.prevent_attempted_version_mutation();

create trigger questions_immutable_after_attempt
before update or delete on public.questions
for each row execute function app_private.prevent_attempted_version_mutation();

create trigger question_options_immutable_after_attempt
before update or delete on public.question_options
for each row execute function app_private.prevent_attempted_version_mutation();

revoke all on all functions in schema app_private from public;
grant execute on all functions in schema app_private to authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_memberships enable row level security;
alter table public.subjects enable row level security;
alter table public.units enable row level security;
alter table public.topics enable row level security;
alter table public.tests enable row level security;
alter table public.test_versions enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.test_assignments enable row level security;
alter table public.test_attempts enable row level security;
alter table public.student_answers enable row level security;
alter table public.answer_display_orders enable row level security;
alter table public.attempt_events enable row level security;
alter table public.assigned_attempt_resets enable row level security;
alter table public.points_transactions enable row level security;
alter table public.status_levels enable row level security;
alter table public.leaderboard_snapshots enable row level security;
alter table public.audit_logs enable row level security;
alter table public.site_settings enable row level security;

grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;

create policy "profiles read permitted identities"
on public.profiles for select
to authenticated
using (
  auth_user_id = (select auth.uid())
  or app_private.is_admin()
  or exists (
    select 1
    from public.student_profiles sp
    where sp.profile_id = profiles.id
      and app_private.teacher_can_access_student(sp.id)
  )
);

create policy "profiles update admin only"
on public.profiles for update
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "teacher profiles read own or admin"
on public.teacher_profiles for select
to authenticated
using (profile_id = app_private.current_profile_id() or app_private.is_admin());

create policy "student profiles read own teacher admin"
on public.student_profiles for select
to authenticated
using (
  id = app_private.current_student_id()
  or app_private.teacher_can_access_student(id)
  or app_private.is_admin()
);

create policy "classes read by owner members admin"
on public.classes for select
to authenticated
using (
  app_private.teacher_owns_class(id)
  or app_private.student_in_class(id)
  or app_private.is_admin()
);

create policy "classes created by teacher or admin"
on public.classes for insert
to authenticated
with check (
  app_private.is_admin()
  or owner_teacher_id = app_private.current_teacher_id()
);

create policy "classes updated by owner or admin"
on public.classes for update
to authenticated
using (app_private.teacher_owns_class(id) or app_private.is_admin())
with check (app_private.teacher_owns_class(id) or app_private.is_admin());

create policy "class memberships read by student teacher admin"
on public.class_memberships for select
to authenticated
using (
  student_id = app_private.current_student_id()
  or app_private.teacher_owns_class(class_id)
  or app_private.is_admin()
);

create policy "published subjects are readable"
on public.subjects for select
to authenticated
using (status = 'active' or app_private.is_teacher() or app_private.is_admin());

create policy "published units are readable"
on public.units for select
to authenticated
using (status = 'active' or app_private.is_teacher() or app_private.is_admin());

create policy "published topics are readable"
on public.topics for select
to authenticated
using (status = 'active' or app_private.is_teacher() or app_private.is_admin());

create policy "published tests are readable"
on public.tests for select
to authenticated
using (status = 'published' or app_private.is_teacher() or app_private.is_admin());

create policy "published versions are readable"
on public.test_versions for select
to authenticated
using (status = 'published' or app_private.is_teacher() or app_private.is_admin());

create policy "questions are staff only"
on public.questions for select
to authenticated
using (app_private.is_teacher() or app_private.is_admin());

create policy "question options are staff only"
on public.question_options for select
to authenticated
using (app_private.is_teacher() or app_private.is_admin());

create policy "assignments read by assigned student teacher admin"
on public.test_assignments for select
to authenticated
using (
  app_private.teacher_owns_class(class_id)
  or app_private.student_in_class(class_id)
  or app_private.is_admin()
);

create policy "assignments created by owner teacher or admin"
on public.test_assignments for insert
to authenticated
with check (
  app_private.is_admin()
  or app_private.teacher_owns_class(class_id)
);

create policy "assignments updated by owner teacher or admin"
on public.test_assignments for update
to authenticated
using (app_private.teacher_owns_class(class_id) or app_private.is_admin())
with check (app_private.teacher_owns_class(class_id) or app_private.is_admin());

create policy "attempts read by owner teacher admin"
on public.test_attempts for select
to authenticated
using (
  student_id = app_private.current_student_id()
  or app_private.teacher_can_access_student(student_id)
  or app_private.is_admin()
);

create policy "answers read by owner when released or staff"
on public.student_answers for select
to authenticated
using (
  exists (
    select 1
    from public.test_attempts ta
    where ta.id = student_answers.attempt_id
      and (
        (ta.student_id = app_private.current_student_id() and ta.feedback_status in ('available', 'released'))
        or app_private.teacher_can_access_student(ta.student_id)
        or app_private.is_admin()
      )
  )
);

create policy "display orders staff only"
on public.answer_display_orders for select
to authenticated
using (
  exists (
    select 1
    from public.test_attempts ta
    where ta.id = answer_display_orders.attempt_id
      and (app_private.teacher_can_access_student(ta.student_id) or app_private.is_admin())
  )
);

create policy "attempt events read by owner teacher admin"
on public.attempt_events for select
to authenticated
using (
  student_id = app_private.current_student_id()
  or app_private.teacher_can_access_student(student_id)
  or app_private.is_admin()
);

create policy "attempt events insert by owning student"
on public.attempt_events for insert
to authenticated
with check (
  student_id = app_private.current_student_id()
  and exists (
    select 1
    from public.test_attempts ta
    where ta.id = attempt_id
      and ta.student_id = app_private.current_student_id()
      and ta.status = 'in_progress'
  )
);

create policy "attempt resets read by staff"
on public.assigned_attempt_resets for select
to authenticated
using (app_private.teacher_can_access_student(student_id) or app_private.is_admin());

create policy "points read by owner teacher admin"
on public.points_transactions for select
to authenticated
using (
  student_id = app_private.current_student_id()
  or app_private.teacher_can_access_student(student_id)
  or app_private.is_admin()
);

create policy "status levels read by authenticated"
on public.status_levels for select
to authenticated
using (active = true);

create policy "leaderboards read by class members staff admin"
on public.leaderboard_snapshots for select
to authenticated
using (
  app_private.is_admin()
  or app_private.teacher_can_access_student(student_id)
  or (class_id is not null and app_private.student_in_class(class_id))
);

create policy "audit logs read own or admin"
on public.audit_logs for select
to authenticated
using (actor_profile_id = app_private.current_profile_id() or app_private.is_admin());

create policy "site settings read authenticated"
on public.site_settings for select
to authenticated
using (true);

insert into public.status_levels (slug, name, min_points, max_points, display_order)
values
  ('starter', 'Starter', 0, 249, 1),
  ('learner', 'Learner', 250, 749, 2),
  ('builder', 'Builder', 750, 1499, 3),
  ('scholar', 'Scholar', 1500, 2499, 4),
  ('expert', 'Expert', 2500, 3999, 5),
  ('master', 'Master', 4000, null, 6)
on conflict (slug) do nothing;

insert into public.site_settings (key, value)
values
  ('whole_site_leaderboard_enabled', 'false'::jsonb),
  ('class_leaderboard_enabled', 'true'::jsonb),
  ('student_password_change_enabled', 'false'::jsonb),
  ('certificates_enabled', 'false'::jsonb),
  ('ai_marking_enabled', 'false'::jsonb)
on conflict (key) do nothing;

comment on table public.questions is 'Student clients must not query this table directly; start-test-attempt returns student-safe payloads only.';
comment on table public.question_options is 'Contains is_correct and is staff/server-readable only.';
comment on column public.student_profiles.student_id is 'Public Student ID used for leaderboard display; independent from username digits.';
