import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { generateTemporaryPassword } from '../_shared/identity.ts';
import { createServiceClient, getRequester, requireStaff, teacherCanAccessStudent } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    await requireStaff(requester);
    const body = await req.json();
    const studentId = String(body.studentId ?? '');
    if (!studentId) return errorResponse('studentId is required', 422);
    if (!(await teacherCanAccessStudent(service, requester, studentId))) return errorResponse('Forbidden', 403);

    const { data: student, error: studentError } = await service
      .from('student_profiles')
      .select('id, profiles!inner(auth_user_id, username)')
      .eq('id', studentId)
      .single();
    if (studentError || !student) throw studentError ?? new Error('Student not found');

    const temporaryPassword = body.temporaryPassword ? String(body.temporaryPassword) : generateTemporaryPassword();
    const authUserId = (student.profiles as { auth_user_id: string }).auth_user_id;
    const { error: updateError } = await service.auth.admin.updateUserById(authUserId, {
      password: temporaryPassword,
    });
    if (updateError) throw updateError;

    await service.from('audit_logs').insert({
      actor_profile_id: requester.id,
      action: 'student_password_reset',
      target_type: 'student_profiles',
      target_id: studentId,
      detail: {},
    });

    return jsonResponse({ temporaryPassword });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to reset password', 400);
  }
});
