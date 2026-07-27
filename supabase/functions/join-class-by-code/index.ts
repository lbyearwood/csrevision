import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester, normalizeClassJoinCode } from '../_shared/supabase.ts';

interface ClassRow {
  id: string;
  class_name: string;
  academic_year: string | null;
  year_group: string | null;
  owner_teacher_id: string;
  status: 'active' | 'archived';
  join_code: string | null;
  accepting_students: boolean;
  is_system: boolean;
}

function mapClass(row: ClassRow) {
  return {
    id: row.id,
    className: row.class_name,
    academicYear: row.academic_year ?? '',
    yearGroup: row.year_group ?? '',
    ownerTeacherId: row.owner_teacher_id,
    status: row.status,
    joinCode: row.join_code ?? '',
    acceptingStudents: row.accepting_students,
    isSystem: row.is_system,
  };
}

async function endNonClassMembershipForOwner(service: ReturnType<typeof createServiceClient>, studentId: string, ownerTeacherId: string) {
  const { data: nonClassRows, error: nonClassError } = await service
    .from('classes')
    .select('id')
    .eq('owner_teacher_id', ownerTeacherId)
    .eq('is_system', true);
  if (nonClassError) throw nonClassError;

  const nonClassIds = (nonClassRows ?? []).map((row) => row.id as string);
  if (!nonClassIds.length) return;

  const { error: endError } = await service
    .from('class_memberships')
    .update({
      status: 'ended',
      end_date: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    })
    .eq('student_id', studentId)
    .eq('status', 'active')
    .in('class_id', nonClassIds);
  if (endError) throw endError;
}

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    if (requester.role !== 'student') return errorResponse('Student permission required', 403);

    const body = await req.json();
    const code = normalizeClassJoinCode(String(body.code ?? ''));
    if (code.length !== 6) return errorResponse('Enter a 6-letter class code', 422);

    const { data: student, error: studentError } = await service
      .from('student_profiles')
      .select('id, account_status')
      .eq('profile_id', requester.id)
      .eq('account_status', 'active')
      .single();
    if (studentError || !student) return errorResponse('Active student account required', 403);

    const { data: classRecord, error: classError } = await service
      .from('classes')
      .select('id, class_name, academic_year, year_group, owner_teacher_id, status, join_code, accepting_students, is_system')
      .eq('join_code', code)
      .maybeSingle();
    if (classError) throw classError;
    if (!classRecord) return errorResponse('Class code not found', 404);

    const classRow = classRecord as ClassRow;
    if (classRow.is_system) return errorResponse('This class code cannot be joined', 403);
    if (classRow.status !== 'active') return errorResponse('This class is not active', 403);
    if (!classRow.accepting_students) return errorResponse('This class is not currently accepting students', 403);

    const { data: existingMembership, error: existingError } = await service
      .from('class_memberships')
      .select('id')
      .eq('class_id', classRow.id)
      .eq('student_id', student.id)
      .eq('status', 'active')
      .maybeSingle();
    if (existingError) throw existingError;
    if (existingMembership) {
      await endNonClassMembershipForOwner(service, student.id, classRow.owner_teacher_id);
      return jsonResponse({
        status: 'already_joined',
        message: `You are already in ${classRow.class_name}.`,
        class: mapClass(classRow),
      });
    }

    const { error: membershipError } = await service.from('class_memberships').insert({
      class_id: classRow.id,
      student_id: student.id,
      status: 'active',
    });
    if (membershipError) throw membershipError;

    await endNonClassMembershipForOwner(service, student.id, classRow.owner_teacher_id);

    await service.from('audit_logs').insert({
      actor_profile_id: requester.id,
      action: 'student_joined_class_by_code',
      target_type: 'classes',
      target_id: classRow.id,
      detail: { code },
    });

    return jsonResponse({
      status: 'joined',
      message: `You have joined ${classRow.class_name}.`,
      class: mapClass(classRow),
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to join class', 400);
  }
});
