import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  ChevronRight,
  Copy,
  ClipboardList,
  Download,
  GraduationCap,
  History,
  Home,
  KeyRound,
  Link2,
  LogOut,
  Pencil,
  RefreshCw,
  Save,
  Search,
  Code2,
  Trash2,
  Trophy,
  UsersRound,
  X,
} from 'lucide-react';
import { Route, Routes, NavLink } from 'react-router-dom';
import { Fragment, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useAppState } from '../../app/AppState';
import { Button } from '../../components/ui/Button';
import { Metric } from '../../components/ui/Metric';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate, isDateWithinInputRange } from '../../lib/time';
import { supabase } from '../../lib/supabaseClient';
import { downloadStudentPerformancePdf } from '../../lib/studentPerformancePdf';
import type { ClassRecord, StudentProfile, Test, TestAssignment, TestAttempt, Topic } from '../../types/domain';

const navItems = [
  { to: '/teacher', label: 'Dashboard', icon: Home },
  { to: '/teacher/classes', label: 'Classes', icon: GraduationCap },
  { to: '/teacher/students', label: 'Students', icon: UsersRound },
  { to: '/teacher/tests', label: 'Courses', icon: BookOpenCheck },
  { to: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/teacher/results', label: 'Results', icon: BarChart3 },
  { to: '/teacher/leaderboards', label: 'Leaderboards', icon: Trophy },
];

const darkSubtleText = 'text-[#b8c8d9]';
const nestedTableFrame = 'overflow-x-auto rounded-app border border-line bg-white text-ink';
const nestedTableHead = 'border-b border-line bg-mist text-xs text-muted';
const lightControlClass = 'h-11 w-full rounded-app border border-line bg-mist px-3 text-sm text-ink shadow-inner [color-scheme:light] focus:border-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue/15';
const whiteControlClass = 'h-11 w-full rounded-app border border-[#dedbf0] bg-white px-3 text-sm text-ink shadow-inner [color-scheme:light] focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/15';
const lightTextareaClass = 'min-h-11 w-full rounded-app border border-line bg-mist px-3 py-2 text-sm text-ink shadow-inner [color-scheme:light] focus:border-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue/15';
const filterCheckboxClass = 'h-4 w-4 rounded border-[#8996e7] bg-[#202a6f] accent-blue focus:ring-2 focus:ring-blue/25';
const filterLabelClass = 'inline-flex min-h-8 items-center gap-2 text-sm font-semibold text-[#eef5fc]';
const resultsFilterFieldClass = 'min-w-0 space-y-2 text-sm font-semibold';
const classStatusFilters = ['active', 'archived'] as const satisfies ReadonlyArray<ClassRecord['status']>;
const allResultsFilterValue = 'all';
const markingMethodLabel: Record<Test['markingMethod'], string> = {
  auto_marked: 'Auto-marked',
  ai_reviewed: 'AI-reviewed',
  self_marked: 'Self-marked',
  teacher_marked: 'Teacher-marked',
};
const resultNaturalSort = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function useDialogAccessibility() {
  useEffect(() => {
    let activeDialog: HTMLElement | null = null;
    let previouslyFocused: HTMLElement | null = null;
    let focusFrame = 0;

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const syncDialog = () => {
      const nextDialog = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
      if (nextDialog === activeDialog) return;

      if (activeDialog && !activeDialog.isConnected) {
        previouslyFocused?.focus();
        previouslyFocused = null;
      }

      activeDialog = nextDialog;
      if (!activeDialog) return;
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      activeDialog.tabIndex = -1;
      window.cancelAnimationFrame(focusFrame);
      focusFrame = window.requestAnimationFrame(() => {
        const firstControl = activeDialog?.querySelector<HTMLElement>(focusableSelector);
        (firstControl ?? activeDialog)?.focus();
      });
    };

    const closeActiveDialog = () => {
      if (!activeDialog) return;
      const labelledClose = activeDialog.querySelector<HTMLElement>('[data-dialog-close], [aria-label^="Close"]');
      const cancelButton = Array.from(activeDialog.querySelectorAll<HTMLButtonElement>('button'))
        .find((button) => button.textContent?.trim() === 'Cancel');
      (labelledClose ?? cancelButton)?.click();
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!activeDialog?.isConnected) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeActiveDialog();
        return;
      }
      if (event.key !== 'Tab') return;

      const controls = Array.from(activeDialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => element.getClientRects().length > 0);
      if (!controls.length) {
        event.preventDefault();
        activeDialog.focus();
        return;
      }

      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const observer = new MutationObserver(syncDialog);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('keydown', handleKeyDown, true);
    syncDialog();

    return () => {
      window.cancelAnimationFrame(focusFrame);
      observer.disconnect();
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);
}

export function TeacherApp() {
  const { dataError, isLoadingData, isSupabaseBacked, signOut } = useAppState();
  useDialogAccessibility();

  if (isSupabaseBacked && dataError) {
    return (
      <main className="min-h-screen bg-mist px-4 py-8 text-ink">
        <Panel className="mx-auto max-w-md p-5">
          <p className="font-bold">{dataError ? 'Local Supabase issue' : 'Loading local Supabase data'}</p>
          <p className={`mt-2 text-sm ${darkSubtleText}`}>
            {dataError || 'Connecting to the local database, Auth profile, and seeded testing data.'}
          </p>
          <Button className="mt-4" variant="secondary" onClick={signOut}>
            Back to sign in
          </Button>
        </Panel>
      </main>
    );
  }

  if (isSupabaseBacked && isLoadingData) {
    return <main aria-label="Loading your workspace" className="min-h-screen bg-mist" />;
  }

  return (
    <main className="min-h-screen bg-mist p-3 text-ink lg:p-6">
      <div className="grid min-h-[860px] w-full overflow-hidden rounded-[18px] border border-line bg-mist shadow-panel lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-[#4b59bd] bg-[#202a6f] p-4 text-white lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-app border border-[#7e8eff] bg-[linear-gradient(135deg,#3857df_0%,#7650cf_100%)] text-white shadow-[0_8px_18px_rgba(56,87,223,0.28)]">
              <Code2 size={22} strokeWidth={2.4} aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold">csrevision</p>
              <p className="text-xs text-[#d9dfff]">Teacher console</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                end={item.to === '/teacher'}
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-app px-3 text-sm font-semibold ${isActive ? 'bg-[#fffaf0] text-[#182347]' : 'text-[#d9dfff] hover:bg-[#2d3d9b] hover:text-white'}`
                }
              >
                <item.icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-5 border-t border-[#4b59bd] pt-4">
            <div className="flex items-center gap-3 px-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#9ca8ff] bg-[linear-gradient(135deg,#4d6cf0_0%,#9a55db_100%)] text-sm font-bold text-white shadow-[0_5px_12px_rgba(67,83,218,0.32)]">JD</span>
              <div className="min-w-0"><p className="truncate text-sm font-bold text-white">J. Doe</p><p className="text-xs text-[#d9dfff]">Teacher</p></div>
            </div>
            <button className="mt-3 flex min-h-10 w-full items-center gap-3 rounded-app px-3 text-sm font-semibold text-[#d9dfff] transition hover:bg-[#2d3d9b] hover:text-white" onClick={signOut} type="button">
              <LogOut size={18} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </aside>

        <section className="min-w-0 bg-mist text-ink">
          <Routes>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="tests" element={<TestsPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="leaderboards" element={<LeaderboardsPage />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}

function TeacherDashboard() {
  const state = useAppState();
  const activeClasses = state.classes.filter((row) => row.status === 'active' && !row.isSystem);
  const [selectedClassId, setSelectedClassId] = useState(() => activeClasses[0]?.id ?? '');
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  useEffect(() => {
    if (!activeClasses.some((classRecord) => classRecord.id === selectedClassId)) {
      setSelectedClassId(activeClasses[0]?.id ?? '');
      setSelectedTopicId('all');
    }
  }, [activeClasses, selectedClassId]);
  const classRecord = activeClasses.find((row) => row.id === selectedClassId) ?? activeClasses[0] ?? state.classes.find((row) => row.status !== 'archived');
  const courseIds = new Set(classRecord?.courseIds ?? []);
  const classTopicOptions = state.topics.filter((topic) => {
    const unit = state.units.find((row) => row.id === topic.unitId);
    return unit && courseIds.has(unit.subjectId);
  });
  useEffect(() => {
    if (selectedTopicId !== 'all' && !classTopicOptions.some((topic) => topic.id === selectedTopicId)) {
      setSelectedTopicId('all');
    }
  }, [classTopicOptions, selectedTopicId]);
  if (!classRecord) {
    return (
      <div className="space-y-5 p-4 lg:p-6">
        <Panel className="p-4">
          <p className="font-bold">No active classes available.</p>
        </Panel>
      </div>
    );
  }
  const classStudents = state.students.filter((student) => studentHasClass(student, classRecord.id) && student.accountStatus !== 'archived');
  const testByVersionId = new Map(state.testVersions.map((version) => [version.id, version.testId]));
  const testById = new Map(state.tests.map((test) => [test.id, test]));
  const classAttempts = state.attempts.filter((attempt) => {
    if (attempt.classIdAtAttempt !== classRecord.id || attempt.status === 'voided') return false;
    return selectedTopicId === 'all' || testById.get(attempt.testId)?.topicId === selectedTopicId;
  });
  const classAssignments = state.assignments.filter((assignment) => {
    if (assignment.classId !== classRecord.id) return false;
    return selectedTopicId === 'all' || testById.get(testByVersionId.get(assignment.testVersionId) ?? '')?.topicId === selectedTopicId;
  });
  const completed = completedAttemptCount(classAttempts);
  const studentsWithCompletedWork = new Set(classAttempts.filter((attempt) => completedAttemptCount([attempt]) > 0).map((attempt) => attempt.studentId)).size;
  const activeThisWeek = new Set(classAttempts.filter((attempt) => new Date(attempt.startedAt).getTime() >= Date.now() - 7 * 24 * 60 * 60 * 1000).map((attempt) => attempt.studentId)).size;
  const average = averageAttemptPercentage(classAttempts);
  const classAttemptIds = new Set(classAttempts.map((attempt) => attempt.id));
  const classStudentsById = new Map(classStudents.map((student) => [student.id, student]));
  const allStudentsById = new Map(state.students.map((student) => [student.id, student]));
  const suspiciousEvents = state.events.filter((event) => classAttemptIds.has(event.attemptId)).slice(0, 5);
  const recentTestActivity = [...classAttempts]
    .sort((first, second) => attemptSortTime(second) - attemptSortTime(first))
    .slice(0, 5)
    .map((attempt) => ({
      attempt,
      student: allStudentsById.get(attempt.studentId),
      test: testById.get(attempt.testId),
      activityAt: attempt.submittedAt ?? attempt.startedAt,
    }));
  const classPerformanceRows = classStudents
    .map((student) => {
      const studentAttempts = classAttempts.filter((attempt) => attempt.studentId === student.id);
      const completedCount = completedAttemptCount(studentAttempts);
      const averageScore = averageAttemptPercentage(studentAttempts);
      const points = studentAttempts.reduce((total, attempt) => total + (attempt.pointsAwarded ?? 0), 0);
      const lastActiveTime = Math.max(0, ...studentAttempts.map((attempt) => attemptSortTime(attempt)));
      const status =
        completedCount === 0
          ? { label: 'Not Started', tone: 'neutral' as const }
          : typeof averageScore === 'number' && averageScore < 50
            ? { label: 'Needs Support', tone: 'red' as const }
            : typeof averageScore === 'number' && averageScore < 70
              ? { label: 'Developing', tone: 'amber' as const }
              : { label: 'On Track', tone: 'green' as const };

      return {
        student,
        displayName: `${studentFullName(student)} - ${student.publicStudentId}`,
        completedCount,
        averageScore,
        points,
        lastActiveTime,
        status,
      };
    })
    .sort((first, second) => {
      if (second.points !== first.points) return second.points - first.points;
      if ((second.averageScore ?? -1) !== (first.averageScore ?? -1)) return (second.averageScore ?? -1) - (first.averageScore ?? -1);
      if (second.completedCount !== first.completedCount) return second.completedCount - first.completedCount;
      return first.displayName.localeCompare(second.displayName);
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Dashboard</h1>
          <p className="text-sm text-muted">Class progress, assigned tests and results.</p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          <select className="h-12 min-w-0 rounded-app border border-[#4b59bd] bg-[#202a6f] px-3 text-sm font-semibold text-white" value={classRecord.id} onChange={(event) => { setSelectedClassId(event.target.value); setSelectedTopicId('all'); }}>
            {activeClasses.map((classOption) => <option key={classOption.id} value={classOption.id}>{classOption.className}</option>)}
          </select>
          <select className="h-12 min-w-0 rounded-app border border-[#4b59bd] bg-[#202a6f] px-3 text-sm font-semibold text-white" value={selectedTopicId} onChange={(event) => setSelectedTopicId(event.target.value)}>
            <option value="all">All course topics</option>
            {classTopicOptions.map((topic) => <option key={topic.id} value={topic.id}>{topic.topicName}</option>)}
          </select>
        </div>
      </div>

      <Panel className="grid grid-cols-2 overflow-hidden sm:grid-cols-4">
        <Metric label="Students" value={classStudents.length} />
        <Metric label="Tests Assigned" value={classAssignments.length} />
        <Metric label="Tests Completed" value={completed} />
        <Metric label="Average Score" value={average === undefined ? '-' : `${average}%`} tone="green" />
      </Panel>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <Panel className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Student Performance Overview</h2>
            <Search className={darkSubtleText} size={18} />
          </div>
          <div className={nestedTableFrame}>
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className={nestedTableHead}>
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Student (ID)</th>
                  <th className="px-3 py-2">Tests Completed</th>
                  <th className="px-3 py-2">Average Score</th>
                  <th className="px-3 py-2">Points Earned</th>
                  <th className="px-3 py-2">Last Active</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white text-ink">
                {classPerformanceRows.map((row) => (
                  <tr key={row.student.id}>
                    <td className="px-3 py-3">{row.rank}</td>
                    <td className="px-3 py-3 font-semibold">{row.displayName}</td>
                    <td className="px-3 py-3">{row.completedCount}</td>
                    <td className={`px-3 py-3 font-bold ${scoreTextClass(row.averageScore)}`}>{typeof row.averageScore === 'number' ? `${row.averageScore}%` : '-'}</td>
                    <td className="px-3 py-3">{row.points} pts</td>
                    <td className="px-3 py-3">{row.lastActiveTime ? new Date(row.lastActiveTime).toLocaleString() : '-'}</td>
                    <td className="px-3 py-3"><StatusBadge tone={row.status.tone}>{row.status.label}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Class Summary</h2>
            <SummaryRow label="Total Students" value={classStudents.length.toString()} />
            <SummaryRow label="Active This Week" value={`${activeThisWeek} (${Math.round((activeThisWeek / Math.max(classStudents.length, 1)) * 100)}%)`} />
            <SummaryRow label="Tests Assigned" value={classAssignments.length.toString()} />
            <SummaryRow label="Students with completed work" value={`${studentsWithCompletedWork} (${Math.round((studentsWithCompletedWork / Math.max(classStudents.length, 1)) * 100)}%)`} />
            <SummaryRow label="Average Score" value={average === undefined ? '-' : `${average}%`} />
          </Panel>
          <Panel className="p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">Recent Test Activity</h2>
                <p className={`mt-1 text-xs ${darkSubtleText}`}>{classAssignments.length} assigned / {completed} completed</p>
              </div>
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#eef0ff] text-blue">
                <History size={17} aria-hidden="true" />
              </span>
            </div>
            {recentTestActivity.length ? (
              <div className="space-y-2">
                {recentTestActivity.map(({ attempt, student, test, activityAt }) => {
                  const isCompleted = completedAttemptCount([attempt]) > 0;
                  return (
                    <div className="rounded-xl border border-[#d8d3f5] bg-white p-3 text-sm text-ink" key={attempt.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold">{student ? studentFullName(student) : 'Student'}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-muted">{test?.testTitle ?? 'Test activity'}</p>
                        </div>
                        <StatusBadge tone={isCompleted ? 'green' : attempt.status === 'in_progress' ? 'blue' : 'amber'}>
                          {attemptStatusLabel(attempt.status)}
                        </StatusBadge>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                        <span className="text-muted">{new Date(activityAt).toLocaleString()}</span>
                        <span className={attempt.suspiciousEventCount ? 'font-bold text-danger' : 'font-semibold text-green'}>
                          {attempt.suspiciousEventCount
                            ? `${attempt.suspiciousEventCount} activity ${attempt.suspiciousEventCount === 1 ? 'flag' : 'flags'}`
                            : 'No activity flags'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-[#cfe9db] bg-[#f5fcf7] p-3 text-sm font-medium text-[#237748]">
                No recent test activity recorded for this class.
              </p>
            )}
          </Panel>
          <Panel className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-bold">Suspicious Activity</h2><span className="grid size-8 place-items-center rounded-lg bg-[#fff0d6] text-[#ad6200]"><AlertTriangle size={17} aria-hidden="true" /></span></div>
            {suspiciousEvents.length ? <div className="space-y-2">{suspiciousEvents.map((event) => {
              const student = classStudentsById.get(event.studentId);
              return <div className="rounded-xl border border-[#f0d4a1] bg-[#fffaf0] p-3 text-sm text-ink" key={event.id}><p className="font-bold">{student ? `${student.firstName} ${student.surname}` : 'Student'}</p><p className="mt-0.5 capitalize text-[#785727]">{event.eventType.replace(/_/g, ' ')}</p><p className="mt-1 text-xs text-muted">{new Date(event.createdAt).toLocaleString()}</p></div>;
            })}</div> : <p className="rounded-xl border border-[#cfe9db] bg-[#f5fcf7] p-3 text-sm font-medium text-[#237748]">No suspicious test activity recorded for this class.</p>}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#4b59bd] py-3 text-sm last:border-b-0">
      <span className="text-[#b8c8d9]">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function accountStatusTone(status: StudentProfile['accountStatus']): 'green' | 'amber' | 'neutral' {
  if (status === 'active') return 'green';
  if (status === 'inactive') return 'amber';
  return 'neutral';
}

function attemptStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    feedback_released: 'Completed',
    marked: 'Completed',
    submitted: 'Completed',
    timed_out: 'Timed out',
    in_progress: 'In progress',
    voided: 'Voided',
  };
  return labels[status] ?? status.replace(/_/g, ' ');
}

function scoreTextClass(score: number | null | undefined): string {
  if (typeof score !== 'number') return 'text-muted';
  if (score >= 80) return 'text-green';
  if (score >= 50) return 'text-amber';
  return 'text-danger';
}

function studentClassIds(student: StudentProfile): string[] {
  return student.classIds.length ? student.classIds : student.classId ? [student.classId] : [];
}

function studentHasClass(student: StudentProfile, classId: string): boolean {
  return studentClassIds(student).includes(classId);
}

function studentClassNames(student: StudentProfile, classNameById: Map<string, string>): string[] {
  return studentClassIds(student).map((classId) => classNameById.get(classId) ?? 'Unknown class');
}

function completedAttemptCount(attempts: ReturnType<typeof useAppState>['attempts']): number {
  return attempts.filter((attempt) => ['feedback_released', 'marked', 'submitted', 'timed_out'].includes(attempt.status)).length;
}

function averageAttemptPercentage(attempts: ReturnType<typeof useAppState>['attempts']): number | undefined {
  const scores = attempts
    .map((attempt) => attempt.percentage)
    .filter((score): score is number => typeof score === 'number');
  if (!scores.length) return undefined;
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

function attemptSortTime(attempt: TestAttempt): number {
  const timestamp = new Date(attempt.submittedAt ?? attempt.startedAt).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function preferredResultAttempt(attempts: TestAttempt[]): TestAttempt | undefined {
  const usableAttempts = attempts
    .filter((attempt) => attempt.status !== 'voided')
    .sort((first, second) => attemptSortTime(second) - attemptSortTime(first));
  const scoredAttempt = usableAttempts.find((attempt) => typeof attempt.percentage === 'number');
  return scoredAttempt ?? usableAttempts[0];
}

function studentFullName(student: StudentProfile): string {
  return `${student.firstName} ${student.surname}`.trim();
}

function resultAttemptLabel(attempt: TestAttempt | undefined, isApplicable: boolean): { className: string; label: string } {
  if (!isApplicable) return { className: 'text-muted', label: '-' };
  if (!attempt) return { className: 'text-danger', label: 'Incomplete' };
  if (typeof attempt.percentage === 'number') {
    const percentageLabel = `${attempt.percentage}%`;
    const scoreLabel =
      typeof attempt.score === 'number' && typeof attempt.maxScore === 'number'
        ? `${attempt.score}/${attempt.maxScore} (${percentageLabel})`
        : percentageLabel;
    return { className: scoreTextClass(attempt.percentage), label: scoreLabel };
  }
  if (attempt.status === 'in_progress') return { className: 'text-blue', label: 'In progress' };
  return { className: 'text-amber', label: attemptStatusLabel(attempt.status) };
}

function sortYearGroups(yearGroups: string[]): string[] {
  return [...yearGroups].sort((first, second) => {
    const firstNumber = Number.parseInt(first, 10);
    const secondNumber = Number.parseInt(second, 10);
    if (Number.isNaN(firstNumber) || Number.isNaN(secondNumber)) return first.localeCompare(second);
    return firstNumber - secondNumber;
  });
}

function ClassesPage() {
  const state = useAppState();
  const yearGroupOptions = useMemo(
    () =>
      sortYearGroups(
        Array.from(
          new Set(
            state.classes
              .filter((classRecord) => !classRecord.isSystem && classRecord.yearGroup)
              .map((classRecord) => classRecord.yearGroup),
          ),
        ),
      ),
    [state.classes],
  );
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [pendingArchiveClassId, setPendingArchiveClassId] = useState<string | null>(null);
  const [yearGroupFilters, setYearGroupFilters] = useState<string[]>([]);
  const [yearGroupFiltersTouched, setYearGroupFiltersTouched] = useState(false);
  const [statusFilters, setStatusFilters] = useState<ClassRecord['status'][]>(['active']);
  const [draft, setDraft] = useState({
    className: '',
    academicYear: '',
    yearGroup: '',
    status: 'active' as (typeof state.classes)[number]['status'],
    acceptingStudents: false,
    courseIds: [] as string[],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const effectiveYearGroupFilters = yearGroupFiltersTouched ? yearGroupFilters : yearGroupOptions;
  const filteredClasses = useMemo(
    () =>
      state.classes.filter((classRecord) => {
        const matchesStatus = statusFilters.includes(classRecord.status);
        const matchesYear =
          classRecord.isSystem ||
          !yearGroupOptions.length ||
          effectiveYearGroupFilters.includes(classRecord.yearGroup);
        return matchesStatus && matchesYear;
      }),
    [effectiveYearGroupFilters, state.classes, statusFilters, yearGroupOptions.length],
  );

  useEffect(() => {
    setYearGroupFilters((current) => current.filter((yearGroup) => yearGroupOptions.includes(yearGroup)));
  }, [yearGroupOptions]);

  const toggleYearGroupFilter = (yearGroup: string) => {
    setYearGroupFiltersTouched(true);
    setYearGroupFilters((current) =>
      (yearGroupFiltersTouched ? current : yearGroupOptions).includes(yearGroup)
        ? (yearGroupFiltersTouched ? current : yearGroupOptions).filter((value) => value !== yearGroup)
        : [...current, yearGroup],
    );
  };

  const toggleStatusFilter = (status: ClassRecord['status']) => {
    setStatusFilters((current) =>
      current.includes(status) ? current.filter((value) => value !== status) : [...current, status],
    );
  };

  const startEditing = (classRecord: (typeof state.classes)[number]) => {
    setEditingClassId(classRecord.id);
    setPendingArchiveClassId(null);
    setDraft({
      className: classRecord.className,
      academicYear: classRecord.academicYear,
      yearGroup: classRecord.yearGroup,
      status: classRecord.status,
      acceptingStudents: classRecord.acceptingStudents,
      courseIds: classRecord.courseIds,
    });
    setMessage('');
    setError('');
  };

  const cancelEditing = () => {
    setEditingClassId(null);
    setPendingArchiveClassId(null);
    setMessage('');
    setError('');
  };

  const requestArchiveClass = (classRecord: (typeof state.classes)[number]) => {
    if (classRecord.isSystem) {
      setMessage('');
      setError('Non-class is a protected holding class and cannot be archived.');
      return;
    }

    setEditingClassId(null);
    setPendingArchiveClassId(classRecord.id);
    setMessage('');
    setError('');
  };

  const confirmArchiveClass = async (classRecord: (typeof state.classes)[number]) => {
    try {
      setIsSaving(true);
      setMessage('');
      setError('');
      const archivedClass = await state.archiveClass(classRecord.id);
      if (editingClassId === classRecord.id) setEditingClassId(null);
      setPendingArchiveClassId(null);
      setMessage(`${archivedClass.className} archived. Students without another class were moved to Non-class.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to archive class');
    } finally {
      setIsSaving(false);
    }
  };

  const saveClass = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingClassId) return;
    try {
      setIsSaving(true);
      setMessage('');
      setError('');
      const updatedClass = await state.updateClass({
        id: editingClassId,
        className: draft.className,
        academicYear: draft.academicYear,
        yearGroup: draft.yearGroup,
        status: draft.status,
        acceptingStudents: draft.acceptingStudents,
        courseIds: draft.courseIds,
      });
      setEditingClassId(null);
      setPendingArchiveClassId(null);
      setMessage(`${updatedClass.className} updated.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update class');
    } finally {
      setIsSaving(false);
    }
  };

  const copyText = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(successMessage);
      setError('');
    } catch {
      setMessage('');
      setError('Copy failed. Select the code and copy it manually.');
    }
  };

  const regenerateClassCode = async (classRecord: (typeof state.classes)[number]) => {
    try {
      setIsSaving(true);
      setMessage('');
      setError('');
      const updatedClass = await state.regenerateClassCode(classRecord.id);
      setMessage(`${updatedClass.className} code regenerated.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to regenerate class code');
    } finally {
      setIsSaving(false);
    }
  };

  const joinLinkForCode = (code: string): string => `${window.location.origin}${window.location.pathname}#/join/${code}`;

  return (
    <TeacherPage title="Classes">
      {message ? <p className="rounded-app bg-[#e7f7ef] p-3 text-sm font-semibold text-green">{message}</p> : null}
      {error ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm font-semibold text-danger">{error}</p> : null}
      <Panel className="p-4">
        <div className="mb-3 border-b border-[#4b59bd] pb-3">
          <p className="text-xs font-semibold uppercase tracking-normal text-[#b8c8d9]">Filters</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <fieldset className="space-y-2">
            <legend className="text-sm font-bold">Year group</legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {yearGroupOptions.map((yearGroup) => (
                <label className={filterLabelClass} key={yearGroup}>
                  <input
                    checked={effectiveYearGroupFilters.includes(yearGroup)}
                    className={filterCheckboxClass}
                    type="checkbox"
                    onChange={() => toggleYearGroupFilter(yearGroup)}
                  />
                  Year {yearGroup}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-bold">Status</legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {classStatusFilters.map((status) => (
                <label className={filterLabelClass} key={status}>
                  <input
                    checked={statusFilters.includes(status)}
                    className={filterCheckboxClass}
                    type="checkbox"
                    onChange={() => toggleStatusFilter(status)}
                  />
                  {status === 'active' ? 'Active' : 'Archived'}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </Panel>
      <div className="space-y-3">
        {filteredClasses.map((classRecord) => {
          const isEditing = editingClassId === classRecord.id;
          const activeStudentCount = state.students.filter((student) => studentHasClass(student, classRecord.id) && student.accountStatus !== 'archived').length;
          return (
            <Panel className="p-4" key={classRecord.id} tone="light">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold">{classRecord.className}</h2>
                  <p className="text-sm text-muted">
                    {classRecord.isSystem ? 'Protected holding class' : `${classRecord.academicYear || 'No academic year'} - Year ${classRecord.yearGroup || '-'}`}
                  </p>
                  {!isEditing && !classRecord.isSystem ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button className="min-h-9 px-3" type="button" variant="outlineLight" onClick={() => startEditing(classRecord)}>
                        <Pencil size={15} aria-hidden="true" />
                        Edit details
                      </Button>
                      {classRecord.status === 'active' ? (
                        <Button
                          className="min-h-9 px-3"
                          disabled={isSaving}
                          type="button"
                          variant="danger"
                          onClick={() => requestArchiveClass(classRecord)}
                        >
                          <Archive size={15} aria-hidden="true" />
                          Archive class
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-start gap-1 text-left sm:items-end sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-normal text-muted">Status</p>
                  <StatusBadge tone={classRecord.status === 'active' ? 'green' : 'neutral'}>{classRecord.status}</StatusBadge>
                  {classRecord.isSystem ? <StatusBadge tone="blue">System</StatusBadge> : null}
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-muted">{activeStudentCount} active students</p>

              {!classRecord.isSystem && classRecord.status === 'active' ? (
                <details className="mt-3 rounded-app border border-[#dedbf0] bg-[#f6f4ff] p-3">
                  <summary className="cursor-pointer text-sm font-bold text-ink">Joining and class code</summary>
                  <div className="mt-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-normal text-muted">Join code</p>
                      <p className="mt-1 text-2xl font-bold tracking-normal">{classRecord.joinCode || 'No code'}</p>
                      <p className="mt-1 text-sm text-muted">
                        Students can join with this code when accepting students is switched on in Edit details.
                      </p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-muted">Joining</p>
                      <StatusBadge tone={classRecord.acceptingStudents ? 'green' : 'neutral'}>
                        {classRecord.acceptingStudents ? 'Accepting students' : 'Not accepting'}
                      </StatusBadge>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-[#dedbf0] pt-3">
                    <p className="text-xs font-semibold uppercase tracking-normal text-muted">Code actions</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button
                        className="min-h-9 px-2"
                        disabled={!classRecord.joinCode}
                        type="button"
                        variant="secondary"
                        onClick={() => copyText(classRecord.joinCode, `${classRecord.className} code copied.`)}
                      >
                        <Copy size={16} aria-hidden="true" />
                        Copy code
                      </Button>
                      <Button
                        className="min-h-9 px-2"
                        disabled={!classRecord.joinCode}
                        type="button"
                        variant="secondary"
                        onClick={() => copyText(joinLinkForCode(classRecord.joinCode), `${classRecord.className} join link copied.`)}
                      >
                        <Link2 size={16} aria-hidden="true" />
                        Copy link
                      </Button>
                      <Button
                        className="min-h-9 px-3"
                        disabled={isSaving}
                        type="button"
                        variant="outlineLight"
                        onClick={() => regenerateClassCode(classRecord)}
                      >
                        <RefreshCw size={16} aria-hidden="true" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  </div>
                </details>
              ) : null}

              {pendingArchiveClassId === classRecord.id ? (
                <div className="mt-4 rounded-app border border-[#f6d69a] bg-[#fff7e8] p-3 text-ink">
                  <p className="text-sm font-bold">Archive {classRecord.className}?</p>
                  <p className="mt-1 text-sm text-muted">
                    This hides the class from new teacher workflows. Student accounts and past results stay, and students without another real class move to Non-class.
                  </p>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <Button className="min-h-10 px-3" disabled={isSaving} type="button" variant="secondary" onClick={() => setPendingArchiveClassId(null)}>
                      <X size={16} aria-hidden="true" />
                      Cancel
                    </Button>
                    <Button className="min-h-10 px-3" disabled={isSaving} type="button" variant="danger" onClick={() => confirmArchiveClass(classRecord)}>
                      <Archive size={16} aria-hidden="true" />
                      {isSaving ? 'Archiving...' : 'Confirm archive'}
                    </Button>
                  </div>
                </div>
              ) : null}

              {isEditing ? (
                <div className="fixed inset-0 z-50 grid place-items-center bg-[#111943]/55 p-4" role="presentation">
                <form aria-label={`Edit ${classRecord.className}`} aria-modal="true" className="max-h-[calc(100vh-2rem)] w-full max-w-2xl space-y-4 overflow-y-auto rounded-app border border-line bg-white p-5 text-ink shadow-2xl" onSubmit={saveClass} role="dialog">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">Edit class</p><h2 className="mt-1 text-xl font-bold">{classRecord.className}</h2></div>
                    <Button aria-label="Close edit class" className="min-h-9 px-3" disabled={isSaving} type="button" variant="secondary" onClick={cancelEditing}><X size={16} aria-hidden="true" /></Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2 text-sm font-semibold">
                      <span>Class name</span>
                      <input
                        className={lightControlClass}
                        value={draft.className}
                        onChange={(event) => setDraft((current) => ({ ...current, className: event.target.value }))}
                        required
                      />
                    </label>
                    <label className="space-y-2 text-sm font-semibold">
                      <span>Academic year</span>
                      <input
                        className={lightControlClass}
                        value={draft.academicYear}
                        onChange={(event) => setDraft((current) => ({ ...current, academicYear: event.target.value }))}
                        placeholder="2026/27"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-semibold">
                      <span>Year group</span>
                      <input
                        className={lightControlClass}
                        value={draft.yearGroup}
                        onChange={(event) => setDraft((current) => ({ ...current, yearGroup: event.target.value }))}
                        placeholder="8"
                      />
                    </label>
                    <label className="space-y-2 text-sm font-semibold">
                      <span>Status</span>
                      <select
                        className={lightControlClass}
                        value={draft.status}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, status: event.target.value as typeof current.status }))
                        }
                      >
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                      </select>
                    </label>
                    <label className="flex items-center justify-between gap-4 rounded-app border border-line bg-mist p-3 text-sm font-semibold sm:col-span-2">
                      <span>
                        <span className="block">Accepting students</span>
                        <span className="mt-1 block text-xs font-normal text-muted">
                          Students can use the class code or join link while this is on.
                        </span>
                      </span>
                      <input
                        aria-label="Accepting students"
                        checked={draft.acceptingStudents}
                        className="h-5 w-5 rounded border-line bg-white text-blue accent-blue focus:ring-2 focus:ring-blue/20"
                        type="checkbox"
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, acceptingStudents: event.target.checked }))
                        }
                      />
                    </label>
                    <fieldset className="space-y-3 rounded-app border border-line bg-mist p-3 sm:col-span-2">
                      <legend className="px-1 text-sm font-bold">Courses for this class</legend>
                      <p className="text-xs text-muted">Students in this class can only practise courses selected here. Choose one or more courses.</p>
                      <div className="grid gap-2">
                        {state.subjects.map((subject) => {
                          const checked = draft.courseIds.includes(subject.id);
                          return (
                            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ink" key={subject.id}>
                              <input
                                checked={checked}
                                className="h-5 w-5 rounded border-line bg-white text-blue accent-blue focus:ring-2 focus:ring-blue/20"
                                type="checkbox"
                                onChange={() => setDraft((current) => ({
                                  ...current,
                                  courseIds: checked
                                    ? current.courseIds.filter((courseId) => courseId !== subject.id)
                                    : [...current.courseIds, subject.id],
                                }))}
                              />
                              <span>{subject.subjectName}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button className="min-h-10 px-3" disabled={isSaving} type="button" variant="secondary" onClick={cancelEditing}>
                      <X size={16} aria-hidden="true" />
                      Cancel
                    </Button>
                    <Button className="min-h-10 px-3" disabled={isSaving} type="submit">
                      <Save size={16} aria-hidden="true" />
                      {isSaving ? 'Saving...' : 'Save changes'}
                    </Button>
                  </div>
                </form>
                </div>
              ) : null}
            </Panel>
          );
        })}
      </div>
      {!filteredClasses.length ? (
        <Panel className="p-4">
          <p className="font-bold">No classes match those filters.</p>
          <p className={`mt-1 text-sm ${darkSubtleText}`}>Change the year group or status checkboxes to show more classes.</p>
        </Panel>
      ) : null}
    </TeacherPage>
  );
}

function StudentsPage() {
  const state = useAppState();
  const classNameById = useMemo(
    () => new Map(state.classes.map((classRecord) => [classRecord.id, classRecord.className])),
    [state.classes],
  );
  const visibleStudents = useMemo(
    () => state.students.filter((student) => student.accountStatus !== 'archived'),
    [state.students],
  );
  const activeClasses = useMemo(() => state.classes.filter((classRecord) => classRecord.status === 'active'), [state.classes]);
  const editableClasses = useMemo(() => activeClasses.filter((classRecord) => !classRecord.isSystem), [activeClasses]);
  const [classFilterId, setClassFilterId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [isEditingStudent, setIsEditingStudent] = useState(false);

  useEffect(() => {
    if (classFilterId !== 'all' && !activeClasses.some((classRecord) => classRecord.id === classFilterId)) {
      setClassFilterId('all');
    }
  }, [activeClasses, classFilterId]);

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return visibleStudents.filter((student) => {
      const classNames = studentClassNames(student, classNameById);
      const matchesClass = classFilterId === 'all' || studentHasClass(student, classFilterId);
      const searchableText = [
        student.firstName,
        student.surname,
        `${student.firstName} ${student.surname}`,
        student.username,
        student.publicStudentId,
        ...classNames,
        student.accountStatus,
      ]
        .join(' ')
        .toLowerCase();
      return matchesClass && (!query || searchableText.includes(query));
    });
  }, [classFilterId, classNameById, searchQuery, visibleStudents]);
  const selectedStudent = filteredStudents.find((student) => student.id === selectedStudentId) ?? null;
  const [draft, setDraft] = useState({
    firstName: '',
    surname: '',
    initialYearGroup: '',
    classIds: [] as string[],
    accountStatus: 'active' as StudentProfile['accountStatus'],
  });
  const [manualPassword, setManualPassword] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activityStudent, setActivityStudent] = useState<StudentProfile | null>(null);
  const [activityEvents, setActivityEvents] = useState<Array<{ id: string; event_type: string; route: string | null; created_at: string }>>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState('');

  useEffect(() => {
    if (selectedStudentId && !filteredStudents.some((student) => student.id === selectedStudentId)) {
      setSelectedStudentId('');
      setIsEditingStudent(false);
    }
  }, [filteredStudents, selectedStudentId]);

  useEffect(() => {
    if (!selectedStudent) return;
    setDraft({
      firstName: selectedStudent.firstName,
      surname: selectedStudent.surname,
      initialYearGroup: selectedStudent.yearGroup.replace(/^Year\s*/i, ''),
      classIds: studentClassIds(selectedStudent).filter((classId) =>
        editableClasses.some((classRecord) => classRecord.id === classId),
      ),
      accountStatus: selectedStudent.accountStatus,
    });
    setManualPassword('');
    setTemporaryPassword('');
    setMessage('');
    setError('');
  }, [editableClasses, selectedStudent]);

  const openStudentEditor = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsEditingStudent(true);
  };

  const openStudentActivity = async (student: StudentProfile) => {
    setActivityStudent(student);
    setActivityEvents([]);
    setActivityError('');
    if (!supabase) {
      setActivityError('Activity history is unavailable because Supabase is not connected.');
      return;
    }
    try {
      setIsLoadingActivity(true);
      const { data, error: activityQueryError } = await supabase
        .from('activity_events')
        .select('id, event_type, route, created_at')
        .eq('profile_id', student.profileId)
        .eq('event_type', 'page_view')
        .like('route', '/student%')
        .order('created_at', { ascending: false })
        .limit(100);
      if (activityQueryError) throw activityQueryError;
      setActivityEvents(data ?? []);
    } catch (caught) {
      setActivityError(caught instanceof Error ? caught.message : 'Unable to load student activity.');
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const saveStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStudent) return;
    try {
      setIsSaving(true);
      setMessage('');
      setError('');
      const updatedStudent = await state.updateStudent({
        id: selectedStudent.id,
        firstName: draft.firstName,
        surname: draft.surname,
        initialYearGroup: draft.initialYearGroup.trim() ? Number(draft.initialYearGroup) : null,
        classIds: draft.classIds,
        accountStatus: draft.accountStatus,
      });
      setMessage(`${updatedStudent.firstName} ${updatedStudent.surname} updated.`);
      setIsEditingStudent(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update student');
    } finally {
      setIsSaving(false);
    }
  };

  const resetPassword = async (useGeneratedPassword: boolean) => {
    if (!selectedStudent) return;
    try {
      setIsSaving(true);
      setMessage('');
      setError('');
      const newPassword = await state.resetStudentPassword({
        studentId: selectedStudent.id,
        temporaryPassword: useGeneratedPassword ? undefined : manualPassword,
      });
      setTemporaryPassword(newPassword);
      setManualPassword('');
      setMessage(`Password reset for ${selectedStudent.firstName} ${selectedStudent.surname}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to reset password');
    } finally {
      setIsSaving(false);
    }
  };

  const archiveStudent = async () => {
    if (!selectedStudent) return;
    const confirmed = window.confirm(`Archive ${selectedStudent.firstName} ${selectedStudent.surname}? Their account will stop working, but past results will be kept.`);
    if (!confirmed) return;
    try {
      setIsSaving(true);
      setMessage('');
      setError('');
      await state.archiveStudent(selectedStudent.id);
      setMessage(`${selectedStudent.firstName} ${selectedStudent.surname} archived.`);
      setSelectedStudentId('');
      setIsEditingStudent(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to archive student');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDraftClass = (classId: string) => {
    setDraft((current) => ({
      ...current,
      classIds: current.classIds.includes(classId)
        ? current.classIds.filter((value) => value !== classId)
        : [...current.classIds, classId],
    }));
  };

  return (
    <TeacherPage title="Students">
      {message ? <p className="rounded-app bg-[#e7f7ef] p-3 text-sm font-semibold text-green">{message}</p> : null}
      {error ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm font-semibold text-danger">{error}</p> : null}
      <div className="space-y-5">
        <Panel className="p-4">
          <div className="mb-4 grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <div className="space-y-2">
              <label className="block space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Class</span>
                <select
                  aria-label="Filter students by class"
                  className={whiteControlClass}
                  value={classFilterId}
                  onChange={(event) => {
                    setClassFilterId(event.target.value);
                    setMessage('');
                    setError('');
                  }}
                >
                  <option value="all">All classes</option>
                  {activeClasses.map((classRecord) => (
                    <option key={classRecord.id} value={classRecord.id}>
                      {classRecord.className}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-sm font-semibold text-[#b8c8d9]">
                Showing <span className="text-white">{filteredStudents.length}</span> of <span className="text-white">{visibleStudents.length}</span>
              </p>
            </div>
            <label className="space-y-2 text-sm font-semibold">
              <span className={darkSubtleText}>Search</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} aria-hidden="true" />
                <input
                  aria-label="Search students"
                  className={`${whiteControlClass} pl-9`}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Name, username, ID or class"
                  type="search"
                  value={searchQuery}
                />
              </div>
            </label>
          </div>
          <div className={nestedTableFrame}>
            <table className="w-full table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[10%]" />
                <col className="w-[18%]" />
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
                <col className="w-[9%]" />
              </colgroup>
              <thead className={nestedTableHead}>
                <tr>
                  <th className="px-3 py-3">Full name</th>
                  <th className="px-2 py-3">Username</th>
                  <th className="px-2 py-3">ID</th>
                  <th className="px-2 py-3">Class</th>
                  <th className="px-2 py-3">Year</th>
                  <th className="px-2 py-3">Joined</th>
                  <th className="px-2 py-3">Status</th>
                  <th className="px-2 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white text-ink">
                {filteredStudents.map((student) => {
                  return (
                    <tr
                      className="border-l-4 border-transparent transition hover:bg-mist"
                      key={student.id}
                    >
                      <td className="truncate px-3 py-3 font-semibold">{student.firstName} {student.surname}</td>
                      <td className="truncate px-2 py-3">{student.username}</td>
                      <td className="truncate px-2 py-3">{student.publicStudentId}</td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-1">
                          {studentClassNames(student, classNameById).length ? (
                            studentClassNames(student, classNameById).map((className) => (
                              <span
                                className={`rounded-[6px] border px-2 py-1 text-xs font-semibold ${
                                  'border-line bg-mist text-muted'
                                }`}
                                key={`${student.id}-${className}`}
                              >
                                {className}
                              </span>
                            ))
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 font-semibold">{student.yearGroup || '—'}</td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs">{student.joinedOn ? formatDate(student.joinedOn) : '—'}</td>
                      <td className="px-2 py-3"><StatusBadge tone={accountStatusTone(student.accountStatus)}>{student.accountStatus}</StatusBadge></td>
                      <td className="px-2 py-3"><div className="flex justify-end gap-2"><Button className="min-h-9 px-3 text-xs" onClick={() => void openStudentActivity(student)} type="button" variant="secondary"><History size={14} aria-hidden="true" />Activity</Button><Button className="min-h-9 px-3 text-xs" onClick={() => openStudentEditor(student.id)} type="button"><Pencil size={14} aria-hidden="true" />Edit</Button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!filteredStudents.length ? (
            <p className="mt-4 rounded-app border border-line bg-white p-3 text-sm text-ink">
              {visibleStudents.length ? 'No students match the current filters.' : 'No active or inactive students are available.'}
            </p>
          ) : null}
        </Panel>

        {selectedStudent && isEditingStudent ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10142b]/55 p-4 backdrop-blur-sm" role="presentation">
            <form aria-label={`Edit ${selectedStudent.firstName} ${selectedStudent.surname}`} aria-modal="true" className="max-h-[calc(100vh-2rem)] w-full max-w-2xl space-y-4 overflow-y-auto rounded-[1.5rem] border-2 border-[#7774ec] bg-white p-5 text-ink shadow-[0_28px_72px_rgba(19,25,72,0.38)] lg:p-6" onSubmit={saveStudent} role="dialog">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-semibold uppercase tracking-normal text-muted">Edit student</p><h2 className="mt-1 text-xl font-bold">{selectedStudent.firstName} {selectedStudent.surname}</h2></div>
                  <button aria-label="Close edit student" className="grid size-10 place-items-center rounded-xl border border-line bg-mist text-muted transition hover:border-blue hover:text-blue" onClick={() => setIsEditingStudent(false)} type="button"><X size={18} aria-hidden="true" /></button>
                </div>
                <p className="mt-1 text-sm text-[#b8c8d9]">ID {selectedStudent.publicStudentId} - {selectedStudent.username}</p>
              </div>

              <div className="rounded-app border border-line bg-white p-3 text-ink">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <label className="space-y-2 text-sm font-semibold">
                    <span>First name</span>
                    <input
                      className={lightControlClass}
                      value={draft.firstName}
                      onChange={(event) => setDraft((current) => ({ ...current, firstName: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="space-y-2 text-sm font-semibold">
                    <span>Surname</span>
                    <input
                      className={lightControlClass}
                      value={draft.surname}
                      onChange={(event) => setDraft((current) => ({ ...current, surname: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="space-y-2 text-sm font-semibold">
                    <span>Starting year group</span>
                    <select
                      className={lightControlClass}
                      value={draft.initialYearGroup}
                      onChange={(event) => setDraft((current) => ({ ...current, initialYearGroup: event.target.value }))}
                    >
                      <option value="">Select starting year</option>
                      {[7, 8, 9, 10, 11, 12, 13].map((year) => <option key={year} value={year}>Year {year}</option>)}
                    </select>
                    <span className="block text-xs font-normal text-muted">The current year updates automatically each September.</span>
                  </label>
                  <details className="group rounded-app border border-line bg-mist p-3 text-sm font-semibold">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-ink">
                      <span>Classes <span className="font-normal text-muted">({draft.classIds.length} selected)</span></span>
                      <ChevronRight className="transition-transform group-open:rotate-90" size={18} aria-hidden="true" />
                    </summary>
                    <div className="mt-3 space-y-2 border-t border-line pt-3">
                      {editableClasses.map((classRecord) => (
                        <label
                          className="flex min-h-8 items-center gap-2 text-sm font-semibold text-ink"
                          key={classRecord.id}
                        >
                          <input
                            checked={draft.classIds.includes(classRecord.id)}
                            className="h-4 w-4 rounded border-line accent-blue focus:ring-2 focus:ring-blue/20"
                            type="checkbox"
                            onChange={() => toggleDraftClass(classRecord.id)}
                          />
                          {classRecord.className}
                        </label>
                      ))}
                      {!editableClasses.length ? (
                        <p className="text-sm text-muted">No active real classes are available.</p>
                      ) : null}
                      {!draft.classIds.length ? (
                        <p className="text-xs font-normal text-muted">
                          No real class selected. Saving will keep this student in Non-class.
                        </p>
                      ) : null}
                    </div>
                  </details>
                  <label className="space-y-2 text-sm font-semibold">
                    <span>Status</span>
                    <select
                      className={lightControlClass}
                      value={draft.accountStatus}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, accountStatus: event.target.value as StudentProfile['accountStatus'] }))
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                </div>
                <Button className="mt-4 w-full" disabled={isSaving} type="submit">
                  <Save size={16} aria-hidden="true" />
                  {isSaving ? 'Saving...' : 'Save student'}
                </Button>
              </div>

              <div className="rounded-app border border-line bg-white p-3 text-ink">
                <div className="flex items-center gap-2">
                  <KeyRound size={18} aria-hidden="true" />
                  <h3 className="font-bold">Password</h3>
                </div>
                <label className="mt-3 block space-y-2 text-sm font-semibold">
                  <span>New password</span>
                  <input
                    className={lightControlClass}
                    minLength={8}
                    onChange={(event) => setManualPassword(event.target.value)}
                    placeholder="8 characters minimum"
                    type="text"
                    value={manualPassword}
                  />
                </label>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  <Button disabled={isSaving || manualPassword.trim().length < 8} type="button" onClick={() => resetPassword(false)}>
                    <KeyRound size={16} aria-hidden="true" />
                    Set password
                  </Button>
                  <Button disabled={isSaving} type="button" variant="outlineLight" onClick={() => resetPassword(true)}>
                    <RefreshCw size={16} aria-hidden="true" />
                    Generate 8 chars
                  </Button>
                </div>
                {temporaryPassword ? (
                  <label className="mt-3 block space-y-2 text-sm font-semibold">
                    <span>Temporary password</span>
                    <textarea className={lightTextareaClass} readOnly value={temporaryPassword} />
                  </label>
                ) : null}
              </div>

              <div className="rounded-app border border-[#ffd2d2] bg-[#fff7f7] p-3 text-ink">
                <h3 className="font-bold text-danger">Archive student</h3>
                <p className="mt-1 text-sm text-muted">The account is made inactive and past results stay in reports.</p>
                <Button className="mt-3 w-full" disabled={isSaving} type="button" variant="danger" onClick={archiveStudent}>
                  <Trash2 size={16} aria-hidden="true" />
                  Archive student
                </Button>
              </div>
            </form>
            </div>
          ) : null}
        {activityStudent ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10142b]/55 p-4 backdrop-blur-sm" role="presentation">
            <section aria-label={`${studentFullName(activityStudent)} activity history`} aria-modal="true" className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-hidden rounded-[1.5rem] border-2 border-[#7774ec] bg-white text-ink shadow-[0_28px_72px_rgba(19,25,72,0.38)]" role="dialog">
              <div className="flex items-start justify-between gap-4 border-b border-line p-5 lg:p-6">
                <div><p className="text-xs font-semibold uppercase tracking-normal text-muted">Student activity</p><h2 className="mt-1 text-xl font-bold">{studentFullName(activityStudent)}</h2><p className="mt-1 text-sm text-muted">Recent learning-platform visits and activity.</p></div>
                <button aria-label="Close student activity" className="grid size-10 place-items-center rounded-xl border border-line bg-mist text-muted transition hover:border-blue hover:text-blue" onClick={() => setActivityStudent(null)} type="button"><X size={18} aria-hidden="true" /></button>
              </div>
              <div className="max-h-[calc(100vh-13rem)] overflow-auto p-5 lg:p-6">
                {isLoadingActivity ? <p className="text-sm font-semibold text-muted">Loading activity…</p> : null}
                {activityError ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm font-semibold text-danger">{activityError}</p> : null}
                {!isLoadingActivity && !activityError && activityEvents.length ? <div className={nestedTableFrame}><table className="w-full min-w-[620px] text-left text-sm"><thead className={nestedTableHead}><tr><th className="px-3 py-3">When</th><th className="px-3 py-3">Activity</th><th className="px-3 py-3">Page</th></tr></thead><tbody className="divide-y divide-line bg-white text-ink">{activityEvents.map((event) => <tr key={event.id}><td className="whitespace-nowrap px-3 py-3 font-semibold">{new Date(event.created_at).toLocaleString()}</td><td className="px-3 py-3 capitalize">{event.event_type.replace(/_/g, ' ')}</td><td className="px-3 py-3 font-semibold text-blue">{event.route ?? '—'}</td></tr>)}</tbody></table></div> : null}
                {!isLoadingActivity && !activityError && !activityEvents.length ? <p className="rounded-app border border-line bg-mist p-4 text-sm text-muted">No recorded activity yet for this student.</p> : null}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </TeacherPage>
  );
}

function TestsPage() {
  const state = useAppState();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [previewTestId, setPreviewTestId] = useState<string | null>(null);
  const [previewQuestionIndex, setPreviewQuestionIndex] = useState(0);
  const testResources = useMemo(
    () =>
      state.tests.map((test) => ({
        ...test,
        version: state.testVersions.find((version) => version.testId === test.id && version.status === 'published') ?? state.testVersions.find((version) => version.testId === test.id),
      })),
    [state.testVersions, state.tests],
  );
  const selectedSubject = state.subjects.find((subject) => subject.id === selectedSubjectId);
  const selectedUnit = state.units.find((unit) => unit.id === selectedUnitId);
  const previewTest = testResources.find((test) => test.id === previewTestId) ?? null;
  const previewQuestions = previewTest?.version
    ? state.questions.filter((question) => question.testVersionId === previewTest.version?.id).sort((first, second) => first.questionOrder - second.questionOrder)
    : [];
  const previewQuestion = previewQuestions[previewQuestionIndex];
  const subjectUnits = state.units.filter((unit) => unit.subjectId === selectedSubjectId);
  const unitTopics = state.topics.filter((topic) => topic.unitId === selectedUnitId);

  const countTopicsForSubject = (subjectId: string) => {
    const unitIds = new Set(state.units.filter((unit) => unit.subjectId === subjectId).map((unit) => unit.id));
    return state.topics.filter((topic) => unitIds.has(topic.unitId)).length;
  };

  const countTestsForSubject = (subjectId: string) => {
    const unitIds = new Set(state.units.filter((unit) => unit.subjectId === subjectId).map((unit) => unit.id));
    const topicIds = new Set(state.topics.filter((topic) => unitIds.has(topic.unitId)).map((topic) => topic.id));
    return testResources.filter((test) => topicIds.has(test.topicId)).length;
  };

  const countTestsForUnit = (unitId: string) => {
    const topicIds = new Set(state.topics.filter((topic) => topic.unitId === unitId).map((topic) => topic.id));
    return testResources.filter((test) => topicIds.has(test.topicId)).length;
  };

  const resetToCourses = () => {
    setSelectedSubjectId(null);
    setSelectedUnitId(null);
    setPreviewTestId(null);
  };

  const openTestPreview = (testId: string) => {
    setPreviewTestId(testId);
    setPreviewQuestionIndex(0);
  };

  return (
    <TeacherPage title="Courses">
      <p className="text-sm text-muted">Browse courses, then choose a unit, topic and test resource.</p>

      {!selectedSubject ? (
        <div className="space-y-3">
          {state.subjects.map((subject) => {
            const testCount = countTestsForSubject(subject.id);
            const unitCount = state.units.filter((unit) => unit.subjectId === subject.id).length;
            const topicCount = countTopicsForSubject(subject.id);
            return (
              <button
                className="group flex w-full items-center gap-4 rounded-app border-2 border-[#dedbf0] bg-white p-4 text-left text-ink shadow-[0_10px_22px_rgba(58,55,143,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#7164e8] hover:shadow-[0_16px_28px_rgba(58,55,143,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:gap-5 lg:p-5"
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#5157dd] to-[#7b45d5] text-white shadow-[0_8px_16px_rgba(76,79,202,0.24)] lg:size-16" aria-hidden="true"><BookOpenCheck size={28} /></span>
                <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Course</p><h2 className="mt-1 text-xl font-bold tracking-tight lg:text-2xl">{subject.subjectName}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted lg:text-base">{subject.description}</p></div>
                <div className="hidden grid-cols-3 gap-2 sm:grid lg:min-w-[22rem]">
                    {[
                      [unitCount, 'Units'],
                      [topicCount, 'Topics'],
                      [testCount, 'Tests'],
                    ].map(([value, label]) => (
                      <div className="rounded-xl bg-[#f0efff] px-3 py-3" key={label as string}>
                        <span className="block text-xl font-bold text-[#514bd0]">{value}</span>
                        <span className="mt-0.5 block text-xs font-semibold text-[#71699b]">{label}</span>
                      </div>
                    ))}
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f0efff] text-[#554fd1] transition group-hover:bg-[#554fd1] group-hover:text-white" aria-hidden="true"><ChevronRight size={21} /></span>
              </button>
            );
          })}
        </div>
      ) : null}

      {selectedSubject && !selectedUnit ? (
        <div className="space-y-4">
          <div>
            <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue transition hover:text-ink" onClick={resetToCourses}>
              <ArrowLeft size={16} aria-hidden="true" />
              All courses
            </button>
            <h2 className="mt-2 font-bold">Units in {selectedSubject.subjectName}</h2>
          </div>
          <div className="space-y-3">
            {subjectUnits.map((unit, unitIndex) => {
              const topicCount = state.topics.filter((topic) => topic.unitId === unit.id).length;
              const testCount = countTestsForUnit(unit.id);
              const unitAccent = [
                'from-[#5157dd] to-[#7b45d5]',
                'from-[#0d9f9b] to-[#2bbd9d]',
                'from-[#ef7b50] to-[#f0ad4e]',
                'from-[#b45bc7] to-[#7c5be2]',
              ][unitIndex % 4];

              return (
                <button
                  className="group flex w-full items-center gap-4 rounded-app border-2 border-[#dedbf0] bg-white p-4 text-left text-ink shadow-[0_10px_22px_rgba(58,55,143,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#7164e8] hover:shadow-[0_16px_28px_rgba(58,55,143,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:gap-5 lg:p-5"
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                >
                  <span className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${unitAccent} text-xl font-bold text-white shadow-[0_8px_16px_rgba(76,79,202,0.24)] lg:size-16 lg:text-2xl`} aria-hidden="true">{unit.unitName.match(/^\d+/)?.[0] ?? unitIndex + 1}</span>
                  <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Unit</p><h2 className="mt-1 text-lg font-bold tracking-tight lg:text-xl">{unit.unitName}</h2><div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted"><span>{topicCount} topics</span><span aria-hidden="true">•</span><span>{testCount} test resources</span></div></div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f0efff] text-[#554fd1] transition group-hover:bg-[#554fd1] group-hover:text-white" aria-hidden="true"><ChevronRight size={21} /></span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {selectedSubject && selectedUnit ? (
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">
              <button className="text-blue transition hover:text-ink" onClick={() => setSelectedUnitId(null)}>{selectedSubject.subjectName}</button>
              <span className="text-muted" aria-hidden="true">/</span>
              <span className="text-muted">{selectedUnit.unitName}</span>
            </div>
            <h2 className="mt-2 font-bold">Topics in {selectedUnit.unitName}</h2>
          </div>
          <div className="space-y-3">
            {unitTopics.map((topic, topicIndex) => {
              const topicTests = testResources.filter((test) => test.topicId === topic.id);
              const topicAccent = ['bg-[#6259df]', 'bg-[#0ca89c]', 'bg-[#ef8b4f]', 'bg-[#a15bd0]'][topicIndex % 4];
              return (
                <Panel className="overflow-hidden p-0" key={topic.id} tone="light">
                  <div className="flex items-start gap-4 px-4 py-4 lg:items-center lg:px-5"><span className={`mt-0.5 size-3 shrink-0 rounded-full ${topicAccent} lg:size-4`} aria-hidden="true" /><div className="min-w-0 flex-1"><h2 className="text-lg font-bold lg:text-xl">{topic.topicName}</h2></div><span className="shrink-0 rounded-lg bg-[#f0efff] px-2.5 py-1 text-sm font-bold text-[#554fd1]">{topicTests.length} {topicTests.length === 1 ? 'test' : 'tests'}</span></div>

                  <div className="space-y-3 border-t border-[#e2dff4] bg-[#faf9ff] px-4 py-3 lg:px-5">
                    {topicTests.length ? (
                      topicTests.map((test) => {
                        const questionCount = test.version ? state.questions.filter((question) => question.testVersionId === test.version?.id).length : 0;
                        return (
                          <div className="flex flex-col gap-3 rounded-app border border-[#dedbf0] bg-white p-3 text-ink sm:flex-row sm:items-center sm:justify-between" key={test.id}>
                            <div className="min-w-0">
                            <div className="flex items-start justify-between gap-3 sm:block">
                              <div>
                                <h3 className="text-sm font-bold">{test.testTitle}</h3>
                                <p className="mt-1 text-xs text-muted">{test.testDescription}</p>
                              </div>
                              <StatusBadge tone={test.status === 'published' ? 'green' : test.status === 'draft' ? 'amber' : 'neutral'}>
                                {test.status === 'published' ? 'Published' : test.status === 'draft' ? 'Draft' : 'Archived'}
                              </StatusBadge>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted">
                              <span>{test.version ? `Version ${test.version.versionNumber}` : 'No version'}</span>
                              <span aria-hidden="true">•</span>
                              <span>{questionCount} questions</span>
                              <span aria-hidden="true">•</span>
                              <span>{Math.round(test.defaultTimeLimitSeconds / 60)} min</span>
                              <span aria-hidden="true">â€¢</span>
                              <span>{markingMethodLabel[test.markingMethod]}</span>
                            </div>
                            </div>
                            <Button className="min-h-10 shrink-0 px-4" disabled={!test.version || !questionCount} onClick={() => openTestPreview(test.id)} type="button" variant="secondary"><BookOpenCheck size={16} aria-hidden="true" />Preview</Button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="rounded-app border border-dashed border-line bg-white p-3 text-sm text-muted">
                        No tests are available for this topic yet.
                      </p>
                    )}
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>
      ) : null}
      {previewTest ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10142b]/55 p-4 backdrop-blur-sm" role="presentation">
          <section aria-label={`${previewTest.testTitle} preview`} aria-modal="true" className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-auto rounded-[1.5rem] border-2 border-[#7774ec] bg-white text-ink shadow-[0_28px_72px_rgba(19,25,72,0.38)]" role="dialog">
            <div className="flex items-start justify-between gap-4 border-b border-line p-5 lg:p-6">
              <div><p className="text-xs font-semibold uppercase tracking-normal text-muted">Teacher preview</p><h2 className="mt-1 text-xl font-bold">{previewTest.testTitle}</h2><p className="mt-1 text-sm text-muted">Read-only test content. Nothing is recorded.</p></div>
              <button aria-label="Close test preview" className="grid size-10 place-items-center rounded-xl border border-line bg-mist text-muted transition hover:border-blue hover:text-blue" onClick={() => setPreviewTestId(null)} type="button"><X size={18} aria-hidden="true" /></button>
            </div>
            <div className="p-5 lg:p-6">
              {previewQuestion ? <>
                <div className="flex items-center justify-between gap-4"><p className="text-sm font-semibold text-muted">Question {previewQuestionIndex + 1} of {previewQuestions.length}</p><span className="rounded-lg bg-[#eef0ff] px-2.5 py-1 text-sm font-bold text-blue">{previewQuestion.maxMarks} {previewQuestion.maxMarks === 1 ? 'mark' : 'marks'}</span></div>
                <h3 className="mt-5 text-lg font-bold leading-7">{previewQuestion.questionText}</h3>
                {previewQuestion.options?.length ? <div className="mt-5 space-y-3">{previewQuestion.options.sort((first, second) => first.optionOrder - second.optionOrder).map((option, optionIndex) => <div className="rounded-app border border-line bg-mist p-4 font-semibold" key={option.id}>{String.fromCharCode(65 + optionIndex)}. {option.optionText}</div>)}</div> : <div className="mt-5 rounded-app border border-dashed border-line bg-mist p-4 text-sm text-muted">This question has a written answer.</div>}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4"><Button disabled={previewQuestionIndex === 0} onClick={() => setPreviewQuestionIndex((index) => index - 1)} type="button" variant="secondary">Previous</Button><Button disabled={previewQuestionIndex === previewQuestions.length - 1} onClick={() => setPreviewQuestionIndex((index) => index + 1)} type="button">Next</Button></div>
              </> : <p className="rounded-app border border-line bg-mist p-4 text-sm text-muted">This test has no published questions to preview yet.</p>}
            </div>
          </section>
        </div>
      ) : null}
    </TeacherPage>
  );
}

type AssignmentTab = 'create' | 'active' | 'expired';

function dueDateInputToIso(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(`${value}T23:59:00`).toISOString();
}

function defaultDueDateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 7);
  const toInput = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  return { from: toInput(from), to: toInput(to) };
}

function assignmentSortTime(value: string): number {
  return value ? new Date(value).getTime() : 0;
}

function AssignmentsPage() {
  const state = useAppState();
  const activeClasses = useMemo(() => state.classes.filter((classRecord) => classRecord.status === 'active' && !classRecord.isSystem), [state.classes]);
  const [activeTab, setActiveTab] = useState<AssignmentTab>('create');
  const [createClassId, setCreateClassId] = useState(() => state.classes.find((classRecord) => classRecord.status === 'active' && !classRecord.isSystem)?.id ?? '');
  const [createSubjectId, setCreateSubjectId] = useState(() => state.subjects[0]?.id ?? '');
  const [assignmentClassId, setAssignmentClassId] = useState(allResultsFilterValue);
  const [assignmentSubjectId, setAssignmentSubjectId] = useState(allResultsFilterValue);
  const [assignmentUnitId, setAssignmentUnitId] = useState(allResultsFilterValue);
  const [assignmentTopicId, setAssignmentTopicId] = useState(allResultsFilterValue);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [dueDate, setDueDate] = useState('');
  const [recipientScope, setRecipientScope] = useState<TestAssignment['recipientScope']>('class');
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<TestAssignment | null>(null);
  const [assignmentToInspect, setAssignmentToInspect] = useState<TestAssignment | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const selectedCreateClass = activeClasses.find((classRecord) => classRecord.id === createClassId);
  const selectedClassStudents = useMemo(
    () => state.students
      .filter((student) => student.accountStatus === 'active' && student.classIds.includes(createClassId))
      .sort((first, second) => `${first.surname} ${first.firstName}`.localeCompare(`${second.surname} ${second.firstName}`)),
    [createClassId, state.students],
  );
  const selectedRecipientIdSet = useMemo(() => new Set(selectedRecipientIds), [selectedRecipientIds]);
  const createSubjects = state.subjects.filter((subject) => selectedCreateClass?.courseIds.includes(subject.id));
  const selectedAssignmentClass = activeClasses.find((classRecord) => classRecord.id === assignmentClassId);
  const assignmentSubjects = assignmentClassId === allResultsFilterValue
    ? state.subjects
    : state.subjects.filter((subject) => selectedAssignmentClass?.courseIds.includes(subject.id));

  useEffect(() => {
    const firstClassId = activeClasses[0]?.id ?? '';
    const firstSubjectId = createSubjects[0]?.id ?? '';
    if ((!createClassId && firstClassId) || (createClassId && !activeClasses.some((classRecord) => classRecord.id === createClassId))) {
      setCreateClassId(firstClassId);
    }
    if ((!createSubjectId && firstSubjectId) || (createSubjectId && !createSubjects.some((subject) => subject.id === createSubjectId))) {
      setCreateSubjectId(firstSubjectId);
      setSelectedVersionIds([]);
    }
  }, [activeClasses, createClassId, createSubjectId, createSubjects]);

  useEffect(() => {
    setSelectedRecipientIds(selectedClassStudents.map((student) => student.id));
  }, [selectedClassStudents]);

  useEffect(() => {
    const timerId = window.setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => window.clearInterval(timerId);
  }, []);

  const publishedTests = useMemo(
    () =>
      state.tests.flatMap((test) => {
        const version = state.testVersions.find((row) => row.testId === test.id && row.status === 'published');
        return test.status === 'published' && version ? [{ ...test, version }] : [];
      }),
    [state.testVersions, state.tests],
  );
  const createUnits = state.units.filter((unit) => unit.subjectId === createSubjectId);
  const assignmentUnits = useMemo(
    () =>
      assignmentSubjectId === allResultsFilterValue
        ? state.units
        : state.units.filter((unit) => unit.subjectId === assignmentSubjectId),
    [assignmentSubjectId, state.units],
  );
  const assignmentTopics = useMemo(() => {
    const topicsByUnit = new Map<string, Topic[]>();
    state.topics.forEach((topic) => {
      topicsByUnit.set(topic.unitId, [...(topicsByUnit.get(topic.unitId) ?? []), topic]);
    });
    const orderedTopicsForUnit = (unitId: string) =>
      [...(topicsByUnit.get(unitId) ?? [])].sort((first, second) => resultNaturalSort.compare(first.topicName, second.topicName));

    if (assignmentUnitId !== allResultsFilterValue) {
      return orderedTopicsForUnit(assignmentUnitId);
    }
    return assignmentUnits.flatMap((unit) => orderedTopicsForUnit(unit.id));
  }, [assignmentUnitId, assignmentUnits, state.topics]);
  const selectedVersions = useMemo(() => new Set(selectedVersionIds), [selectedVersionIds]);
  const selectedClass = activeClasses.find((classRecord) => classRecord.id === createClassId);
  const createRecipientCount = recipientScope === 'class' ? selectedClassStudents.length : selectedRecipientIds.length;

  useEffect(() => {
    if (assignmentClassId !== allResultsFilterValue && !activeClasses.some((classRecord) => classRecord.id === assignmentClassId)) {
      setAssignmentClassId(allResultsFilterValue);
    }
    if (assignmentSubjectId !== allResultsFilterValue && !assignmentSubjects.some((subject) => subject.id === assignmentSubjectId)) {
      setAssignmentSubjectId(allResultsFilterValue);
      setAssignmentUnitId(allResultsFilterValue);
      setAssignmentTopicId(allResultsFilterValue);
    }
  }, [activeClasses, assignmentClassId, assignmentSubjectId, assignmentSubjects]);

  useEffect(() => {
    if (assignmentUnitId !== allResultsFilterValue && !assignmentUnits.some((unit) => unit.id === assignmentUnitId)) {
      setAssignmentUnitId(allResultsFilterValue);
      setAssignmentTopicId(allResultsFilterValue);
    }
  }, [assignmentUnitId, assignmentUnits]);

  useEffect(() => {
    if (assignmentTopicId !== allResultsFilterValue && !assignmentTopics.some((topic) => topic.id === assignmentTopicId)) {
      setAssignmentTopicId(allResultsFilterValue);
    }
  }, [assignmentTopicId, assignmentTopics]);

  const toggleVersion = (versionId: string) => {
    setSelectedVersionIds((current) =>
      current.includes(versionId) ? current.filter((id) => id !== versionId) : [...current, versionId],
    );
    setMessage('');
    setError('');
  };

  const toggleTopicVersions = (versionIds: string[]) => {
    if (!versionIds.length) return;
    setSelectedVersionIds((current) => {
      const topicVersionSet = new Set(versionIds);
      const currentSet = new Set(current);
      const allSelected = versionIds.every((versionId) => currentSet.has(versionId));

      if (allSelected) {
        return current.filter((versionId) => !topicVersionSet.has(versionId));
      }

      return [...current, ...versionIds.filter((versionId) => !currentSet.has(versionId))];
    });
    setMessage('');
    setError('');
  };

  const createAssignments = async () => {
    try {
      setError('');
      setMessage('');
      setIsSaving(true);
      const created = await state.createAssignments({
        classId: createClassId,
        testVersionIds: selectedVersionIds,
        recipientScope,
        recipientStudentIds: recipientScope === 'selected' ? selectedRecipientIds : [],
        dueAt: dueDateInputToIso(dueDate),
      });
      setSelectedVersionIds([]);
      setDueDate('');
      setAssignmentClassId(createClassId);
      setAssignmentSubjectId(createSubjectId);
      setAssignmentUnitId(allResultsFilterValue);
      setAssignmentTopicId(allResultsFilterValue);
      setActiveTab('active');
      const recipientLabel = recipientScope === 'class'
        ? `the whole ${selectedClass?.className ?? 'class'} class`
        : `${selectedRecipientIds.length} selected student${selectedRecipientIds.length === 1 ? '' : 's'} in ${selectedClass?.className ?? 'class'}`;
      setMessage(`${created.length} assignment${created.length === 1 ? '' : 's'} created for ${recipientLabel}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create assignments');
    } finally {
      setIsSaving(false);
    }
  };

  const assignmentRows = useMemo(() => {
    const activeClassById = new Map(activeClasses.map((classRecord) => [classRecord.id, classRecord]));
    const testVersionById = new Map(state.testVersions.map((version) => [version.id, version]));
    const testById = new Map(state.tests.map((test) => [test.id, test]));
    const topicById = new Map(state.topics.map((topic) => [topic.id, topic]));
    const unitById = new Map(state.units.map((unit) => [unit.id, unit]));

    return state.assignments
      .flatMap((assignment) => {
        if (assignment.status !== 'scheduled' && assignment.status !== 'open') return [];

        const classRecord = activeClassById.get(assignment.classId);
        const version = testVersionById.get(assignment.testVersionId);
        const test = version ? testById.get(version.testId) : undefined;
        const topic = test ? topicById.get(test.topicId) : undefined;
        const unit = topic ? unitById.get(topic.unitId) : undefined;
        if (!classRecord || !test || !topic || !unit) return [];

        if (assignmentClassId !== allResultsFilterValue && classRecord.id !== assignmentClassId) return [];
        if (assignmentSubjectId !== allResultsFilterValue && unit.subjectId !== assignmentSubjectId) return [];
        if (assignmentUnitId !== allResultsFilterValue && unit.id !== assignmentUnitId) return [];
        if (assignmentTopicId !== allResultsFilterValue && topic.id !== assignmentTopicId) return [];

        return [
          {
            assignment,
            className: classRecord.className,
            testName: test.testTitle,
            recipientCount: assignment.recipientScope === 'selected'
              ? assignment.recipientStudentIds.length
              : state.students.filter((student) => student.accountStatus === 'active' && student.classIds.includes(assignment.classId)).length,
            dueSortTime: assignment.dueAt ? assignmentSortTime(assignment.dueAt) : Number.POSITIVE_INFINITY,
            createdSortTime: assignmentSortTime(assignment.startAt),
            isExpired: Boolean(assignment.dueAt && assignmentSortTime(assignment.dueAt) < currentTime),
          },
        ];
      })
      .sort((first, second) => {
        if (first.dueSortTime !== second.dueSortTime) return first.dueSortTime - second.dueSortTime;
        if (first.createdSortTime !== second.createdSortTime) return second.createdSortTime - first.createdSortTime;
        return resultNaturalSort.compare(first.testName, second.testName);
      });
  }, [
    activeClasses,
    currentTime,
    assignmentClassId,
    assignmentSubjectId,
    assignmentTopicId,
    assignmentUnitId,
    state.assignments,
    state.testVersions,
    state.tests,
    state.topics,
    state.units,
    state.students,
  ]);
  const assignmentProgressById = useMemo(() => {
    const studentById = new Map(state.students.map((student) => [student.id, student]));
    const attemptsByAssignmentId = new Map<string, TestAttempt[]>();
    state.attempts.forEach((attempt) => {
      if (!attempt.assignmentId) return;
      attemptsByAssignmentId.set(attempt.assignmentId, [...(attemptsByAssignmentId.get(attempt.assignmentId) ?? []), attempt]);
    });

    return new Map(state.assignments.map((assignment) => {
      const recipientIds = assignment.recipientScope === 'selected'
        ? assignment.recipientStudentIds
        : state.students
          .filter((student) => student.accountStatus === 'active' && student.classIds.includes(assignment.classId))
          .map((student) => student.id);
      const attemptsByStudentId = new Map<string, TestAttempt[]>();
      (attemptsByAssignmentId.get(assignment.id) ?? []).forEach((attempt) => {
        attemptsByStudentId.set(attempt.studentId, [...(attemptsByStudentId.get(attempt.studentId) ?? []), attempt]);
      });
      const students = recipientIds.map((studentId) => {
        const studentAttempts = attemptsByStudentId.get(studentId) ?? [];
        const attempt = preferredResultAttempt(studentAttempts);
        const completedAttempts = studentAttempts.filter((candidate) => typeof candidate.percentage === 'number' || ['feedback_released', 'marked', 'submitted', 'timed_out'].includes(candidate.status));
        const completed = completedAttempts.length > 0;
        const deadlineStatus = !attempt
          ? '-'
          : !completed
            ? '-'
            : !assignment.dueAt || !attempt.submittedAt
              ? '-'
              : assignmentSortTime(attempt.submittedAt) <= assignmentSortTime(assignment.dueAt) ? 'On time' : 'Late';
        const score = typeof attempt?.percentage === 'number'
          ? typeof attempt.score === 'number' && typeof attempt.maxScore === 'number'
            ? `${attempt.score}/${attempt.maxScore} (${attempt.percentage}%)`
            : `${attempt.percentage}%`
          : '-';
        return {
          id: studentId,
          name: studentById.get(studentId) ? studentFullName(studentById.get(studentId) as StudentProfile) : 'Unknown student',
          attempt,
          completed,
          deadlineStatus,
          score,
          points: completed ? `${completedAttempts.reduce((total, candidate) => total + (candidate.pointsAwarded ?? 0), 0)}` : '-',
          status: attempt ? (completed ? 'Completed' : attemptStatusLabel(attempt.status)) : 'Not started',
        };
      });
      return [assignment.id, {
        students,
        completedCount: students.filter((student) => student.completed).length,
        inProgressCount: students.filter((student) => student.attempt?.status === 'in_progress').length,
      }];
    }));
  }, [state.assignments, state.attempts, state.students]);
  const activeAssignmentRows = assignmentRows.filter((row) => !row.isExpired);
  const expiredAssignmentRows = assignmentRows.filter((row) => row.isExpired);
  const visibleAssignmentRows = activeTab === 'expired' ? expiredAssignmentRows : activeAssignmentRows;
  const inspectedAssignmentRow = assignmentToInspect ? assignmentRows.find((row) => row.assignment.id === assignmentToInspect.id) : undefined;
  const inspectedAssignmentProgress = assignmentToInspect ? assignmentProgressById.get(assignmentToInspect.id) : undefined;
  const deleteAssignment = async () => {
    if (!assignmentToDelete) return;
    try {
      setIsSaving(true);
      setError('');
      const result = await state.deleteAssignment(assignmentToDelete.id);
      setMessage(result === 'deleted' ? 'Unused assignment deleted permanently.' : 'Assignment archived. Completed student work remains in Results.');
      setAssignmentToDelete(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to delete assignment');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TeacherPage title="Assignments">
      <div className="flex flex-wrap gap-2 rounded-app border border-line bg-white p-1">
        {[
          ['create', 'Create assignment'],
          ['active', 'Active Assignments'],
          ['expired', 'Expired Assignments'],
        ].map(([id, label]) => (
          <button
            className={`min-h-10 rounded-[6px] px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue/25 ${
              activeTab === id ? 'bg-[#202a6f] text-white' : 'text-muted hover:bg-mist hover:text-ink'
            }`}
            key={id}
            onClick={() => setActiveTab(id as AssignmentTab)}
          >
            {label}
          </button>
        ))}
      </div>

      {message ? <p className="rounded-app bg-[#e7f7ef] p-3 text-sm font-semibold text-green">{message}</p> : null}
      {error ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm font-semibold text-danger">{error}</p> : null}

      {activeTab === 'create' ? (
        <div className="space-y-5">
          <Panel className="p-4">
            <div className="mb-3 border-b border-[#4b59bd] pb-3">
              <p className="text-xs font-semibold uppercase tracking-normal text-[#b8c8d9]">Assignment details</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Class</span>
                <select
                  className={whiteControlClass}
                  value={createClassId}
                  onChange={(event) => {
                    setCreateClassId(event.target.value);
                    setMessage('');
                    setError('');
                  }}
                >
                  {activeClasses.map((classRecord) => (
                    <option key={classRecord.id} value={classRecord.id}>
                      {classRecord.className}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Course</span>
                <select
                  className={whiteControlClass}
                  value={createSubjectId}
                  onChange={(event) => {
                    setCreateSubjectId(event.target.value);
                    setSelectedVersionIds([]);
                    setMessage('');
                    setError('');
                  }}
                >
                  {createSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Due date optional</span>
                <input
                  className={whiteControlClass}
                  onBlur={(event) => setDueDate(event.currentTarget.value)}
                  onChange={(event) => setDueDate(event.target.value)}
                  onInput={(event) => setDueDate(event.currentTarget.value)}
                  type="date"
                  value={dueDate}
                />
              </label>
            </div>
            <fieldset className="mt-4 rounded-app border border-[#dedbf0] bg-[#faf9ff] p-4 text-ink">
              <legend className="px-1 text-xs font-bold uppercase tracking-[0.12em] text-[#71699b]">Recipients</legend>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['class', 'Whole class', `${selectedClassStudents.length} active student${selectedClassStudents.length === 1 ? '' : 's'}`],
                  ['selected', 'Selected students', `${selectedRecipientIds.length} of ${selectedClassStudents.length} selected`],
                ].map(([id, label, description]) => (
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-app border p-3 transition ${
                      recipientScope === id ? 'border-blue bg-[#eef6ff]' : 'border-line bg-white hover:border-blue'
                    }`}
                    key={id}
                  >
                    <input
                      checked={recipientScope === id}
                      className="mt-1 size-4 accent-blue"
                      onChange={() => {
                        setRecipientScope(id as TestAssignment['recipientScope']);
                        setMessage('');
                        setError('');
                      }}
                      type="radio"
                    />
                    <span>
                      <span className="block text-sm font-bold">{label}</span>
                      <span className="mt-1 block text-xs text-muted">{description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {recipientScope === 'selected' ? <details className="group mt-4 rounded-app border border-[#dedbf0] bg-[#faf9ff]" key={createClassId}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-ink">
                <span><span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#71699b]">Students</span><span className="mt-1 block">{selectedRecipientIds.length} of {selectedClassStudents.length} selected</span></span>
                <ChevronRight className="shrink-0 text-[#554fd1] transition group-open:rotate-90" size={20} aria-hidden="true" />
              </summary>
              <div className="border-t border-[#dedbf0] bg-white p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted">All students are selected by default. Deselect anyone who should not receive this assignment.</p>
                  <div className="flex items-center gap-2"><button className="rounded-lg border border-[#c8c3ff] bg-[#f0efff] px-3 py-1.5 text-xs font-bold text-[#514bd0]" onClick={() => setSelectedRecipientIds(selectedClassStudents.map((student) => student.id))} type="button">Select all</button><button className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-bold text-muted" onClick={() => setSelectedRecipientIds([])} type="button">Clear</button></div>
                </div>
                <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                  {selectedClassStudents.map((student) => {
                    const selected = selectedRecipientIdSet.has(student.id);
                    return <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${selected ? 'border-[#7164e8] bg-[#f0efff] text-[#453ab0]' : 'border-line bg-white text-muted hover:border-[#b4aefa]'}`} key={student.id}><input checked={selected} className="size-4 accent-[#554fd1]" onChange={() => setSelectedRecipientIds((current) => selected ? current.filter((id) => id !== student.id) : [...current, student.id])} type="checkbox" /><span>{student.firstName} {student.surname}</span></label>;
                  })}
                </div>
              </div>
            </details> : null}
          </Panel>

          <div className="flex flex-col gap-3 rounded-app border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">{selectedVersionIds.length} tests selected</p>
              <p className="text-sm text-muted">
                Each selected test creates one {recipientScope === 'class' ? `whole-class assignment for ${selectedClass?.className ?? 'the selected class'}` : `assignment for ${selectedRecipientIds.length} selected student${selectedRecipientIds.length === 1 ? '' : 's'}`}{dueDate ? ` due ${formatDate(dueDate)}` : ' with no deadline'}.
              </p>
            </div>
            <Button disabled={!createClassId || !selectedVersionIds.length || !createRecipientCount || isSaving} onClick={createAssignments}>
              {isSaving ? 'Creating...' : 'Create assignments'}
            </Button>
          </div>

          <div className="space-y-3">
            {createUnits.map((unit) => {
              const unitTopics = state.topics.filter((topic) => topic.unitId === unit.id);
              const unitTests = publishedTests.filter((test) => unitTopics.some((topic) => topic.id === test.topicId));
              const unitVersionIds = unitTests.map((test) => test.version.id);
              const unitTestCount = unitTests.length;
              const selectedUnitTestCount = unitVersionIds.filter((versionId) => selectedVersions.has(versionId)).length;
              const allUnitTestsSelected = Boolean(unitVersionIds.length && selectedUnitTestCount === unitVersionIds.length);
              return (
                <details className="group rounded-app border-2 border-[#dedbf0] bg-white text-ink shadow-[0_8px_18px_rgba(58,55,143,0.07)] transition duration-200 hover:-translate-y-0.5 hover:border-[#7164e8] hover:shadow-[0_16px_28px_rgba(58,55,143,0.15)]" key={unit.id}>
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-4 lg:p-5"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f0efff] text-[#554fd1] transition group-open:rotate-90"><ChevronRight size={20} aria-hidden="true" /></span><div className="min-w-0 flex-1"><h2 className="font-bold lg:text-lg">{unit.unitName}</h2><p className="mt-1 text-sm text-muted">{unitTopics.length} topics · {unitTestCount} tests</p></div><div className="flex flex-wrap items-center justify-end gap-2"><span className="text-xs font-semibold text-muted">{selectedUnitTestCount}/{unitTestCount} selected</span>{unitTestCount ? <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-app border border-line bg-white px-3 text-sm font-semibold text-ink"><input checked={allUnitTestsSelected} className="size-4 accent-blue" onChange={() => toggleTopicVersions(unitVersionIds)} onClick={(event) => event.stopPropagation()} type="checkbox" /><span>Select all</span></label> : null}</div></summary>
                  <div className="space-y-2 border-t border-[#e2dff4] bg-[#faf9ff] p-3 lg:p-4">
                    {unitTopics.map((topic) => {
                      const topicTests = publishedTests.filter((test) => test.topicId === topic.id);
                      const topicVersionIds = topicTests.map((test) => test.version.id);
                      const selectedTopicTestCount = topicVersionIds.filter((versionId) => selectedVersions.has(versionId)).length;
                      const allTopicTestsSelected = Boolean(topicVersionIds.length && selectedTopicTestCount === topicVersionIds.length);
                      return (
                        <details className="group rounded-app border-2 border-[#cbc3f3] bg-[#e9e6ff] text-ink shadow-[0_4px_10px_rgba(81,79,202,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#7164e8] hover:shadow-[0_12px_22px_rgba(58,55,143,0.16)]" key={topic.id}>
                          <summary className="flex cursor-pointer list-none items-center gap-3 p-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f0efff] text-[#554fd1] transition group-open:rotate-90"><ChevronRight size={17} aria-hidden="true" /></span><div className="min-w-0 flex-1"><h3 className="font-bold">{topic.topicName}</h3><p className="mt-0.5 text-xs text-muted">{topicTests.length} {topicTests.length === 1 ? 'test' : 'tests'} · {selectedTopicTestCount} selected</p></div>
                            <div className="flex flex-wrap items-center gap-2">
                              {topicTests.length ? (
                                <>
                                  <span className="text-xs font-semibold text-muted">
                                    {selectedTopicTestCount}/{topicTests.length} selected
                                  </span>
                                  <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-app border border-line bg-white px-3 text-sm font-semibold text-ink">
                                    <input checked={allTopicTestsSelected} className="size-4 accent-blue" onChange={() => toggleTopicVersions(topicVersionIds)} onClick={(event) => event.stopPropagation()} type="checkbox" />
                                    <span>Select all</span>
                                  </label>
                                </>
                              ) : null}
                            </div>
                          </summary>
                          <div className="space-y-2 border-t border-[#e2dff4] bg-[#faf9ff] p-3">
                            {topicTests.map((test) => {
                              const checked = selectedVersions.has(test.version.id);
                              const questionCount = state.questions.filter((question) => question.testVersionId === test.version.id).length;
                              return (
                                <label
                                  className={`flex cursor-pointer items-start gap-3 rounded-app border p-3 text-ink transition ${
                                    checked ? 'border-blue bg-[#eef6ff]' : 'border-line bg-mist hover:border-blue'
                                  }`}
                                  key={test.id}
                                >
                                  <input
                                    checked={checked}
                                    className="mt-1 h-4 w-4 accent-blue"
                                    onChange={() => toggleVersion(test.version.id)}
                                    type="checkbox"
                                  />
                                  <span className="min-w-0 flex-1">
                                    <span className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold">{test.testTitle}</span><span className="rounded-md bg-[#e6f5ff] px-2 py-0.5 text-xs font-bold text-[#24559a]">{markingMethodLabel[test.markingMethod]}</span></span>
                                    <span className="mt-1 block text-xs text-muted">{test.testDescription}</span>
                                    <span className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                                      <span>v{test.version.versionNumber}</span>
                                      <span>{questionCount} questions</span>
                                      <span>{Math.round(test.defaultTimeLimitSeconds / 60)} min</span>
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      ) : null}

      {activeTab === 'active' || activeTab === 'expired' ? (
        <div className="space-y-5">
          <Panel className="p-4">
            <div className="mb-3 border-b border-[#4b59bd] pb-3">
              <p className="text-xs font-semibold uppercase tracking-normal text-[#b8c8d9]">Filters</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Class</span>
                <select
                  className={lightControlClass}
                  value={assignmentClassId}
                  onChange={(event) => setAssignmentClassId(event.target.value)}
                >
                  <option value={allResultsFilterValue}>All classes</option>
                  {activeClasses.map((classRecord) => (
                    <option key={classRecord.id} value={classRecord.id}>
                      {classRecord.className}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Course</span>
                <select
                  className={lightControlClass}
                  value={assignmentSubjectId}
                  onChange={(event) => {
                    setAssignmentSubjectId(event.target.value);
                    setAssignmentUnitId(allResultsFilterValue);
                    setAssignmentTopicId(allResultsFilterValue);
                  }}
                >
                  <option value={allResultsFilterValue}>All courses</option>
                  {assignmentSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Unit</span>
                <select
                  className={lightControlClass}
                  value={assignmentUnitId}
                  onChange={(event) => {
                    setAssignmentUnitId(event.target.value);
                    setAssignmentTopicId(allResultsFilterValue);
                  }}
                >
                  <option value={allResultsFilterValue}>All units</option>
                  {assignmentUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unitName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Topic</span>
                <select
                  className={lightControlClass}
                  value={assignmentTopicId}
                  onChange={(event) => setAssignmentTopicId(event.target.value)}
                >
                  <option value={allResultsFilterValue}>All topics</option>
                  {assignmentTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.topicName}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Panel>

          <Panel className="p-4">
            <div className={nestedTableFrame}>
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className={nestedTableHead}>
                  <tr>
                    <th className="px-3 py-3">Date created</th>
                    <th className="px-3 py-3">Class</th>
                    <th className="px-3 py-3">Test</th>
                    <th className="px-3 py-3 text-center">Students assigned</th>
                    <th className="px-3 py-3 text-center">Progress</th>
                    <th className="px-3 py-3">Assignment deadline</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-white">
                  {visibleAssignmentRows.length ? (
                    visibleAssignmentRows.map((row) => (
                      <tr key={row.assignment.id}>
                        <td className="whitespace-nowrap px-3 py-3 font-semibold">
                          {row.assignment.startAt ? formatDate(row.assignment.startAt) : '-'}
                        </td>
                        <td className="px-3 py-3">{row.className}</td>
                        <td className="px-3 py-3 font-semibold">{row.testName}</td>
                        <td className="px-3 py-3 text-center font-semibold">{row.recipientCount}</td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold text-ink">{assignmentProgressById.get(row.assignment.id)?.completedCount ?? 0}/{row.recipientCount} completed</span>
                            <button className="text-xs font-bold text-blue underline-offset-2 hover:underline" onClick={() => setAssignmentToInspect(row.assignment)} type="button">View students</button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {row.assignment.dueAt ? formatDate(row.assignment.dueAt) : 'No deadline'}
                        </td>
                        <td className="px-3 py-3 text-right"><Button className="min-h-9 px-3" type="button" variant="danger" onClick={() => setAssignmentToDelete(row.assignment)}>Delete</Button></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-6 text-center text-muted" colSpan={7}>
                        No {activeTab === 'expired' ? 'expired' : 'active'} assignments match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      ) : null}
      {assignmentToDelete ? <div className="fixed inset-0 z-50 grid place-items-center bg-[#131544]/45 p-4" role="presentation" onMouseDown={() => setAssignmentToDelete(null)}>
        <section className="w-full max-w-md rounded-app border border-[#f3b4b4] bg-white p-5 text-ink shadow-[0_24px_60px_rgba(24,27,80,0.3)]" role="dialog" aria-modal="true" aria-labelledby="delete-assignment-title" onMouseDown={(event) => event.stopPropagation()}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-danger">Delete assignment</p>
          <h2 className="mt-1 text-xl font-bold" id="delete-assignment-title">Remove this assignment?</h2>
          <p className="mt-3 text-sm text-muted">If no student has started it, it will be deleted permanently. Otherwise it will disappear for students and these lists, while completed history stays in Results.</p>
          <div className="mt-5 flex justify-end gap-3"><Button disabled={isSaving} type="button" variant="secondary" onClick={() => setAssignmentToDelete(null)}>Cancel</Button><Button disabled={isSaving} type="button" variant="danger" onClick={deleteAssignment}>{isSaving ? 'Deleting...' : 'Delete assignment'}</Button></div>
        </section>
      </div> : null}
      {assignmentToInspect ? <div className="fixed inset-0 z-50 grid place-items-center bg-[#131544]/45 p-4" role="presentation" onMouseDown={() => setAssignmentToInspect(null)}>
        <section aria-labelledby="assignment-progress-title" className="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-app border border-[#d9d5fb] bg-white text-ink shadow-[0_24px_60px_rgba(24,27,80,0.3)]" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4 border-b border-line p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Assignment progress</p>
              <h2 className="mt-1 text-xl font-bold" id="assignment-progress-title">{inspectedAssignmentRow?.testName ?? 'Assignment'}</h2>
              <p className="mt-1 text-sm text-muted">{inspectedAssignmentRow?.className ?? 'Class'} · Due {assignmentToInspect.dueAt ? formatDate(assignmentToInspect.dueAt) : 'no deadline'}</p>
            </div>
            <button aria-label="Close assignment progress" className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-mist text-muted transition hover:border-blue hover:text-blue" onClick={() => setAssignmentToInspect(null)} type="button"><X size={18} aria-hidden="true" /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 border-b border-line bg-[#faf9ff] p-4">
            <div className="rounded-xl border border-[#dedbf0] bg-white p-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Students</p><p className="mt-1 text-xl font-bold">{inspectedAssignmentProgress?.students.length ?? 0}</p></div>
            <div className="rounded-xl border border-[#c4ead3] bg-[#f2fbf5] p-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-green">Completed</p><p className="mt-1 text-xl font-bold text-green">{inspectedAssignmentProgress?.completedCount ?? 0}</p></div>
            <div className="rounded-xl border border-[#c9d7f6] bg-[#f4f8ff] p-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-blue">In progress</p><p className="mt-1 text-xl font-bold text-blue">{inspectedAssignmentProgress?.inProgressCount ?? 0}</p></div>
          </div>
          <div className="min-h-0 overflow-y-auto p-4">
            <div className="overflow-x-auto rounded-app border border-line">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className={nestedTableHead}><tr><th className="px-3 py-3">Student</th><th className="px-3 py-3 text-center">Status</th><th className="px-3 py-3 text-center">Score</th><th className="px-3 py-3 text-center">Points earned</th><th className="px-3 py-3 text-center">Deadline met</th></tr></thead>
                <tbody className="divide-y divide-line bg-white">
                  {inspectedAssignmentProgress?.students.map((student) => <tr key={student.id}><td className="px-3 py-3 font-semibold">{student.name}</td><td className="px-3 py-3 text-center"><span className={student.completed ? 'font-semibold text-green' : student.attempt?.status === 'in_progress' ? 'font-semibold text-blue' : 'text-muted'}>{student.status}</span></td><td className={`px-3 py-3 text-center font-semibold ${scoreTextClass(student.attempt?.percentage)}`}>{student.score}</td><td className={`px-3 py-3 text-center font-semibold ${student.points === '-' ? 'text-muted' : 'text-[#554fd1]'}`}>{student.points === '-' ? '-' : `${student.points} pts`}</td><td className={`px-3 py-3 text-center font-semibold ${student.deadlineStatus === 'Late' || student.deadlineStatus === 'Overdue' ? 'text-danger' : student.deadlineStatus === 'On time' ? 'text-green' : 'text-muted'}`}>{student.deadlineStatus}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div> : null}
    </TeacherPage>
  );
}

function ResultsPage() {
  const state = useAppState();
  const topResultsScrollRef = useRef<HTMLDivElement>(null);
  const resultsTableScrollRef = useRef<HTMLDivElement>(null);
  const activeClasses = useMemo(() => state.classes.filter((classRecord) => classRecord.status === 'active' && !classRecord.isSystem), [state.classes]);
  const [selectedClassId, setSelectedClassId] = useState(() => state.classes.find((classRecord) => classRecord.status === 'active' && !classRecord.isSystem)?.id ?? allResultsFilterValue);
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => state.subjects[0]?.id ?? allResultsFilterValue);
  const [selectedUnitId, setSelectedUnitId] = useState(allResultsFilterValue);
  const [selectedTopicId, setSelectedTopicId] = useState(allResultsFilterValue);
  const [dueDateFrom, setDueDateFrom] = useState(() => defaultDueDateRange().from);
  const [dueDateTo, setDueDateTo] = useState(() => defaultDueDateRange().to);
  const [isDueDateFilterEnabled, setIsDueDateFilterEnabled] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [scoreSort, setScoreSort] = useState<{ testId: string; direction: 'ascending' | 'descending' } | null>(null);
  const [studentToInspect, setStudentToInspect] = useState<StudentProfile | null>(null);
  const selectedResultsClass = activeClasses.find((classRecord) => classRecord.id === selectedClassId);
  const availableResultSubjects = selectedClassId === allResultsFilterValue
    ? state.subjects
    : state.subjects.filter((subject) => selectedResultsClass?.courseIds.includes(subject.id));

  const unitById = useMemo(() => new Map(state.units.map((unit) => [unit.id, unit])), [state.units]);
  const topicById = useMemo(() => new Map(state.topics.map((topic) => [topic.id, topic])), [state.topics]);
  const studentById = useMemo(() => new Map(state.students.map((student) => [student.id, student])), [state.students]);
  const unitOrderById = useMemo(() => new Map(state.units.map((unit, index) => [unit.id, index])), [state.units]);
  const topicOrderById = useMemo(() => new Map(state.topics.map((topic, index) => [topic.id, index])), [state.topics]);

  const unitOptions = useMemo(
    () =>
      selectedSubjectId === allResultsFilterValue
        ? state.units
        : state.units.filter((unit) => unit.subjectId === selectedSubjectId),
    [selectedSubjectId, state.units],
  );
  const topicOptions = useMemo(() => {
    if (selectedUnitId !== allResultsFilterValue) {
      return state.topics.filter((topic) => topic.unitId === selectedUnitId);
    }
    const topicsByUnit = new Map<string, Topic[]>();
    state.topics.forEach((topic) => {
      topicsByUnit.set(topic.unitId, [...(topicsByUnit.get(topic.unitId) ?? []), topic]);
    });
    return unitOptions.flatMap((unit) => topicsByUnit.get(unit.id) ?? []);
  }, [selectedUnitId, state.topics, unitOptions]);

  useEffect(() => {
    const firstClassId = activeClasses[0]?.id ?? allResultsFilterValue;
    if (selectedClassId !== allResultsFilterValue && !activeClasses.some((classRecord) => classRecord.id === selectedClassId)) {
      setSelectedClassId(firstClassId);
    }

    if (selectedSubjectId !== allResultsFilterValue && !availableResultSubjects.some((subject) => subject.id === selectedSubjectId)) {
      setSelectedSubjectId(availableResultSubjects[0]?.id ?? allResultsFilterValue);
      setSelectedUnitId(allResultsFilterValue);
      setSelectedTopicId(allResultsFilterValue);
    }

    if (selectedUnitId !== allResultsFilterValue && !unitOptions.some((unit) => unit.id === selectedUnitId)) {
      setSelectedUnitId(allResultsFilterValue);
      setSelectedTopicId(allResultsFilterValue);
    }

    if (selectedTopicId !== allResultsFilterValue && !topicOptions.some((topic) => topic.id === selectedTopicId)) {
      setSelectedTopicId(allResultsFilterValue);
    }
  }, [activeClasses, availableResultSubjects, selectedClassId, selectedSubjectId, selectedTopicId, selectedUnitId, topicOptions, unitOptions]);

  const filteredTests = useMemo(
    () =>
      state.tests
        .filter((test) => {
          if (test.status !== 'published') return false;
          const topic = topicById.get(test.topicId);
          const unit = topic ? unitById.get(topic.unitId) : undefined;
          if (!topic || !unit) return false;
          if (selectedSubjectId !== allResultsFilterValue && unit.subjectId !== selectedSubjectId) return false;
          if (selectedUnitId !== allResultsFilterValue && topic.unitId !== selectedUnitId) return false;
          if (selectedTopicId !== allResultsFilterValue && topic.id !== selectedTopicId) return false;
          return true;
        })
        .sort((first, second) => {
          const firstTopic = topicById.get(first.topicId);
          const secondTopic = topicById.get(second.topicId);
          const firstUnitOrder = firstTopic ? unitOrderById.get(firstTopic.unitId) ?? 0 : 0;
          const secondUnitOrder = secondTopic ? unitOrderById.get(secondTopic.unitId) ?? 0 : 0;
          const firstTopicOrder = firstTopic ? topicOrderById.get(firstTopic.id) ?? 0 : 0;
          const secondTopicOrder = secondTopic ? topicOrderById.get(secondTopic.id) ?? 0 : 0;
          return (
            firstUnitOrder - secondUnitOrder ||
            firstTopicOrder - secondTopicOrder ||
            resultNaturalSort.compare(first.testTitle, second.testTitle)
          );
        }),
    [selectedSubjectId, selectedTopicId, selectedUnitId, state.tests, topicById, topicOrderById, unitById, unitOrderById],
  );

  const resultAttempts = useMemo(() => {
    const testIds = new Set(filteredTests.map((test) => test.id));
    return state.attempts.filter(
      (attempt) =>
        attempt.status !== 'voided' &&
        testIds.has(attempt.testId) &&
        (selectedClassId === allResultsFilterValue || attempt.classIdAtAttempt === selectedClassId),
    );
  }, [filteredTests, selectedClassId, state.attempts]);

  const studentColumns = useMemo(() => {
    const activeClassIds = new Set(activeClasses.map((classRecord) => classRecord.id));
    const currentRosterStudents = state.students.filter((student) => {
      if (student.accountStatus === 'archived') return false;
      if (selectedClassId !== allResultsFilterValue) return studentHasClass(student, selectedClassId);
      return studentClassIds(student).some((classId) => activeClassIds.has(classId));
    });
    const studentIds = new Set(currentRosterStudents.map((student) => student.id));
    resultAttempts.forEach((attempt) => studentIds.add(attempt.studentId));

    return Array.from(studentIds)
      .map((studentId) => studentById.get(studentId))
      .filter((student): student is StudentProfile => Boolean(student))
      .sort((first, second) => studentFullName(first).localeCompare(studentFullName(second)) || first.publicStudentId.localeCompare(second.publicStudentId));
  }, [activeClasses, resultAttempts, selectedClassId, state.students, studentById]);

  const assignmentsByTestId = useMemo(() => {
    const testIdByVersionId = new Map(state.testVersions.map((version) => [version.id, version.testId]));
    const assignments = new Map<string, TestAssignment[]>();
    state.assignments.filter((assignment) => assignment.status !== 'archived').forEach((assignment) => {
      const testId = testIdByVersionId.get(assignment.testVersionId);
      if (testId) assignments.set(testId, [...(assignments.get(testId) ?? []), assignment]);
    });
    return assignments;
  }, [state.assignments, state.testVersions]);

  const resultRows = useMemo(() => {
    const attemptsByCell = new Map<string, TestAttempt[]>();
    resultAttempts.forEach((attempt) => {
      const key = `${attempt.testId}:${attempt.studentId}`;
      attemptsByCell.set(key, [...(attemptsByCell.get(key) ?? []), attempt]);
    });

    return filteredTests.map((test) => {
      const matchingAssignments = (assignmentsByTestId.get(test.id) ?? []).filter(
        (assignment) => selectedClassId === allResultsFilterValue || assignment.classId === selectedClassId,
      );
      const cells = studentColumns.map((student) => {
        const attempt = preferredResultAttempt(attemptsByCell.get(`${test.id}:${student.id}`) ?? []);
        const isAssignedToStudent = matchingAssignments.some((assignment) =>
          assignment.recipientScope === 'selected'
            ? assignment.recipientStudentIds.includes(student.id)
            : studentHasClass(student, assignment.classId),
        );
        const isApplicable = Boolean(attempt) || isAssignedToStudent;
        const label = resultAttemptLabel(attempt, isApplicable);
        return { attempt, ...label, student };
      });
      const scores = cells
        .map((cell) => cell.attempt?.percentage)
        .filter((score): score is number => typeof score === 'number');
      const average = scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : undefined;
      const latestAssignment = [...matchingAssignments].sort((first, second) => assignmentSortTime(second.dueAt) - assignmentSortTime(first.dueAt))[0];
      return {
        average,
        dueAt: latestAssignment?.dueAt,
        cells,
        test,
        unit: unitById.get(topicById.get(test.topicId)?.unitId ?? ''),
      };
    }).filter((row) => {
      if (!isDueDateFilterEnabled) return true;
      if (!row.dueAt) return false;
      return isDateWithinInputRange(row.dueAt, dueDateFrom, dueDateTo);
    });
  }, [assignmentsByTestId, dueDateFrom, dueDateTo, filteredTests, isDueDateFilterEnabled, resultAttempts, selectedClassId, studentColumns, topicById, unitById]);

  const studentPerformanceSummary = useMemo(() => {
    if (!studentToInspect) return null;
    const courseTests = state.tests
      .filter((test) => {
        if (test.status !== 'published') return false;
        const topic = topicById.get(test.topicId);
        const unit = topic ? unitById.get(topic.unitId) : undefined;
        return Boolean(topic && unit && (selectedSubjectId === allResultsFilterValue || unit.subjectId === selectedSubjectId));
      })
      .sort((first, second) => resultNaturalSort.compare(first.testTitle, second.testTitle));
    const courseTestIds = new Set(courseTests.map((test) => test.id));
    const attemptsByTestId = new Map<string, TestAttempt[]>();
    state.attempts
      .filter((attempt) => attempt.studentId === studentToInspect.id && attempt.status !== 'voided' && courseTestIds.has(attempt.testId))
      .forEach((attempt) => attemptsByTestId.set(attempt.testId, [...(attemptsByTestId.get(attempt.testId) ?? []), attempt]));
    const results = courseTests.map((test) => {
      const attempts = attemptsByTestId.get(test.id) ?? [];
      const preferredAttempt = preferredResultAttempt(attempts);
      const completedAttempts = attempts.filter((attempt) => typeof attempt.percentage === 'number' || ['feedback_released', 'marked', 'submitted', 'timed_out'].includes(attempt.status));
      const completed = completedAttempts.length > 0;
      const score = typeof preferredAttempt?.percentage === 'number'
        ? typeof preferredAttempt.score === 'number' && typeof preferredAttempt.maxScore === 'number'
          ? `${preferredAttempt.score}/${preferredAttempt.maxScore} (${preferredAttempt.percentage}%)`
          : `${preferredAttempt.percentage}%`
        : '-';
      return {
        unitId: unitById.get(topicById.get(test.topicId)?.unitId ?? '')?.id ?? '',
        unitName: unitById.get(topicById.get(test.topicId)?.unitId ?? '')?.unitName ?? 'Course tests',
        testName: test.testTitle,
        status: !preferredAttempt ? 'Not started' : completed ? 'Completed' : attemptStatusLabel(preferredAttempt.status),
        score,
        percentage: preferredAttempt?.percentage,
        marks: typeof preferredAttempt?.score === 'number' ? preferredAttempt.score : 0,
        maxMarks: typeof preferredAttempt?.maxScore === 'number' ? preferredAttempt.maxScore : 0,
        points: completed ? completedAttempts.reduce((total, attempt) => total + (attempt.pointsAwarded ?? 0), 0) : undefined,
        completed,
      };
    });
    const scoredResults = results.filter((result) => typeof result.percentage === 'number');
    const course = selectedSubjectId === allResultsFilterValue ? undefined : state.subjects.find((subject) => subject.id === selectedSubjectId);
    return {
      className: selectedClassId === allResultsFilterValue ? 'All classes' : selectedResultsClass?.className ?? 'Class',
      courseName: course?.subjectName ?? 'All courses',
      results,
      unitSummaries: Array.from(new Map(results.map((result) => [result.unitId, result.unitName])).entries()).map(([unitId, unitName]) => {
        const unitResults = results.filter((result) => result.unitId === unitId);
        const scoredUnitResults = unitResults.filter((result) => typeof result.percentage === 'number');
        return {
          unitId,
          unitName,
          results: unitResults,
          average: scoredUnitResults.length ? Math.round(scoredUnitResults.reduce((total, result) => total + (result.percentage ?? 0), 0) / scoredUnitResults.length) : undefined,
          bestScore: scoredUnitResults.length ? Math.max(...scoredUnitResults.map((result) => result.percentage ?? 0)) : undefined,
          completedTests: unitResults.filter((result) => result.completed).length,
          marksEarned: unitResults.reduce((total, result) => total + result.marks, 0),
          marksAvailable: unitResults.reduce((total, result) => total + result.maxMarks, 0),
          totalPoints: unitResults.reduce((total, result) => total + (result.points ?? 0), 0),
        };
      }),
      average: scoredResults.length ? Math.round(scoredResults.reduce((total, result) => total + (result.percentage ?? 0), 0) / scoredResults.length) : undefined,
      bestScore: scoredResults.length ? Math.max(...scoredResults.map((result) => result.percentage ?? 0)) : undefined,
      marksEarned: results.reduce((total, result) => total + result.marks, 0),
      marksAvailable: results.reduce((total, result) => total + result.maxMarks, 0),
      completedTests: results.filter((result) => result.completed).length,
      totalTests: results.length,
      totalPoints: results.reduce((total, result) => total + (result.points ?? 0), 0),
    };
  }, [selectedClassId, selectedResultsClass?.className, selectedSubjectId, state.attempts, state.subjects, state.tests, studentToInspect, topicById, unitById]);
  const unitResultSummaries = useMemo(() => {
    const groups = new Map<string, { unitName: string; rows: typeof resultRows }>();
    resultRows.forEach((row) => {
      const unitId = row.unit?.id ?? 'course-tests';
      const unitName = row.unit?.unitName ?? 'Course tests';
      const group = groups.get(unitId) ?? { unitName, rows: [] };
      group.rows.push(row);
      groups.set(unitId, group);
    });
    return new Map(Array.from(groups.entries()).map(([unitId, group]) => {
      const scores = group.rows.flatMap((row) => row.cells.map((cell) => cell.attempt?.percentage).filter((score): score is number => typeof score === 'number'));
      const averagesByStudentId = new Map(studentColumns.map((student) => {
        const scoresForStudent = group.rows.map((row) => row.cells.find((cell) => cell.student.id === student.id)?.attempt?.percentage).filter((score): score is number => typeof score === 'number');
        return [student.id, scoresForStudent.length ? Math.round(scoresForStudent.reduce((total, score) => total + score, 0) / scoresForStudent.length) : undefined];
      }));
      return [unitId, {
        unitName: group.unitName,
        classAverage: scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : undefined,
        averagesByStudentId,
      }];
    }));
  }, [resultRows, studentColumns]);

  const tableMinWidth = `${Math.max(760, 472 + studentColumns.length * 76)}px`;
  const orderedStudentColumns = useMemo(() => {
    if (!scoreSort) return studentColumns;
    const row = resultRows.find((resultRow) => resultRow.test.id === scoreSort.testId);
    if (!row) return studentColumns;
    const scoreByStudentId = new Map(row.cells.map((cell) => [cell.student.id, cell.attempt?.percentage]));
    return [...studentColumns].sort((first, second) => {
      const firstScore = scoreByStudentId.get(first.id);
      const secondScore = scoreByStudentId.get(second.id);
      if (typeof firstScore !== 'number' && typeof secondScore !== 'number') return studentFullName(first).localeCompare(studentFullName(second));
      if (typeof firstScore !== 'number') return 1;
      if (typeof secondScore !== 'number') return -1;
      return scoreSort.direction === 'descending' ? secondScore - firstScore : firstScore - secondScore;
    });
  }, [resultRows, scoreSort, studentColumns]);
  const syncResultsScroll = (source: HTMLDivElement, target: HTMLDivElement | null) => {
    if (target && target.scrollLeft !== source.scrollLeft) target.scrollLeft = source.scrollLeft;
  };

  return (
    <TeacherPage title="Student Results">
      <Panel className="p-4">
        <button
          aria-expanded={filtersOpen}
          className="group flex w-full items-center justify-between gap-4 rounded-app text-left transition focus:outline-none focus:ring-2 focus:ring-[#aeb9ff]/70"
          onClick={() => setFiltersOpen((open) => !open)}
          type="button"
        >
          <div>
            <h2 className="font-bold">Result filters</h2>
            <p className="mt-1 text-sm text-[#d9dfff] transition group-hover:text-white">Change the class, course, topic or due-date view.</p>
          </div>
          <ChevronRight aria-hidden="true" className={`shrink-0 text-[#d9dfff] transition group-hover:text-white ${filtersOpen ? 'rotate-90' : ''}`} size={22} />
        </button>
        {filtersOpen ? <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-12">
          <label className={`${resultsFilterFieldClass} xl:col-span-2`}>
            <span className={darkSubtleText}>Class</span>
            <select
              className={whiteControlClass}
              value={selectedClassId}
              onChange={(event) => setSelectedClassId(event.target.value)}
            >
              <option value={allResultsFilterValue}>All classes</option>
              {activeClasses.map((classRecord) => (
                <option key={classRecord.id} value={classRecord.id}>
                  {classRecord.className}
                </option>
              ))}
            </select>
          </label>
          <label className={`${resultsFilterFieldClass} xl:col-span-4`}>
            <span className={darkSubtleText}>Course</span>
            <select
              className={whiteControlClass}
              value={selectedSubjectId}
              onChange={(event) => {
                setSelectedSubjectId(event.target.value);
                setSelectedUnitId(allResultsFilterValue);
                setSelectedTopicId(allResultsFilterValue);
              }}
            >
              <option value={allResultsFilterValue}>All courses</option>
              {availableResultSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </label>
          <label className={`${resultsFilterFieldClass} xl:col-span-3`}>
            <span className={darkSubtleText}>Unit</span>
            <select
              className={whiteControlClass}
              value={selectedUnitId}
              onChange={(event) => {
                setSelectedUnitId(event.target.value);
                setSelectedTopicId(allResultsFilterValue);
              }}
            >
              <option value={allResultsFilterValue}>All units</option>
              {unitOptions.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unitName}
                </option>
              ))}
            </select>
          </label>
          <label className={`${resultsFilterFieldClass} xl:col-span-3`}>
            <span className={darkSubtleText}>Topic</span>
            <select
              className={whiteControlClass}
              value={selectedTopicId}
              onChange={(event) => setSelectedTopicId(event.target.value)}
            >
              <option value={allResultsFilterValue}>All topics</option>
              {topicOptions.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.topicName}
                </option>
              ))}
            </select>
          </label>
          <label className="col-span-full inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white">
            <input checked={isDueDateFilterEnabled} className="size-4 accent-blue" onChange={(event) => setIsDueDateFilterEnabled(event.target.checked)} type="checkbox" />
            Filter by due date
          </label>
          <label className={`${resultsFilterFieldClass} xl:col-span-2`}>
            <span className={darkSubtleText}>Due from</span>
            <input className={whiteControlClass} onBlur={(event) => setDueDateFrom(event.currentTarget.value)} onChange={(event) => setDueDateFrom(event.target.value)} onInput={(event) => setDueDateFrom(event.currentTarget.value)} type="date" value={dueDateFrom} />
          </label>
          <label className={`${resultsFilterFieldClass} xl:col-span-2`}>
            <span className={darkSubtleText}>Due to</span>
            <input className={whiteControlClass} onBlur={(event) => setDueDateTo(event.currentTarget.value)} onChange={(event) => setDueDateTo(event.target.value)} onInput={(event) => setDueDateTo(event.currentTarget.value)} type="date" value={dueDateTo} />
          </label>
        </div> : null}
      </Panel>

      <Panel className="p-4">
        <div
          aria-label="Results table horizontal scrollbar"
          className="mb-2 h-5 overflow-x-auto rounded-app border border-line bg-mist"
          onScroll={(event) => syncResultsScroll(event.currentTarget, resultsTableScrollRef.current)}
          ref={topResultsScrollRef}
          role="region"
        >
          <div aria-hidden="true" style={{ minWidth: tableMinWidth }} />
        </div>
        <div
          className={`${nestedTableFrame} max-h-[70vh] overflow-auto`}
          onScroll={(event) => syncResultsScroll(event.currentTarget, topResultsScrollRef.current)}
          ref={resultsTableScrollRef}
        >
          <table className="w-full border-collapse text-left text-sm" style={{ minWidth: tableMinWidth }}>
            <thead className={`${nestedTableHead} text-ink`}>
              <tr>
                <th className="sticky left-0 top-0 z-30 w-[300px] min-w-[300px] border border-line bg-[#f6f4ff] px-3 py-3">Test</th>
                <th className="sticky left-[300px] top-0 z-30 w-[92px] min-w-[92px] whitespace-nowrap border border-line bg-[#f6f4ff] px-2 py-3 text-center text-xs">Due date</th>
                <th className="sticky left-[392px] top-0 z-30 w-[80px] min-w-[80px] whitespace-nowrap border border-line bg-[#f6f4ff] px-2 py-3 text-center text-xs shadow-[5px_0_10px_rgba(33,42,111,0.13)]">Class avg</th>
                {orderedStudentColumns.map((student) => (
                  <th className="sticky top-0 z-20 w-px whitespace-nowrap border border-line bg-[#f6f4ff] px-2 py-3 text-center text-xs" key={student.id}>
                    <button className="block max-w-[76px] truncate text-center font-bold text-ink underline-offset-2 hover:text-blue hover:underline focus:outline-none focus:ring-2 focus:ring-blue/30" onClick={() => setStudentToInspect(student)} title={`View ${studentFullName(student)}'s course performance`} type="button">{studentFullName(student)}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-ink">
              {resultRows.length ? (
                resultRows.map((row, rowIndex) => {
                  const unitId = row.unit?.id ?? 'course-tests';
                  const previousUnitId = resultRows[rowIndex - 1]?.unit?.id ?? (rowIndex ? 'course-tests' : undefined);
                  const unitSummary = unitResultSummaries.get(unitId);
                  return <Fragment key={row.test.id}>
                  {unitId !== previousUnitId ? <tr className="bg-[#eeecff] text-ink"><th className="sticky left-0 z-20 w-[300px] min-w-[300px] border border-[#c8c3f6] bg-[#eeecff] px-3 py-3 text-left" scope="row"><span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#625bb3]">Unit summary</span><span className="mt-1 block font-bold">{unitSummary?.unitName ?? row.unit?.unitName ?? 'Course tests'}</span></th><td className="sticky left-[300px] z-20 w-[92px] min-w-[92px] border border-[#c8c3f6] bg-[#eeecff] px-2 py-3 text-center text-xs font-semibold text-[#625bb3]">-</td><td className={`sticky left-[392px] z-20 w-[80px] min-w-[80px] border border-[#c8c3f6] bg-[#eeecff] px-2 py-3 text-center text-xs font-bold shadow-[5px_0_10px_rgba(33,42,111,0.13)] ${scoreTextClass(unitSummary?.classAverage)}`}>{typeof unitSummary?.classAverage === 'number' ? `${unitSummary.classAverage}%` : '-'}</td>{orderedStudentColumns.map((student) => { const average = unitSummary?.averagesByStudentId.get(student.id); return <td className={`w-px whitespace-nowrap border border-[#c8c3f6] bg-[#eeecff] px-2 py-3 text-center text-xs font-bold ${scoreTextClass(average)}`} key={`${unitId}-${student.id}`}>{typeof average === 'number' ? `${average}%` : '-'}</td>; })}</tr> : null}
                  <tr>
                    <th
                      className="sticky left-0 z-20 w-[300px] min-w-[300px] border border-line bg-white px-3 py-3 text-left align-top font-semibold"
                      scope="row"
                    >
                      <button
                        className="flex w-full items-center justify-between gap-2 text-left hover:text-blue focus:outline-none focus:ring-2 focus:ring-blue/30"
                        onClick={() => setScoreSort((current) => current?.testId === row.test.id ? { testId: row.test.id, direction: current.direction === 'descending' ? 'ascending' : 'descending' } : { testId: row.test.id, direction: 'descending' })}
                        type="button"
                      >
                        <span>{row.test.testTitle}</span>
                        {scoreSort?.testId === row.test.id ? <span aria-label={scoreSort.direction === 'descending' ? 'Highest scores first' : 'Lowest scores first'} className="shrink-0 text-xs text-blue">{scoreSort.direction === 'descending' ? '↓' : '↑'}</span> : null}
                      </button>
                    </th>
                    <td className="sticky left-[300px] z-20 w-[92px] min-w-[92px] whitespace-nowrap border border-line bg-white px-2 py-3 text-center align-top text-xs font-bold">
                      {row.dueAt ? formatDate(row.dueAt) : '-'}
                    </td>
                    <td className={`sticky left-[392px] z-20 w-[80px] min-w-[80px] whitespace-nowrap border border-line bg-white px-2 py-3 text-center align-top text-xs font-bold shadow-[5px_0_10px_rgba(33,42,111,0.13)] ${scoreTextClass(row.average)}`}>
                      {typeof row.average === 'number' ? `${row.average}%` : '-'}
                    </td>
                    {orderedStudentColumns.map((student) => {
                      const cell = row.cells.find((resultCell) => resultCell.student.id === student.id);
                      if (!cell) return <td className="w-px whitespace-nowrap border border-line px-2 py-3 align-top text-xs font-bold text-muted" key={`${row.test.id}-${student.id}`}>—</td>;
                      return (
                      <td className={`w-px whitespace-nowrap border border-line px-2 py-3 text-center align-top text-xs font-bold ${cell.className}`} key={`${row.test.id}-${cell.student.id}`}>
                        {cell.label}
                      </td>
                      );
                    })}
                  </tr>
                  </Fragment>;
                })
              ) : (
                <tr>
                  <td className="border border-line px-3 py-6 text-center text-sm font-semibold text-muted" colSpan={Math.max(3, studentColumns.length + 3)}>
                    No assigned tests match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
      {studentToInspect && studentPerformanceSummary ? <div className="fixed inset-0 z-50 grid place-items-center bg-[#131544]/45 p-4" role="presentation" onMouseDown={() => setStudentToInspect(null)}>
        <section aria-labelledby="student-performance-title" className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-app border border-[#d9d5fb] bg-white text-ink shadow-[0_24px_60px_rgba(24,27,80,0.3)]" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4 border-b border-line p-5">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Student performance summary</p><h2 className="mt-1 text-xl font-bold" id="student-performance-title">{studentFullName(studentToInspect)}</h2><p className="mt-1 text-sm text-muted">{studentPerformanceSummary.className} · {studentPerformanceSummary.courseName}</p></div>
            <div className="flex items-center gap-2"><Button className="min-h-10 px-3" onClick={() => downloadStudentPerformancePdf({ studentName: studentFullName(studentToInspect), ...studentPerformanceSummary })} type="button" variant="secondary"><Download size={16} aria-hidden="true" />Download PDF</Button><button aria-label="Close student performance summary" className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-mist text-muted transition hover:border-blue hover:text-blue" onClick={() => setStudentToInspect(null)} type="button"><X size={18} aria-hidden="true" /></button></div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-b border-line bg-[#faf9ff] p-4 sm:grid-cols-5">
            <div className="rounded-xl border border-[#dedbf0] bg-white p-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Average</p><p className="mt-1 text-xl font-bold">{typeof studentPerformanceSummary.average === 'number' ? `${studentPerformanceSummary.average}%` : '-'}</p></div>
            <div className="rounded-xl border border-[#c9d7f6] bg-[#f4f8ff] p-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-blue">Total marks</p><p className="mt-1 text-xl font-bold text-blue">{studentPerformanceSummary.marksEarned}/{studentPerformanceSummary.marksAvailable}</p></div>
            <div className="rounded-xl border border-[#c4ead3] bg-[#f2fbf5] p-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-green">Completed</p><p className="mt-1 text-xl font-bold text-green">{studentPerformanceSummary.completedTests}/{studentPerformanceSummary.results.length}</p></div>
            <div className="rounded-xl border border-[#f3d8a4] bg-[#fff9ec] p-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-amber">Best score</p><p className="mt-1 text-xl font-bold text-amber">{typeof studentPerformanceSummary.bestScore === 'number' ? `${studentPerformanceSummary.bestScore}%` : '-'}</p></div>
            <div className="rounded-xl border border-[#d8d0fb] bg-[#f3f0ff] p-3"><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#554fd1]">Points earned</p><p className="mt-1 text-xl font-bold text-[#554fd1]">{studentPerformanceSummary.totalPoints}</p></div>
          </div>
          <div className="min-h-0 overflow-y-auto p-4">
            <div className="space-y-4">{studentPerformanceSummary.unitSummaries.map((unit) => <section className="overflow-hidden rounded-app border border-[#d8d3f5]" key={unit.unitId}><div className="flex flex-wrap items-center justify-between gap-3 bg-[#eeecff] px-4 py-3"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#625bb3]">Unit summary</p><h3 className="mt-1 font-bold">{unit.unitName}</h3></div><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-[#4d468f]"><span>Average {typeof unit.average === 'number' ? `${unit.average}%` : '-'}</span><span>Marks {unit.marksEarned}/{unit.marksAvailable}</span><span>Completed {unit.completedTests}/{unit.results.length}</span><span>Best {typeof unit.bestScore === 'number' ? `${unit.bestScore}%` : '-'}</span><span>{unit.totalPoints} points</span></div></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className={nestedTableHead}><tr><th className="px-3 py-3">Test</th><th className="px-3 py-3 text-center">Status</th><th className="px-3 py-3 text-center">Score</th><th className="px-3 py-3 text-center">Points earned</th></tr></thead><tbody className="divide-y divide-line bg-white">{unit.results.map((result) => <tr key={result.testName}><td className="px-3 py-3 font-semibold">{result.testName}</td><td className={`px-3 py-3 text-center font-semibold ${result.status === 'Completed' ? 'text-green' : result.status === 'In progress' ? 'text-blue' : 'text-muted'}`}>{result.status}</td><td className={`px-3 py-3 text-center font-semibold ${scoreTextClass(result.percentage)}`}>{result.score}</td><td className={`px-3 py-3 text-center font-semibold ${typeof result.points === 'number' ? 'text-[#554fd1]' : 'text-muted'}`}>{typeof result.points === 'number' ? `${result.points} pts` : '-'}</td></tr>)}</tbody></table></div></section>)}</div>
          </div>
        </section>
      </div> : null}
    </TeacherPage>
  );
}

function LeaderboardsPage() {
  const state = useAppState();
  const activeClasses = useMemo(() => state.classes.filter((classRecord) => classRecord.status === 'active' && !classRecord.isSystem), [state.classes]);
  const [classId, setClassId] = useState(() => activeClasses[0]?.id ?? allResultsFilterValue);
  const [yearGroup, setYearGroup] = useState(allResultsFilterValue);
  const studentById = useMemo(() => new Map(state.students.map((student) => [student.id, student])), [state.students]);
  const yearGroups = useMemo(
    () => sortYearGroups(Array.from(new Set(state.students.map((student) => student.yearGroup.replace(/^Year\s*/i, '')).filter(Boolean)))),
    [state.students],
  );
  const rankedClassRows = useMemo(() => {
    const selectedClass = activeClasses.find((classRecord) => classRecord.id === classId);
    return state.leaderboardRows
      .filter((row) => !selectedClass || row.className === selectedClass.className)
      .filter((row) => yearGroup === allResultsFilterValue || studentById.get(row.studentId)?.yearGroup === `Year ${yearGroup}`)
      .sort((first, second) => second.points - first.points || first.displayName.localeCompare(second.displayName))
      .map((row, index) => ({ ...row, rank: index + 1 }));
  }, [activeClasses, classId, state.leaderboardRows, studentById, yearGroup]);
  const rankedAllTimeRows = useMemo(
    () =>
      state.allTimeLeaderboardRows
        .filter((row) => yearGroup === allResultsFilterValue || studentById.get(row.studentId)?.yearGroup === `Year ${yearGroup}`)
        .sort((first, second) => second.points - first.points || first.displayName.localeCompare(second.displayName))
        .map((row, index) => ({ ...row, rank: index + 1 })),
    [state.allTimeLeaderboardRows, studentById, yearGroup],
  );

  return (
    <TeacherPage title="Leaderboards">
      <Panel className="overflow-hidden p-0">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#4b59bd] px-5 py-5 lg:px-6">
          <div className="flex items-start gap-3">
            <span className="grid size-11 place-items-center rounded-xl border border-[#315071] bg-[#17304d] text-[#e6bc5c]">
              <Trophy size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b8c8d9]">Class leaderboard</p>
              <h2 className="mt-1 text-xl font-bold text-white">{activeClasses.find((classRecord) => classRecord.id === classId)?.className ?? 'All classes'}</h2>
              <p className={`mt-1 text-sm ${darkSubtleText}`}>Standings based on points earned.</p>
            </div>
          </div>
          <span className="pt-2 text-sm font-semibold text-[#b8c8d9]">{rankedClassRows.length} students</span>
        </div>
        <div className="grid gap-3 border-b border-[#4b59bd] bg-[#202a6f] p-4 text-white lg:grid-cols-[minmax(150px,1fr)_minmax(140px,0.75fr)] lg:items-end lg:px-5">
          <label className="space-y-1 text-sm font-semibold"><span className="text-[#d9dfff]">Class</span><select className={whiteControlClass} onChange={(event) => setClassId(event.target.value)} value={classId}><option value={allResultsFilterValue}>All classes</option>{activeClasses.map((classRecord) => <option key={classRecord.id} value={classRecord.id}>{classRecord.className}</option>)}</select></label>
          <label className="space-y-1 text-sm font-semibold"><span className="text-[#d9dfff]">Year group</span><select className={whiteControlClass} onChange={(event) => setYearGroup(event.target.value)} value={yearGroup}><option value={allResultsFilterValue}>All year groups</option>{yearGroups.map((group) => <option key={group} value={group}>Year {group}</option>)}</select></label>
        </div>
        <div className="space-y-2 p-4 lg:p-5">
          {rankedClassRows.map((row) => (
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm text-ink transition hover:border-[#9ab8d6]" key={row.studentId}>
              <span
                className={`grid size-9 place-items-center rounded-lg text-sm font-bold ${
                  row.rank === 1
                    ? 'bg-[#f5d879] text-[#49380a]'
                    : row.rank === 2
                      ? 'bg-[#dbe4ef] text-[#31445d]'
                      : row.rank === 3
                        ? 'bg-[#e7bf99] text-[#603b1b]'
                        : 'bg-[#eef4f8] text-[#42566f]'
                }`}
              >
                {row.rank}
              </span>
              <div className="min-w-0">
                <span className="block truncate font-bold">{row.displayName}</span>
                <span className="mt-0.5 block text-xs text-muted">{row.points} points</span>
              </div>
              <StatusBadge tone="green">{row.status}</StatusBadge>
            </div>
          ))}
          {!rankedClassRows.length ? <p className="rounded-app border border-dashed border-line bg-mist p-4 text-sm font-semibold text-muted">No students match these leaderboard filters.</p> : null}
        </div>
      </Panel>
      <Panel className="mt-5 overflow-hidden p-0">
        <div className="flex items-start justify-between gap-4 border-b border-line bg-[#f6f4ff] px-5 py-4 lg:px-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5a4eb5]">All-time leaderboard</p><h2 className="mt-1 text-xl font-bold text-ink">All students</h2><p className="mt-1 text-sm text-muted">Includes students whose records are now archived.</p></div>
          <span className="pt-2 text-sm font-semibold text-muted">{rankedAllTimeRows.length} students</span>
        </div>
        <div className="space-y-2 p-4 lg:p-5">
          {rankedAllTimeRows.map((row) => (
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm text-ink" key={`all-time-${row.studentId}`}>
              <span className={`grid size-9 place-items-center rounded-lg text-sm font-bold ${row.rank === 1 ? 'bg-[#f5d879] text-[#49380a]' : row.rank === 2 ? 'bg-[#dbe4ef] text-[#31445d]' : row.rank === 3 ? 'bg-[#e7bf99] text-[#603b1b]' : 'bg-[#eef4f8] text-[#42566f]'}`}>{row.rank}</span>
              <div className="min-w-0"><span className="block truncate font-bold">{row.displayName}</span><span className="mt-0.5 block text-xs text-muted">{row.points} points</span></div>
              <StatusBadge tone="green">{row.status}</StatusBadge>
            </div>
          ))}
          {!rankedAllTimeRows.length ? <p className="rounded-app border border-dashed border-line bg-mist p-4 text-sm font-semibold text-muted">No students match this year group.</p> : null}
        </div>
      </Panel>
    </TeacherPage>
  );
}


function TeacherPage({
  title,
  titleVisibility = 'visible',
  children,
}: {
  title: string;
  titleVisibility?: 'visible' | 'sr-only';
  children: ReactNode;
}) {
  return (
    <div className="space-y-5 p-4 lg:p-6">
      <h1 className={titleVisibility === 'sr-only' ? 'sr-only' : 'text-2xl font-bold tracking-normal'}>{title}</h1>
      {children}
    </div>
  );
}
