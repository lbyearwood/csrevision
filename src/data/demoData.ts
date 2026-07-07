import { leaderboardDisplay } from '../lib/identity';
import { rankLeaderboard } from '../lib/leaderboard';
import { statusForPoints } from '../lib/points';
import type {
  ClassRecord,
  LeaderboardRow,
  Question,
  StudentProfile,
  Test,
  TestAssignment,
  TestAttempt,
  TestVersion,
  Topic,
  Unit,
  Subject,
  TeacherProfile,
  PointsTransaction,
} from '../types/domain';

export const teacher: TeacherProfile = {
  id: 'teacher-1',
  profileId: 'profile-teacher-1',
  displayName: 'J. Doe',
  email: 'j.doe@school.example',
};

export const classes: ClassRecord[] = [
  {
    id: 'class-8a',
    className: '8A Computing',
    academicYear: '2026/27',
    yearGroup: '8',
    ownerTeacherId: teacher.id,
    status: 'active',
  },
  {
    id: 'class-9b',
    className: '9B Computer Science',
    academicYear: '2026/27',
    yearGroup: '9',
    ownerTeacherId: teacher.id,
    status: 'active',
  },
];

export const students: StudentProfile[] = [
  {
    id: 'student-1',
    profileId: 'profile-student-1',
    firstName: 'Ananya',
    surname: 'Singh',
    username: 'asingh5827',
    publicStudentId: '2587',
    classId: 'class-8a',
    accountStatus: 'active',
  },
  {
    id: 'student-2',
    profileId: 'profile-student-2',
    firstName: 'Rohan',
    surname: 'Mehta',
    username: 'rmehta4120',
    publicStudentId: '2410',
    classId: 'class-8a',
    accountStatus: 'active',
  },
  {
    id: 'student-3',
    profileId: 'profile-student-3',
    firstName: 'Diya',
    surname: 'Patel',
    username: 'dpatel9144',
    publicStudentId: '2468',
    classId: 'class-8a',
    accountStatus: 'active',
  },
  {
    id: 'student-4',
    profileId: 'profile-student-4',
    firstName: 'Vikram',
    surname: 'Kumar',
    username: 'vkumar3021',
    publicStudentId: '2390',
    classId: 'class-8a',
    accountStatus: 'active',
  },
  {
    id: 'student-5',
    profileId: 'profile-student-5',
    firstName: 'Maya',
    surname: 'Khan',
    username: 'mkhan7712',
    publicStudentId: '2472',
    classId: 'class-8a',
    accountStatus: 'active',
  },
];

export const subjects: Subject[] = [
  {
    id: 'subject-ocr-cs',
    subjectName: 'OCR GCSE Computer Science',
    description: 'GCSE computer science revision and assessment content.',
  },
];

export const units: Unit[] = [
  { id: 'unit-hardware', subjectId: 'subject-ocr-cs', unitName: 'Hardware' },
  { id: 'unit-programming', subjectId: 'subject-ocr-cs', unitName: 'Programming' },
];

export const topics: Topic[] = [
  { id: 'topic-cpu', unitId: 'unit-hardware', topicName: 'CPU' },
  { id: 'topic-storage', unitId: 'unit-hardware', topicName: 'Storage' },
  { id: 'topic-linear-search', unitId: 'unit-programming', topicName: 'Searching Algorithms' },
];

export const tests: Test[] = [
  {
    id: 'test-cpu-check',
    topicId: 'topic-cpu',
    testTitle: 'CPU Knowledge Check',
    testDescription: 'Checks CPU components and the fetch-decode-execute cycle.',
    defaultMode: 'practice',
    defaultTimeLimitSeconds: 900,
    randomiseQuestions: true,
    shuffleOptions: true,
    status: 'published',
  },
  {
    id: 'test-cpu-assessment',
    topicId: 'topic-cpu',
    testTitle: 'CPU Timed Assessment',
    testDescription: 'One-attempt assessment for CPU topic understanding.',
    defaultMode: 'assigned',
    defaultTimeLimitSeconds: 1200,
    randomiseQuestions: true,
    shuffleOptions: true,
    status: 'published',
  },
];

export const testVersions: TestVersion[] = [
  {
    id: 'version-cpu-check-1',
    testId: 'test-cpu-check',
    versionNumber: 1,
    totalMarks: 4,
    status: 'published',
  },
  {
    id: 'version-cpu-assessment-1',
    testId: 'test-cpu-assessment',
    versionNumber: 1,
    totalMarks: 4,
    status: 'published',
  },
];

export const questions: Question[] = [
  {
    id: 'q-control-unit',
    testVersionId: 'version-cpu-check-1',
    questionOrder: 1,
    questionType: 'multiple_choice',
    questionText: 'Which CPU component manages the execution of instructions?',
    maxMarks: 1,
    studentExplanation: 'The Control Unit coordinates fetching, decoding and executing instructions.',
    options: [
      { id: 'opt-control-unit', questionId: 'q-control-unit', optionText: 'Control Unit', optionOrder: 1 },
      { id: 'opt-hard-disk', questionId: 'q-control-unit', optionText: 'Hard Disk', optionOrder: 2 },
      { id: 'opt-ram', questionId: 'q-control-unit', optionText: 'RAM', optionOrder: 3 },
      { id: 'opt-monitor', questionId: 'q-control-unit', optionText: 'Monitor', optionOrder: 4 },
    ],
  },
  {
    id: 'q-alu',
    testVersionId: 'version-cpu-check-1',
    questionOrder: 2,
    questionType: 'multiple_choice',
    questionText: 'Which CPU component performs arithmetic and logic operations?',
    maxMarks: 1,
    studentExplanation: 'The ALU performs arithmetic and logical comparisons.',
    options: [
      { id: 'opt-alu', questionId: 'q-alu', optionText: 'Arithmetic Logic Unit', optionOrder: 1 },
      { id: 'opt-cache', questionId: 'q-alu', optionText: 'Cache', optionOrder: 2 },
      { id: 'opt-rom', questionId: 'q-alu', optionText: 'ROM', optionOrder: 3 },
      { id: 'opt-bus', questionId: 'q-alu', optionText: 'Address bus', optionOrder: 4 },
    ],
  },
  {
    id: 'q-cache',
    testVersionId: 'version-cpu-check-1',
    questionOrder: 3,
    questionType: 'true_false',
    questionText: 'Cache memory is usually faster than main memory.',
    maxMarks: 1,
    options: [
      { id: 'true', questionId: 'q-cache', optionText: 'True', optionOrder: 1 },
      { id: 'false', questionId: 'q-cache', optionText: 'False', optionOrder: 2 },
    ],
  },
  {
    id: 'q-fde',
    testVersionId: 'version-cpu-check-1',
    questionOrder: 4,
    questionType: 'short_fixed',
    questionText: 'Name the cycle where the CPU fetches, decodes and executes instructions.',
    maxMarks: 1,
  },
  {
    id: 'q-assessment-cu',
    testVersionId: 'version-cpu-assessment-1',
    questionOrder: 1,
    questionType: 'multiple_choice',
    questionText: 'What is the main purpose of the Control Unit?',
    maxMarks: 1,
    options: [
      { id: 'opt-cu-directs', questionId: 'q-assessment-cu', optionText: 'Directs the operation of the CPU', optionOrder: 1 },
      { id: 'opt-cu-stores', questionId: 'q-assessment-cu', optionText: 'Stores long-term files', optionOrder: 2 },
      { id: 'opt-cu-displays', questionId: 'q-assessment-cu', optionText: 'Displays output to the user', optionOrder: 3 },
      { id: 'opt-cu-cools', questionId: 'q-assessment-cu', optionText: 'Cools the processor', optionOrder: 4 },
    ],
  },
  {
    id: 'q-assessment-clock',
    testVersionId: 'version-cpu-assessment-1',
    questionOrder: 2,
    questionType: 'multiple_choice',
    questionText: 'A higher clock speed usually means the CPU can...',
    maxMarks: 1,
    options: [
      { id: 'opt-more-cycles', questionId: 'q-assessment-clock', optionText: 'Run more instruction cycles per second', optionOrder: 1 },
      { id: 'opt-more-storage', questionId: 'q-assessment-clock', optionText: 'Store more files permanently', optionOrder: 2 },
      { id: 'opt-more-screen', questionId: 'q-assessment-clock', optionText: 'Improve monitor resolution', optionOrder: 3 },
      { id: 'opt-more-internet', questionId: 'q-assessment-clock', optionText: 'Increase internet bandwidth', optionOrder: 4 },
    ],
  },
];

export const assignments: TestAssignment[] = [
  {
    id: 'assignment-cpu-8a',
    testVersionId: 'version-cpu-assessment-1',
    classId: 'class-8a',
    startAt: '2026-07-07T08:00:00.000Z',
    dueAt: '2026-07-24T22:59:00.000Z',
    timeLimitSeconds: 1200,
    attemptLimit: 1,
    feedbackPolicy: 'score_only',
    status: 'open',
  },
];

export const attempts: TestAttempt[] = [
  {
    id: 'attempt-1',
    studentId: 'student-1',
    classIdAtAttempt: 'class-8a',
    testId: 'test-cpu-check',
    testVersionId: 'version-cpu-check-1',
    attemptType: 'practice',
    attemptNumber: 1,
    status: 'feedback_released',
    startedAt: '2026-07-05T09:12:00.000Z',
    submittedAt: '2026-07-05T09:22:00.000Z',
    durationSeconds: 600,
    timeLimitSeconds: 900,
    score: 3,
    maxScore: 4,
    percentage: 75,
    markingStatus: 'marked',
    feedbackStatus: 'released',
    suspiciousEventCount: 1,
  },
  {
    id: 'attempt-2',
    studentId: 'student-2',
    classIdAtAttempt: 'class-8a',
    testId: 'test-cpu-check',
    testVersionId: 'version-cpu-check-1',
    attemptType: 'practice',
    attemptNumber: 1,
    status: 'feedback_released',
    startedAt: '2026-07-04T10:00:00.000Z',
    submittedAt: '2026-07-04T10:08:00.000Z',
    durationSeconds: 480,
    timeLimitSeconds: 900,
    score: 4,
    maxScore: 4,
    percentage: 100,
    markingStatus: 'marked',
    feedbackStatus: 'released',
    suspiciousEventCount: 0,
  },
];

export const pointsTransactions: PointsTransaction[] = [
  {
    id: 'points-1',
    studentId: 'student-1',
    points: 320,
    reason: 'Practice progress and assigned completion',
    createdAt: '2026-07-05T09:22:00.000Z',
  },
  {
    id: 'points-2',
    studentId: 'student-2',
    points: 360,
    reason: 'Strong CPU practice score',
    createdAt: '2026-07-04T10:08:00.000Z',
  },
  {
    id: 'points-3',
    studentId: 'student-3',
    points: 260,
    reason: 'Recent assessment progress',
    createdAt: '2026-07-03T11:25:00.000Z',
  },
  {
    id: 'points-4',
    studentId: 'student-4',
    points: 300,
    reason: 'Consistent practice attempts',
    createdAt: '2026-07-06T12:45:00.000Z',
  },
  {
    id: 'points-5',
    studentId: 'student-5',
    points: 160,
    reason: 'New starter progress',
    createdAt: '2026-07-01T15:10:00.000Z',
  },
];

export function pointsForStudent(studentId: string): number {
  return pointsTransactions
    .filter((transaction) => transaction.studentId === studentId)
    .reduce((total, transaction) => total + transaction.points, 0);
}

export const leaderboardRows: LeaderboardRow[] = rankLeaderboard(
  students.map((student) => {
    const points = pointsForStudent(student.id);
    const className = classes.find((classRecord) => classRecord.id === student.classId)?.className ?? '';
    return {
      studentId: student.id,
      displayName: leaderboardDisplay(student),
      publicStudentId: student.publicStudentId,
      className,
      points,
      status: statusForPoints(points).name,
    };
  }),
);
