/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  assignments,
  attempts as initialAttempts,
  classes,
  leaderboardRows,
  pointsForStudent,
  questions,
  students,
  subjects,
  teacher,
  tests,
  testVersions,
  topics,
  units,
} from '../data/demoData';
import { calculateAttemptPoints, statusForPoints } from '../lib/points';
import type { AttemptEvent, PointsTransaction, StudentAnswer, TestAttempt, UserRole } from '../types/domain';

interface SessionState {
  role: UserRole | null;
  displayName: string;
}

interface BeginAttemptInput {
  testId: string;
  assignmentId?: string;
}

interface AppStateValue {
  session: SessionState;
  setSession: (session: SessionState) => void;
  signOut: () => void;
  currentStudent: (typeof students)[number];
  teacher: typeof teacher;
  classes: typeof classes;
  students: typeof students;
  subjects: typeof subjects;
  units: typeof units;
  topics: typeof topics;
  tests: typeof tests;
  testVersions: typeof testVersions;
  questions: typeof questions;
  assignments: typeof assignments;
  attempts: TestAttempt[];
  answers: StudentAnswer[];
  events: AttemptEvent[];
  leaderboardRows: typeof leaderboardRows;
  pointsTotal: number;
  statusName: string;
  beginAttempt: (input: BeginAttemptInput) => TestAttempt;
  saveAnswer: (attemptId: string, questionId: string, answer: string) => void;
  submitAttempt: (attemptId: string) => TestAttempt;
  logAttemptEvent: (attemptId: string, eventType: AttemptEvent['eventType']) => void;
  voidAssignedAttempt: (attemptId: string, reason: string) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({ role: null, displayName: '' });
  const [attempts, setAttempts] = useState<TestAttempt[]>(initialAttempts);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [events, setEvents] = useState<AttemptEvent[]>([]);
  const [earnedPoints, setEarnedPoints] = useState<PointsTransaction[]>([]);
  const currentStudent = students[0];

  const pointsTotal = pointsForStudent(currentStudent.id) + earnedPoints.reduce((total, row) => total + row.points, 0);
  const statusName = statusForPoints(pointsTotal).name;

  const beginAttempt = ({ testId, assignmentId }: BeginAttemptInput): TestAttempt => {
    const test = tests.find((item) => item.id === testId);
    if (!test) throw new Error('Test not found');
    const version = testVersions.find((item) => item.testId === test.id && item.status === 'published');
    if (!version) throw new Error('Published test version not found');
    const assignment = assignmentId ? assignments.find((item) => item.id === assignmentId) : undefined;

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

  const saveAnswer = (attemptId: string, questionId: string, answer: string) => {
    setAnswers((rows) => {
      const existingIndex = rows.findIndex((row) => row.attemptId === attemptId && row.questionId === questionId);
      const nextAnswer: StudentAnswer = {
        id: existingIndex >= 0 ? rows[existingIndex].id : `answer-${crypto.randomUUID()}`,
        attemptId,
        questionId,
        answer,
        maxMarks: questions.find((question) => question.id === questionId)?.maxMarks ?? 1,
      };
      if (existingIndex >= 0) {
        return rows.map((row, index) => (index === existingIndex ? nextAnswer : row));
      }
      return [nextAnswer, ...rows];
    });
  };

  const submitAttempt = (attemptId: string): TestAttempt => {
    const attempt = attempts.find((row) => row.id === attemptId);
    if (!attempt) throw new Error('Attempt not found');
    const attemptQuestions = questions.filter((question) => question.testVersionId === attempt.testVersionId);
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
  };

  const voidAssignedAttempt = (attemptId: string, reason: string) => {
    setAttempts((rows) =>
      rows.map((row) =>
        row.id === attemptId && row.attemptType === 'assigned'
          ? { ...row, status: 'voided', feedbackStatus: 'hidden', suspiciousEventCount: row.suspiciousEventCount, voidReason: reason } as TestAttempt
          : row,
      ),
    );
  };

  const value: AppStateValue = {
    session,
    setSession,
    signOut: () => setSession({ role: null, displayName: '' }),
    currentStudent,
    teacher,
    classes,
    students,
    subjects,
    units,
    topics,
    tests,
    testVersions,
    questions,
    assignments,
    attempts,
    answers,
    events,
    leaderboardRows,
    pointsTotal,
    statusName,
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
