import { handleOptions } from '../_shared/cors.ts';
import { errorResponse, jsonResponse } from '../_shared/responses.ts';
import { createServiceClient, getRequester } from '../_shared/supabase.ts';

function shuffle<T>(values: T[]): T[] {
  return [...values].sort(() => Math.random() - 0.5);
}

type AttemptResumeRow = {
  id: string;
  started_at: string;
  resume_question_index: number;
  expires_at: string | null;
  time_limit_seconds: number | null;
  status: string;
};

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;

  try {
    const service = createServiceClient();
    const requester = await getRequester(req, service);
    if (requester.role !== 'student') return errorResponse('Student permission required', 403);

    const { data: student, error: studentError } = await service
      .from('student_profiles')
      .select('id')
      .eq('profile_id', requester.id)
      .eq('account_status', 'active')
      .single();
    if (studentError || !student) throw studentError ?? new Error('Student profile not found');

    const body = await req.json();
    const assignmentId = body.assignmentId ? String(body.assignmentId) : undefined;
    const testVersionId = body.testVersionId ? String(body.testVersionId) : undefined;

    const { data: memberships, error: membershipsError } = await service
      .from('class_memberships')
      .select('class_id, classes!inner(is_system, status)')
      .eq('student_id', student.id)
      .eq('status', 'active')
      .eq('classes.status', 'active');
    if (membershipsError) throw membershipsError;

    const activeMemberships = (memberships ?? []) as Array<{
      class_id: string;
      classes?: { is_system: boolean; status: string } | Array<{ is_system: boolean; status: string }> | null;
    }>;
    const activeClassIds = new Set(activeMemberships.map((membership) => membership.class_id));
    const preferredPracticeClassId =
      activeMemberships.find((membership) => {
        const classRecord = Array.isArray(membership.classes) ? membership.classes[0] : membership.classes;
        return classRecord && !classRecord.is_system;
      })?.class_id ??
      activeMemberships[0]?.class_id ??
      null;

    let versionId = testVersionId;
    let assignment = null as null | {
      id: string;
      test_version_id: string;
      class_id: string;
      recipient_scope: 'class' | 'selected';
      time_limit_seconds: number | null;
      start_at: string | null;
    };
    let attemptType: 'practice' | 'assigned' = 'practice';
    let resumeAttempt: AttemptResumeRow | null = null;

    if (assignmentId) {
      const { data, error } = await service
        .from('test_assignments')
        .select('id, test_version_id, class_id, recipient_scope, time_limit_seconds, start_at, status')
        .eq('id', assignmentId)
        .single();
      if (error || !data) throw error ?? new Error('Assignment not found');
      if (!activeClassIds.has(data.class_id)) return errorResponse('Assignment is not for your class', 403);
      if (data.recipient_scope === 'selected') {
        const { data: recipient, error: recipientError } = await service
          .from('assignment_recipients')
          .select('student_id')
          .eq('assignment_id', data.id)
          .eq('student_id', student.id)
          .maybeSingle();
        if (recipientError) throw recipientError;
        if (!recipient) return errorResponse('Assignment is not for you', 403);
      }
      if (data.status !== 'open') return errorResponse('Assignment is not open', 403);
      const now = Date.now();
      if (data.start_at && new Date(data.start_at).getTime() > now) return errorResponse('Assignment has not started', 403);

      const { error: clearNotStartedError } = await service
        .from('test_attempts')
        .update({ status: 'voided', voided_at: new Date().toISOString() })
        .eq('student_id', student.id)
        .eq('assignment_id', assignmentId)
        .eq('attempt_type', 'assigned')
        .eq('status', 'not_started')
        .is('voided_at', null);
      if (clearNotStartedError) throw clearNotStartedError;

      const { data: existingAttempt } = await service
        .from('test_attempts')
        .select('id, started_at, resume_question_index, expires_at, time_limit_seconds, status')
        .eq('student_id', student.id)
        .eq('assignment_id', assignmentId)
        .eq('status', 'in_progress')
        .is('voided_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (existingAttempt?.status === 'in_progress') resumeAttempt = existingAttempt;

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

    if (!assignmentId) {
      const { data: testCourse, error: testCourseError } = await service
        .from('tests')
        .select('topics!inner(units!inner(subject_id))')
        .eq('id', (version.tests as { id: string }).id)
        .single();
      if (testCourseError || !testCourse) throw testCourseError ?? new Error('Test course not found');
      const topic = testCourse.topics as { units?: { subject_id?: string } | Array<{ subject_id?: string }> };
      const unit = Array.isArray(topic.units) ? topic.units[0] : topic.units;
      const subjectId = unit?.subject_id;
      if (!subjectId) return errorResponse('Test course not found', 404);

      const { data: entitlement, error: entitlementError } = await service
        .from('class_courses')
        .select('class_id')
        .in('class_id', Array.from(activeClassIds))
        .eq('subject_id', subjectId)
        .limit(1)
        .maybeSingle();
      if (entitlementError) throw entitlementError;
      if (!entitlement) return errorResponse('This course is not available to your class', 403);
    }

    // Timed tests are temporarily disabled throughout the platform.
    const timeLimitSeconds = null;
    const newExpiresAt = null;

    if (!resumeAttempt && !assignmentId) {
      const { data: existingPracticeAttempt } = await service
        .from('test_attempts')
        .select('id, started_at, resume_question_index, expires_at, time_limit_seconds, status')
        .eq('student_id', student.id)
        .eq('test_version_id', versionId)
        .eq('attempt_type', 'practice')
        .eq('status', 'in_progress')
        .is('voided_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (existingPracticeAttempt) resumeAttempt = existingPracticeAttempt;
    }

    const { count } = await service
      .from('test_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', student.id)
      .eq('test_version_id', versionId);

    let attempt = resumeAttempt;
    if (attempt && (attempt.expires_at || attempt.time_limit_seconds)) {
      const { data: untimedAttempt, error: clearTimerError } = await service
        .from('test_attempts')
        .update({ expires_at: null, time_limit_seconds: null })
        .eq('id', attempt.id)
        .select('id, started_at, resume_question_index, expires_at, time_limit_seconds, status')
        .single();
      if (clearTimerError || !untimedAttempt) throw clearTimerError ?? new Error('Unable to remove test timer');
      attempt = untimedAttempt;
    }
    if (!attempt) {
      const { data: createdAttempt, error: attemptError } = await service
        .from('test_attempts')
        .insert({
          student_id: student.id,
          class_id_at_attempt: assignment?.class_id ?? preferredPracticeClassId,
          test_id: (version.tests as { id: string }).id,
          test_version_id: versionId,
          assignment_id: assignment?.id,
          attempt_type: attemptType,
          attempt_number: (count ?? 0) + 1,
          time_limit_seconds: timeLimitSeconds,
          expires_at: newExpiresAt,
        })
        .select('id, started_at, resume_question_index, expires_at, time_limit_seconds, status')
        .single();
      if (attemptError || !createdAttempt) throw attemptError ?? new Error('Attempt was not created');
      attempt = createdAttempt;
    }

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

    const { data: savedAnswers, error: savedAnswersError } = await service
      .from('student_answers')
      .select('id, question_id, answer, answer_text, max_marks, last_saved_at')
      .eq('attempt_id', attempt.id);
    if (savedAnswersError) throw savedAnswersError;

    if (!resumeAttempt) {
      await Promise.all(
        safeQuestions.map((question) =>
          service.from('answer_display_orders').insert({
            attempt_id: attempt.id,
            question_id: question.id,
            option_ids: question.options.map((option: { id: string }) => option.id),
          }),
        ),
      );
    }

    return jsonResponse({
      attemptId: attempt.id,
      startedAt: attempt.started_at,
      resumeQuestionIndex: attempt.resume_question_index ?? 0,
      expiresAt: attempt.expires_at,
      timeLimitSeconds: attempt.time_limit_seconds ?? timeLimitSeconds,
      questions: safeQuestions,
      answers: (savedAnswers ?? []).map((answer) => ({
        id: answer.id,
        questionId: answer.question_id,
        answer: answer.answer ?? answer.answer_text ?? '',
        maxMarks: answer.max_marks ?? 1,
        lastSavedAt: answer.last_saved_at,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Unable to start attempt';
    return errorResponse(message, 400);
  }
});
