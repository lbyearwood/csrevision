import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester } from '../_shared/supabase.ts';

function answerParts(answer: unknown): string[] {
  if (Array.isArray(answer)) return answer.map((value) => String(value));
  return answer === null || answer === undefined ? [] : [String(answer)];
}

function correctAnswerParts(answer: unknown): string[] {
  if (Array.isArray(answer)) return answer.filter(Boolean).map((value) => String(value));
  return answer ? [String(answer)] : [];
}

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    if (requester.role !== 'student') return errorResponse('Student permission required', 403);

    const body = await req.json();
    const attemptId = String(body.attemptId ?? '');
    if (!attemptId) return errorResponse('attemptId is required', 422);

    const { data: student } = await service
      .from('student_profiles')
      .select('id')
      .eq('profile_id', requester.id)
      .single();
    if (!student) return errorResponse('Student profile not found', 403);

    const { data: attempt, error: attemptError } = await service
      .from('test_attempts')
      .select('id, test_version_id, status, score, max_score, percentage, points_awarded, submitted_at')
      .eq('id', attemptId)
      .eq('student_id', student.id)
      .single();
    if (attemptError || !attempt) return errorResponse('Attempt not found', 404);
    if (!['feedback_released', 'marked', 'timed_out'].includes(attempt.status)) {
      return errorResponse('This test is not ready to review yet', 409);
    }

    const { data: questions, error: questionsError } = await service
      .from('questions')
      .select('id, question_order, question_text, max_marks, correct_answer')
      .eq('test_version_id', attempt.test_version_id)
      .order('question_order');
    if (questionsError) throw questionsError;

    const questionIds = (questions ?? []).map((question) => question.id);
    const [{ data: optionsByQuestion, error: optionsError }, { data: answers, error: answersError }] = await Promise.all([
      questionIds.length
        ? service
          .from('question_options')
          .select('id, question_id, option_text, option_order, is_correct')
          .in('question_id', questionIds)
          .order('option_order')
        : Promise.resolve({ data: [], error: null }),
      service
        .from('student_answers')
        .select('question_id, answer, answer_text, is_correct, marks_awarded, max_marks, feedback')
        .eq('attempt_id', attemptId),
    ]);
    if (optionsError) throw optionsError;
    if (answersError) throw answersError;

    const answersByQuestion = new Map((answers ?? []).map((answer) => [answer.question_id, answer]));
    const optionsForQuestion = new Map<string, Array<{ id: string; option_text: string; is_correct: boolean }>>();
    for (const option of optionsByQuestion ?? []) {
      const current = optionsForQuestion.get(option.question_id) ?? [];
      current.push(option);
      optionsForQuestion.set(option.question_id, current);
    }

    const review = (questions ?? []).map((question) => {
      const answer = answersByQuestion.get(question.id);
      const answerIds = new Set(answerParts(answer?.answer));
      const questionOptions = optionsForQuestion.get(question.id) ?? [];
      const answerText = questionOptions.length
        ? questionOptions.filter((option) => answerIds.has(option.id)).map((option) => option.option_text).join(', ')
        : answer?.answer_text ?? answerParts(answer?.answer).join(', ');
      const correctAnswerText = questionOptions.length
        ? questionOptions.filter((option) => option.is_correct).map((option) => option.option_text).join(', ')
        : correctAnswerParts(question.correct_answer).join(', ');

      return {
        id: question.id,
        questionOrder: question.question_order,
        questionText: question.question_text,
        maxMarks: Number(question.max_marks),
        answerText: answerText || 'No answer given',
        correctAnswerText: correctAnswerText || 'Not available',
        isCorrect: Boolean(answer?.is_correct),
        marksAwarded: Number(answer?.marks_awarded ?? 0),
        feedback: answer?.feedback ?? '',
      };
    });

    return jsonResponse({
      attempt: {
        id: attempt.id,
        score: Number(attempt.score ?? 0),
        maxScore: Number(attempt.max_score ?? 0),
        percentage: Number(attempt.percentage ?? 0),
        pointsAwarded: Number(attempt.points_awarded ?? 0),
        submittedAt: attempt.submitted_at,
      },
      questions: review,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to load test review', 400);
  }
});
