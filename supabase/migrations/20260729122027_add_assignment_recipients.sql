-- An assignment may target the whole class or a fixed set of selected class members.
-- Existing assignments stay class-wide for backwards compatibility.
alter table public.test_assignments
  add column recipient_scope text not null default 'class'
  check (recipient_scope in ('class', 'selected'));

create table public.assignment_recipients (
  assignment_id uuid not null references public.test_assignments(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (assignment_id, student_id)
);

create index assignment_recipients_student_idx
  on public.assignment_recipients (student_id, assignment_id);

alter table public.assignment_recipients enable row level security;

drop policy if exists "assignments read by assigned student teacher admin" on public.test_assignments;
create policy "assignments read by recipient student teacher admin"
on public.test_assignments for select
to authenticated
using (
  app_private.teacher_owns_class(class_id)
  or app_private.is_admin()
  or (
    app_private.student_in_class(class_id)
    and (
      recipient_scope = 'class'
      or exists (
        select 1
        from public.assignment_recipients recipient
        where recipient.assignment_id = test_assignments.id
          and recipient.student_id = app_private.current_student_id()
      )
    )
  )
);

create policy "assignment recipients read by recipient teacher admin"
on public.assignment_recipients for select
to authenticated
using (
  student_id = app_private.current_student_id()
  or app_private.is_admin()
  or exists (
    select 1
    from public.test_assignments assignment
    where assignment.id = assignment_recipients.assignment_id
      and app_private.teacher_owns_class(assignment.class_id)
  )
);

create policy "assignment recipients created by class owner or admin"
on public.assignment_recipients for insert
to authenticated
with check (
  app_private.is_admin()
  or exists (
    select 1
    from public.test_assignments assignment
    join public.class_memberships membership
      on membership.class_id = assignment.class_id
      and membership.student_id = assignment_recipients.student_id
      and membership.status = 'active'
    where assignment.id = assignment_recipients.assignment_id
      and app_private.teacher_owns_class(assignment.class_id)
  )
);

create policy "assignment recipients removed by class owner or admin"
on public.assignment_recipients for delete
to authenticated
using (
  app_private.is_admin()
  or exists (
    select 1
    from public.test_assignments assignment
    where assignment.id = assignment_recipients.assignment_id
      and app_private.teacher_owns_class(assignment.class_id)
  )
);

grant select, insert, delete on public.assignment_recipients to authenticated;
