create table public.activity_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'admin')),
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.activity_sessions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('session_started', 'page_view', 'heartbeat', 'page_hidden', 'page_visible')),
  route text,
  created_at timestamptz not null default now()
);

create index activity_sessions_profile_active_idx on public.activity_sessions (profile_id, last_active_at desc);
create index activity_events_session_created_idx on public.activity_events (session_id, created_at desc);
create index activity_events_profile_created_idx on public.activity_events (profile_id, created_at desc);

alter table public.activity_sessions enable row level security;
alter table public.activity_events enable row level security;

grant select on public.activity_sessions, public.activity_events to authenticated;

create policy "activity sessions read by profile teacher admin"
on public.activity_sessions for select
to authenticated
using (
  profile_id = app_private.current_profile_id()
  or app_private.is_admin()
  or exists (
    select 1
    from public.student_profiles sp
    where sp.profile_id = activity_sessions.profile_id
      and app_private.teacher_can_access_student(sp.id)
  )
);

create policy "activity events read by profile teacher admin"
on public.activity_events for select
to authenticated
using (
  profile_id = app_private.current_profile_id()
  or app_private.is_admin()
  or exists (
    select 1
    from public.student_profiles sp
    where sp.profile_id = activity_events.profile_id
      and app_private.teacher_can_access_student(sp.id)
  )
);
