alter table public.classes
  add column if not exists join_code text,
  add column if not exists accepting_students boolean not null default false,
  add column if not exists is_system boolean not null default false;

alter table public.classes
  drop constraint if exists classes_join_code_format;

alter table public.classes
  add constraint classes_join_code_format
  check (join_code is null or join_code ~ '^[A-Z]{6}$');

drop index if exists public.class_memberships_one_active_student;

alter table public.class_memberships
  drop constraint if exists class_memberships_one_active;

create unique index if not exists class_memberships_one_active_class_student
  on public.class_memberships (class_id, student_id)
  where status = 'active';

create unique index if not exists classes_join_code_unique
  on public.classes (join_code)
  where join_code is not null;

create unique index if not exists classes_one_system_non_class_per_teacher
  on public.classes (owner_teacher_id)
  where is_system = true;

insert into public.classes (
  slug,
  class_name,
  academic_year,
  year_group,
  owner_teacher_id,
  status,
  join_code,
  accepting_students,
  is_system
)
select
  'non-class',
  'Non-class',
  null,
  null,
  teacher_profiles.id,
  'active',
  null,
  false,
  true
from public.teacher_profiles
on conflict (owner_teacher_id, slug) do update
set
  class_name = excluded.class_name,
  academic_year = excluded.academic_year,
  year_group = excluded.year_group,
  status = 'active',
  join_code = null,
  accepting_students = false,
  is_system = true,
  updated_at = now();

do $$
declare
  class_row record;
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  generated_code text;
  position integer;
begin
  for class_row in
    select id
    from public.classes
    where is_system = false
      and join_code is null
  loop
    loop
      generated_code := '';
      for position in 1..6 loop
        generated_code := generated_code || substr(alphabet, floor(random() * length(alphabet) + 1)::integer, 1);
      end loop;

      exit when not exists (
        select 1
        from public.classes
        where join_code = generated_code
      );
    end loop;

    update public.classes
    set
      join_code = generated_code,
      accepting_students = false,
      updated_at = now()
    where id = class_row.id;
  end loop;
end $$;

create or replace function app_private.teacher_can_access_attempt(attempt_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select app_private.is_admin()
    or exists (
      select 1
      from public.test_attempts ta
      left join public.classes attempt_class on attempt_class.id = ta.class_id_at_attempt
      left join public.test_assignments assignment on assignment.id = ta.assignment_id
      left join public.classes assignment_class on assignment_class.id = assignment.class_id
      where ta.id = attempt_uuid
        and (
          attempt_class.owner_teacher_id = app_private.current_teacher_id()
          or assignment_class.owner_teacher_id = app_private.current_teacher_id()
        )
    )
$$;

revoke all on function app_private.teacher_can_access_attempt(uuid) from public;
grant execute on function app_private.teacher_can_access_attempt(uuid) to authenticated, service_role;

create or replace function app_private.protect_class_managed_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  generated_code text;
  position integer;
begin
  if current_user = 'authenticated' then
    if tg_op = 'INSERT' then
      if new.is_system then
        raise exception 'System class flags are managed by the server.';
      end if;

      if new.join_code is not null then
        raise exception 'Class join codes are managed by the server.';
      end if;
    elsif tg_op = 'UPDATE' then
      if old.is_system is distinct from new.is_system then
        raise exception 'System class flags are managed by the server.';
      end if;

      if old.join_code is distinct from new.join_code then
        raise exception 'Class join codes are managed by the server.';
      end if;

      if old.is_system and new.status <> 'active' then
        raise exception 'System classes cannot be archived.';
      end if;

      if old.is_system and new.accepting_students then
        raise exception 'System classes cannot accept student join codes.';
      end if;
    end if;
  end if;

  if new.is_system then
    new.join_code := null;
    new.accepting_students := false;
    new.status := 'active';
  elsif new.join_code is null then
    loop
      generated_code := '';
      for position in 1..6 loop
        generated_code := generated_code || substr(alphabet, floor(random() * length(alphabet) + 1)::integer, 1);
      end loop;

      exit when not exists (
        select 1
        from public.classes
        where join_code = generated_code
          and id <> new.id
      );
    end loop;

    new.join_code := generated_code;
  end if;

  return new;
end
$$;

drop trigger if exists classes_protect_managed_fields on public.classes;

create trigger classes_protect_managed_fields
before insert or update on public.classes
for each row execute function app_private.protect_class_managed_fields();

revoke all on function app_private.protect_class_managed_fields() from public;
grant execute on function app_private.protect_class_managed_fields() to service_role;

drop policy if exists "attempts read by owner teacher admin" on public.test_attempts;

create policy "attempts read by owner teacher admin"
on public.test_attempts for select
to authenticated
using (
  student_id = app_private.current_student_id()
  or app_private.teacher_can_access_attempt(id)
  or app_private.is_admin()
);

drop policy if exists "answers read by owner when released or staff" on public.student_answers;

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
        or app_private.teacher_can_access_attempt(ta.id)
        or app_private.is_admin()
      )
  )
);

drop policy if exists "display orders staff only" on public.answer_display_orders;

create policy "display orders staff only"
on public.answer_display_orders for select
to authenticated
using (
  exists (
    select 1
    from public.test_attempts ta
    where ta.id = answer_display_orders.attempt_id
      and (app_private.teacher_can_access_attempt(ta.id) or app_private.is_admin())
  )
);

drop policy if exists "attempt events read by owner teacher admin" on public.attempt_events;

create policy "attempt events read by owner teacher admin"
on public.attempt_events for select
to authenticated
using (
  student_id = app_private.current_student_id()
  or app_private.teacher_can_access_attempt(attempt_id)
  or app_private.is_admin()
);

drop policy if exists "attempt resets read by staff" on public.assigned_attempt_resets;

create policy "attempt resets read by staff"
on public.assigned_attempt_resets for select
to authenticated
using (
  app_private.is_admin()
  or exists (
    select 1
    from public.test_assignments assignment
    where assignment.id = assigned_attempt_resets.assignment_id
      and app_private.teacher_owns_class(assignment.class_id)
  )
);

drop policy if exists "leaderboards read by class members staff admin" on public.leaderboard_snapshots;

create policy "leaderboards read by class members staff admin"
on public.leaderboard_snapshots for select
to authenticated
using (
  app_private.is_admin()
  or (class_id is not null and app_private.teacher_owns_class(class_id))
  or (class_id is not null and app_private.student_in_class(class_id))
);
