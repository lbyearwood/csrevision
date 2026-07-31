import { leaderboardDisplay } from './identity';
import { statusForPoints } from './points';
import { supabase } from './supabaseClient';
import type {
  AttemptEvent,
  ClassRecord,
  LeaderboardRow,
  PointsTransaction,
  Question,
  QuestionOption,
  StudentAnswer,
  StudentProfile,
  Subject,
  TeacherProfile,
  Test,
  TestAssignment,
  TestAttempt,
  TestVersion,
} from '../types/domain';

export interface SupabaseSnapshot {
  teacher: TeacherProfile;
  classes: ClassRecord[];
  students: StudentProfile[];
  subjects: Subject[];
  units: import('../types/domain').Unit[];
  topics: import('../types/domain').Topic[];
  tests: Test[];
  testVersions: TestVersion[];
  questions: Question[];
  assignments: TestAssignment[];
  attempts: TestAttempt[];
  answers: StudentAnswer[];
  events: AttemptEvent[];
  pointsTransactions: PointsTransaction[];
  leaderboardRows: LeaderboardRow[];
  allTimeLeaderboardRows: LeaderboardRow[];
}

function requireSupabase() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

async function readTable<T>(tableName: string, query: PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
  const { data, error } = await query;
  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error && 'message' in error
          ? String(error.message)
          : `Unable to read ${tableName}`;
    throw new Error(message);
  }
  return data as T;
}

async function readAllRows<T>(
  tableName: string,
  pageQuery: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
  const pageSize = 1_000;
  const rows: T[] = [];

  for (let from = 0; ; from += pageSize) {
    const page = await readTable<T[]>(tableName, pageQuery(from, from + pageSize - 1));
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

function toNumber(value: unknown, defaultValue = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : defaultValue;
}

function firstRelation<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : value ?? undefined;
}

export async function loadSupabaseSnapshot(): Promise<SupabaseSnapshot> {
  const client = requireSupabase();

  const [
    teacherProfiles,
    studentProfiles,
    classes,
    classCourses,
    memberships,
    subjects,
    units,
    topics,
    tests,
    testVersions,
    questions,
    assignments,
    assignmentRecipients,
    attempts,
    answers,
    events,
    pointsTransactions,
    leaderboardRows,
  ] = await Promise.all([
    readTable<
      Array<{
        id: string;
        profile_id: string;
        email: string;
        profiles?: Array<{ display_name?: string | null }> | null;
      }>
    >(
      'teacher_profiles',
      client
        .from('teacher_profiles')
        .select('id, profile_id, email, profiles!teacher_profiles_profile_id_fkey(display_name)')
        .order('created_at'),
    ),
    readTable<
      Array<{
        id: string;
        profile_id: string;
        first_name: string;
        surname: string;
        student_id: string;
        initial_year_group: number | null;
        joined_on: string;
        account_status: StudentProfile['accountStatus'];
        profiles?: Array<{ username?: string | null }> | null;
      }>
    >(
      'student_profiles',
      client
        .from('student_profiles')
        .select('id, profile_id, first_name, surname, student_id, initial_year_group, joined_on, account_status, profiles!student_profiles_profile_id_fkey(username)')
        .order('surname'),
    ),
    readTable<
      Array<{
        id: string;
        class_name: string;
        academic_year: string | null;
        year_group: string | null;
        owner_teacher_id: string;
        status: ClassRecord['status'];
        join_code: string | null;
        accepting_students: boolean;
        is_system: boolean;
      }>
    >(
      'classes',
      client
        .from('classes')
        .select('id, class_name, academic_year, year_group, owner_teacher_id, status, join_code, accepting_students, is_system')
        .order('class_name'),
    ),
    readTable<Array<{ class_id: string; subject_id: string }>>(
      'class_courses',
      client.from('class_courses').select('class_id, subject_id'),
    ),
    readTable<Array<{ class_id: string; student_id: string; status: string }>>(
      'class_memberships',
      client.from('class_memberships').select('class_id, student_id, status').eq('status', 'active'),
    ),
    readTable<
      Array<{
        id: string;
        subject_name: string;
        description: string | null;
        display_order: number;
      }>
    >('subjects', client.from('subjects').select('id, subject_name, description, display_order').order('display_order')),
    readTable<
      Array<{
        id: string;
        subject_id: string;
        unit_name: string;
        display_order: number;
      }>
    >('units', client.from('units').select('id, subject_id, unit_name, display_order').order('display_order')),
    readTable<
      Array<{
        id: string;
        unit_id: string;
        topic_name: string;
        display_order: number;
      }>
    >('topics', client.from('topics').select('id, unit_id, topic_name, display_order').order('display_order')),
    readTable<
      Array<{
        id: string;
        topic_id: string;
        test_title: string;
        test_description: string | null;
        default_mode: Test['defaultMode'];
        default_time_limit_seconds: number | null;
        marking_method: Test['markingMethod'];
        randomise_questions: boolean;
        shuffle_options: boolean;
        status: Test['status'];
      }>
    >(
      'tests',
      client
        .from('tests')
        .select('id, topic_id, test_title, test_description, default_mode, default_time_limit_seconds, marking_method, randomise_questions, shuffle_options, status')
        .order('test_title'),
    ),
    readTable<
      Array<{
        id: string;
        test_id: string;
        version_number: number;
        total_marks: number;
        status: TestVersion['status'];
      }>
    >('test_versions', client.from('test_versions').select('id, test_id, version_number, total_marks, status').order('version_number')),
    readTable<
      Array<{
        id: string;
        test_version_id: string;
        question_order: number;
        question_type: Question['questionType'];
        question_text: string;
        max_marks: number;
        student_explanation: string | null;
        question_options?: Array<{ id: string; question_id: string; option_text: string; option_order: number }> | null;
      }>
    >(
      'questions',
      client
        .from('questions')
        .select('id, test_version_id, question_order, question_type, question_text, max_marks, student_explanation, question_options(id, question_id, option_text, option_order)')
        .order('question_order'),
    ),
    readTable<
      Array<{
        id: string;
        test_version_id: string;
        class_id: string;
        assigned_by: string;
        recipient_scope: TestAssignment['recipientScope'];
        start_at: string | null;
        due_at: string | null;
        time_limit_seconds: number | null;
        attempt_limit: number | null;
        feedback_policy: TestAssignment['feedbackPolicy'];
        status: TestAssignment['status'];
      }>
    >(
      'test_assignments',
      client
        .from('test_assignments')
        .select('id, test_version_id, class_id, assigned_by, recipient_scope, start_at, due_at, time_limit_seconds, attempt_limit, feedback_policy, status')
        .order('due_at'),
    ),
    readTable<Array<{ assignment_id: string; student_id: string }>>(
      'assignment_recipients',
      client.from('assignment_recipients').select('assignment_id, student_id'),
    ),
    readAllRows<
      {
        id: string;
        student_id: string;
        class_id_at_attempt: string | null;
        test_id: string;
        test_version_id: string;
        assignment_id: string | null;
        attempt_type: TestAttempt['attemptType'];
        attempt_number: number;
        resume_question_index: number;
        status: TestAttempt['status'];
        started_at: string;
        submitted_at: string | null;
        duration_seconds: number | null;
        time_limit_seconds: number | null;
        score: number | null;
        max_score: number | null;
        percentage: number | null;
        marking_status: TestAttempt['markingStatus'];
        feedback_status: TestAttempt['feedbackStatus'];
        points_awarded: number | null;
        suspicious_event_count: number;
        void_reason: string | null;
      }
    >(
      'test_attempts',
      (from, to) =>
        client
          .from('test_attempts')
          .select('id, student_id, class_id_at_attempt, test_id, test_version_id, assignment_id, attempt_type, attempt_number, resume_question_index, status, started_at, submitted_at, duration_seconds, time_limit_seconds, score, max_score, percentage, marking_status, feedback_status, points_awarded, suspicious_event_count, void_reason')
          .order('started_at', { ascending: false })
          .order('id', { ascending: true })
          .range(from, to),
    ),
    readTable<
      Array<{
        id: string;
        attempt_id: string;
        question_id: string;
        answer: string | string[] | null;
        answer_text: string | null;
        marks_awarded: number | null;
        max_marks: number | null;
        feedback: string | null;
        last_saved_at: string;
      }>
    >(
      'student_answers',
      client
        .from('student_answers')
        .select('id, attempt_id, question_id, answer, answer_text, marks_awarded, max_marks, feedback, last_saved_at')
        .order('last_saved_at', { ascending: false }),
    ),
    readTable<
      Array<{
        id: string;
        attempt_id: string;
        student_id: string;
        event_type: AttemptEvent['eventType'];
        created_at: string;
        event_detail: Record<string, unknown> | null;
      }>
    >(
      'attempt_events',
      client.from('attempt_events').select('id, attempt_id, student_id, event_type, created_at, event_detail').order('created_at', { ascending: false }),
    ),
    readTable<
      Array<{
        id: string;
        student_id: string;
        related_attempt_id: string | null;
        points: number;
        reason: string;
        created_at: string;
      }>
    >(
      'points_transactions',
      client.from('points_transactions').select('id, student_id, related_attempt_id, points, reason, created_at').order('created_at', { ascending: false }),
    ),
    readTable<
      Array<{
        rank: number;
        student_id: string;
        display_name: string;
        student_public_id: string;
        class_id: string | null;
        points: number;
        status_name: string;
      }>
    >(
      'leaderboard_snapshots',
      client
        .from('leaderboard_snapshots')
        .select('rank, student_id, display_name, student_public_id, class_id, points, status_name')
        .eq('period_type', 'all_time')
        .order('rank'),
    ),
  ]);

  const courseIdsByClassId = new Map<string, string[]>();
  classCourses.forEach((classCourse) => {
    const courseIds = courseIdsByClassId.get(classCourse.class_id) ?? [];
    courseIdsByClassId.set(classCourse.class_id, [...courseIds, classCourse.subject_id]);
  });
  const mappedClasses: ClassRecord[] = classes.map((classRecord) => ({
    id: classRecord.id,
    className: classRecord.class_name,
    academicYear: classRecord.academic_year ?? '',
    yearGroup: classRecord.year_group ?? '',
    ownerTeacherId: classRecord.owner_teacher_id,
    status: classRecord.status,
    joinCode: classRecord.join_code ?? '',
    acceptingStudents: classRecord.accepting_students,
    isSystem: classRecord.is_system,
    courseIds: courseIdsByClassId.get(classRecord.id) ?? [],
  }));
  const classById = new Map(mappedClasses.map((classRecord) => [classRecord.id, classRecord]));
  const classNameById = new Map(mappedClasses.map((classRecord) => [classRecord.id, classRecord.className]));
  const activeClassesForStudent = new Map<string, string[]>();
  memberships.forEach((membership) => {
    const currentClassIds = activeClassesForStudent.get(membership.student_id) ?? [];
    activeClassesForStudent.set(membership.student_id, [...currentClassIds, membership.class_id]);
  });
  activeClassesForStudent.forEach((classIds, studentId) => {
    activeClassesForStudent.set(
      studentId,
      [...classIds].sort((firstId, secondId) => {
        const firstClass = classById.get(firstId);
        const secondClass = classById.get(secondId);
        if (firstClass?.isSystem !== secondClass?.isSystem) return firstClass?.isSystem ? 1 : -1;
        return (firstClass?.className ?? '').localeCompare(secondClass?.className ?? '');
      }),
    );
  });
  const primaryTeacher = teacherProfiles[0];

  const mappedStudents: StudentProfile[] = studentProfiles.map((student) => {
    const classIds = activeClassesForStudent.get(student.id) ?? [];
    const displayClassId = classIds.find((classId) => !classById.get(classId)?.isSystem) ?? classIds[0] ?? '';
    return {
      id: student.id,
      profileId: student.profile_id,
      firstName: student.first_name,
      surname: student.surname,
      username: firstRelation(student.profiles)?.username ?? '',
      publicStudentId: student.student_id,
      yearGroup: currentUkYearGroup(student.initial_year_group, student.joined_on),
      joinedOn: student.joined_on,
      classIds,
      classId: displayClassId,
      accountStatus: student.account_status,
    };
  });
  const mappedStudentById = new Map(mappedStudents.map((student) => [student.id, student]));

  const mappedPoints: PointsTransaction[] = pointsTransactions.map((transaction) => ({
    id: transaction.id,
    studentId: transaction.student_id,
    relatedAttemptId: transaction.related_attempt_id ?? undefined,
    points: transaction.points,
    reason: transaction.reason,
    createdAt: transaction.created_at,
  }));

  return {
    teacher: {
      id: primaryTeacher?.id ?? '',
      profileId: primaryTeacher?.profile_id ?? '',
      displayName: firstRelation(primaryTeacher?.profiles)?.display_name ?? 'Teacher',
      email: primaryTeacher?.email ?? '',
    },
    classes: mappedClasses,
    students: mappedStudents,
    subjects: subjects.map((subject) => ({
      id: subject.id,
      subjectName: subject.subject_name,
      description: subject.description ?? '',
    })),
    units: units.map((unit) => ({
      id: unit.id,
      subjectId: unit.subject_id,
      unitName: unit.unit_name,
    })),
    topics: topics.map((topic) => ({
      id: topic.id,
      unitId: topic.unit_id,
      topicName: topic.topic_name,
    })),
    tests: tests.map((test) => ({
      id: test.id,
      topicId: test.topic_id,
      testTitle: test.test_title,
      testDescription: test.test_description ?? '',
      defaultMode: test.default_mode,
      defaultTimeLimitSeconds: test.default_time_limit_seconds ?? 0,
      markingMethod: test.marking_method,
      randomiseQuestions: test.randomise_questions,
      shuffleOptions: test.shuffle_options,
      status: test.status,
    })),
    testVersions: testVersions.map((version) => ({
      id: version.id,
      testId: version.test_id,
      versionNumber: version.version_number,
      totalMarks: toNumber(version.total_marks),
      status: version.status,
    })),
    questions: questions.map((question) => ({
      id: question.id,
      testVersionId: question.test_version_id,
      questionOrder: question.question_order,
      questionType: question.question_type,
      questionText: question.question_text,
      maxMarks: toNumber(question.max_marks, 1),
      studentExplanation: question.student_explanation ?? undefined,
      options: (question.question_options ?? [])
        .sort((first, second) => first.option_order - second.option_order)
        .map<QuestionOption>((option) => ({
          id: option.id,
          questionId: option.question_id,
          optionText: option.option_text,
          optionOrder: option.option_order,
        })),
    })),
    assignments: assignments.map((assignment) => ({
      id: assignment.id,
      testVersionId: assignment.test_version_id,
      classId: assignment.class_id,
      recipientScope: assignment.recipient_scope ?? 'class',
      recipientStudentIds: assignmentRecipients.filter((recipient) => recipient.assignment_id === assignment.id).map((recipient) => recipient.student_id),
      startAt: assignment.start_at ?? '',
      dueAt: assignment.due_at ?? '',
      timeLimitSeconds: assignment.time_limit_seconds ?? 0,
      attemptLimit: assignment.attempt_limit,
      feedbackPolicy: assignment.feedback_policy,
      status: assignment.status,
    })),
    attempts: attempts.map((attempt) => ({
      id: attempt.id,
      studentId: attempt.student_id,
      classIdAtAttempt: attempt.class_id_at_attempt ?? '',
      testId: attempt.test_id,
      testVersionId: attempt.test_version_id,
      assignmentId: attempt.assignment_id ?? undefined,
      attemptType: attempt.attempt_type,
      attemptNumber: attempt.attempt_number,
      resumeQuestionIndex: attempt.resume_question_index ?? 0,
      status: attempt.status,
      startedAt: attempt.started_at,
      submittedAt: attempt.submitted_at ?? undefined,
      durationSeconds: attempt.duration_seconds ?? undefined,
      timeLimitSeconds: attempt.time_limit_seconds ?? undefined,
      score: attempt.score ?? undefined,
      maxScore: attempt.max_score ?? undefined,
      percentage: attempt.percentage ?? undefined,
      markingStatus: attempt.marking_status,
      feedbackStatus: attempt.feedback_status,
      pointsAwarded: attempt.points_awarded ?? undefined,
      suspiciousEventCount: attempt.suspicious_event_count,
      voidReason: attempt.void_reason ?? undefined,
    })),
    answers: answers.map((answer) => ({
      id: answer.id,
      attemptId: answer.attempt_id,
      questionId: answer.question_id,
      answer: answer.answer ?? answer.answer_text ?? '',
      lastSavedAt: answer.last_saved_at,
      marksAwarded: answer.marks_awarded ?? undefined,
      maxMarks: answer.max_marks ?? 1,
      feedback: answer.feedback ?? undefined,
    })),
    events: events.map((event) => ({
      id: event.id,
      attemptId: event.attempt_id,
      studentId: event.student_id,
      eventType: event.event_type,
      createdAt: event.created_at,
      eventDetail: event.event_detail ?? undefined,
    })),
    pointsTransactions: mappedPoints,
    leaderboardRows: leaderboardRows
      .filter((row) => mappedStudentById.get(row.student_id)?.accountStatus !== 'archived')
      .map((row) => {
        const student = mappedStudentById.get(row.student_id);
        const currentClassId = row.class_id ?? student?.classId ?? '';
        return {
          rank: row.rank,
          studentId: row.student_id,
          displayName: student ? leaderboardDisplay(student) : row.display_name,
          publicStudentId: row.student_public_id,
          className: currentClassId ? classNameById.get(currentClassId) ?? '' : '',
          points: row.points,
          status: row.status_name,
        };
      }),
    allTimeLeaderboardRows: leaderboardRows.map((row) => {
      const student = mappedStudentById.get(row.student_id);
      const currentClassId = row.class_id ?? student?.classId ?? '';
      return {
        rank: row.rank,
        studentId: row.student_id,
        displayName: student ? leaderboardDisplay(student) : row.display_name,
        publicStudentId: row.student_public_id,
        className: currentClassId ? classNameById.get(currentClassId) ?? '' : '',
        points: row.points,
        status: row.status_name,
      };
    }),
  };
}

function currentUkYearGroup(initialYearGroup: number | null, joinedOn: string): string {
  if (!initialYearGroup || !joinedOn) return '';
  const joined = new Date(`${joinedOn}T00:00:00`);
  const now = new Date();
  const academicYearStart = (date: Date) => date.getMonth() >= 8 ? date.getFullYear() : date.getFullYear() - 1;
  return `Year ${initialYearGroup + Math.max(0, academicYearStart(now) - academicYearStart(joined))}`;
}

export function buildLeaderboardFromPoints(students: StudentProfile[], classes: ClassRecord[], points: PointsTransaction[]): LeaderboardRow[] {
  const classesById = new Map(classes.map((classRecord) => [classRecord.id, classRecord]));

  const orderedRows = [...students]
    .filter((student) => student.accountStatus !== 'archived')
    .map((student) => {
      const total = points
        .filter((transaction) => transaction.studentId === student.id)
        .reduce((sum, transaction) => sum + transaction.points, 0);
      return {
        rank: 0,
        studentId: student.id,
        displayName: leaderboardDisplay(student),
        publicStudentId: student.publicStudentId,
        className: classesById.get(student.classId)?.className ?? '',
        points: total,
        status: statusForPoints(total).name,
      };
    })
    .sort((first, second) => second.points - first.points || first.displayName.localeCompare(second.displayName));

  let previousPoints: number | undefined;
  let rank = 0;
  return orderedRows.map((row, index) => {
    if (row.points !== previousPoints) rank = index + 1;
    previousPoints = row.points;
    return { ...row, rank };
  });
}
