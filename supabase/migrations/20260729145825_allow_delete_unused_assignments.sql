-- Teachers may permanently remove an assignment only when it has no attempts.
-- Assignments with learner history are archived by the application instead.
create policy "assignments deleted by owner teacher or admin"
on public.test_assignments for delete
to authenticated
using (app_private.teacher_owns_class(class_id) or app_private.is_admin());
