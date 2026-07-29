export type UserRole = 'student' | 'teacher' | 'admin';

export type AccountStatus = 'active' | 'inactive' | 'archived';

export type AttemptType = 'practice' | 'assigned';

export type AttemptStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'timed_out'
  | 'abandoned'
  | 'voided'
  | 'marked'
  | 'feedback_released';

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_fixed';

export interface Profile {
  id: string;
  userId: string;
  role: UserRole;
  displayName: string;
  accountStatus: AccountStatus;
}

export interface StudentProfile {
  id: string;
  profileId: string;
  firstName: string;
  surname: string;
  username: string;
  publicStudentId: string;
  yearGroup: string;
  joinedOn: string;
  classIds: string[];
  classId: string;
  accountStatus: AccountStatus;
}

export interface TeacherProfile {
  id: string;
  profileId: string;
  displayName: string;
  email: string;
}

export interface ClassRecord {
  id: string;
  className: string;
  academicYear: string;
  yearGroup: string;
  ownerTeacherId: string;
  status: 'active' | 'archived';
  joinCode: string;
  acceptingStudents: boolean;
  isSystem: boolean;
  courseIds: string[];
}

export interface Subject {
  id: string;
  subjectName: string;
  description: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  unitName: string;
}

export interface Topic {
  id: string;
  unitId: string;
  topicName: string;
}

export interface Test {
  id: string;
  topicId: string;
  testTitle: string;
  testDescription: string;
  defaultMode: AttemptType;
  defaultTimeLimitSeconds: number;
  markingMethod: 'auto_marked' | 'ai_reviewed' | 'self_marked' | 'teacher_marked';
  randomiseQuestions: boolean;
  shuffleOptions: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface TestVersion {
  id: string;
  testId: string;
  versionNumber: number;
  totalMarks: number;
  status: 'draft' | 'published' | 'archived';
}

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  optionOrder: number;
}

export interface Question {
  id: string;
  testVersionId: string;
  questionOrder: number;
  questionType: QuestionType;
  questionText: string;
  maxMarks: number;
  studentExplanation?: string;
  options?: QuestionOption[];
}

export interface TestAssignment {
  id: string;
  testVersionId: string;
  classId: string;
  recipientScope: 'class' | 'selected';
  recipientStudentIds: string[];
  startAt: string;
  dueAt: string;
  timeLimitSeconds: number;
  attemptLimit: number | null;
  feedbackPolicy: 'score_only' | 'score_and_summary' | 'full_review' | 'delayed' | 'teacher_released' | 'hidden';
  status: 'scheduled' | 'open' | 'closed' | 'archived';
}

export interface TestAttempt {
  id: string;
  studentId: string;
  classIdAtAttempt: string;
  testId: string;
  testVersionId: string;
  assignmentId?: string;
  attemptType: AttemptType;
  attemptNumber: number;
  resumeQuestionIndex: number;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string;
  durationSeconds?: number;
  timeLimitSeconds?: number;
  score?: number;
  maxScore?: number;
  percentage?: number;
  markingStatus: 'not_required' | 'pending' | 'marked';
  feedbackStatus: 'hidden' | 'available' | 'released';
  pointsAwarded?: number;
  suspiciousEventCount: number;
  voidReason?: string;
}

export interface StudentAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answer: string | string[];
  marksAwarded?: number;
  maxMarks: number;
  feedback?: string;
}

export interface AttemptEvent {
  id: string;
  attemptId: string;
  studentId: string;
  eventType:
    | 'copy_attempt'
    | 'paste_attempt'
    | 'cut_attempt'
    | 'right_click_attempt'
    | 'print_attempt'
    | 'tab_hidden'
    | 'window_blur'
    | 'page_leave_attempt'
    | 'reload_attempt'
    | 'fullscreen_exit'
    | 'suspicious_focus_loss';
  createdAt: string;
  eventDetail?: Record<string, unknown>;
}

export interface PointsTransaction {
  id: string;
  studentId: string;
  points: number;
  reason: string;
  relatedAttemptId?: string;
  createdAt: string;
}

export interface StatusLevel {
  id: string;
  name: string;
  minPoints: number;
  maxPoints?: number;
}

export interface LeaderboardRow {
  rank: number;
  studentId: string;
  displayName: string;
  publicStudentId: string;
  className: string;
  points: number;
  status: string;
}
