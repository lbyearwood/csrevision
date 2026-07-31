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
      const expectedLastSavedAt = body.expectedLastSavedAt === null
        ? null
        : typeof body.expectedLastSavedAt === 'string'
          ? body.expectedLastSavedAt
          : undefined;
      if (expectedLastSavedAt === undefined) {
        return errorResponse('Answer revision token is required. Reload the assessment and retry.', 409);
      }

      const { data: existingAnswer, error: existingAnswerError } = await service
        .from('student_answers')
        .select('id, last_saved_at')
        .eq('attempt_id', attemptId)
        .eq('question_id', questionId)
        .maybeSingle();
      if (existingAnswerError) throw existingAnswerError;

      if (
        (existingAnswer && expectedLastSavedAt === null) ||
        (!existingAnswer && expectedLastSavedAt !== null) ||
        (existingAnswer && expectedLastSavedAt !== null && existingAnswer.last_saved_at !== expectedLastSavedAt)
      ) {
        return errorResponse('This answer was changed in another tab. Reload the assessment before saving again.', 409);
      }

      const savedAt = new Date().toISOString();
      if (existingAnswer) {
        const { data: updatedAnswer, error: updateError } = await service
          .from('student_answers')
          .update({
            answer,
            answer_text: typeof answer === 'string' ? answer : null,
            max_marks: body.maxMarks ?? null,
            last_saved_at: savedAt,
          })
          .eq('id', existingAnswer.id)
          .eq('last_saved_at', expectedLastSavedAt)
          .select('id, last_saved_at')
          .maybeSingle();
        if (updateError) throw updateError;
        if (!updatedAnswer) {
          return errorResponse('This answer was changed in another tab. Reload the assessment before saving again.', 409);
        }
        return jsonResponse({ answerId: updatedAnswer.id, savedAt: updatedAnswer.last_saved_at });
      }

      const { data: insertedAnswer, error: insertError } = await service
        .from('student_answers')
        .insert({
          attempt_id: attemptId,
          question_id: questionId,
          answer,
          answer_text: typeof answer === 'string' ? answer : null,
          max_marks: body.maxMarks ?? null,
          last_saved_at: savedAt,
        })
        .select('id, last_saved_at')
        .single();
      if (insertError) {
        if (insertError.code === '23505') {
          return errorResponse('This answer was changed in another tab. Reload the assessment before saving again.', 409);
        }
        throw insertError;
      }
      return jsonResponse({ answerId: insertedAnswer.id, savedAt: insertedAnswer.last_saved_at });
    }

    return jsonResponse({ savedAt: new Date().toISOString() });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to save answer', 400);
  }
});
