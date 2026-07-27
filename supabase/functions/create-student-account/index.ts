import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { buildUsernameStem, generateTemporaryPassword, randomFourDigits, syntheticStudentEmail } from '../_shared/identity.ts';
import { createServiceClient, getRequester, requireStaff, teacherOwnsClass } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    await requireStaff(requester);

    const body = await req.json();
    const firstName = String(body.firstName ?? '').trim();
    const surname = String(body.surname ?? '').trim();
    const classId = String(body.classId ?? '');
    if (!firstName || !surname || !classId) {
      return errorResponse('firstName, surname and classId are required', 422);
    }

    if (!(await teacherOwnsClass(service, requester, classId))) {
      return errorResponse('You cannot add students to this class', 403);
    }
    const { data: targetClass, error: targetClassError } = await service
      .from('classes')
      .select('id, status')
      .eq('id', classId)
      .single();
    if (targetClassError || !targetClass || targetClass.status !== 'active') {
      return errorResponse('Target class must be active', 422);
    }

    const stem = buildUsernameStem(firstName, surname);
    let username = body.username ? String(body.username).toLowerCase().replace(/[^a-z0-9]/g, '') : `${stem}${randomFourDigits()}`;
    for (let attempts = 0; attempts < 25; attempts += 1) {
      const { data: existing } = await service.from('profiles').select('id').eq('username', username).maybeSingle();
      if (!existing) break;
      username = `${stem}${randomFourDigits()}`;
    }

    const { data: collision } = await service.from('profiles').select('id').eq('username', username).maybeSingle();
    if (collision) return errorResponse('Username is already taken', 409);

    const existingIds = await service.from('student_profiles').select('student_id');
    const usedIds = new Set((existingIds.data ?? []).map((row) => row.student_id));
    let publicStudentId = randomFourDigits();
    while (usedIds.has(publicStudentId) || username.endsWith(publicStudentId)) {
      publicStudentId = randomFourDigits();
    }

    const email = syntheticStudentEmail(username);
    const temporaryPassword = body.temporaryPassword ? String(body.temporaryPassword) : generateTemporaryPassword();

    const { data: authUser, error: authError } = await service.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      app_metadata: { role: 'student' },
    });
    if (authError || !authUser.user) throw authError ?? new Error('Auth user was not created');

    const { data: profile, error: profileError } = await service
      .from('profiles')
      .insert({
        auth_user_id: authUser.user.id,
        role: 'student',
        display_name: `${firstName} ${surname}`,
        username,
      })
      .select('id')
      .single();
    if (profileError) throw profileError;

    const { data: student, error: studentError } = await service
      .from('student_profiles')
      .insert({
        profile_id: profile.id,
        first_name: firstName,
        surname,
        student_id: publicStudentId,
        internal_auth_email: email,
        created_by: requester.id,
      })
      .select('id')
      .single();
    if (studentError) throw studentError;

    const { error: membershipError } = await service.from('class_memberships').insert({
      class_id: classId,
      student_id: student.id,
    });
    if (membershipError) throw membershipError;

    await service.from('audit_logs').insert({
      actor_profile_id: requester.id,
      action: 'student_created',
      target_type: 'student_profiles',
      target_id: student.id,
      detail: { classId, username },
    });

    return jsonResponse({
      studentId: student.id,
      username,
      publicStudentId,
      temporaryPassword,
      internalEmail: email,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to create student', 400);
  }
});
