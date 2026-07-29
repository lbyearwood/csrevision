-- Avoid mutual RLS evaluation between assignments and recipients.
create or replace function app_private.current_student_is_assignment_recipient(assignment_uuid uuid)
returns boolean
language sql
security definer
set search_path = public, app_private
as $$
  select exists (
    select 1
    from public.assignment_recipients recipient
    where recipient.assignment_id = assignment_uuid
      and recipient.student_id = app_private.current_student_id()
  )
$$;

revoke all on function app_private.current_student_is_assignment_recipient(uuid) from public;
grant execute on function app_private.current_student_is_assignment_recipient(uuid) to authenticated;

drop policy if exists "assignments read by recipient student teacher admin" on public.test_assignments;
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
      or app_private.current_student_is_assignment_recipient(id)
    )
  )
);
