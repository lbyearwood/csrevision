import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester, requireStaff, teacherCanAccessStudent, teacherOwnsClass } from '../_shared/supabase.ts';

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
    const nextClassId = String(body.classId ?? '').trim();
    const nextStatusRaw = String(body.accountStatus ?? '').trim();
    const nextStatus: AccountStatus = validStatus(nextStatusRaw) ? nextStatusRaw : 'active';

    if (!studentId) return errorResponse('studentId is required', 422);
    if (!firstName || !surname) return errorResponse('firstName and surname are required', 422);
    if (nextStatus !== 'archived' && !nextClassId) return errorResponse('classId is required', 422);
    if (!(await teacherCanAccessStudent(service, requester, studentId))) return errorResponse('Forbidden', 403);

    if (nextStatus !== 'archived') {
      if (!(await teacherOwnsClass(service, requester, nextClassId))) {
        return errorResponse('You cannot move students to this class', 403);
      }
      const { data: targetClass, error: targetClassError } = await service
        .from('classes')
        .select('id, status')
        .eq('id', nextClassId)
        .single();
      if (targetClassError || !targetClass || targetClass.status !== 'active') {
        return errorResponse('Target class must be active', 422);
      }
    }

    const { data: student, error: studentError } = await service
      .from('student_profiles')
      .select('id, profile_id, first_name, surname, student_id, account_status, profiles!student_profiles_profile_id_fkey(id, auth_user_id, username, account_status), class_memberships!class_memberships_student_id_fkey(id, class_id, status)')
      .eq('id', studentId)
      .single();
    if (studentError || !student) throw studentError ?? new Error('Student not found');

    const profile = one(student.profiles as RelatedProfile | RelatedProfile[] | null);
    if (!profile) throw new Error('Profile not found');

    const memberships = ((student.class_memberships ?? []) as RelatedMembership[]).filter((membership) => membership.status === 'active');
    const currentClassId = memberships[0]?.class_id ?? '';
    const statusChanged = student.account_status !== nextStatus || profile.account_status !== nextStatus;
    const classChanged = nextStatus !== 'archived' && currentClassId !== nextClassId;
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
      const { error: endMembershipError } = await service
        .from('class_memberships')
        .update({
          status: 'ended',
          end_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('student_id', studentId)
        .eq('status', 'active');
      if (endMembershipError) throw endMembershipError;
    }

    if (!archived && classChanged) {
      const { error: membershipError } = await service.from('class_memberships').insert({
        class_id: nextClassId,
        student_id: studentId,
        status: 'active',
      });
      if (membershipError) throw membershipError;
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
        detail: { fromClassId: currentClassId, toClassId: nextClassId },
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
        detail: { fromClassId: currentClassId },
      });
    }

    const { error: auditError } = await service.from('audit_logs').insert(auditRows);
    if (auditError) throw auditError;

    return jsonResponse({
      student: {
        id: studentId,
        profileId: student.profile_id,
        firstName,
        surname,
        username: profile.username ?? '',
        publicStudentId: student.student_id,
        classId: archived ? '' : nextClassId || currentClassId,
        accountStatus: nextStatus,
      },
    });
  } catch (error) {
    return errorResponse(errorMessage(error), 400);
  }
});
