import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    if (requester.role !== 'student') return errorResponse('Student permission required', 403);

    const body = await req.json();
    const attemptId = String(body.attemptId ?? '');
    const questionId = body.questionId ? String(body.questionId) : '';
    const resumeQuestionIndex = Number.isInteger(body.resumeQuestionIndex) && body.resumeQuestionIndex >= 0
      ? Number(body.resumeQuestionIndex)
      : undefined;
    if (!attemptId || (!questionId && resumeQuestionIndex === undefined)) {
      return errorResponse('attemptId and either questionId or resumeQuestionIndex are required', 422);
    }

    const { data: student } = await service.from('student_profiles').select('id').eq('profile_id', requester.id).single();
    if (!student) return errorResponse('Student profile not found', 403);

    const { data: attempt } = await service
      .from('test_attempts')
      .select('id, status, expires_at, student_id')
      .eq('id', attemptId)
      .eq('student_id', student.id)
      .single();
    if (!attempt) return errorResponse('Attempt not found', 404);
    if (attempt.status !== 'in_progress') return errorResponse('Cannot save to a submitted attempt', 409);
    if (attempt.expires_at && new Date(attempt.expires_at).getTime() < Date.now()) {
      return errorResponse('Attempt has expired', 409);
    }

    if (resumeQuestionIndex !== undefined) {
      const { error } = await service.from('test_attempts')
        .update({ resume_question_index: resumeQuestionIndex })
        .eq('id', attemptId)
        .eq('student_id', student.id);
      if (error) throw error;
    }

    if (questionId) {
      const answer = body.answer ?? null;
      const { error } = await service.from('student_answers').upsert(
        {
          attempt_id: attemptId,
          question_id: questionId,
          answer,
          answer_text: typeof answer === 'string' ? answer : null,
          max_marks: body.maxMarks ?? null,
          last_saved_at: new Date().toISOString(),
        },
        { onConflict: 'attempt_id,question_id' },
      );
      if (error) throw error;
    }

    return jsonResponse({ savedAt: new Date().toISOString() });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to save answer', 400);
  }
});
