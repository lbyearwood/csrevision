/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { signOut as signOutFromSupabase } from '../lib/auth';
import { statusForPoints } from '../lib/points';
import { buildLeaderboardFromPoints, loadSupabaseSnapshot, type SupabaseSnapshot } from '../lib/supabaseData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
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
  dueAt?: string;
  timeLimitSeconds?: number;
  attemptLimit?: number;
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
}

interface UpdateStudentInput {
  id: string;
  firstName: string;
  surname: string;
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
}

interface SubmitAttemptResponse {
  score: number;
  maxScore: number;
  percentage: number;
  pointsAwarded: number;
  timedOut: boolean;
}

interface AssignmentRow {
  id: string;
  test_version_id: string;
  class_id: string;
  start_at: string | null;
  due_at: string | null;
  time_limit_seconds: number | null;
  attempt_limit: number;
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
}

interface AppStateValue extends SupabaseSnapshot {
  session: SessionState;
  setSession: (session: SessionState) => void;
  signOut: () => void;
  currentStudent: StudentProfile;
  pointsTotal: number;
  statusName: string;
  isSupabaseBacked: boolean;
  isLoadingData: boolean;
  dataError: string;
  beginAttempt: (input: BeginAttemptInput) => Promise<TestAttempt>;
  saveAnswer: (attemptId: string, questionId: string, answer: string) => void;
  submitAttempt: (attemptId: string) => Promise<TestAttempt>;
  logAttemptEvent: (attemptId: string, eventType: AttemptEvent['eventType']) => void;
  voidAssignedAttempt: (attemptId: string, reason: string) => void;
  createAssignments: (input: CreateAssignmentsInput) => Promise<TestAssignment[]>;
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

  const { data, error } = await supabase.functions.invoke<T | { error: string }>(name, {
    body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (error) throw new Error(await functionErrorMessage(error));
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
  const [dataError, setDataError] = useState('');

  const isSupabaseBacked = Boolean(isSupabaseConfigured && supabase && session.role);

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
        setDataError(error instanceof Error ? error.message : 'Unable to load local Supabase data');
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
  const leaderboardRows = snapshot.leaderboardRows.length
    ? snapshot.leaderboardRows
    : buildLeaderboardFromPoints(snapshot.students, snapshot.classes, pointRows);

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
      status: existingAttempt?.status === 'in_progress' ? existingAttempt.status : 'in_progress',
      startedAt: started.startedAt,
      timeLimitSeconds: started.timeLimitSeconds ?? test.defaultTimeLimitSeconds,
      markingStatus: existingAttempt?.markingStatus ?? 'not_required',
      feedbackStatus: existingAttempt?.feedbackStatus ?? 'hidden',
      suspiciousEventCount: existingAttempt?.suspiciousEventCount ?? 0,
    };

    setSnapshot((current) => ({
      ...current,
      questions: [...current.questions.filter((question) => question.testVersionId !== version.id), ...safeQuestions],
    }));
    setAttempts((rows) => (rows.some((row) => row.id === attempt.id) ? rows.map((row) => (row.id === attempt.id ? attempt : row)) : [attempt, ...rows]));
    return attempt;
  };

  const beginAttempt = async (input: BeginAttemptInput): Promise<TestAttempt> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    return beginSupabaseAttempt(input);
  };

  const defaultTimeLimitForVersion = (testVersionId: string): number => {
    const version = snapshot.testVersions.find((item) => item.id === testVersionId);
    const test = snapshot.tests.find((item) => item.id === version?.testId);
    return test?.defaultTimeLimitSeconds ?? 900;
  };

  const createSupabaseAssignments = async (input: CreateAssignmentsInput): Promise<TestAssignment[]> => {
    if (!supabase) throw new Error('Supabase is not configured');
    const uniqueVersionIds = Array.from(new Set(input.testVersionIds));
    if (!input.classId) throw new Error('Class is required');
    if (!uniqueVersionIds.length) throw new Error('Select at least one test');
    if (!snapshot.teacher.profileId) throw new Error('Teacher profile is not loaded');
    const targetClass = snapshot.classes.find((classRecord) => classRecord.id === input.classId);
    if (targetClass?.isSystem) throw new Error('Assignments cannot be created for Non-class');
    const now = new Date().toISOString();
    const rows = uniqueVersionIds.map((testVersionId) => ({
      test_version_id: testVersionId,
      assigned_by: snapshot.teacher.profileId,
      class_id: input.classId,
      start_at: now,
      due_at: input.dueAt ?? null,
      time_limit_seconds: input.timeLimitSeconds ?? defaultTimeLimitForVersion(testVersionId),
      attempt_limit: input.attemptLimit ?? 1,
      feedback_policy: input.feedbackPolicy ?? 'score_only',
      status: input.status ?? 'open',
    }));
    const { data, error } = await supabase
      .from('test_assignments')
      .insert(rows)
      .select('id, test_version_id, class_id, start_at, due_at, time_limit_seconds, attempt_limit, feedback_policy, status');
    if (error) throw error;
    const assignments = ((data ?? []) as AssignmentRow[]).map(mapAssignmentRow);
    setSnapshot((current) => ({
      ...current,
      assignments: [...assignments, ...current.assignments],
    }));
    return assignments;
  };

  const createAssignments = async (input: CreateAssignmentsInput): Promise<TestAssignment[]> => {
    if (!isSupabaseBacked) throw new Error(SUPABASE_REQUIRED_MESSAGE);
    return createSupabaseAssignments(input);
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

    const updatedClass = mapClassRow(data as ClassRow);
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

  const saveAnswer = (attemptId: string, questionId: string, answer: string) => {
    if (!isSupabaseBacked) {
      setDataError(SUPABASE_REQUIRED_MESSAGE);
      return;
    }

    const maxMarks = snapshot.questions.find((question) => question.id === questionId)?.maxMarks ?? 1;
    setAnswers((rows) => {
      const existingIndex = rows.findIndex((row) => row.attemptId === attemptId && row.questionId === questionId);
      const nextAnswer: StudentAnswer = {
        id: existingIndex >= 0 ? rows[existingIndex].id : `answer-${crypto.randomUUID()}`,
        attemptId,
        questionId,
        answer,
        maxMarks,
      };
      if (existingIndex >= 0) {
        return rows.map((row, index) => (index === existingIndex ? nextAnswer : row));
      }
      return [nextAnswer, ...rows];
    });

    void invokeFunction('save-answer', { attemptId, questionId, answer, maxMarks }).catch((error: unknown) => {
      setDataError(error instanceof Error ? error.message : 'Unable to save answer');
    });
  };

  const submitSupabaseAttempt = async (attemptId: string): Promise<TestAttempt> => {
    const attempt = attempts.find((row) => row.id === attemptId);
    if (!attempt) throw new Error('Attempt not found');
    const submittedAnswers = answers
      .filter((answer) => answer.attemptId === attemptId)
      .map((answer) => ({ questionId: answer.questionId, answer: answer.answer }));
    const result = await invokeFunction<SubmitAttemptResponse>('submit-test-attempt', {
      attemptId,
      answers: submittedAnswers,
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
    pointsTotal,
    statusName,
    isSupabaseBacked,
    isLoadingData,
    dataError,
    beginAttempt,
    saveAnswer,
    submitAttempt,
    logAttemptEvent,
    voidAssignedAttempt,
    createAssignments,
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
