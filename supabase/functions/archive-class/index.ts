import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester, requireStaff, teacherProfileIdForRequester } from '../_shared/supabase.ts';

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

interface MembershipRow {
  id: string;
  student_id: string;
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

    const { data: classRecord, error: classError } = await service
      .from('classes')
      .select('id, class_name, academic_year, year_group, owner_teacher_id, status, join_code, accepting_students, is_system')
      .eq('id', classId)
      .single();
    if (classError || !classRecord) throw classError ?? new Error('Class not found');

    const classRow = classRecord as ClassRow;
    const teacherProfileId = await teacherProfileIdForRequester(service, requester);
    if (requester.role !== 'admin' && classRow.owner_teacher_id !== teacherProfileId) {
      return errorResponse('Forbidden', 403);
    }
    if (classRow.is_system) return errorResponse('Non-class cannot be archived', 422);
    if (classRow.status === 'archived') {
      return jsonResponse({ class: mapClass(classRow), movedStudentIds: [] });
    }

    const { data: memberships, error: membershipsError } = await service
      .from('class_memberships')
      .select('id, student_id')
      .eq('class_id', classId)
      .eq('status', 'active');
    if (membershipsError) throw membershipsError;

    const affectedStudentIds = Array.from(new Set(((memberships ?? []) as MembershipRow[]).map((membership) => membership.student_id)));
    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    const { data: updatedClass, error: updateClassError } = await service
      .from('classes')
      .update({
        status: 'archived',
        accepting_students: false,
        updated_at: now,
      })
      .eq('id', classId)
      .select('id, class_name, academic_year, year_group, owner_teacher_id, status, join_code, accepting_students, is_system')
      .single();
    if (updateClassError || !updatedClass) throw updateClassError ?? new Error('Class was not archived');

    if (affectedStudentIds.length) {
      const { error: endMembershipsError } = await service
        .from('class_memberships')
        .update({
          status: 'ended',
          end_date: today,
          updated_at: now,
        })
        .eq('class_id', classId)
        .eq('status', 'active');
      if (endMembershipsError) throw endMembershipsError;
    }

    const { data: nonClassRows, error: nonClassReadError } = await service
      .from('classes')
      .select('id')
      .eq('owner_teacher_id', classRow.owner_teacher_id)
      .eq('is_system', true)
      .limit(1);
    if (nonClassReadError) throw nonClassReadError;

    let nonClassId = nonClassRows?.[0]?.id as string | undefined;
    if (!nonClassId) {
      const { data: createdNonClass, error: nonClassCreateError } = await service
        .from('classes')
        .insert({
          slug: 'non-class',
          class_name: 'Non-class',
          owner_teacher_id: classRow.owner_teacher_id,
          status: 'active',
          accepting_students: false,
          is_system: true,
        })
        .select('id')
        .single();
      if (nonClassCreateError || !createdNonClass) throw nonClassCreateError ?? new Error('Non-class was not created');
      nonClassId = createdNonClass.id;
    }

    let movedStudentIds: string[] = [];
    if (affectedStudentIds.length) {
      const { data: remainingRealMemberships, error: remainingError } = await service
        .from('class_memberships')
        .select('student_id, classes!inner(owner_teacher_id, is_system, status)')
        .in('student_id', affectedStudentIds)
        .eq('status', 'active')
        .eq('classes.owner_teacher_id', classRow.owner_teacher_id)
        .eq('classes.is_system', false)
        .eq('classes.status', 'active');
      if (remainingError) throw remainingError;

      const studentsWithRealClass = new Set((remainingRealMemberships ?? []).map((membership) => membership.student_id as string));

      const { data: existingNonClassMemberships, error: existingNonClassError } = await service
        .from('class_memberships')
        .select('student_id')
        .in('student_id', affectedStudentIds)
        .eq('class_id', nonClassId)
        .eq('status', 'active');
      if (existingNonClassError) throw existingNonClassError;

      const studentsAlreadyInNonClass = new Set((existingNonClassMemberships ?? []).map((membership) => membership.student_id as string));
      movedStudentIds = affectedStudentIds.filter(
        (studentId) => !studentsWithRealClass.has(studentId) && !studentsAlreadyInNonClass.has(studentId),
      );

      if (movedStudentIds.length) {
        const { error: nonClassMembershipError } = await service.from('class_memberships').insert(
          movedStudentIds.map((studentId) => ({
            class_id: nonClassId,
            student_id: studentId,
            status: 'active',
          })),
        );
        if (nonClassMembershipError) throw nonClassMembershipError;
      }
    }

    await service.from('audit_logs').insert([
      {
        actor_profile_id: requester.id,
        action: 'class_archived',
        target_type: 'classes',
        target_id: classId,
        detail: { movedStudentIds, endedMembershipCount: affectedStudentIds.length },
      },
      ...movedStudentIds.map((studentId) => ({
        actor_profile_id: requester.id,
        action: 'student_moved_to_non_class',
        target_type: 'student_profiles',
        target_id: studentId,
        detail: { fromClassId: classId, toClassId: nonClassId },
      })),
    ]);

    return jsonResponse({ class: mapClass(updatedClass as ClassRow), movedStudentIds });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to archive class', 400);
  }
});
