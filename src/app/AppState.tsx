/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  assignments as demoAssignments,
  attempts as demoAttempts,
  classes as demoClasses,
  leaderboardRows as demoLeaderboardRows,
  pointsTransactions as demoPointsTransactions,
  questions as demoQuestions,
  students as demoStudents,
  subjects as demoSubjects,
  teacher as demoTeacher,
  tests as demoTests,
  testVersions as demoTestVersions,
  topics as demoTopics,
  units as demoUnits,
} from '../data/demoData';
import { signOut as signOutFromSupabase } from '../lib/auth';
import { calculateAttemptPoints, statusForPoints } from '../lib/points';
import { buildLeaderboardFromPoints, loadSupabaseSnapshot, type SupabaseSnapshot } from '../lib/supabaseData';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import type { AttemptEvent, PointsTransaction, Question, StudentAnswer, TestAttempt, UserRole } from '../types/domain';

interface SessionState {
  role: UserRole | null;
  displayName: string;
}

interface BeginAttemptInput {
  testId: string;
  assignmentId?: string;
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

interface AppStateValue extends SupabaseSnapshot {
  session: SessionState;
  setSession: (session: SessionState) => void;
  signOut: () => void;
  currentStudent: (typeof demoStudents)[number];
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
}

const demoSnapshot: SupabaseSnapshot = {
  teacher: demoTeacher,
  classes: demoClasses,
  students: demoStudents,
  subjects: demoSubjects,
  units: demoUnits,
  topics: demoTopics,
  tests: demoTests,
  testVersions: demoTestVersions,
  questions: demoQuestions,
  assignments: demoAssignments,
  attempts: demoAttempts,
  answers: [],
  events: [],
  pointsTransactions: demoPointsTransactions,
  leaderboardRows: demoLeaderboardRows,
};

const AppStateContext = createContext<AppStateValue | null>(null);

function hasFunctionError(value: unknown): value is { error: string } {
  return Boolean(value && typeof value === 'object' && 'error' in value);
}

async function invokeFunction<T>(name: string, body: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.functions.invoke<T | { error: string }>(name, { body });
  if (error) throw error;
  if (hasFunctionError(data)) throw new Error(data.error);
  return data as T;
}

function totalPointsForStudent(studentId: string, points: PointsTransaction[]): number {
  return points
    .filter((transaction) => transaction.studentId === studentId)
    .reduce((total, transaction) => total + transaction.points, 0);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionState>({ role: null, displayName: '' });
  const [snapshot, setSnapshot] = useState<SupabaseSnapshot>(demoSnapshot);
  const [attempts, setAttempts] = useState<TestAttempt[]>(demoAttempts);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [events, setEvents] = useState<AttemptEvent[]>([]);
  const [earnedPoints, setEarnedPoints] = useState<PointsTransaction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  const isSupabaseBacked = Boolean(isSupabaseConfigured && supabase && session.role);

  useEffect(() => {
    let isActive = true;

    if (!isSupabaseConfigured || !supabase || !session.role) {
      setIsLoadingData(false);
      setDataError('');
      if (!session.role) {
        setSnapshot(demoSnapshot);
        setAttempts(demoAttempts);
        setAnswers([]);
        setEvents([]);
        setEarnedPoints([]);
      }
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

  const currentStudent = snapshot.students[0] ?? demoStudents[0];
  const pointRows = [...snapshot.pointsTransactions, ...earnedPoints];
  const pointsTotal = totalPointsForStudent(currentStudent.id, pointRows);
  const statusName = statusForPoints(pointsTotal).name;
  const leaderboardRows = snapshot.leaderboardRows.length
    ? snapshot.leaderboardRows
    : buildLeaderboardFromPoints(snapshot.students, snapshot.classes, pointRows);

  const setSession = (nextSession: SessionState) => {
    setSessionState(nextSession);
  };

  const beginDemoAttempt = ({ testId, assignmentId }: BeginAttemptInput): TestAttempt => {
    const test = snapshot.tests.find((item) => item.id === testId);
    if (!test) throw new Error('Test not found');
    const version = snapshot.testVersions.find((item) => item.testId === test.id && item.status === 'published');
    if (!version) throw new Error('Published test version not found');
    const assignment = assignmentId ? snapshot.assignments.find((item) => item.id === assignmentId) : undefined;

    if (assignmentId) {
      const consumedAttempt = attempts.find(
        (attempt) =>
          attempt.assignmentId === assignmentId &&
          attempt.studentId === currentStudent.id &&
          attempt.status !== 'voided',
      );
      if (consumedAttempt) return consumedAttempt;
    }

    const priorAttempts = attempts.filter(
      (attempt) => attempt.studentId === currentStudent.id && attempt.testVersionId === version.id,
    );
    const now = new Date();
    const timeLimitSeconds = assignment?.timeLimitSeconds ?? test.defaultTimeLimitSeconds;
    const attempt: TestAttempt = {
      id: `attempt-${crypto.randomUUID()}`,
      studentId: currentStudent.id,
      classIdAtAttempt: currentStudent.classId,
      testId: test.id,
      testVersionId: version.id,
      assignmentId,
      attemptType: assignmentId ? 'assigned' : 'practice',
      attemptNumber: priorAttempts.length + 1,
      status: 'in_progress',
      startedAt: now.toISOString(),
      timeLimitSeconds,
      markingStatus: 'not_required',
      feedbackStatus: 'hidden',
      suspiciousEventCount: 0,
    };
    setAttempts((rows) => [attempt, ...rows]);
    return attempt;
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
      classIdAtAttempt: currentStudent.classId,
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
    if (isSupabaseBacked) return beginSupabaseAttempt(input);
    return beginDemoAttempt(input);
  };

  const saveAnswer = (attemptId: string, questionId: string, answer: string) => {
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

    if (isSupabaseBacked) {
      void invokeFunction('save-answer', { attemptId, questionId, answer, maxMarks }).catch((error: unknown) => {
        setDataError(error instanceof Error ? error.message : 'Unable to save answer');
      });
    }
  };

  const submitDemoAttempt = (attemptId: string): TestAttempt => {
    const attempt = attempts.find((row) => row.id === attemptId);
    if (!attempt) throw new Error('Attempt not found');
    const attemptQuestions = snapshot.questions.filter((question) => question.testVersionId === attempt.testVersionId);
    const answeredCount = answers.filter((answer) => answer.attemptId === attemptId && answer.answer).length;
    const maxScore = attemptQuestions.reduce((total, question) => total + question.maxMarks, 0);
    const simulatedServerScore = Math.min(answeredCount, Math.max(maxScore - 1, 0));
    const percentage = maxScore === 0 ? 0 : Math.round((simulatedServerScore / maxScore) * 100);
    const submittedAt = new Date();
    const durationSeconds = Math.round((submittedAt.getTime() - new Date(attempt.startedAt).getTime()) / 1000);
    const timedOut = Boolean(attempt.timeLimitSeconds && durationSeconds > attempt.timeLimitSeconds);
    const previousBest = Math.max(
      0,
      ...attempts
        .filter((row) => row.studentId === currentStudent.id && row.testId === attempt.testId && row.percentage)
        .map((row) => row.percentage ?? 0),
    );
    const points = calculateAttemptPoints({
      attemptType: attempt.attemptType,
      percentage,
      isFirstPracticeAttempt: attempt.attemptType === 'practice' && attempt.attemptNumber === 1,
      previousBestPercentage: previousBest || undefined,
      completedWithinLimit: !timedOut,
    });
    const completedAttempt: TestAttempt = {
      ...attempt,
      status: timedOut ? 'timed_out' : 'feedback_released',
      submittedAt: submittedAt.toISOString(),
      durationSeconds,
      score: simulatedServerScore,
      maxScore,
      percentage,
      markingStatus: 'marked',
      feedbackStatus: 'released',
      pointsAwarded: points.points,
    };
    setAttempts((rows) => rows.map((row) => (row.id === attemptId ? completedAttempt : row)));
    if (points.points > 0) {
      setEarnedPoints((rows) => [
        {
          id: `points-${crypto.randomUUID()}`,
          studentId: currentStudent.id,
          points: points.points,
          reason: points.reasons.join('; '),
          relatedAttemptId: attemptId,
          createdAt: submittedAt.toISOString(),
        },
        ...rows,
      ]);
    }
    return completedAttempt;
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
    if (isSupabaseBacked) return submitSupabaseAttempt(attemptId);
    return submitDemoAttempt(attemptId);
  };

  const logAttemptEvent = (attemptId: string, eventType: AttemptEvent['eventType']) => {
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

    if (isSupabaseBacked) {
      void invokeFunction('log-attempt-event', { attemptId, eventType, route: window.location.hash }).catch((error: unknown) => {
        setDataError(error instanceof Error ? error.message : 'Unable to log attempt event');
      });
    }
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
    if (isSupabaseBacked) {
      void invokeFunction('reset-assigned-attempt', { attemptId, reason })
        .then(() => markAssignedAttemptVoided(attemptId, reason))
        .catch((error: unknown) => {
          setDataError(error instanceof Error ? error.message : 'Unable to void assigned attempt');
        });
      return;
    }
    markAssignedAttemptVoided(attemptId, reason);
  };

  const signOut = () => {
    if (isSupabaseConfigured) {
      void signOutFromSupabase();
    }
    setSessionState({ role: null, displayName: '' });
    setSnapshot(demoSnapshot);
    setAttempts(demoAttempts);
    setAnswers([]);
    setEvents([]);
    setEarnedPoints([]);
    setDataError('');
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
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}
