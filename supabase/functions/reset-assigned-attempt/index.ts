import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester, requireStaff, teacherCanAccessStudent } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    await requireStaff(requester);
    const body = await req.json();
    const attemptId = String(body.attemptId ?? '');
    const reason = String(body.reason ?? '').trim();
    if (!attemptId || !reason) return errorResponse('attemptId and reason are required', 422);

    const { data: attempt, error: attemptError } = await service
      .from('test_attempts')
      .select('id, student_id, assignment_id, attempt_type, voided_at')
      .eq('id', attemptId)
      .single();
    if (attemptError || !attempt) throw attemptError ?? new Error('Attempt not found');
    if (attempt.attempt_type !== 'assigned' || !attempt.assignment_id) {
      return errorResponse('Only assigned attempts can be reset', 422);
    }
    if (attempt.voided_at) return errorResponse('Attempt is already voided', 409);
    if (!(await teacherCanAccessStudent(service, requester, attempt.student_id))) {
      return errorResponse('Forbidden', 403);
    }

    const now = new Date().toISOString();
    const { error: updateError } = await service.from('test_attempts').update({
      status: 'voided',
      voided_at: now,
      voided_by: requester.id,
      void_reason: reason,
    }).eq('id', attemptId);
    if (updateError) throw updateError;

    await service.from('assigned_attempt_resets').insert({
      original_attempt_id: attemptId,
      student_id: attempt.student_id,
      assignment_id: attempt.assignment_id,
      reset_by: requester.id,
      reason,
    });

    await service.from('audit_logs').insert({
      actor_profile_id: requester.id,
      action: 'assigned_attempt_reset',
      target_type: 'test_attempts',
      target_id: attemptId,
      detail: { reason },
    });

    return jsonResponse({ reset: true, voidedAt: now });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to reset attempt', 400);
  }
});
