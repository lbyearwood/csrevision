import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  ChevronRight,
  Copy,
  ClipboardList,
  GraduationCap,
  Home,
  KeyRound,
  Link2,
  LogOut,
  Menu,
  Pencil,
  RefreshCw,
  Save,
  Search,
  Settings,
  SquareCheck,
  SquareMinus,
  Code2,
  Trash2,
  Trophy,
  UsersRound,
  X,
} from 'lucide-react';
import { Route, Routes, NavLink } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useAppState } from '../../app/AppState';
import { Button } from '../../components/ui/Button';
import { Metric } from '../../components/ui/Metric';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { leaderboardDisplay } from '../../lib/identity';
import { formatDate } from '../../lib/time';
import type { ClassRecord, StudentProfile, TestAttempt, Topic } from '../../types/domain';

const navItems = [
  { to: '/teacher', label: 'Dashboard', icon: Home },
  { to: '/teacher/classes', label: 'Classes', icon: GraduationCap },
  { to: '/teacher/students', label: 'Students', icon: UsersRound },
  { to: '/teacher/tests', label: 'Courses', icon: BookOpenCheck },
  { to: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/teacher/results', label: 'Results', icon: BarChart3 },
  { to: '/teacher/leaderboards', label: 'Leaderboards', icon: Trophy },
  { to: '/teacher/settings', label: 'Settings', icon: Settings },
];

const darkSubtleText = 'text-[#b8c8d9]';
const nestedTableFrame = 'overflow-x-auto rounded-app border border-line bg-white text-ink';
const nestedTableHead = 'border-b border-line bg-mist text-xs text-muted';
const lightControlClass = 'h-11 w-full rounded-app border border-line bg-mist px-3 text-sm text-ink shadow-inner [color-scheme:light] focus:border-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue/15';
const lightTextareaClass = 'min-h-11 w-full rounded-app border border-line bg-mist px-3 py-2 text-sm text-ink shadow-inner [color-scheme:light] focus:border-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue/15';
const filterCheckboxClass = 'h-4 w-4 rounded border-[#7c8fa7] bg-[#0f1d2e] accent-blue focus:ring-2 focus:ring-blue/25';
const filterLabelClass = 'inline-flex min-h-8 items-center gap-2 text-sm font-semibold text-[#eef5fc]';
const classStatusFilters = ['active', 'archived'] as const satisfies ReadonlyArray<ClassRecord['status']>;
const allResultsFilterValue = 'all';
const resultNaturalSort = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function TeacherApp() {
  const { dataError, isLoadingData, isSupabaseBacked, signOut } = useAppState();

  if (isSupabaseBacked && (isLoadingData || dataError)) {
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

  return (
    <main className="min-h-screen bg-mist p-3 text-ink lg:p-6">
      <div className="grid min-h-[860px] w-full overflow-hidden rounded-[18px] border border-[#d9e3ee] bg-mist shadow-panel lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-[#2a3a50] bg-[#14243a] p-4 text-white lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-app bg-teal text-white">
              <Code2 size={22} strokeWidth={2.4} aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold">csrevision</p>
              <p className="text-xs text-[#a9bbcf]">Teacher console</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                end={item.to === '/teacher'}
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-app px-3 text-sm font-semibold ${isActive ? 'bg-white text-[#0f1d2e]' : 'text-[#a9bbcf] hover:bg-[#20344f] hover:text-white'}`
                }
              >
                <item.icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 bg-mist text-ink">
          <header className="flex items-center justify-between border-b border-[#2a3a50] bg-[#14243a] px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <button className="grid h-10 w-10 place-items-center rounded-app border border-[#3a4e68] bg-[#0f1d2e] lg:hidden">
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <p className="font-bold">csrevision</p>
                <p className="truncate text-xs text-[#a9bbcf]">All times shown in your local time zone.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold">J. Doe</p>
                <p className="text-xs text-[#a9bbcf]">Teacher</p>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white font-bold text-[#0f1d2e]">JD</button>
              <button className="grid h-10 w-10 place-items-center rounded-app border border-[#3a4e68] bg-[#0f1d2e]" onClick={signOut} title="Sign out">
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>
          </header>
          <Routes>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="tests" element={<TestsPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="leaderboards" element={<LeaderboardsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </section>
      </div>
    </main>
  );
}

function TeacherDashboard() {
  const state = useAppState();
  const classRecord = state.classes.find((row) => row.status === 'active' && !row.isSystem) ?? state.classes.find((row) => row.status !== 'archived');
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
  const classAttempts = state.attempts.filter((attempt) => attempt.classIdAtAttempt === classRecord.id && attempt.status !== 'voided');
  const completed = completedAttemptCount(classAttempts);
  const average = averageAttemptPercentage(classAttempts);
  const flagged = classAttempts.reduce((total, attempt) => total + attempt.suspiciousEventCount, 0) + state.events.filter((event) => classAttempts.some((attempt) => attempt.id === event.attemptId)).length;

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Dashboard</h1>
          <p className="text-sm text-muted">Class progress, assigned tests, results and activity alerts.</p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          <select className="h-12 min-w-0 rounded-app border border-[#2a3a50] bg-[#14243a] px-3 text-sm font-semibold text-white">
            <option>{classRecord.className}</option>
          </select>
          <select className="h-12 min-w-0 rounded-app border border-[#2a3a50] bg-[#14243a] px-3 text-sm font-semibold text-white">
            <option>{'OCR GCSE CS -> Hardware -> CPU'}</option>
          </select>
        </div>
      </div>

      <Panel className="grid grid-cols-2 overflow-hidden sm:grid-cols-5">
        <Metric label="Students" value={classStudents.length} />
        <Metric label="Tests Assigned" value={state.assignments.length} />
        <Metric label="Tests Completed" value={completed} />
        <Metric label="Average Score" value={average === undefined ? '-' : `${average}%`} tone="green" />
        <Metric label="Suspicious Activity" value={flagged} tone="red" />
      </Panel>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Panel className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Recent Test Activity</h2>
            <NavLink className="text-sm font-semibold text-blue" to="/teacher/results">View all</NavLink>
          </div>
          <div className={nestedTableFrame}>
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead className={nestedTableHead}>
                <tr>
                  <th className="px-3 py-2">Test Name</th>
                  <th className="px-3 py-2">Assigned</th>
                  <th className="px-3 py-2">Completed</th>
                  <th className="px-3 py-2">Avg. Score</th>
                  <th className="px-3 py-2">Points</th>
                  <th className="px-3 py-2">Flagged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white text-ink">
                {state.tests.map((test) => {
                  const testAttempts = classAttempts.filter((attempt) => attempt.testId === test.id);
                  const testCompleted = completedAttemptCount(testAttempts);
                  const testAverage = averageAttemptPercentage(testAttempts);
                  const points = testAttempts.reduce((total, attempt) => total + (attempt.pointsAwarded ?? 0), 0);
                  const testFlagged = testAttempts.reduce((total, attempt) => total + attempt.suspiciousEventCount, 0);
                  return (
                    <tr key={test.id}>
                      <td className="px-3 py-3 font-semibold">{test.testTitle}</td>
                      <td className="px-3 py-3">{test.defaultMode === 'practice' ? 'Practice' : classRecord.className}</td>
                      <td className="px-3 py-3">{testCompleted}/{classStudents.length}</td>
                      <td className={`px-3 py-3 font-bold ${scoreTextClass(testAverage)}`}>{testAverage === undefined ? '-' : `${testAverage}%`}</td>
                      <td className="px-3 py-3">{points} pts</td>
                      <td className="px-3 py-3"><StatusBadge tone={testFlagged ? 'amber' : 'neutral'}>{testFlagged}</StatusBadge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Suspicious Activity</h2>
            <AlertTriangle className="text-amber" size={20} />
          </div>
          <div className="space-y-3">
            {state.students.filter((student) => student.accountStatus !== 'archived').slice(0, 3).map((student, index) => (
              <div className="rounded-app border border-line bg-white p-3 text-sm text-ink" key={student.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{leaderboardDisplay(student)}</p>
                    <p className="text-muted">{index === 0 ? 'Multiple tab switches' : index === 1 ? 'Copy/paste detected' : 'Focus loss excessive'}</p>
                    <p className="mt-1 text-xs text-muted">16 May, 10:12 AM</p>
                  </div>
                  <StatusBadge tone="red">{index + 1}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
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
                {state.leaderboardRows.map((row) => (
                  <tr key={row.studentId}>
                    <td className="px-3 py-3">{row.rank}</td>
                    <td className="px-3 py-3 font-semibold">{row.displayName}</td>
                    <td className="px-3 py-3">4/4</td>
                    <td className={`px-3 py-3 font-bold ${scoreTextClass(row.rank === 1 ? 84 : row.rank === 2 ? 78 : 72)}`}>{row.rank === 1 ? '84%' : row.rank === 2 ? '78%' : '72%'}</td>
                    <td className="px-3 py-3">{row.points} pts</td>
                    <td className="px-3 py-3">16 May, 10:12 AM</td>
                    <td className="px-3 py-3"><StatusBadge tone={row.rank <= 3 ? 'green' : 'amber'}>{row.rank <= 3 ? 'On Track' : 'Needs Support'}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-4">
          <h2 className="mb-3 font-bold">Class Summary</h2>
          <SummaryRow label="Total Students" value={classStudents.length.toString()} />
          <SummaryRow label="Active This Week" value="25 (89%)" />
          <SummaryRow label="Tests Assigned" value={state.assignments.length.toString()} />
          <SummaryRow label="Tests Completed" value={`${completed} (${Math.round((completed / Math.max(classStudents.length, 1)) * 100)}%)`} />
          <SummaryRow label="Average Score" value={average === undefined ? '-' : `${average}%`} />
        </Panel>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#2a3a50] py-3 text-sm last:border-b-0">
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
  if (!isApplicable) return { className: 'text-muted', label: 'N.a.' };
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
        <div className="mb-3 border-b border-[#2a3a50] pb-3">
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
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredClasses.map((classRecord) => {
          const isEditing = editingClassId === classRecord.id;
          const activeStudentCount = state.students.filter((student) => studentHasClass(student, classRecord.id) && student.accountStatus !== 'archived').length;
          return (
            <Panel className="p-4" key={classRecord.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold">{classRecord.className}</h2>
                  <p className={`text-sm ${darkSubtleText}`}>
                    {classRecord.isSystem ? 'Protected holding class' : `${classRecord.academicYear || 'No academic year'} - Year ${classRecord.yearGroup || '-'}`}
                  </p>
                  {!isEditing && !classRecord.isSystem ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button className="min-h-9 px-3" type="button" variant="outlineDark" onClick={() => startEditing(classRecord)}>
                        <Pencil size={15} aria-hidden="true" />
                        Edit details
                      </Button>
                      {classRecord.status === 'active' ? (
                        <Button
                          className="min-h-9 px-3"
                          disabled={isSaving}
                          type="button"
                          variant="dangerOutline"
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
                  <p className={`text-xs font-semibold uppercase tracking-normal ${darkSubtleText}`}>Status</p>
                  <StatusBadge tone={classRecord.status === 'active' ? 'green' : 'neutral'}>{classRecord.status}</StatusBadge>
                  {classRecord.isSystem ? <StatusBadge tone="blue">System</StatusBadge> : null}
                </div>
              </div>
              <p className="mt-4 text-sm">{activeStudentCount} active students</p>

              {!classRecord.isSystem && classRecord.status === 'active' ? (
                <div className="mt-4 rounded-app border border-[#2a3a50] bg-[#0f1d2e] p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-normal text-[#b8c8d9]">Join code</p>
                      <p className="mt-1 text-2xl font-bold tracking-normal">{classRecord.joinCode || 'No code'}</p>
                      <p className="mt-1 text-sm text-[#b8c8d9]">
                        Students can join with this code when accepting students is switched on in Edit details.
                      </p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-normal text-[#b8c8d9]">Joining</p>
                      <StatusBadge tone={classRecord.acceptingStudents ? 'green' : 'neutral'}>
                        {classRecord.acceptingStudents ? 'Accepting students' : 'Not accepting'}
                      </StatusBadge>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-[#2a3a50] pt-3">
                    <p className="text-xs font-semibold uppercase tracking-normal text-[#b8c8d9]">Code actions</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button
                        className="min-h-9 px-2"
                        disabled={!classRecord.joinCode}
                        type="button"
                        variant="utilityDark"
                        onClick={() => copyText(classRecord.joinCode, `${classRecord.className} code copied.`)}
                      >
                        <Copy size={16} aria-hidden="true" />
                        Copy code
                      </Button>
                      <Button
                        className="min-h-9 px-2"
                        disabled={!classRecord.joinCode}
                        type="button"
                        variant="utilityDark"
                        onClick={() => copyText(joinLinkForCode(classRecord.joinCode), `${classRecord.className} join link copied.`)}
                      >
                        <Link2 size={16} aria-hidden="true" />
                        Copy link
                      </Button>
                      <Button
                        className="min-h-9 px-3"
                        disabled={isSaving}
                        type="button"
                        variant="outlineDark"
                        onClick={() => regenerateClassCode(classRecord)}
                      >
                        <RefreshCw size={16} aria-hidden="true" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
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
                <form className="mt-4 space-y-4 rounded-app border border-line bg-white p-3 text-ink" onSubmit={saveClass}>
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
    classIds: [] as string[],
    accountStatus: 'active' as StudentProfile['accountStatus'],
  });
  const [manualPassword, setManualPassword] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!filteredStudents.length) {
      setSelectedStudentId('');
      return;
    }
    if (!selectedStudentId || !filteredStudents.some((student) => student.id === selectedStudentId)) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [filteredStudents, selectedStudentId]);

  useEffect(() => {
    if (!selectedStudent) return;
    setDraft({
      firstName: selectedStudent.firstName,
      surname: selectedStudent.surname,
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

  const selectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
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
        classIds: draft.classIds,
        accountStatus: draft.accountStatus,
      });
      setMessage(`${updatedStudent.firstName} ${updatedStudent.surname} updated.`);
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
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel className="p-4">
          <div className="mb-4 grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <div className="space-y-2">
              <label className="block space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Class</span>
                <select
                  aria-label="Filter students by class"
                  className={lightControlClass}
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
                  className={`${lightControlClass} pl-9`}
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
                <col className="w-[28%]" />
                <col className="w-[20%]" />
                <col className="w-[13%]" />
                <col className="w-[25%]" />
                <col className="w-[14%]" />
              </colgroup>
              <thead className={nestedTableHead}>
                <tr>
                  <th className="px-3 py-3">Full name</th>
                  <th className="px-2 py-3">Username</th>
                  <th className="px-2 py-3">ID</th>
                  <th className="px-2 py-3">Class</th>
                  <th className="px-2 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white text-ink">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudent?.id === student.id;
                  return (
                    <tr
                      aria-selected={isSelected}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? 'border-l-4 border-blue bg-[#223653] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                          : 'border-l-4 border-transparent hover:bg-mist'
                      }`}
                      key={student.id}
                      onClick={() => selectStudent(student.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') selectStudent(student.id);
                      }}
                      role="button"
                      tabIndex={0}
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
                                  isSelected ? 'border-[#5f7898] bg-[#172943] text-white' : 'border-line bg-mist text-muted'
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
                      <td className="px-2 py-3"><StatusBadge tone={accountStatusTone(student.accountStatus)}>{student.accountStatus}</StatusBadge></td>
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

        <Panel className="p-4">
          {selectedStudent ? (
            <form className="space-y-4" onSubmit={saveStudent}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-[#b8c8d9]">Selected student</p>
                <h2 className="mt-1 text-xl font-bold">{selectedStudent.firstName} {selectedStudent.surname}</h2>
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
                  <fieldset className="space-y-2 text-sm font-semibold">
                    <legend>Classes</legend>
                    <div className="space-y-2 rounded-app border border-line bg-mist p-3">
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
                  </fieldset>
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
          ) : (
            <div className="rounded-app border border-line bg-white p-4 text-ink">
              <p className="font-bold">Select a student</p>
            </div>
          )}
        </Panel>
      </div>
    </TeacherPage>
  );
}

function TestsPage() {
  const state = useAppState();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
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
  };

  return (
    <TeacherPage title="Courses">
      <p className="text-sm text-muted">Browse courses, then choose a unit, topic and test resource.</p>

      {!selectedSubject ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {state.subjects.map((subject) => {
            const testCount = countTestsForSubject(subject.id);
            const unitCount = state.units.filter((unit) => unit.subjectId === subject.id).length;
            const topicCount = countTopicsForSubject(subject.id);
            return (
              <button
                className="group relative overflow-hidden rounded-app border border-[#2a3a50] bg-[#14243a] p-5 text-left text-white shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-blue hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:col-span-2 lg:p-7"
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-gradient-to-l from-[#1d3554] to-transparent lg:block" aria-hidden="true" />
                <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-xl border border-[#315071] bg-[#17304d] text-[#73b6ff]">
                        <BookOpenCheck size={23} aria-hidden="true" />
                      </span>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8c8d9]">Course library</p>
                    </div>
                    <h2 className="mt-5 text-2xl font-bold tracking-tight lg:text-3xl">{subject.subjectName}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#c7d6e5] lg:text-base">{subject.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:max-w-md lg:min-w-[22rem]">
                    {[
                      [unitCount, 'Units'],
                      [topicCount, 'Topics'],
                      [testCount, 'Tests'],
                    ].map(([value, label]) => (
                      <div className="rounded-xl border border-[#315071] bg-[#10233a]/80 px-3 py-3" key={label as string}>
                        <span className="block text-xl font-bold text-white">{value}</span>
                        <span className="mt-0.5 block text-xs font-semibold text-[#b8c8d9]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative mt-6 flex items-center gap-2 text-sm font-bold text-[#73b6ff]">
                  <span>Explore course</span>
                  <ChevronRight className="transition-transform duration-200 group-hover:translate-x-1" size={19} aria-hidden="true" />
                </div>
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
          <div className="grid gap-4 lg:grid-cols-2">
            {subjectUnits.map((unit) => {
              const topicCount = state.topics.filter((topic) => topic.unitId === unit.id).length;
              const testCount = countTestsForUnit(unit.id);

              return (
                <button
                  className="group relative overflow-hidden rounded-app border border-[#2a3a50] bg-[#14243a] p-5 text-left text-white shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-blue hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:p-6"
                  key={unit.id}
                  onClick={() => setSelectedUnitId(unit.id)}
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-blue transition-all duration-200 group-hover:w-1.5" aria-hidden="true" />
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a9c1d8]">Unit</p>
                      <h2 className="mt-3 text-lg font-bold tracking-tight lg:text-xl">{unit.unitName}</h2>
                    </div>
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#315071] bg-[#17304d] text-[#73b6ff] transition-colors group-hover:bg-[#1d3d60]" aria-hidden="true">
                      <ChevronRight size={20} />
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#2a3a50] pt-4">
                    <div>
                      <span className="block text-lg font-bold">{topicCount}</span>
                      <span className="text-xs font-semibold text-[#b8c8d9]">Topics</span>
                    </div>
                    <div>
                      <span className="block text-lg font-bold">{testCount}</span>
                      <span className="text-xs font-semibold text-[#b8c8d9]">Test resources</span>
                    </div>
                  </div>
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
              <button className="text-blue transition hover:text-ink" onClick={resetToCourses}>All courses</button>
              <span className="text-muted" aria-hidden="true">/</span>
              <button className="text-blue transition hover:text-ink" onClick={() => setSelectedUnitId(null)}>Units</button>
            </div>
            <h2 className="mt-2 font-bold">Topics in {selectedUnit.unitName}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {unitTopics.map((topic) => {
              const topicTests = testResources.filter((test) => test.topicId === topic.id);
              return (
                <Panel className="p-4 lg:p-5" key={topic.id}>
                  <p className="text-xs font-semibold text-[#b8c8d9]">Topic</p>
                  <h2 className="mt-2 font-bold">{topic.topicName}</h2>

                  <div className="mt-4 space-y-3">
                    {topicTests.length ? (
                      topicTests.map((test, testIndex) => {
                        const questionCount = test.version ? state.questions.filter((question) => question.testVersionId === test.version?.id).length : 0;
                        return (
                          <div className="rounded-app border border-line bg-white p-3 text-ink" key={test.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-bold">Test {testIndex + 1}</h3>
                                <p className="mt-1 text-xs text-muted">{test.testDescription}</p>
                              </div>
                              <StatusBadge tone={test.status === 'published' ? 'green' : test.status === 'draft' ? 'amber' : 'neutral'}>
                                {test.status === 'published' ? 'Published' : test.status === 'draft' ? 'Draft' : 'Archived'}
                              </StatusBadge>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted">
                              <span>{test.version ? `Version ${test.version.versionNumber}` : 'No version'}</span>
                              <span aria-hidden="true">•</span>
                              <span>{questionCount} questions</span>
                              <span aria-hidden="true">•</span>
                              <span>{Math.round(test.defaultTimeLimitSeconds / 60)} min</span>
                            </div>
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
    </TeacherPage>
  );
}

type AssignmentTab = 'create' | 'active' | 'expired';

function dueDateInputToIso(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(`${value}T23:59:00`).toISOString();
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
  const dueDateInputRef = useRef<HTMLInputElement>(null);
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const firstClassId = activeClasses[0]?.id ?? '';
    const firstSubjectId = state.subjects[0]?.id ?? '';
    if ((!createClassId && firstClassId) || (createClassId && !activeClasses.some((classRecord) => classRecord.id === createClassId))) {
      setCreateClassId(firstClassId);
    }
    if ((!createSubjectId && firstSubjectId) || (createSubjectId && !state.subjects.some((subject) => subject.id === createSubjectId))) {
      setCreateSubjectId(firstSubjectId);
      setSelectedVersionIds([]);
    }
  }, [activeClasses, createClassId, createSubjectId, state.subjects]);

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

  useEffect(() => {
    if (assignmentClassId !== allResultsFilterValue && !activeClasses.some((classRecord) => classRecord.id === assignmentClassId)) {
      setAssignmentClassId(allResultsFilterValue);
    }
    if (assignmentSubjectId !== allResultsFilterValue && !state.subjects.some((subject) => subject.id === assignmentSubjectId)) {
      setAssignmentSubjectId(allResultsFilterValue);
      setAssignmentUnitId(allResultsFilterValue);
      setAssignmentTopicId(allResultsFilterValue);
    }
  }, [activeClasses, assignmentClassId, assignmentSubjectId, state.subjects]);

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
        dueAt: dueDateInputToIso(dueDateInputRef.current?.value ?? ''),
      });
      setSelectedVersionIds([]);
      setAssignmentClassId(createClassId);
      setAssignmentSubjectId(createSubjectId);
      setAssignmentUnitId(allResultsFilterValue);
      setAssignmentTopicId(allResultsFilterValue);
      setActiveTab('active');
      setMessage(`${created.length} assignment${created.length === 1 ? '' : 's'} created for ${selectedClass?.className ?? 'class'}.`);
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
            topicName: topic.topicName,
            dueSortTime: assignment.dueAt ? assignmentSortTime(assignment.dueAt) : Number.POSITIVE_INFINITY,
            createdSortTime: assignmentSortTime(assignment.startAt),
            isExpired: Boolean(assignment.dueAt && assignmentSortTime(assignment.dueAt) < currentTime),
          },
        ];
      })
      .sort((first, second) => {
        if (first.dueSortTime !== second.dueSortTime) return first.dueSortTime - second.dueSortTime;
        if (first.createdSortTime !== second.createdSortTime) return second.createdSortTime - first.createdSortTime;
        return resultNaturalSort.compare(first.topicName, second.topicName);
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
  ]);
  const activeAssignmentRows = assignmentRows.filter((row) => !row.isExpired);
  const expiredAssignmentRows = assignmentRows.filter((row) => row.isExpired);
  const visibleAssignmentRows = activeTab === 'expired' ? expiredAssignmentRows : activeAssignmentRows;

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
              activeTab === id ? 'bg-[#14243a] text-white' : 'text-muted hover:bg-mist hover:text-ink'
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
            <div className="mb-3 border-b border-[#2a3a50] pb-3">
              <p className="text-xs font-semibold uppercase tracking-normal text-[#b8c8d9]">Assignment details</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Class</span>
                <select
                  className={lightControlClass}
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
                  className={lightControlClass}
                  value={createSubjectId}
                  onChange={(event) => {
                    setCreateSubjectId(event.target.value);
                    setSelectedVersionIds([]);
                    setMessage('');
                    setError('');
                  }}
                >
                  {state.subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span className={darkSubtleText}>Due date</span>
                <input
                  className={lightControlClass}
                  ref={dueDateInputRef}
                  type="date"
                />
              </label>
            </div>
          </Panel>

          <div className="flex flex-col gap-3 rounded-app border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">{selectedVersionIds.length} tests selected</p>
              <p className="text-sm text-muted">Each selected test creates one assignment for {selectedClass?.className ?? 'the selected class'}.</p>
            </div>
            <Button disabled={!createClassId || !selectedVersionIds.length || isSaving} onClick={createAssignments}>
              {isSaving ? 'Creating...' : 'Create assignments'}
            </Button>
          </div>

          <div className="space-y-4">
            {createUnits.map((unit) => {
              const unitTopics = state.topics.filter((topic) => topic.unitId === unit.id);
              return (
                <Panel className="p-4" key={unit.id}>
                  <h2 className="font-bold">{unit.unitName}</h2>
                  <div className="mt-4 space-y-3">
                    {unitTopics.map((topic) => {
                      const topicTests = publishedTests.filter((test) => test.topicId === topic.id);
                      const topicVersionIds = topicTests.map((test) => test.version.id);
                      const selectedTopicTestCount = topicVersionIds.filter((versionId) => selectedVersions.has(versionId)).length;
                      const allTopicTestsSelected = Boolean(topicVersionIds.length && selectedTopicTestCount === topicVersionIds.length);
                      return (
                        <div className="rounded-app border border-line bg-white p-3 text-ink" key={topic.id}>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold text-muted">Topic</p>
                              <h3 className="mt-1 font-bold">{topic.topicName}</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge tone={topicTests.length ? 'blue' : 'neutral'}>
                                {topicTests.length ? `${topicTests.length} test${topicTests.length === 1 ? '' : 's'}` : 'No tests'}
                              </StatusBadge>
                              {topicTests.length ? (
                                <>
                                  <span className="text-xs font-semibold text-muted">
                                    {selectedTopicTestCount}/{topicTests.length} selected
                                  </span>
                                  <Button
                                    className="min-h-9 px-3"
                                    type="button"
                                    variant="outlineLight"
                                    onClick={() => toggleTopicVersions(topicVersionIds)}
                                  >
                                    {allTopicTestsSelected ? <SquareMinus size={16} aria-hidden="true" /> : <SquareCheck size={16} aria-hidden="true" />}
                                    {allTopicTestsSelected ? 'Clear topic' : 'Select all'}
                                  </Button>
                                </>
                              ) : null}
                            </div>
                          </div>
                          <div className="mt-3 space-y-2">
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
                                    <span className="block text-sm font-bold">{test.testTitle}</span>
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
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>
      ) : null}

      {activeTab === 'active' || activeTab === 'expired' ? (
        <div className="space-y-5">
          <Panel className="p-4">
            <div className="mb-3 border-b border-[#2a3a50] pb-3">
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
                  {state.subjects.map((subject) => (
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
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className={nestedTableHead}>
                  <tr>
                    <th className="px-3 py-3">Date created</th>
                    <th className="px-3 py-3">Class</th>
                    <th className="px-3 py-3">Topic</th>
                    <th className="px-3 py-3">Assignment deadline</th>
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
                        <td className="px-3 py-3">{row.topicName}</td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {row.assignment.dueAt ? formatDate(row.assignment.dueAt) : 'No deadline'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-6 text-center text-muted" colSpan={4}>
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
    </TeacherPage>
  );
}

function ResultsPage() {
  const state = useAppState();
  const activeClasses = useMemo(() => state.classes.filter((classRecord) => classRecord.status === 'active' && !classRecord.isSystem), [state.classes]);
  const [selectedClassId, setSelectedClassId] = useState(() => state.classes.find((classRecord) => classRecord.status === 'active' && !classRecord.isSystem)?.id ?? allResultsFilterValue);
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => state.subjects[0]?.id ?? allResultsFilterValue);
  const [selectedUnitId, setSelectedUnitId] = useState(allResultsFilterValue);
  const [selectedTopicId, setSelectedTopicId] = useState(allResultsFilterValue);

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

    if (selectedSubjectId !== allResultsFilterValue && !state.subjects.some((subject) => subject.id === selectedSubjectId)) {
      setSelectedSubjectId(state.subjects[0]?.id ?? allResultsFilterValue);
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
  }, [activeClasses, selectedClassId, selectedSubjectId, selectedTopicId, selectedUnitId, state.subjects, topicOptions, unitOptions]);

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

  const currentRosterIds = useMemo(
    () =>
      new Set(
        state.students
          .filter((student) => student.accountStatus !== 'archived')
          .filter((student) => selectedClassId === allResultsFilterValue || studentHasClass(student, selectedClassId))
          .map((student) => student.id),
      ),
    [selectedClassId, state.students],
  );

  const resultRows = useMemo(() => {
    const attemptsByCell = new Map<string, TestAttempt[]>();
    resultAttempts.forEach((attempt) => {
      const key = `${attempt.testId}:${attempt.studentId}`;
      attemptsByCell.set(key, [...(attemptsByCell.get(key) ?? []), attempt]);
    });

    return filteredTests.map((test) => {
      const cells = studentColumns.map((student) => {
        const attempt = preferredResultAttempt(attemptsByCell.get(`${test.id}:${student.id}`) ?? []);
        const isApplicable = selectedClassId === allResultsFilterValue || currentRosterIds.has(student.id) || Boolean(attempt);
        const label = resultAttemptLabel(attempt, isApplicable);
        return { attempt, ...label, student };
      });
      const scores = cells
        .map((cell) => cell.attempt?.percentage)
        .filter((score): score is number => typeof score === 'number');
      const average = scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : undefined;
      return {
        average,
        cells,
        test,
      };
    });
  }, [currentRosterIds, filteredTests, resultAttempts, selectedClassId, studentColumns]);

  const tableMinWidth = `${Math.max(760, 265 + studentColumns.length * 115)}px`;

  return (
    <TeacherPage title="Results" titleVisibility="sr-only">
      <Panel className="p-4">
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="font-bold">Result filters</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(150px,0.8fr)_minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(260px,1.4fr)]">
          <label className="space-y-2 text-sm font-semibold">
            <span className={darkSubtleText}>Class</span>
            <select
              className={lightControlClass}
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
          <label className="space-y-2 text-sm font-semibold">
            <span className={darkSubtleText}>Course</span>
            <select
              className={lightControlClass}
              value={selectedSubjectId}
              onChange={(event) => {
                setSelectedSubjectId(event.target.value);
                setSelectedUnitId(allResultsFilterValue);
                setSelectedTopicId(allResultsFilterValue);
              }}
            >
              <option value={allResultsFilterValue}>All courses</option>
              {state.subjects.map((subject) => (
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
          <label className="space-y-2 text-sm font-semibold">
            <span className={darkSubtleText}>Topic</span>
            <select
              className={lightControlClass}
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
        </div>
      </Panel>

      <Panel className="p-4">
        <div className={nestedTableFrame}>
          <table className="w-full border-collapse text-left text-sm" style={{ minWidth: tableMinWidth }}>
            <thead className={`${nestedTableHead} text-ink`}>
              <tr>
                <th className="w-[180px] border border-line px-3 py-3">Test</th>
                <th className="w-[85px] border border-line px-3 py-3">Class avg</th>
                {studentColumns.map((student) => (
                  <th className="w-[115px] border border-line px-3 py-3" key={student.id}>
                    <span className="block truncate">{studentFullName(student)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-ink">
              {resultRows.length ? (
                resultRows.map((row) => (
                  <tr key={row.test.id}>
                    <th
                      className="border border-line px-3 py-3 text-left align-top font-semibold"
                      scope="row"
                    >
                      <span className="block">{row.test.testTitle}</span>
                    </th>
                    <td className={`border border-line px-3 py-3 align-top font-bold ${scoreTextClass(row.average)}`}>
                      {typeof row.average === 'number' ? `${row.average}%` : '-'}
                    </td>
                    {row.cells.map((cell) => (
                      <td className={`border border-line px-3 py-3 align-top font-bold ${cell.className}`} key={`${row.test.id}-${cell.student.id}`}>
                        {cell.label}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border border-line px-3 py-6 text-center text-sm font-semibold text-muted" colSpan={Math.max(2, studentColumns.length + 2)}>
                    No published tests match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </TeacherPage>
  );
}

function LeaderboardsPage() {
  const state = useAppState();
  const activeClass = state.classes.find((classRecord) => classRecord.status === 'active' && !classRecord.isSystem);
  return (
    <TeacherPage title="Leaderboards">
      <Panel className="overflow-hidden p-0">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#2a3a50] px-5 py-5 lg:px-6">
          <div className="flex items-start gap-3">
            <span className="grid size-11 place-items-center rounded-xl border border-[#315071] bg-[#17304d] text-[#e6bc5c]">
              <Trophy size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b8c8d9]">Class leaderboard</p>
              <h2 className="mt-1 text-xl font-bold text-white">{activeClass?.className ?? 'Current class'}</h2>
              <p className={`mt-1 text-sm ${darkSubtleText}`}>Current standings based on points earned.</p>
            </div>
          </div>
          <span className="pt-2 text-sm font-semibold text-[#b8c8d9]">{state.leaderboardRows.length} students</span>
        </div>
        <div className="space-y-2 p-4 lg:p-5">
          {state.leaderboardRows.map((row) => (
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
        </div>
      </Panel>
    </TeacherPage>
  );
}

function SettingsPage() {
  return (
    <TeacherPage title="Settings">
      <Panel className="p-4">
        <p className={`text-sm ${darkSubtleText}`}>No teacher settings are available yet.</p>
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
