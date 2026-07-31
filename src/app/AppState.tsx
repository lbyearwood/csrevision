/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { restoreSignedInSession, signOut as signOutFromSupabase } from '../lib/auth';
import { clearActivitySession } from '../lib/activity';
import { statusForPoints } from '../lib/points';
import { buildLeaderboardFromPoints, loadSupabaseSnapshot, type SupabaseSnapshot } from '../lib/supabaseData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { toLocalSupabaseError } from '../lib/supabaseErrors';
import type { AttemptEvent, ClassRecord, PointsTransaction, Question, StudentAnswer, StudentProfile, TeacherProfile, TestAssignment, TestAttempt, UserRole } from '../types/domain';

interface SessionState {
  role: UserRole | null;
  displayName: string;
}

interface BeginAttemptInput {
  testId: string;
  assignmentId?: string;
}

interface CreateAssignmentsInput {
  classId: string;
  testVersionIds: string[];
  recipientScope?: TestAssignment['recipientScope'];
  recipientStudentIds: string[];
  dueAt?: string;
  timeLimitSeconds?: number;
  attemptLimit?: number | null;
  feedbackPolicy?: TestAssignment['feedbackPolicy'];
  status?: TestAssignment['status'];
}

interface UpdateClassInput {
  id: string;
  className: string;
  academicYear: string;
  yearGroup: string;
  status: ClassRecord['status'];
  acceptingStudents?: boolean;
  courseIds: string[];
}

interface UpdateStudentInput {
  id: string;
  firstName: string;
  surname: string;
  initialYearGroup?: number | null;
  classIds: string[];
  accountStatus: StudentProfile['accountStatus'];
}

interface ResetStudentPasswordInput {
  studentId: string;
  temporaryPassword?: string;
}

interface UpdateStudentResponse {
  student: StudentProfile;
}

interface ClassResponse {
  class: ClassRecord;
}

interface JoinClassResponse {
  message: string;
  class: ClassRecord;
  status: 'joined' | 'already_joined';
}

interface ResetStudentPasswordResponse {
  temporaryPassword: string;
}

interface StartAttemptResponse {
  attemptId: string;
  startedAt: string;
  resumeQuestionIndex: number;
  expiresAt: string | null;
  timeLimitSeconds: number | null;
  questions: Array<{
    id: string;
    questionText: string;
    questionType: Question['questionType'];
    maxMarks: number;
    displayOrder: number;
    options: Array<{ id: string; optionText: string }>;
  }>;
  answers?: Array<{
    id: string;
    questionId: string;
    answer: string | string[];
    maxMarks: number;
    lastSavedAt: string;
  }>;
}

interface SaveAnswerResponse {
  answerId?: string;
  savedAt: string;
}

interface SubmitAttemptResponse {
  score: number;
  maxScore: number;
  percentage: number;
  pointsAwarded: number;
  timedOut: boolean;
}

export interface AttemptReview {
  attempt: {
    id: string;
    score: number;
    maxScore: number;
    percentage: number;
    pointsAwarded: number;
    submittedAt: string | null;
  };
  questions: Array<{
    id: string;
    questionOrder: number;
    questionText: string;
    maxMarks: number;
    answerText: string;
    correctAnswerText: string;
    isCorrect: boolean;
    marksAwarded: number;
    feedback: string;
  }>;
}

interface AssignmentRow {
  id: string;
  test_version_id: string;
  class_id: string;
  assigned_by?: string | null;
  recipient_scope: TestAssignment['recipientScope'];
  start_at: string | null;
  due_at: string | null;
  time_limit_seconds: number | null;
  attempt_limit: number | null;
  feedback_policy: TestAssignment['feedbackPolicy'];
  status: TestAssignment['status'];
}

interface ClassRow {
  id: string;
  class_name: string;
  academic_year: string | null;
  year_group: string | null;
  owner_teacher_id: string;
  status: ClassRecord['status'];
  join_code: string | null;
  accepting_students: boolean;
  is_system: boolean;
  course_ids?: string[];
}

interface AppStateValue extends SupabaseSnapshot {
  session: SessionState;
  setSession: (session: SessionState) => void;
  signOut: () => void;
  currentStudent: StudentProfile;
  pointsTotal: number;
  statusName: string;
  isSupabaseBacked: boolean;
  isRestoringSession: boolean;
  isLoadingData: boolean;
  dataError: string;
  beginAttempt: (input: BeginAttemptInput) => Promise<TestAttempt>;
  saveAnswer: (attemptId: string, questionId: string, answer: string) => Promise<void>;
  saveAttemptProgress: (attemptId: string, questionIndex: number) => void;
  submitAttempt: (attemptId: string) => Promise<TestAttempt>;
  getAttemptReview: (attemptId: string) => Promise<AttemptReview>;
  logAttemptEvent: (attemptId: string, eventType: AttemptEvent['eventType']) => void;
  voidAssignedAttempt: (attemptId: string, reason: string) => void;
  createAssignments: (input: CreateAssignmentsInput) => Promise<TestAssignment[]>;
  deleteAssignment: (assignmentId: string) => Promise<'deleted' | 'archived'>;
  updateClass: (input: UpdateClassInput) => Promise<ClassRecord>;
  archiveClass: (classId: string) => Promise<ClassRecord>;
  regenerateClassCode: (classId: string) => Promise<ClassRecord>;
  updateStudent: (input: UpdateStudentInput) => Promise<StudentProfile>;
  archiveStudent: (studentId: string) => Promise<StudentProfile>;
  resetStudentPassword: (input: ResetStudentPasswordInput) => Promise<string>;
  joinClassByCode: (code: string) => Promise<string>;
}

const SUPABASE_REQUIRED_MESSAGE =
  'Local Supabase is required. Start Supabase, create .env.local with local values, then sign in again.';

const emptyTeacher: TeacherProfile = {
  id: '',
  profileId: '',
  displayName: '',
  email: '',
};

const emptyStudent: StudentProfile = {
  id: '',
  profileId: '',
  firstName: 'Student',
  surname: '',
  username: '',
  publicStudentId: '',
  yearGroup: '',
  joinedOn: '',
  classIds: [],
  classId: '',
  accountStatus: 'active',
};

const emptySnapshot: SupabaseSnapshot = {
  teacher: emptyTeacher,
  classes: [],
  students: [],
  subjects: [],
  units: [],
  topics: [],
  tests: [],
  testVersions: [],
  questions: [],
  assignments: [],
  attempts: [],
  answers: [],
  events: [],
  pointsTransactions: [],
  leaderboardRows: [],
  allTimeLeaderboardRows: [],
};

const AppStateContext = createContext<AppStateValue | null>(null);

function hasFunctionError(value: unknown): value is { error: string } {
  return Boolean(value && typeof value === 'object' && 'error' in value);
}

function hasMessage(value: unknown): value is { message: string } {
  return Boolean(value && typeof value === 'object' && 'message' in value);
}

function responseFromFunctionError(error: unknown): Response | null {
  if (!error || typeof error !== 'object' || !('context' in error)) return null;
  const context = (error as { context?: unknown }).context;
  return context instanceof Response ? context : null;
}

async function functionErrorMessage(error: unknown): Promise<string> {
  const fallback = error instanceof Error ? error.message : 'Edge Function failed';
  const response = responseFromFunctionError(error);
  if (!response) return fallback;

  try {
    const payload: unknown = await response.clone().json();
    if (hasFunctionError(payload)) return payload.error;
    if (hasMessage(payload)) return payload.message;
  } catch {
    try {
      const text = await response.clone().text();
      if (text.trim()) return text.trim();
    } catch {
      return fallback;
    }
  }

  return fallback;
}

async function invokeFunction<T>(name: string, body: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (sessionError || !accessToken) {
    throw new Error('Your session has expired. Sign in again, then retry.');
  }

  const abortController = new AbortController();
  let rejectForTimeout: ((reason?: unknown) => void) | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    rejectForTimeout = reject;
  });
  const timeoutId = globalThis.setTimeout(() => {
    abortController.abort();
    rejectForTimeout?.(new Error('Edge Function request timed out'));
  }, 5_000);

  let result: Awaited<ReturnType<typeof supabase.functions.invoke<T | { error: string }>>>;
  try {
    result = await Promise.race([
      supabase.functions.invoke<T | { error: string }>(name, {
        body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: abortController.signal,
        timeout: 5_000,
      }),
      timeoutPromise,
    ]);
  } catch (error) {
    throw toLocalSupabaseError(error, 'The Local Supabase action failed. Retry the action.');
  } finally {
    globalThis.clearTimeout(timeoutId);
  }

  const { data, error } = result;
  if (error) {
    throw toLocalSupabaseError(
      new Error(await functionErrorMessage(error)),
      'The Local Supabase action failed. Retry the action.',
    );
  }
  if (hasFunctionError(data)) throw new Error(data.error);
  return data as T;
}

function totalPointsForStudent(studentId: string, points: PointsTransaction[]): number {
  return points
    .filter((transaction) => transaction.studentId === studentId)
    .reduce((total, transaction) => total + transaction.points, 0);
}

function mapAssignmentRow(row: AssignmentRow): TestAssignment {
  return {
    id: row.id,
    testVersionId: row.test_version_id,
    classId: row.class_id,
    recipientScope: row.recipient_scope ?? 'class',
    recipientStudentIds: [],
    startAt: row.start_at ?? '',
    dueAt: row.due_at ?? '',
    timeLimitSeconds: row.time_limit_seconds ?? 0,
    attemptLimit: row.attempt_limit,
    feedbackPolicy: row.feedback_policy,
    status: row.status,
  };
}

function mapClassRow(row: ClassRow): ClassRecord {
  return {
    id: row.id,
    className: row.class_name,
    academicYear: row.academic_year ?? '',
    yearGroup: row.year_group ?? '',
    ownerTeacherId: row.owner_teacher_id,
    status: row.status,
    joinCode: row.join_code ?? '',
    acceptingStudents: row.accepting_students,
    isSystem: row.is_system,
    courseIds: row.course_ids ?? [],
  };
}

function applySnapshot(
  nextSnapshot: SupabaseSnapshot,
  setSnapshot: (value: SupabaseSnapshot) => void,
  setAttempts: (value: TestAttempt[]) => void,
  setAnswers: (value: StudentAnswer[]) => void,
  setEvents: (value: AttemptEvent[]) => void,
  setEarnedPoints: (value: PointsTransaction[]) => void,
) {
  setSnapshot(nextSnapshot);
  setAttempts(nextSnapshot.attempts);
  setAnswers(nextSnapshot.answers);
  setEvents(nextSnapshot.events);
  setEarnedPoints([]);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionState>({ role: null, displayName: '' });
  const [snapshot, setSnapshot] = useState<SupabaseSnapshot>(emptySnapshot);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [events, setEvents] = useState<AttemptEvent[]>([]);
  const [earnedPoints, setEarnedPoints] = useState<PointsTransaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(isSupabaseConfigured);
  const [dataError, setDataError] = useState('');

  const isSupabaseBacked = Boolean(isSupabaseConfigured && supabase && session.role);

  useEffect(() => {
    let isActive = true;

    if (!isSupabaseConfigured || !supabase) {
      setIsRestoringSession(false);
      return () => {
        isActive = false;
      };
    }

    restoreSignedInSession()
      .then((restoredSession) => {
        if (isActive && restoredSession) setSessionState(restoredSession);
      })
      .catch(() => {
        // A missing or expired browser session should fall back to the normal sign-in screen.
      })
      .finally(() => {
        if (isActive) setIsRestoringSession(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    if (!isSupabaseConfigured || !supabase) {
      setIsLoadingData(false);
      setDataError(SUPABASE_REQUIRED_MESSAGE);
      setSnapshot(emptySnapshot);
      setAttempts([]);
      setAnswers([]);
      setEvents([]);
      setEarnedPoints([]);
      return () => {
        isActive = false;
      };
    }

    if (!session.role) {
      setIsLoadingData(false);
      setDataError('');
      setSnapshot(emptySnapshot);
      setAttempts([]);
      setAnswers([]);
      setEvents([]);
      setEarnedPoints([]);
      return () => {
        isActive = false;
      };
    }

    setIsLoadingData(true);
    setDataError('');
    loadSupabaseSnapshot()
      .then((nextSnapshot) => {
        if (!isActive) return;
        setSnapshot(nextSnapshot);
        setAttempts(nextSnapshot.attempts);
        setAnswers(nextSnapshot.answers);
        setEvents(nextSnapshot.events);
        setEarnedPoints([]);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setDataError(toLocalSupabaseError(error, 'Unable to load local Supabase data').message);
      })
      .finally(() => {
        if (isActive) setIsLoadingData(false);
      });

    return () => {
      isActive = false;
    };
  }, [session.displayName, session.role]);

  const currentStudent = snapshot.students[0] ?? emptyStudent;
  const pointRows = [...snapshot.pointsTransactions, ...earnedPoints];
  const pointsTotal = totalPointsForStudent(currentStudent.id, pointRows);
  const statusName = statusForPoints(pointsTotal).name;
  // Leaderboard snapshots are shared safely across a class; individual point transactions
  // are only visible to their owner. Keep the shared rows, but refresh the signed-in
  // student's own total from their live transactions so their dashboard stays accurate.
  const leaderboardRows = snapshot.leaderboardRows.length
    ? snapshot.leaderboardRows.map((row) => row.studentId === currentStudent.id
      ? { ...row, points: pointsTotal, status: statusName }
      : row)
    : buildLeaderboardFromPoints(snapshot.students, snapshot.classes, pointRows);
  const allTimeLeaderboardRows = snapshot.allTimeLeaderboardRows.map((row) => row.studentId === currentStudent.id
    ? { ...row, points: pointsTotal, status: statusName }
    : row);

  const setSession = (nextSession: SessionState) => {
    setSessionState(nextSession);
  };

  const refreshSnapshot = async (): Promise<SupabaseSnapshot> => {
    const nextSnapshot = await loadSupabaseSnapshot();
    applySnapshot(nextSnapshot, setSnapshot, setAttempts, setAnswers, setEvents, setEarnedPoints);
    return nextSnapshot;
  };

  const beginSupabaseAttempt = async ({ testId, assignmentId }: BeginAttemptInput): Promise<TestAttempt> => {
    const test = snapshot.tests.find((item) => item.id === testId);
    if (!test) throw new Error('Test not found');
    const version = snapshot.testVersions.find((item) => item.testId === test.id && item.status === 'published');
    if (!version) throw new Error('Published test version not found');

    const started = await invokeFunction<StartAttemptResponse>(
      'start-test-attempt',
      assignmentId ? { assignmentId } : { testVersionId: version.id },
    );
    const priorAttempts = attempts.filter(
      (attempt) => attempt.studentId === currentStudent.id && attempt.testVersionId === version.id,
    );
    const existingAttempt = attempts.find((attempt) => attempt.id === started.attemptId);
    const assignmentClassId = assignmentId
      ? snapshot.assignments.find((assignment) => assignment.id === assignmentId)?.classId
      : undefined;
    const safeQuestions: Question[] = started.questions.map((question) => ({
      id: question.id,
      testVersionId: version.id,
      questionOrder: question.displayOrder,
      questionType: question.questionType,
      questionText: question.questionText,
      maxMarks: Number(question.maxMarks),
      options: question.options.map((option, index) => ({
        id: option.id,
        questionId: question.id,
        optionText: option.optionText,
        optionOrder: index + 1,
      })),
    }));
    const attempt: TestAttempt = {
      ...existingAttempt,
      id: started.attemptId,
      studentId: currentStudent.id,
      classIdAtAttempt: existingAttempt?.classIdAtAttempt ?? assignmentClassId ?? currentStudent.classId,
      testId: test.id,
      testVersionId: version.id,
      assignmentId: existingAttempt?.assignmentId ?? assignmentId,
      attemptType: existingAttempt?.attemptType ?? (assignmentId ? 'assigned' : 'practice'),
      attemptNumber: existingAttempt?.attemptNumber ?? priorAttempts.length + 1,
      resumeQuestionIndex: started.resumeQuestionIndex ?? existingAttempt?.resumeQuestionIndex ?? 0,
      status: existingAttempt?.status === 'in_progress' ? existingAttempt.status : 'in_progress',
      startedAt: started.startedAt,
      timeLimitSeconds: started.timeLimitSeconds ?? undefined,
      markingStatus: existingAttempt?.markingStatus ?? 'not_required',
      feedbackStatus: existingAttempt?.feedbackStatus ?? 'hidden',
      suspiciousEventCount: existingAttempt?.suspiciousEventCount ?? 0,
    };
    const restoredAnswers: StudentAnswer[] = (started.answers ?? []).map((answer) => ({
      id: answer.id,
      attemptId: started.attemptId,
      questionId: answer.questionId,
      answer: answer.answer,
      maxMarks: answer.maxMarks,
      lastSavedAt: answer.lastSavedAt,
    }));

    setSnapshot((current) => ({
      ...current,
      questions: [...current.questions.filter((question) => question.testVersionId !== version.id), ...safeQuestions],
    }));
    if (restoredAnswers.length) {
      setAnswers((rows) => {
        const restoredQuestionIds = new Set(restoredAnswers.map((answer) => answer.questionId));
        return [
          ...restoredAnswers,
          ...rows.filter((answer) => answer.attemptId !== started.attemptId || !restoredQuestionIds.has(answer.questionId)),
        ];
      });
    }
    setAttempts((rows) => (rows.some((row) => row.id === attempt.id) ? rows.map((row) => (row.id === attempt.id ? attempt : row)) : [attempt, ...rows]));
    return attempt;
  };

  const beginAttempt = async (input: BeginAttemptInput): Promise<TestAttempt> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    return beginSupabaseAttempt(input);
  };

  const createSupabaseAssignments = async (input: CreateAssignmentsInput): Promise<TestAssignment[]> => {
    if (!supabase) throw new Error('Supabase is not configured');
    const uniqueVersionIds = Array.from(new Set(input.testVersionIds));
    if (!input.classId) throw new Error('Class is required');
    if (!uniqueVersionIds.length) throw new Error('Select at least one test');
    const recipientScope = input.recipientScope ?? 'selected';
    const recipientStudentIds = Array.from(new Set(input.recipientStudentIds));
    if (recipientScope === 'selected' && !recipientStudentIds.length) throw new Error('Select at least one student');
    const eligibleStudentIds = new Set(
      snapshot.students
        .filter((student) => student.accountStatus === 'active' && student.classIds.includes(input.classId))
        .map((student) => student.id),
    );
    if (recipientScope === 'selected' && recipientStudentIds.some((studentId) => !eligibleStudentIds.has(studentId))) {
      throw new Error('Selected students must belong to the chosen class.');
    }
    if (!snapshot.teacher.profileId) throw new Error('Teacher profile is not loaded');
    const targetClass = snapshot.classes.find((classRecord) => classRecord.id === input.classId);
    if (targetClass?.isSystem) throw new Error('Assignments cannot be created for Non-class');
    const allowedCourseIds = new Set(targetClass?.courseIds ?? []);
    const testByVersionId = new Map(
      snapshot.testVersions.map((version) => [version.id, snapshot.tests.find((test) => test.id === version.testId)]),
    );
    const topicById = new Map(snapshot.topics.map((topic) => [topic.id, topic]));
    const unitById = new Map(snapshot.units.map((unit) => [unit.id, unit]));
    const hasUnavailableCourse = uniqueVersionIds.some((versionId) => {
      const test = testByVersionId.get(versionId);
      const topic = test ? topicById.get(test.topicId) : undefined;
      const unit = topic ? unitById.get(topic.unitId) : undefined;
      return !unit || !allowedCourseIds.has(unit.subjectId);
    });
    if (hasUnavailableCourse) throw new Error('One or more tests are not available to this class.');
    const now = new Date().toISOString();
    const rows = uniqueVersionIds.map((testVersionId) => ({
      test_version_id: testVersionId,
      assigned_by: snapshot.teacher.profileId,
      class_id: input.classId,
      recipient_scope: recipientScope,
      start_at: now,
      due_at: input.dueAt ?? null,
      time_limit_seconds: null,
      attempt_limit: input.attemptLimit ?? null,
      feedback_policy: input.feedbackPolicy ?? 'score_only',
      status: input.status ?? 'open',
    }));
    const { data, error } = await supabase
      .from('test_assignments')
      .insert(rows)
      .select('id, test_version_id, class_id, assigned_by, recipient_scope, start_at, due_at, time_limit_seconds, attempt_limit, feedback_policy, status');
    if (error) throw error;
    const assignments = ((data ?? []) as AssignmentRow[]).map(mapAssignmentRow);
    if (recipientScope === 'selected') {
      const recipientRows = assignments.flatMap((assignment) => recipientStudentIds.map((studentId) => ({ assignment_id: assignment.id, student_id: studentId })));
      const { error: recipientError } = await supabase.from('assignment_recipients').insert(recipientRows);
      if (recipientError) throw recipientError;
    }
    const assignmentsWithRecipients = assignments.map((assignment) => ({
      ...assignment,
      assignedByName: snapshot.teacher.displayName,
      recipientStudentIds: recipientScope === 'selected' ? recipientStudentIds : [],
    }));
    setSnapshot((current) => ({
      ...current,
      assignments: [...assignmentsWithRecipients, ...current.assignments],
    }));
    return assignmentsWithRecipients;
  };

  const createAssignments = async (input: CreateAssignmentsInput): Promise<TestAssignment[]> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    return createSupabaseAssignments(input);
  };

  const deleteAssignment = async (assignmentId: string): Promise<'deleted' | 'archived'> => {
    if (!isSupabaseBacked || !supabase) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    const { data: attempts, error: attemptsError } = await supabase
      .from('test_attempts')
      .select('id')
      .eq('assignment_id', assignmentId)
      .limit(1);
    if (attemptsError) throw attemptsError;

    const hasAttemptHistory = Boolean(attempts?.length);
    const { error } = hasAttemptHistory
      ? await supabase.from('test_assignments').update({ status: 'archived' }).eq('id', assignmentId)
      : await supabase.from('test_assignments').delete().eq('id', assignmentId);
    if (error) throw error;
    setSnapshot((current) => ({
      ...current,
      assignments: hasAttemptHistory
        ? current.assignments.map((assignment) => assignment.id === assignmentId ? { ...assignment, status: 'archived' } : assignment)
        : current.assignments.filter((assignment) => assignment.id !== assignmentId),
    }));
    return hasAttemptHistory ? 'archived' : 'deleted';
  };

  const updateSupabaseClass = async (input: UpdateClassInput): Promise<ClassRecord> => {
    if (!supabase) throw new Error('Supabase is not configured');
    const className = input.className.trim();
    const academicYear = input.academicYear.trim();
    const yearGroup = input.yearGroup.trim();
    if (!className) throw new Error('Class name is required');

    const { data, error } = await supabase
      .from('classes')
      .update({
        class_name: className,
        academic_year: academicYear || null,
        year_group: yearGroup || null,
        status: input.status,
        accepting_students: input.acceptingStudents ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id)
      .select('id, class_name, academic_year, year_group, owner_teacher_id, status, join_code, accepting_students, is_system')
      .single();
    if (error) throw error;

    const courseIds = [...new Set(input.courseIds)];
    const { error: removeCoursesError } = await supabase.from('class_courses').delete().eq('class_id', input.id);
    if (removeCoursesError) throw removeCoursesError;
    if (courseIds.length) {
      const { error: addCoursesError } = await supabase
        .from('class_courses')
        .insert(courseIds.map((subjectId) => ({ class_id: input.id, subject_id: subjectId })));
      if (addCoursesError) throw addCoursesError;
    }

    const updatedClass = mapClassRow({ ...(data as ClassRow), course_ids: courseIds });
    setSnapshot((current) => ({
      ...current,
      classes: current.classes.map((classRecord) => (classRecord.id === updatedClass.id ? updatedClass : classRecord)),
      leaderboardRows: current.leaderboardRows.map((row) => {
        const student = current.students.find((studentRecord) => studentRecord.id === row.studentId);
        return student?.classId === updatedClass.id ? { ...row, className: updatedClass.className } : row;
      }),
    }));
    return updatedClass;
  };

  const updateClass = async (input: UpdateClassInput): Promise<ClassRecord> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    return updateSupabaseClass(input);
  };

  const archiveClass = async (classId: string): Promise<ClassRecord> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    const classRecord = snapshot.classes.find((row) => row.id === classId);
    if (!classRecord) throw new Error('Class not found');
    if (classRecord.isSystem) throw new Error('Non-class cannot be archived');
    const result = await invokeFunction<ClassResponse>('archive-class', { classId });
    const nextSnapshot = await refreshSnapshot();
    return nextSnapshot.classes.find((row) => row.id === classId) ?? result.class;
  };

  const regenerateClassCode = async (classId: string): Promise<ClassRecord> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    const result = await invokeFunction<ClassResponse>('regenerate-class-code', { classId });
    const nextSnapshot = await refreshSnapshot();
    return nextSnapshot.classes.find((row) => row.id === classId) ?? result.class;
  };

  const updateSupabaseStudent = async (input: UpdateStudentInput): Promise<StudentProfile> => {
    const firstName = input.firstName.trim();
    const surname = input.surname.trim();
    if (!firstName || !surname) throw new Error('First name and surname are required');
    const classIds = [...new Set(input.classIds.map((classId) => classId.trim()).filter(Boolean))];

    const result = await invokeFunction<UpdateStudentResponse>('update-student-account', {
      studentId: input.id,
      firstName,
      surname,
      ...(input.initialYearGroup === undefined ? {} : { initialYearGroup: input.initialYearGroup }),
      classIds,
      accountStatus: input.accountStatus,
    });
    const updatedStudent = result.student;
    const nextSnapshot = await refreshSnapshot();
    return nextSnapshot.students.find((student) => student.id === updatedStudent.id) ?? updatedStudent;
  };

  const updateStudent = async (input: UpdateStudentInput): Promise<StudentProfile> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    return updateSupabaseStudent(input);
  };

  const archiveStudent = async (studentId: string): Promise<StudentProfile> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    const student = snapshot.students.find((row) => row.id === studentId);
    if (!student) throw new Error('Student not found');
    return updateSupabaseStudent({
      id: student.id,
      firstName: student.firstName,
      surname: student.surname,
      classIds: student.classIds,
      accountStatus: 'archived',
    });
  };

  const resetStudentPassword = async (input: ResetStudentPasswordInput): Promise<string> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    const password = input.temporaryPassword?.trim();
    if (password && password.length < 8) throw new Error('Password must be at least 8 characters');
    const result = await invokeFunction<ResetStudentPasswordResponse>('reset-student-password', {
      studentId: input.studentId,
      ...(password ? { temporaryPassword: password } : {}),
    });
    return result.temporaryPassword;
  };

  const joinClassByCode = async (code: string): Promise<string> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    const result = await invokeFunction<JoinClassResponse>('join-class-by-code', { code });
    await refreshSnapshot();
    return result.message;
  };

  const saveAnswer = async (attemptId: string, questionId: string, answer: string): Promise<void> => {
    if (!isSupabaseBacked) {
      throw new Error(SUPABASE_REQUIRED_MESSAGE);
    }

    const maxMarks = snapshot.questions.find((question) => question.id === questionId)?.maxMarks ?? 1;
    const existingAnswer = answers.find((row) => row.attemptId === attemptId && row.questionId === questionId);
    const result = await invokeFunction<SaveAnswerResponse>('save-answer', {
      attemptId,
      questionId,
      answer,
      maxMarks,
      expectedLastSavedAt: existingAnswer?.lastSavedAt ?? null,
    });
    const savedAnswer: StudentAnswer = {
      id: result.answerId ?? existingAnswer?.id ?? `answer-${crypto.randomUUID()}`,
      attemptId,
      questionId,
      answer,
      lastSavedAt: result.savedAt,
      maxMarks,
    };
    setAnswers((rows) => {
      const existingIndex = rows.findIndex((row) => row.attemptId === attemptId && row.questionId === questionId);
      if (existingIndex >= 0) {
        return rows.map((row, index) => (index === existingIndex ? savedAnswer : row));
      }
      return [savedAnswer, ...rows];
    });
  };

  const saveAttemptProgress = (attemptId: string, questionIndex: number) => {
    if (!isSupabaseBacked) {
      setDataError(SUPABASE_REQUIRED_MESSAGE);
      return;
    }

    const resumeQuestionIndex = Math.max(0, Math.floor(questionIndex));
    setAttempts((rows) => rows.map((row) => row.id === attemptId ? { ...row, resumeQuestionIndex } : row));
    void invokeFunction('save-answer', { attemptId, resumeQuestionIndex }).catch((error: unknown) => {
      setDataError(error instanceof Error ? error.message : 'Unable to save test progress');
    });
  };

  const submitSupabaseAttempt = async (attemptId: string): Promise<TestAttempt> => {
    const attempt = attempts.find((row) => row.id === attemptId);
    if (!attempt) throw new Error('Attempt not found');
    const result = await invokeFunction<SubmitAttemptResponse>('submit-test-attempt', {
      attemptId,
    });
    const submittedAt = new Date();
    const durationSeconds = Math.round((submittedAt.getTime() - new Date(attempt.startedAt).getTime()) / 1000);
    const completedAttempt: TestAttempt = {
      ...attempt,
      status: result.timedOut ? 'timed_out' : 'feedback_released',
      submittedAt: submittedAt.toISOString(),
      durationSeconds,
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      markingStatus: 'marked',
      feedbackStatus: 'released',
      pointsAwarded: result.pointsAwarded,
    };
    setAttempts((rows) => rows.map((row) => (row.id === attemptId ? completedAttempt : row)));
    if (result.pointsAwarded > 0) {
      setEarnedPoints((rows) => [
        {
          id: `points-${crypto.randomUUID()}`,
          studentId: currentStudent.id,
          points: result.pointsAwarded,
          reason: 'Server-marked attempt',
          relatedAttemptId: attemptId,
          createdAt: submittedAt.toISOString(),
        },
        ...rows,
      ]);
    }
    return completedAttempt;
  };

  const submitAttempt = async (attemptId: string): Promise<TestAttempt> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    return submitSupabaseAttempt(attemptId);
  };

  const getAttemptReview = async (attemptId: string): Promise<AttemptReview> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    return invokeFunction<AttemptReview>('get-attempt-review', { attemptId });
  };

  const logAttemptEvent = (attemptId: string, eventType: AttemptEvent['eventType']) => {
    if (!isSupabaseBacked) {
      setDataError(SUPABASE_REQUIRED_MESSAGE);
      return;
    }

    const attempt = attempts.find((row) => row.id === attemptId);
    if (!attempt || attempt.status !== 'in_progress') return;
    const recentDuplicate = events.some(
      (event) =>
        event.attemptId === attemptId &&
        event.eventType === eventType &&
        Date.now() - new Date(event.createdAt).getTime() < 5000,
    );
    if (recentDuplicate) return;
    setEvents((rows) => [
      {
        id: `event-${crypto.randomUUID()}`,
        attemptId,
        studentId: currentStudent.id,
        eventType,
        createdAt: new Date().toISOString(),
      },
      ...rows,
    ]);
    setAttempts((rows) =>
      rows.map((row) =>
        row.id === attemptId ? { ...row, suspiciousEventCount: row.suspiciousEventCount + 1 } : row,
      ),
    );

    void invokeFunction('log-attempt-event', { attemptId, eventType, route: window.location.hash }).catch((error: unknown) => {
      setDataError(error instanceof Error ? error.message : 'Unable to log attempt event');
    });
  };

  const markAssignedAttemptVoided = (attemptId: string, reason: string) => {
    setAttempts((rows) =>
      rows.map((row) =>
        row.id === attemptId && row.attemptType === 'assigned'
          ? ({ ...row, status: 'voided', feedbackStatus: 'hidden', suspiciousEventCount: row.suspiciousEventCount, voidReason: reason } as TestAttempt)
          : row,
      ),
    );
  };

  const voidAssignedAttempt = (attemptId: string, reason: string) => {
    if (!isSupabaseBacked) {
      setDataError(SUPABASE_REQUIRED_MESSAGE);
      return;
    }

    void invokeFunction('reset-assigned-attempt', { attemptId, reason })
      .then(() => markAssignedAttemptVoided(attemptId, reason))
      .catch((error: unknown) => {
        setDataError(error instanceof Error ? error.message : 'Unable to void assigned attempt');
      });
  };

  const signOut = () => {
    clearActivitySession();
    if (isSupabaseConfigured) {
      void signOutFromSupabase();
    }
    setSessionState({ role: null, displayName: '' });
    setSnapshot(emptySnapshot);
    setAttempts([]);
    setAnswers([]);
    setEvents([]);
    setEarnedPoints([]);
    setDataError(isSupabaseConfigured ? '' : SUPABASE_REQUIRED_MESSAGE);
  };

  const value: AppStateValue = {
    ...snapshot,
    session,
    setSession,
    signOut,
    currentStudent,
    attempts,
    answers,
    events,
    leaderboardRows,
    allTimeLeaderboardRows,
    pointsTotal,
    statusName,
    isSupabaseBacked,
    isRestoringSession,
    isLoadingData,
    dataError,
    beginAttempt,
    saveAnswer,
    saveAttemptProgress,
    submitAttempt,
    getAttemptReview,
    logAttemptEvent,
    voidAssignedAttempt,
    createAssignments,
    deleteAssignment,
    updateClass,
    archiveClass,
    regenerateClassCode,
    updateStudent,
    archiveStudent,
    resetStudentPassword,
    joinClassByCode,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}
