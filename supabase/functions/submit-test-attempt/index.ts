import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester } from '../_shared/supabase.ts';
import { markQuestion } from '../_shared/marking.ts';

function calculatePoints(input: {
  attemptType: 'practice' | 'assigned';
  percentage: number;
  isFirstPracticeAttempt: boolean;
  previousBestPercentage?: number;
  completedWithinLimit: boolean;
}): { points: number; reasons: string[] } {
  let points = 0;
  const reasons: string[] = [];
  if (input.attemptType === 'assigned') {
    points += 20;
    reasons.push('Completed assigned test');
  }
  if (input.attemptType === 'practice' && input.isFirstPracticeAttempt) {
    points += 10;
    reasons.push('Completed practice test first attempt');
  }
  if (input.percentage >= 100) {
    points += 75;
    reasons.push('Scored 100%');
  } else if (input.percentage >= 85) {
    points += 40;
    reasons.push('Scored 85% or above');
  } else if (input.percentage >= 70) {
    points += 20;
    reasons.push('Scored 70% or above');
  }
  if (input.previousBestPercentage !== undefined && input.percentage - input.previousBestPercentage >= 10) {
    points += 30;
    reasons.push('Improved previous best by at least 10%');
  }
  if (input.completedWithinLimit) {
    points += 20;
    reasons.push('Completed timed test within time limit');
  }
  return { points, reasons };
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

    const { data: student } = await service.from('student_profiles').select('id').eq('profile_id', requester.id).single();
    if (!student) return errorResponse('Student profile not found', 403);

    const { data: attempt } = await service
      .from('test_attempts')
      .select('id, student_id, test_id, test_version_id, attempt_type, attempt_number, started_at, expires_at, time_limit_seconds, status')
      .eq('id', attemptId)
      .eq('student_id', student.id)
      .single();
    if (!attempt) return errorResponse('Attempt not found', 404);
    if (attempt.status !== 'in_progress') return errorResponse('Attempt has already been submitted', 409);

    if (Array.isArray(body.answers)) {
      for (const submittedAnswer of body.answers) {
        await service.from('student_answers').upsert(
          {
            attempt_id: attemptId,
            question_id: submittedAnswer.questionId,
            answer: submittedAnswer.answer,
            answer_text: typeof submittedAnswer.answer === 'string' ? submittedAnswer.answer : null,
            last_saved_at: new Date().toISOString(),
          },
          { onConflict: 'attempt_id,question_id' },
        );
      }
    }

    const { data: questions, error: questionError } = await service
      .from('questions')
      .select('id, question_type, max_marks, correct_answer, accepted_keywords')
      .eq('test_version_id', attempt.test_version_id);
    if (questionError) throw questionError;

    const { data: answers, error: answerError } = await service
      .from('student_answers')
      .select('id, question_id, answer')
      .eq('attempt_id', attemptId);
    if (answerError) throw answerError;

    const answerMap = new Map((answers ?? []).map((answer) => [answer.question_id, answer]));
    let score = 0;
    let maxScore = 0;
    for (const question of questions ?? []) {
      const savedAnswer = answerMap.get(question.id);
      const result = markQuestion(question, savedAnswer?.answer);
      score += result.marks;
      maxScore += Number(question.max_marks);
      await service
        .from('student_answers')
        .update({
          is_correct: result.isCorrect,
          marks_awarded: result.marks,
          max_marks: question.max_marks,
          marked_by: 'system',
          feedback: result.feedback,
        })
        .eq('id', savedAnswer?.id ?? '');
    }

    const submittedAt = new Date();
    const startedAt = new Date(attempt.started_at);
    const expiresAt = attempt.expires_at ? new Date(attempt.expires_at) : null;
    const durationSeconds = Math.max(0, Math.round((submittedAt.getTime() - startedAt.getTime()) / 1000));
    const timedOut = Boolean(expiresAt && submittedAt.getTime() > expiresAt.getTime());
    const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);

    const { data: previousAttempts } = await service
      .from('test_attempts')
      .select('percentage')
      .eq('student_id', student.id)
      .eq('test_id', attempt.test_id)
      .neq('id', attemptId)
      .eq('status', 'feedback_released');
    const previousBest = Math.max(...(previousAttempts ?? []).map((row) => Number(row.percentage ?? 0)), 0);
    const points = calculatePoints({
      attemptType: attempt.attempt_type,
      percentage,
      isFirstPracticeAttempt: attempt.attempt_type === 'practice' && Number(attempt.attempt_number) === 1,
      previousBestPercentage: previousBest || undefined,
      completedWithinLimit: !timedOut,
    });

    await service.from('test_attempts').update({
      status: timedOut ? 'timed_out' : 'feedback_released',
      submitted_at: submittedAt.toISOString(),
      duration_seconds: durationSeconds,
      timed_out: timedOut,
      submitted_late: timedOut,
      score,
      max_score: maxScore,
      percentage,
      marking_status: 'marked',
      feedback_status: 'released',
      points_awarded: points.points,
    }).eq('id', attemptId);

    if (points.points > 0) {
      await service.from('points_transactions').insert({
        student_id: student.id,
        related_attempt_id: attemptId,
        points: points.points,
        reason: points.reasons.join('; '),
        created_by: 'system',
        metadata: { percentage },
      });
    }

    return jsonResponse({ score, maxScore, percentage, pointsAwarded: points.points, timedOut });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to submit attempt', 400);
  }
});
