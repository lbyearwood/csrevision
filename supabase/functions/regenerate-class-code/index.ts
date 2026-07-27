import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, generateClassJoinCode, getRequester, requireStaff, teacherOwnsClass } from '../_shared/supabase.ts';

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

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    await requireStaff(requester);

    const body = await req.json();
    const classId = String(body.classId ?? '').trim();
    if (!classId) return errorResponse('classId is required', 422);
    if (!(await teacherOwnsClass(service, requester, classId))) return errorResponse('Forbidden', 403);

    const { data: classRecord, error: classError } = await service
      .from('classes')
      .select('id, class_name, academic_year, year_group, owner_teacher_id, status, join_code, accepting_students, is_system')
      .eq('id', classId)
      .single();
    if (classError || !classRecord) throw classError ?? new Error('Class not found');

    const classRow = classRecord as ClassRow;
    if (classRow.is_system) return errorResponse('Non-class does not have a join code', 422);
    if (classRow.status !== 'active') return errorResponse('Archived classes cannot regenerate join codes', 422);

    const joinCode = await generateClassJoinCode(service);
    const { data: updatedClass, error: updateError } = await service
      .from('classes')
      .update({
        join_code: joinCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', classId)
      .select('id, class_name, academic_year, year_group, owner_teacher_id, status, join_code, accepting_students, is_system')
      .single();
    if (updateError || !updatedClass) throw updateError ?? new Error('Class code was not regenerated');

    await service.from('audit_logs').insert({
      actor_profile_id: requester.id,
      action: 'class_join_code_regenerated',
      target_type: 'classes',
      target_id: classId,
      detail: { joinCode },
    });

    return jsonResponse({ class: mapClass(updatedClass as ClassRow) });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to regenerate class code', 400);
  }
});
