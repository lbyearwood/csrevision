import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester, requireStaff, teacherCanAccessStudent, teacherProfileIdForRequester } from '../_shared/supabase.ts';

type AccountStatus = 'active' | 'inactive' | 'archived';

interface RelatedProfile {
  id: string;
  auth_user_id: string;
  username: string | null;
  account_status: AccountStatus;
}

interface RelatedMembership {
  id: string;
  class_id: string;
  status: 'active' | 'ended';
}

interface RelatedClass {
  id: string;
  owner_teacher_id: string;
  is_system: boolean;
  status: 'active' | 'archived';
}

interface ActiveMembership {
  id: string;
  class_id: string;
  student_id: string;
  classes?: RelatedClass | RelatedClass[] | null;
}

interface AuditRow {
  actor_profile_id: string;
  action: string;
  target_type: string;
  target_id: string;
  detail: Record<string, unknown>;
}

function one<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function validStatus(value: string): value is AccountStatus {
  return value === 'active' || value === 'inactive' || value === 'archived';
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Unable to update student';
}

function normalizeClassIds(value: unknown, legacyClassId: unknown): string[] {
  const source = Array.isArray(value) ? value : [legacyClassId];
  return Array.from(
    new Set(
      source
        .map((item) => String(item ?? '').trim())
        .filter(Boolean),
    ),
  );
}

function sameStringSet(first: string[], second: string[]): boolean {
  if (first.length !== second.length) return false;
  const secondSet = new Set(second);
  return first.every((value) => secondSet.has(value));
}

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    await requireStaff(requester);

    const body = await req.json();
    const studentId = String(body.studentId ?? '').trim();
    const firstName = String(body.firstName ?? '').trim();
    const surname = String(body.surname ?? '').trim();
    const requestedClassIds = normalizeClassIds(body.classIds, body.classId);
    const nextStatusRaw = String(body.accountStatus ?? '').trim();
    const nextStatus: AccountStatus = validStatus(nextStatusRaw) ? nextStatusRaw : 'active';

    if (!studentId) return errorResponse('studentId is required', 422);
    if (!firstName || !surname) return errorResponse('firstName and surname are required', 422);
    if (!(await teacherCanAccessStudent(service, requester, studentId))) return errorResponse('Forbidden', 403);
    const teacherProfileId = await teacherProfileIdForRequester(service, requester);
    let finalClassIds: string[] = [];

    const { data: student, error: studentError } = await service
      .from('student_profiles')
      .select('id, profile_id, first_name, surname, student_id, account_status, profiles!student_profiles_profile_id_fkey(id, auth_user_id, username, account_status)')
      .eq('id', studentId)
      .single();
    if (studentError || !student) throw studentError ?? new Error('Student not found');

    const profile = one(student.profiles as RelatedProfile | RelatedProfile[] | null);
    if (!profile) throw new Error('Profile not found');

    const { data: membershipRows, error: membershipsError } = await service
      .from('class_memberships')
      .select('id, class_id, student_id, classes!inner(id, owner_teacher_id, is_system, status)')
      .eq('student_id', studentId)
      .eq('status', 'active');
    if (membershipsError) throw membershipsError;

    const memberships = (membershipRows ?? []) as ActiveMembership[];
    const requesterOwnedMemberships =
      requester.role === 'admin'
        ? memberships
        : memberships.filter((membership) => one(membership.classes)?.owner_teacher_id === teacherProfileId);

    if (nextStatus !== 'archived') {
      if (requestedClassIds.length) {
        const { data: targetClassRows, error: targetClassesError } = await service
          .from('classes')
          .select('id, owner_teacher_id, is_system, status')
          .in('id', requestedClassIds);
        if (targetClassesError) throw targetClassesError;

        const targetClasses = (targetClassRows ?? []) as RelatedClass[];
        if (targetClasses.length !== requestedClassIds.length) {
          return errorResponse('One or more selected classes could not be found', 422);
        }

        const invalidClass = targetClasses.find(
          (classRecord) =>
            classRecord.status !== 'active' ||
            (requester.role !== 'admin' && classRecord.owner_teacher_id !== teacherProfileId),
        );
        if (invalidClass) return errorResponse('Selected classes must be active and owned by this teacher', 403);

        const selectedRealClassIds = targetClasses.filter((classRecord) => !classRecord.is_system).map((classRecord) => classRecord.id);
        finalClassIds = selectedRealClassIds.length
          ? selectedRealClassIds
          : targetClasses.filter((classRecord) => classRecord.is_system).map((classRecord) => classRecord.id);
      }

      if (!finalClassIds.length && requester.role === 'teacher') {
        const { data: nonClass, error: nonClassError } = await service
          .from('classes')
          .select('id')
          .eq('owner_teacher_id', teacherProfileId)
          .eq('is_system', true)
          .eq('status', 'active')
          .single();
        if (nonClassError || !nonClass) {
          return errorResponse('Non-class holding class is required before clearing class memberships', 422);
        }
        finalClassIds = [nonClass.id];
      }

      if (!finalClassIds.length) return errorResponse('At least one class is required', 422);
      finalClassIds = Array.from(new Set(finalClassIds));
    }

    const currentClassIds = requesterOwnedMemberships.map((membership) => membership.class_id);
    const finalClassIdSet = new Set(finalClassIds);
    const statusChanged = student.account_status !== nextStatus || profile.account_status !== nextStatus;
    const classChanged = nextStatus !== 'archived' && !sameStringSet(currentClassIds, finalClassIds);
    const archived = nextStatus === 'archived';
    const today = new Date().toISOString().slice(0, 10);
    const displayName = `${firstName} ${surname}`;

    const { error: profileUpdateError } = await service
      .from('profiles')
      .update({
        display_name: displayName,
        account_status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', student.profile_id);
    if (profileUpdateError) throw profileUpdateError;

    const { error: studentUpdateError } = await service
      .from('student_profiles')
      .update({
        first_name: firstName,
        surname,
        account_status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', studentId);
    if (studentUpdateError) throw studentUpdateError;

    if (archived || classChanged) {
      const membershipsToEnd = archived
        ? memberships
        : requesterOwnedMemberships.filter((membership) => !finalClassIdSet.has(membership.class_id));
      if (membershipsToEnd.length) {
        const { error: endMembershipError } = await service
          .from('class_memberships')
          .update({
            status: 'ended',
            end_date: today,
            updated_at: new Date().toISOString(),
          })
          .in('id', membershipsToEnd.map((membership) => membership.id));
        if (endMembershipError) throw endMembershipError;
      }
    }

    if (!archived && classChanged) {
      const currentClassIdSet = new Set(currentClassIds);
      const membershipsToCreate = finalClassIds.filter((classId) => !currentClassIdSet.has(classId));
      if (membershipsToCreate.length) {
        const { error: membershipError } = await service.from('class_memberships').insert(
          membershipsToCreate.map((classId) => ({
            class_id: classId,
            student_id: studentId,
            status: 'active',
          })),
        );
        if (membershipError) throw membershipError;
      }
    }

    const auditRows: AuditRow[] = [
      {
        actor_profile_id: requester.id,
        action: 'student_updated',
        target_type: 'student_profiles',
        target_id: studentId,
        detail: { firstName, surname },
      },
    ];
    if (classChanged) {
      auditRows.push({
        actor_profile_id: requester.id,
        action: 'student_class_changed',
        target_type: 'student_profiles',
        target_id: studentId,
        detail: { fromClassIds: currentClassIds, toClassIds: finalClassIds },
      });
    }
    if (statusChanged) {
      auditRows.push({
        actor_profile_id: requester.id,
        action: 'student_status_changed',
        target_type: 'student_profiles',
        target_id: studentId,
        detail: { fromStatus: student.account_status, toStatus: nextStatus },
      });
    }
    if (archived) {
      auditRows.push({
        actor_profile_id: requester.id,
        action: 'student_archived',
        target_type: 'student_profiles',
        target_id: studentId,
        detail: { fromClassIds: currentClassIds },
      });
    }

    const { error: auditError } = await service.from('audit_logs').insert(auditRows);
    if (auditError) throw auditError;

    const { data: nextMembershipRows, error: nextMembershipError } = archived
      ? { data: [], error: null }
      : await service
          .from('class_memberships')
          .select('class_id')
          .eq('student_id', studentId)
          .eq('status', 'active');
    if (nextMembershipError) throw nextMembershipError;

    const classIds = ((nextMembershipRows ?? []) as RelatedMembership[]).map((membership) => membership.class_id);

    return jsonResponse({
      student: {
        id: studentId,
        profileId: student.profile_id,
        firstName,
        surname,
        username: profile.username ?? '',
        publicStudentId: student.student_id,
        classId: archived ? '' : finalClassIds[0] || classIds[0] || currentClassIds[0] || '',
        classIds,
        accountStatus: nextStatus,
      },
    });
  } catch (error) {
    return errorResponse(errorMessage(error), 400);
  }
});
