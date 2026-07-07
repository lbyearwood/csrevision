import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester } from '../_shared/supabase.ts';

function shuffle<T>(values: T[]): T[] {
  return [...values].sort(() => Math.random() - 0.5);
}

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    if (requester.role !== 'student') return errorResponse('Student permission required', 403);

    const { data: student, error: studentError } = await service
      .from('student_profiles')
      .select('id, class_memberships!inner(class_id, status)')
      .eq('profile_id', requester.id)
      .eq('class_memberships.status', 'active')
      .single();
    if (studentError || !student) throw studentError ?? new Error('Student profile not found');

    const body = await req.json();
    const assignmentId = body.assignmentId ? String(body.assignmentId) : undefined;
    const testVersionId = body.testVersionId ? String(body.testVersionId) : undefined;
    const activeClassId = (student.class_memberships as Array<{ class_id: string }>)[0]?.class_id;
    if (!activeClassId) return errorResponse('Student is not in an active class', 403);

    let versionId = testVersionId;
    let assignment = null as null | {
      id: string;
      test_version_id: string;
      class_id: string;
      time_limit_seconds: number | null;
      due_at: string | null;
      start_at: string | null;
    };
    let attemptType: 'practice' | 'assigned' = 'practice';

    if (assignmentId) {
      const { data, error } = await service
        .from('test_assignments')
        .select('id, test_version_id, class_id, time_limit_seconds, due_at, start_at, status')
        .eq('id', assignmentId)
        .single();
      if (error || !data) throw error ?? new Error('Assignment not found');
      if (data.class_id !== activeClassId) return errorResponse('Assignment is not for your class', 403);
      if (data.status !== 'open') return errorResponse('Assignment is not open', 403);
      const now = Date.now();
      if (data.start_at && new Date(data.start_at).getTime() > now) return errorResponse('Assignment has not started', 403);
      if (data.due_at && new Date(data.due_at).getTime() < now) return errorResponse('Assignment deadline has passed', 403);

      const { data: existingAttempt } = await service
        .from('test_attempts')
        .select('id')
        .eq('student_id', student.id)
        .eq('assignment_id', assignmentId)
        .is('voided_at', null)
        .maybeSingle();
      if (existingAttempt) return errorResponse('This assigned assessment has already been started', 409);

      assignment = data;
      versionId = data.test_version_id;
      attemptType = 'assigned';
    }

    if (!versionId) return errorResponse('assignmentId or testVersionId is required', 422);

    const { data: version, error: versionError } = await service
      .from('test_versions')
      .select('id, test_id, status, tests!inner(id, default_time_limit_seconds, status)')
      .eq('id', versionId)
      .single();
    if (versionError || !version) throw versionError ?? new Error('Test version not found');
    if (version.status !== 'published') return errorResponse('Test version is not published', 403);

    const timeLimitSeconds =
      assignment?.time_limit_seconds ?? (version.tests as { default_time_limit_seconds: number | null }).default_time_limit_seconds;
    const expiresAt = timeLimitSeconds
      ? new Date(Date.now() + timeLimitSeconds * 1000).toISOString()
      : null;

    const { count } = await service
      .from('test_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', student.id)
      .eq('test_version_id', versionId);

    const { data: attempt, error: attemptError } = await service
      .from('test_attempts')
      .insert({
        student_id: student.id,
        class_id_at_attempt: activeClassId,
        test_id: (version.tests as { id: string }).id,
        test_version_id: versionId,
        assignment_id: assignment?.id,
        attempt_type: attemptType,
        attempt_number: (count ?? 0) + 1,
        time_limit_seconds: timeLimitSeconds,
        expires_at: expiresAt,
      })
      .select('id, started_at, expires_at')
      .single();
    if (attemptError || !attempt) throw attemptError ?? new Error('Attempt was not created');

    const { data: questions, error: questionsError } = await service
      .from('questions')
      .select('id, question_order, question_type, question_text, max_marks, media_url, question_options(id, option_text, option_order)')
      .eq('test_version_id', versionId)
      .order('question_order');
    if (questionsError) throw questionsError;

    const safeQuestions = (questions ?? []).map((question) => {
      const options = shuffle(question.question_options ?? []).map((option: { id: string; option_text: string; option_order: number }) => ({
        id: option.id,
        optionText: option.option_text,
      }));
      return {
        id: question.id,
        questionText: question.question_text,
        questionType: question.question_type,
        maxMarks: question.max_marks,
        displayOrder: question.question_order,
        mediaUrl: question.media_url,
        options,
      };
    });

    await Promise.all(
      safeQuestions.map((question) =>
        service.from('answer_display_orders').insert({
          attempt_id: attempt.id,
          question_id: question.id,
          option_ids: question.options.map((option: { id: string }) => option.id),
        }),
      ),
    );

    return jsonResponse({
      attemptId: attempt.id,
      startedAt: attempt.started_at,
      expiresAt: attempt.expires_at,
      timeLimitSeconds,
      questions: safeQuestions,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to start attempt', 400);
  }
});
