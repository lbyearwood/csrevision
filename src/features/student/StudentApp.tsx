import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  ChevronRight,
  Clock3,
  Home,
  ListChecks,
  LogOut,
  Code2,
  Trophy,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../../app/AppState';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { leaderboardDisplay } from '../../lib/identity';
import { formatDate, formatDuration } from '../../lib/time';
import { AntiCheatLayer } from '../tests/AntiCheatLayer';

const navItems = [
  { to: '/student', label: 'Home', icon: Home },
  { to: '/student/practice', label: 'Practice', icon: BookOpenCheck },
  { to: '/student/assigned', label: 'Assigned', icon: ListChecks },
  { to: '/student/results', label: 'Results', icon: BarChart3 },
  { to: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function StudentApp() {
  const { currentStudent, dataError, isLoadingData, isSupabaseBacked, signOut } = useAppState();

  if (isSupabaseBacked && (isLoadingData || dataError)) {
    return (
      <main className="min-h-screen bg-mist px-4 py-8 text-ink">
        <Panel className="mx-auto max-w-md p-5">
          <p className="font-bold">{dataError ? 'Local Supabase issue' : 'Loading local Supabase data'}</p>
          <p className="mt-2 text-sm text-muted">
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
    <main className="min-h-screen bg-mist text-ink">
      <div className="mx-auto min-h-screen max-w-[430px] bg-mist shadow-panel md:my-6 md:min-h-[860px] md:rounded-[28px] md:border md:border-line lg:mx-0 lg:my-0 lg:grid lg:min-h-screen lg:w-full lg:max-w-none lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6 lg:border-0 lg:bg-transparent lg:p-6 lg:shadow-none">
        <aside className="hidden rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-white shadow-panel lg:flex lg:flex-col">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-app bg-teal text-white">
              <Code2 size={23} strokeWidth={2.4} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold">csrevision</p>
              <p className="text-xs font-semibold text-[#a9bbcf]">Student portal</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                end={item.to === '/student'}
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-app px-3 py-3 text-sm font-semibold ${isActive ? 'bg-white text-[#0f1d2e]' : 'text-[#a9bbcf] hover:bg-[#20344f] hover:text-white'}`
                }
              >
                <item.icon size={20} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 border-t border-[#2a3a50] pt-3">
            <NavLink to="/student/profile" className={({ isActive }) => `flex items-center gap-3 rounded-app px-3 py-3 ${isActive ? 'bg-white text-[#0f1d2e]' : 'text-[#dceeff] hover:bg-[#20344f]'}`}>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-teal text-sm font-bold text-white">{currentStudent.firstName[0]}</div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{leaderboardDisplay(currentStudent).split(' - ')[0]}</p><p className="text-xs text-[#a9bbcf]">View profile</p></div>
              <UserRound size={18} aria-hidden="true" />
            </NavLink>
            <button className="mt-2 flex w-full items-center gap-3 rounded-app px-3 py-3 text-sm font-semibold text-[#a9bbcf] hover:bg-[#20344f] hover:text-white" onClick={signOut}>
              <LogOut size={18} aria-hidden="true" /> Sign out
            </button>
          </div>
        </aside>

        <section className="min-w-0 lg:self-start">
          <header className="flex items-center justify-between border-b border-[#2a3a50] bg-[#14243a] px-4 py-4 text-white lg:hidden">
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-app bg-teal"><Code2 size={21} strokeWidth={2.4} aria-hidden="true" /></div><p className="font-bold">csrevision</p></div>
            <NavLink className="grid h-10 w-10 place-items-center rounded-full border border-[#3a4e68] bg-[#0f1d2e]" to="/student/profile" title="Profile"><UserRound size={18} aria-hidden="true" /></NavLink>
          </header>
          <div className="pb-24 lg:pb-0">
          <Routes>
            <Route index element={<StudentHome />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="assigned" element={<AssignedPage />} />
            <Route path="test/:attemptId" element={<ActiveTestPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="leaderboard" element={<StudentLeaderboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
          </div>
        </section>

        <nav className="fixed bottom-0 left-1/2 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-6 border-t border-[#2a3a50] bg-[#14243a] px-2 py-2 md:bottom-6 md:rounded-b-[28px] lg:hidden">
          {navItems.map((item) => (
            <NavLink
              end={item.to === '/student'}
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 rounded-app text-[10px] font-semibold ${isActive ? 'text-white' : 'text-[#a9bbcf]'}`
              }
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </main>
  );
}

function StudentHome() {
  const state = useAppState();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState('');
  const assigned = currentStudentAssignments(state)[0];
  const assignedVersion = state.testVersions.find((version) => version.id === assigned?.testVersionId);
  const assignedTest = state.tests.find((test) => test.id === assignedVersion?.testId);
  const assignedAttempt = findExistingAssignedAttempt(state, assigned?.id);
  const assignedDisplay = getStudentTestDisplay(state, assignedTest?.id);
  const assignedQuestionCount = Math.max(
    state.questions.filter((question) => question.testVersionId === assignedVersion?.id).length,
    assignedVersion?.totalMarks ?? 0,
  );
  const recentAttempts = state.attempts.filter((attempt) => attempt.studentId === state.currentStudent.id);
  const courseResults = state.subjects[0] ? buildCourseResults(state, state.subjects[0].id) : null;
  const currentLeaderboardRow = state.leaderboardRows.find((row) => row.studentId === state.currentStudent.id);
  const classRank = currentLeaderboardRow?.rank ?? '-';
  const classPoints = currentLeaderboardRow?.points ?? state.pointsTotal;
  const leadingPoints = state.leaderboardRows[0]?.points ?? classPoints;
  const pointsToFirst = Math.max(leadingPoints - classPoints + 1, 0);
  const studentBehind = currentLeaderboardRow ? state.leaderboardRows.find((row) => row.rank === currentLeaderboardRow.rank + 1) : undefined;
  const leadOverStudentBehind = studentBehind ? Math.max(classPoints - studentBehind.points, 0) : 0;
  const learningGapTopics = courseResults?.units
    .flatMap((unit) => unit.topics)
    .filter((topic) => typeof topic.latestScore === 'number' && topic.latestScore < 80)
    .sort((a, b) => (a.latestScore ?? 100) - (b.latestScore ?? 100))
    .slice(0, 3) ?? [];
  const completedTopicCount = courseResults?.triedCount ?? 0;
  const totalTopicCount = courseResults?.totalTopics ?? 0;
  const completionPercentage = totalTopicCount ? Math.round((completedTopicCount / totalTopicCount) * 100) : 0;
  const remainingTopicCount = Math.max(totalTopicCount - completedTopicCount, 0);
  const scoredTopics = courseResults?.units.flatMap((unit) => unit.topics).filter((topic) => topic.latestScore !== undefined) ?? [];
  const strongestTopic = [...scoredTopics].sort((a, b) => (b.latestScore ?? 0) - (a.latestScore ?? 0))[0];
  const topicScoreChart = [...scoredTopics].sort((a, b) => (a.latestScore ?? 0) - (b.latestScore ?? 0)).slice(0, 5);

  return (
    <div className="space-y-5 px-4 py-5 lg:px-0 lg:py-0">
      <section className="rounded-app border border-line bg-white px-5 py-5 shadow-panel lg:px-7 lg:py-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)] lg:items-center">
          <div>
            <p className="text-xl font-bold tracking-tight text-ink lg:text-2xl">Hello, {state.currentStudent.firstName}!</p>
            <p className="mt-1 max-w-xl text-sm text-muted">Keep up the momentum — small steps lead to big results.</p>
            <p className="mt-4 text-sm font-semibold text-[#4c6786]">Course progress: {completedTopicCount} of {totalTopicCount} topics practised</p>
          </div>
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1fr)] items-center gap-4 overflow-hidden rounded-xl border border-[#80c8ff] bg-gradient-to-br from-[#13336b] via-[#2e62ce] to-[#7041b3] px-5 py-4 text-white shadow-[0_12px_28px_rgba(45,95,205,0.28)]">
            <span className="pointer-events-none absolute -right-2 -top-3 text-5xl opacity-30" aria-hidden="true">✨</span><span className="pointer-events-none absolute -bottom-3 right-28 text-4xl opacity-25" aria-hidden="true">⭐</span>
            <span className="grid size-12 place-items-center rounded-2xl bg-white/15 text-[#ffe37b] shadow-inner"><Trophy size={31} aria-hidden="true" /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#dceeff]">Class challenge 🏆</p><p className="mt-1 text-3xl font-bold text-[#ffe37b]">{classPoints.toLocaleString()}</p><p className="text-xs font-semibold text-[#dceeff]">points earned</p></div>
            <div className="border-l border-white/25 pl-4"><p className="text-xs font-semibold text-[#dceeff]">Your rank</p><p className="mt-1 text-3xl font-bold">#{classRank}</p></div>
            <div className="border-l border-white/25 pl-4 text-xs font-semibold text-white"><p>{pointsToFirst ? `🚀 ${pointsToFirst} points to rank #1` : '🏆 You are leading the class'}</p>{studentBehind ? <p className="mt-2 text-[#dceeff]">{studentBehind.displayName.split(' - ')[0]} is {leadOverStudentBehind} points behind you.</p> : null}</div>
          </div>
        </div>
      </section>
      <Panel className="border border-[#f0c36c] bg-[#fffaf0] p-4 lg:p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9a6500]">Learning gaps 🎯</p>
            <h2 className="mt-1 text-xl font-bold text-ink">Strengthen your weaker topics</h2>
            <p className="mt-1 text-sm text-muted">Practise these areas to build secure understanding before moving on.</p>
          </div>
          <Button variant="primary" className="min-h-9 shrink-0 px-3" onClick={() => navigate('/student/practice')}>Practise now<ChevronRight size={17} aria-hidden="true" /></Button>
        </div>
        {learningGapTopics.length ? <div className="mt-4 space-y-2">{learningGapTopics.map((topic) => <div className="flex items-center justify-between gap-3 rounded-xl border border-[#f0d59e] bg-white p-3 text-sm text-ink" key={topic.id}><span className="font-bold">{topic.topicName}</span><span className="shrink-0 font-bold text-amber">{topic.latestScore}%</span></div>)}</div> : <p className="mt-4 rounded-xl border border-[#d8eadf] bg-white p-3 text-sm font-medium text-[#237748]">You have no current learning gaps. Keep practising to stay confident.</p>}
      </Panel>
      <div className="space-y-5">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Your next step ✨</p><h2 className="mt-1 text-lg font-bold">Next assignment</h2></div>
          <NavLink className="text-sm font-semibold text-blue" to="/student/assigned">View all</NavLink>
        </div>
        {assigned && assignedTest ? (
          <button
            className="w-full rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-left text-white shadow-panel lg:p-5"
            onClick={async () => {
              try {
                setActionError('');
                if (assignedAttempt && assignedAttempt.status !== 'in_progress') {
                  setActionError('This assigned assessment has already been completed.');
                  return;
                }
                const attempt = await state.beginAttempt({ testId: assignedTest.id, assignmentId: assigned.id });
                navigate(`/student/test/${attempt.id}`);
              } catch {
                setActionError('We could not open this assignment just now. Please try again.');
              }
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{assignedDisplay.title}</p>
                {assignedDisplay.context ? <p className="mt-1 text-xs font-semibold text-[#b8c8d9]">{assignedDisplay.context}</p> : null}
                <p className="mt-2 text-sm text-[#b8c8d9]">{assignedQuestionCount} questions · {assignedVersion?.totalMarks ?? assignedQuestionCount} marks</p>
                <p className="mt-3 text-sm font-semibold">{assigned.dueAt ? `Due ${formatDate(assigned.dueAt)}` : 'Ready when you are'}</p>
              </div>
              <StatusBadge tone={assignedAttempt ? 'blue' : 'amber'}>{assignedAttempt?.status === 'in_progress' ? 'Started' : assignedAttempt ? 'Completed' : 'Not Started'}</StatusBadge>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#2a3a50] pt-3 text-sm font-bold text-[#dceeff]"><span>{assignedAttempt?.status === 'in_progress' ? 'Continue where you left off' : assignedAttempt ? 'Review your completed work' : 'Start this assignment'}</span><ChevronRight size={18} aria-hidden="true" /></div>
          </button>
        ) : <Panel tone="light" className="border-dashed p-4"><p className="font-bold text-ink">Nothing assigned right now</p><p className="mt-1 text-sm text-muted">Choose a topic to keep your learning moving.</p><Button className="mt-3 min-h-9 px-3" variant="secondary" onClick={() => navigate('/student/practice')}>Choose a topic<ChevronRight size={17} aria-hidden="true" /></Button></Panel>}
        {actionError ? <p className="mt-3 rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{actionError}</p> : null}
      </section>

      <section>
        <div className="mb-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Keep learning</p><h2 className="mt-1 text-lg font-bold">Choose what to do next</h2></div>
        <div className="space-y-3">
          <button className="flex w-full items-center gap-4 rounded-app border border-[#cfe0f2] bg-[#edf5ff] p-4 text-left text-ink shadow-panel transition hover:border-blue hover:shadow-none" onClick={() => navigate('/student/practice')}>
            <BookOpenCheck className="shrink-0 text-blue" size={24} />
            <div className="min-w-0 flex-1"><p className="text-sm font-bold">Practise a topic</p><p className="text-xs text-muted">Choose a skill to strengthen and take a practice test.</p><p className="mt-2 text-xs font-bold text-blue">Choose a topic</p></div><ChevronRight className="text-[#4c6786]" size={18} aria-hidden="true" />
          </button>
          <button className="flex w-full items-center gap-4 rounded-app border border-[#cfe7df] bg-[#effaf5] p-4 text-left text-ink shadow-panel transition hover:border-teal hover:shadow-none" onClick={() => navigate('/student/results')}>
            <Clock3 className="shrink-0 text-teal" size={24} />
            <div className="min-w-0 flex-1"><p className="text-sm font-bold">Review completed tests</p><p className="text-xs text-muted">See your answers, scores, and what to improve next.</p><p className="mt-2 text-xs font-bold text-teal">View your results</p></div><ChevronRight className="text-[#397b75]" size={18} aria-hidden="true" />
          </button>
        </div>
      </section>

      <Panel tone="light" className="border-[#cfe0f2] p-4 lg:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Your course progress</p>
            <h2 className="mt-1 text-lg font-bold">{state.subjects[0]?.subjectName ?? 'Your course'}</h2>
          </div>
          <span className="rounded-full bg-[#dceeff] px-3 py-1 text-sm font-bold text-blue">{completionPercentage}% complete</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e6edf5]" aria-label={`${completionPercentage}% of topics completed`}>
          <div className="h-full rounded-full bg-blue transition-all" style={{ width: `${completionPercentage}%` }} />
        </div>
        <p className="mt-3 text-sm text-muted">
          {completedTopicCount} of {totalTopicCount} topics practised{remainingTopicCount ? ` · ${remainingTopicCount} still to explore` : ' · You have practised every topic'}
        </p>
        <div className="mt-4 divide-y divide-line border-t border-line">
          <div className="flex items-center justify-between py-3"><span className="text-sm font-semibold text-muted">Tests completed</span><span className="text-lg font-bold">{recentAttempts.filter((attempt) => typeof attempt.percentage === 'number').length}</span></div>
          <div className="flex items-center justify-between py-3"><span className="text-sm font-semibold text-muted">Points earned</span><span className="text-lg font-bold text-blue">{state.pointsTotal} pts</span></div>
        </div>
      </Panel>

      <Panel tone="light" className="border-[#e8dcb9] p-4 lg:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Your performance</p>
            <h2 className="mt-1 text-lg font-bold">Your performance snapshot</h2>
          </div>
          <NavLink className="shrink-0 text-sm font-semibold text-blue" to="/student/results">View results</NavLink>
        </div>
        {courseResults?.averageScore !== undefined ? <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[#edf5ff] p-3"><p className="text-xs font-semibold text-muted">Average score</p><p className="mt-1 text-2xl font-bold text-blue">{courseResults.averageScore}%</p></div><div className="rounded-xl bg-[#effaf5] p-3"><p className="text-xs font-semibold text-muted">Strongest topic</p><p className="mt-1 text-sm font-bold text-green">{strongestTopic?.topicName ?? 'Keep practising'}</p></div></div>
          <div className="mt-5 border-t border-[#eadfca] pt-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold">Topic scores</p><p className="text-xs text-muted">Latest test result</p></div><div className="mt-3 space-y-3">{topicScoreChart.map((topic) => <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3" key={topic.id}><div className="min-w-0"><div className="flex items-center justify-between gap-3"><span className="truncate text-sm font-semibold">{topic.topicName}</span><span className={`shrink-0 text-sm font-bold ${topic.latestScore! >= 80 ? 'text-green' : 'text-amber'}`}>{topic.latestScore}%</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#f0e9da]"><div className={`h-full rounded-full ${topic.latestScore! >= 80 ? 'bg-green' : 'bg-amber'}`} style={{ width: `${topic.latestScore}%` }} /></div></div></div>)}</div></div>
        </> : <p className="mt-4 text-sm text-muted">Take a practice test to see what is going well and what to work on next.</p>}
      </Panel>
      </div>
    </div>
  );
}

function getActionError(caught: unknown): string {
  return caught instanceof Error ? caught.message : 'Action failed';
}

type StudentAppState = ReturnType<typeof useAppState>;
type BadgeTone = 'green' | 'amber' | 'red' | 'blue' | 'neutral';

function currentStudentClassIds(state: StudentAppState): string[] {
  return state.currentStudent.classIds.length
    ? state.currentStudent.classIds
    : state.currentStudent.classId
      ? [state.currentStudent.classId]
      : [];
}

function currentStudentClassNames(state: StudentAppState): string {
  const classNames = currentStudentClassIds(state)
    .map((classId) => state.classes.find((item) => item.id === classId)?.className)
    .filter((className): className is string => Boolean(className));
  return classNames.join(', ');
}

function currentStudentAssignments(state: StudentAppState) {
  const classIds = new Set(currentStudentClassIds(state));
  return state.assignments.filter((assignment) => classIds.has(assignment.classId) && assignment.status === 'open');
}

function getStudentTestDisplay(state: StudentAppState, testId?: string) {
  const test = state.tests.find((item) => item.id === testId);
  const topic = state.topics.find((item) => item.id === test?.topicId);
  const unit = state.units.find((item) => item.id === topic?.unitId);
  const subject = state.subjects.find((item) => item.id === unit?.subjectId);
  const contextParts = [subject?.subjectName, unit?.unitName].filter(Boolean);

  return {
    test,
    title: topic?.topicName ?? test?.testTitle ?? 'Test',
    context: contextParts.join(' - '),
    fullPath: [...contextParts, topic?.topicName].filter(Boolean).join(' -> '),
    resourceLabel: test?.testTitle ?? 'Test',
  };
}

function sortAttemptsByStartedAt<T extends { startedAt: string }>(rows: T[]): T[] {
  return [...rows].sort((first, second) => new Date(second.startedAt).getTime() - new Date(first.startedAt).getTime());
}

function findExistingAssignedAttempt(state: StudentAppState, assignmentId?: string) {
  if (!assignmentId) return undefined;
  return sortAttemptsByStartedAt(
    state.attempts.filter(
      (attempt) =>
        attempt.studentId === state.currentStudent.id &&
        attempt.assignmentId === assignmentId &&
        attempt.status !== 'voided',
    ),
  )[0];
}

interface TopicResultSummary {
  id: string;
  topicName: string;
  testId?: string;
  assignmentId?: string;
  bestScore?: number;
  latestScore?: number;
  latestAttemptType?: string;
  isAssigned: boolean;
  attemptCount: number;
  lastTaken?: string;
  statusLabel: string;
  statusTone: BadgeTone;
}

interface UnitResultSummary {
  id: string;
  unitName: string;
  topics: TopicResultSummary[];
  triedCount: number;
  totalTopics: number;
  averageScore?: number;
  bestScore?: number;
  latestScore?: number;
}

interface CourseResultSummary {
  units: UnitResultSummary[];
  triedCount: number;
  totalTopics: number;
  averageScore?: number;
  bestScore?: number;
}

function averageScore(values: number[]): number | undefined {
  if (!values.length) return undefined;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function bestScore(values: number[]): number | undefined {
  if (!values.length) return undefined;
  return Math.round(Math.max(...values));
}

function formatScore(value?: number): string {
  return typeof value === 'number' ? `${Math.round(value)}%` : '-';
}

function scoreTone(value?: number): string {
  if (typeof value !== 'number') return 'text-muted';
  if (value >= 80) return 'text-green';
  if (value >= 50) return 'text-amber';
  return 'text-danger';
}

function formatAttemptType(value?: string): string {
  if (!value) return '-';
  return value[0].toUpperCase() + value.slice(1);
}

function completionStatus(hasCompletedAttempt: boolean, isAssigned: boolean, hasCompletedAssignedAttempt: boolean): { label: string; tone: BadgeTone } {
  const isComplete = isAssigned ? hasCompletedAssignedAttempt : hasCompletedAttempt;
  if (isComplete) return { label: 'Completed', tone: 'green' };
  return { label: 'Incomplete', tone: isAssigned ? 'red' : 'neutral' };
}

function buildCourseResults(state: StudentAppState, subjectId: string): CourseResultSummary {
  const unitRows = state.units.filter((unit) => unit.subjectId === subjectId);
  const studentAttempts = state.attempts.filter((attempt) => attempt.studentId === state.currentStudent.id && attempt.status !== 'voided');

  const units = unitRows.map<UnitResultSummary>((unit) => {
    const topics = state.topics
      .filter((topic) => topic.unitId === unit.id)
      .map<TopicResultSummary>((topic) => {
        const topicTests = state.tests.filter((test) => test.topicId === topic.id);
        const testIds = new Set(topicTests.map((test) => test.id));
        const testVersionIds = new Set(state.testVersions.filter((version) => testIds.has(version.testId)).map((version) => version.id));
        const studentClassIds = new Set(currentStudentClassIds(state));
        const topicAssignments = state.assignments.filter(
          (assignment) => studentClassIds.has(assignment.classId) && testVersionIds.has(assignment.testVersionId),
        );
        const assignmentIds = new Set(topicAssignments.map((assignment) => assignment.id));
        const isAssigned = topicAssignments.length > 0;
        const assignedVersion = state.testVersions.find((version) => version.id === topicAssignments[0]?.testVersionId);
        const practiceTest = topicTests.find((test) => test.defaultMode === 'practice' && test.status === 'published') ?? topicTests[0];
        const attempts = studentAttempts
          .filter((attempt) => testIds.has(attempt.testId))
          .sort((first, second) => new Date(second.startedAt).getTime() - new Date(first.startedAt).getTime());
        const completedAttempts = attempts.filter((attempt) => typeof attempt.percentage === 'number');
        const latestAttempt = attempts[0];
        const latestCompleted = completedAttempts[0];
        const completedScores = completedAttempts.map((attempt) => attempt.percentage as number);
        const hasCompletedAssignedAttempt = completedAttempts.some((attempt) => Boolean(attempt.assignmentId && assignmentIds.has(attempt.assignmentId)));
        const status = completionStatus(Boolean(latestCompleted), isAssigned, hasCompletedAssignedAttempt);

        return {
          id: topic.id,
          topicName: topic.topicName,
          testId: assignedVersion?.testId ?? practiceTest?.id,
          assignmentId: topicAssignments[0]?.id,
          bestScore: bestScore(completedScores),
          latestScore: latestCompleted?.percentage,
          latestAttemptType: latestCompleted?.attemptType ?? latestAttempt?.attemptType,
          isAssigned,
          attemptCount: attempts.length,
          lastTaken: latestCompleted?.startedAt ?? latestAttempt?.startedAt,
          statusLabel: status.label,
          statusTone: status.tone,
        };
      });
    const latestScores = topics.flatMap((topic) => (typeof topic.latestScore === 'number' ? [topic.latestScore] : []));
    const latestTopic = topics
      .filter((topic) => typeof topic.latestScore === 'number' && topic.lastTaken)
      .sort((first, second) => new Date(second.lastTaken!).getTime() - new Date(first.lastTaken!).getTime())[0];

    return {
      id: unit.id,
      unitName: unit.unitName,
      topics,
      triedCount: latestScores.length,
      totalTopics: topics.length,
      averageScore: averageScore(latestScores),
      bestScore: bestScore(topics.flatMap((topic) => (typeof topic.bestScore === 'number' ? [topic.bestScore] : []))),
      latestScore: latestTopic?.latestScore,
    };
  });
  const courseLatestScores = units.flatMap((unit) =>
    unit.topics.flatMap((topic) => (typeof topic.latestScore === 'number' ? [topic.latestScore] : [])),
  );

  return {
    units,
    triedCount: courseLatestScores.length,
    totalTopics: units.reduce((total, unit) => total + unit.totalTopics, 0),
    averageScore: averageScore(courseLatestScores),
    bestScore: bestScore(
      units.flatMap((unit) => unit.topics.flatMap((topic) => (typeof topic.bestScore === 'number' ? [topic.bestScore] : []))),
    ),
  };
}

type PracticeResourceType = 'test' | 'revision_lesson' | 'tutorial' | 'worksheet';

interface PracticeResource {
  id: string;
  topicId: string;
  type: PracticeResourceType;
  title: string;
  description: string;
  status: 'available' | 'coming_soon';
  testId?: string;
}

function PracticePage() {
  const state = useAppState();
  const navigate = useNavigate();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const resources = useMemo<PracticeResource[]>(
    () =>
      state.tests
        .filter((test) => test.defaultMode === 'practice' && test.status === 'published')
        .map((test) => ({
          id: `resource-${test.id}`,
          topicId: test.topicId,
          type: 'test',
          title: test.testTitle,
          description: test.testDescription,
          status: 'available',
          testId: test.id,
        })),
    [state.tests],
  );
  const selectedSubject = state.subjects.find((subject) => subject.id === selectedSubjectId);
  const selectedUnit = state.units.find((unit) => unit.id === selectedUnitId);
  const subjectUnits = state.units.filter((unit) => unit.subjectId === selectedSubjectId);
  const unitTopics = state.topics.filter((topic) => topic.unitId === selectedUnitId);

  const countResourcesForSubject = (subjectId: string) => {
    const topicIds = new Set(
      state.topics
        .filter((topic) => state.units.some((unit) => unit.id === topic.unitId && unit.subjectId === subjectId))
        .map((topic) => topic.id),
    );
    return resources.filter((resource) => topicIds.has(resource.topicId)).length;
  };

  const countTopicsForSubject = (subjectId: string) => {
    const unitIds = new Set(state.units.filter((unit) => unit.subjectId === subjectId).map((unit) => unit.id));
    return state.topics.filter((topic) => unitIds.has(topic.unitId)).length;
  };

  const countResourcesForUnit = (unitId: string) => {
    const topicIds = new Set(state.topics.filter((topic) => topic.unitId === unitId).map((topic) => topic.id));
    return resources.filter((resource) => topicIds.has(resource.topicId)).length;
  };

  const startResource = async (resource: PracticeResource) => {
    if (resource.type !== 'test' || !resource.testId) return;
    try {
      setActionError('');
      const attempt = await state.beginAttempt({ testId: resource.testId });
      navigate(`/student/test/${attempt.id}`);
    } catch (caught) {
      setActionError(getActionError(caught));
    }
  };

  const resetToCourses = () => {
    setSelectedSubjectId(null);
    setSelectedUnitId(null);
  };

  return (
    <div className="space-y-5 px-4 py-5 lg:px-0 lg:py-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Practice</h2>
          <p className="mt-1 text-sm text-muted">
            Choose a course, then practise the topics that matter most to you.
          </p>
        </div>
        {selectedSubject ? (
          <Button className="min-h-10 px-3" variant="dark" onClick={resetToCourses}>
            <ArrowLeft size={17} aria-hidden="true" />
            Courses
          </Button>
        ) : null}
      </div>

      {actionError ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{actionError}</p> : null}

      {!selectedSubject ? (
        <div className="grid gap-4">
          {state.subjects.map((subject) => {
            const resourceCount = countResourcesForSubject(subject.id);
            const unitCount = state.units.filter((unit) => unit.subjectId === subject.id).length;
            const topicCount = countTopicsForSubject(subject.id);
            return (
              <button
                className="group relative overflow-hidden rounded-app border border-[#2a3a50] bg-[#14243a] p-5 text-left text-white shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-blue hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:p-7"
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-gradient-to-l from-[#1d3554] to-transparent lg:block" aria-hidden="true" />
                <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl border border-[#315071] bg-[#17304d] text-[#73b6ff]"><BookOpenCheck size={23} aria-hidden="true" /></span><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8c8d9]">Practice course</p></div>
                    <h3 className="mt-5 text-2xl font-bold tracking-tight lg:text-3xl">{subject.subjectName}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#c7d6e5] lg:text-base">{subject.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:max-w-md lg:min-w-[22rem]">
                    {[[unitCount, 'Units'], [topicCount, 'Topics'], [resourceCount, 'Practice tests']].map(([value, label]) => <div className="rounded-xl border border-[#315071] bg-[#10233a]/80 px-3 py-3" key={label as string}><span className="block text-xl font-bold text-white">{value}</span><span className="mt-0.5 block text-xs font-semibold text-[#b8c8d9]">{label}</span></div>)}
                  </div>
                </div>
                <div className="relative mt-6 flex items-center gap-2 text-sm font-bold text-[#73b6ff]"><span>Choose this course</span><ChevronRight className="transition-transform duration-200 group-hover:translate-x-1" size={19} aria-hidden="true" /></div>
              </button>
            );
          })}
        </div>
      ) : null}

      {selectedSubject && !selectedUnit ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Units in {selectedSubject.subjectName}</h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {subjectUnits.map((unit) => (
              <button
                className="rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-left text-white shadow-panel transition hover:border-blue hover:shadow-none lg:p-5"
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#b8c8d9]">Unit</p>
                    <h3 className="mt-2 font-bold">{unit.unitName}</h3>
                    <p className="mt-1 text-sm text-[#b8c8d9]">
                      {state.topics.filter((topic) => topic.unitId === unit.id).length} topics - {countResourcesForUnit(unit.id)} resources ready
                    </p>
                  </div>
                  <ChevronRight className="mt-1 text-blue" size={20} aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {selectedSubject && selectedUnit ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold">Topics in {selectedUnit.unitName}</h3>
            <Button className="min-h-10 px-3" variant="ghost" onClick={() => setSelectedUnitId(null)}>
              <ArrowLeft size={17} aria-hidden="true" />
              Units
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {unitTopics.map((topic) => {
              const topicResources = resources.filter((resource) => resource.topicId === topic.id);
              const testResources = topicResources.filter((resource) => resource.type === 'test');
              return (
                <Panel className="p-4 lg:p-5" key={topic.id}>
                  <p className="text-xs font-semibold text-[#b8c8d9]">Topic</p>
                  <h3 className="mt-2 font-bold">{topic.topicName}</h3>

                  <div className="mt-4 space-y-3">
                    {testResources.length ? (
                      testResources.map((resource) => (
                        <div className="rounded-app border border-line bg-white p-3 text-ink" key={resource.id}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-bold">{resource.title}</h4>
                              <p className="mt-1 text-xs text-muted">{resource.description}</p>
                            </div>
                            <StatusBadge tone={resource.status === 'available' ? 'green' : 'blue'}>
                              {resource.status === 'available' ? 'Ready' : 'Soon'}
                            </StatusBadge>
                          </div>
                          <Button className="mt-3 w-full" variant="dark" onClick={() => startResource(resource)}>
                            start
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="rounded-app border border-dashed border-line bg-white p-3 text-sm text-muted">
                        No practice tests are available for this topic yet.
                      </p>
                    )}
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AssignedPage() {
  const state = useAppState();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState('');
  const assignments = currentStudentAssignments(state);
  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <div>
        <h2 className="text-xl font-bold">Assigned</h2>
        <p className="mt-1 text-sm text-muted">Complete tests your teacher has set for your class.</p>
      </div>
      {actionError ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{actionError}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {assignments.map((assignment) => {
          const version = state.testVersions.find((item) => item.id === assignment.testVersionId);
          const test = state.tests.find((item) => item.id === version?.testId);
          const display = getStudentTestDisplay(state, test?.id);
          const consumed = findExistingAssignedAttempt(state, assignment.id);
          return (
            <Panel className="p-4 lg:p-5" key={assignment.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#b8c8d9]">{display.resourceLabel} - One-attempt assigned assessment</p>
                  <h3 className="mt-2 font-bold">{display.title}</h3>
                  {display.context ? <p className="mt-1 text-sm text-[#b8c8d9]">{display.context}</p> : null}
                  <p className="mt-1 text-sm text-[#b8c8d9]">
                    {assignment.dueAt ? `Due ${formatDate(assignment.dueAt)}` : 'No due date set'} - {formatDuration(assignment.timeLimitSeconds)}
                  </p>
                </div>
                <StatusBadge tone={consumed ? 'blue' : 'amber'}>{consumed ? 'Started' : 'Ready'}</StatusBadge>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={Boolean(consumed && consumed.status !== 'in_progress')}
                onClick={async () => {
                  try {
                    setActionError('');
                    if (consumed && consumed.status !== 'in_progress') {
                      setActionError('This assigned assessment has already been completed.');
                      return;
                    }
                    const attempt = await state.beginAttempt({ testId: test!.id, assignmentId: assignment.id });
                    navigate(`/student/test/${attempt.id}`);
                  } catch (caught) {
                    setActionError(getActionError(caught));
                  }
                }}
              >
                {consumed?.status === 'in_progress' ? 'Continue attempt' : consumed ? 'Attempt consumed' : 'Start assessment'}
              </Button>
            </Panel>
          );
        })}
      </div>
      {!assignments.length ? (
        <Panel className="p-4 lg:p-5">
          <p className="font-bold">No assigned tests right now.</p>
          <p className="mt-1 text-sm text-[#b8c8d9]">Your teacher's assignments will appear here when they are set.</p>
        </Panel>
      ) : null}
    </div>
  );
}

function ActiveTestPage() {
  const { attemptId = '' } = useParams();
  const navigate = useNavigate();
  const state = useAppState();
  const attempt = state.attempts.find((row) => row.id === attemptId);
  const test = state.tests.find((row) => row.id === attempt?.testId);
  const display = getStudentTestDisplay(state, test?.id);
  const attemptQuestions = state.questions.filter((question) => question.testVersionId === attempt?.testVersionId);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(attempt?.timeLimitSeconds ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const question = attemptQuestions[index];
  const answeredCount = state.answers.filter((answer) => answer.attemptId === attemptId && answer.answer).length;
  const selectedAnswer = state.answers.find((answer) => answer.attemptId === attemptId && answer.questionId === question?.id)?.answer;

  useEffect(() => {
    if (!remaining || attempt?.status !== 'in_progress') return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [attempt?.status, remaining]);

  useEffect(() => {
    if (remaining === 0 && attempt?.status === 'in_progress' && !isSubmitting) {
      setIsSubmitting(true);
      void state
        .submitAttempt(attempt.id)
        .then(() => navigate('/student/results'))
        .catch((caught: unknown) => {
          setSubmitError(getActionError(caught));
          setIsSubmitting(false);
        });
    }
  }, [attempt, isSubmitting, navigate, remaining, state]);

  if (!attempt || !question) {
    return <div className="p-4">Attempt not found.</div>;
  }

  const submit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      await state.submitAttempt(attempt.id);
      navigate('/student/results');
    } catch (caught) {
      setSubmitError(getActionError(caught));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="active-test-surface relative space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <AntiCheatLayer attemptId={attempt.id} onLog={state.logAttemptEvent} />
      <div className="flex items-center justify-between">
        <button className="text-sm font-semibold text-blue" onClick={() => navigate('/student/assigned')}>Back</button>
        <h2 className="max-w-[230px] truncate text-sm font-bold" title={display.fullPath || display.title}>{display.title}</h2>
        <span className="text-sm font-bold">{Math.round(((index + 1) / attemptQuestions.length) * 100)}%</span>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-sm font-semibold">
          <span>Question {index + 1} of {attemptQuestions.length}</span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="h-2 rounded-full bg-line">
          <div className="h-2 rounded-full bg-blue" style={{ width: `${((index + 1) / attemptQuestions.length) * 100}%` }} />
        </div>
      </div>

      <Panel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted">Time Remaining</p>
            <p className="text-2xl font-bold text-white">{formatDuration(remaining || attempt.timeLimitSeconds || 0)}</p>
          </div>
          <Button variant="secondary" className="min-h-10 px-3">Hide Timer</Button>
        </div>
        {attempt.attemptType === 'assigned' ? (
          <p className="mt-4 rounded-app border border-[#cfe3ff] bg-[#eaf4ff] p-3 text-sm text-ink">
            One attempt only. Once submitted, you cannot retake this assessment.
          </p>
        ) : null}
      </Panel>

      <Panel className="watermark-grid relative overflow-hidden p-4">
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center text-3xl font-bold uppercase text-ink/10 rotate-[-32deg]">
          {leaderboardDisplay(state.currentStudent)}<br />Do not share
        </div>
        <div className="relative">
          <p className="text-sm font-bold">{index + 1}. {question.questionText}</p>
          <div className="mt-4 space-y-3">
            {question.options?.map((option, optionIndex) => (
              <button
                className={`flex min-h-12 w-full items-center gap-3 rounded-app border px-3 text-left text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-blue/25 ${selectedAnswer === option.id ? 'border-blue bg-[#eef5ff] text-ink' : 'border-line bg-white text-ink'}`}
                key={option.id}
                onClick={() => state.saveAnswer(attempt.id, question.id, option.id)}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full border text-[11px] ${selectedAnswer === option.id ? 'border-blue bg-blue text-white' : 'border-muted text-muted'}`}>
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                {option.optionText}
              </button>
            ))}
            {!question.options?.length ? (
              <textarea
                className="min-h-28 w-full rounded-app border border-line bg-white p-3 text-sm text-ink outline-none focus:border-blue"
                onChange={(event) => state.saveAnswer(attempt.id, question.id, event.target.value)}
                placeholder="Type your answer"
                value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
              />
            ) : null}
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>Previous</Button>
        {index === attemptQuestions.length - 1 ? (
          <Button disabled={isSubmitting} onClick={submit}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
        ) : (
          <Button onClick={() => setIndex((value) => Math.min(attemptQuestions.length - 1, value + 1))}>Next</Button>
        )}
      </div>
      {submitError ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{submitError}</p> : null}
      <p className="text-xs text-[#a9bbcf]">
        All changes saved. The platform deters copying, printing and screenshot-based sharing through watermarking, randomised questions, shuffled answers, timers and activity logging. It cannot fully prevent external screenshots or photographs.
      </p>
    </div>
  );
}

function ResultsPage() {
  const state = useAppState();
  const navigate = useNavigate();
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => state.subjects[0]?.id ?? '');
  const [actionError, setActionError] = useState('');
  const [startingTopicId, setStartingTopicId] = useState('');

  useEffect(() => {
    if (state.subjects.some((subject) => subject.id === selectedSubjectId)) return;
    setSelectedSubjectId(state.subjects[0]?.id ?? '');
  }, [selectedSubjectId, state.subjects]);

  const selectedSubject = state.subjects.find((subject) => subject.id === selectedSubjectId) ?? state.subjects[0];
  const courseResults = selectedSubject ? buildCourseResults(state, selectedSubject.id) : null;

  const startTopicTest = async (topic: TopicResultSummary) => {
    if (!topic.testId) {
      setActionError(`No test is available for ${topic.topicName}.`);
      return;
    }

    try {
      setActionError('');
      setStartingTopicId(topic.id);
      const existingAssignedAttempt = findExistingAssignedAttempt(state, topic.assignmentId);
      if (existingAssignedAttempt && existingAssignedAttempt.status !== 'in_progress') {
        setActionError('This assigned test has already been completed.');
        setStartingTopicId('');
        return;
      }
      const attempt = await state.beginAttempt({ testId: topic.testId, assignmentId: topic.assignmentId });
      navigate(`/student/test/${attempt.id}`);
    } catch (caught) {
      setActionError(getActionError(caught));
      setStartingTopicId('');
    }
  };

  if (!selectedSubject || !courseResults) {
    return (
      <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
        <h2 className="text-xl font-bold">Results</h2>
        <Panel className="p-4 lg:p-5">
          <p className="font-bold">No courses available</p>
          <p className="mt-1 text-sm text-[#b8c8d9]">Results will appear once a course has been added.</p>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 py-5 lg:px-0 lg:py-0">
      <div>
        <h2 className="text-xl font-bold">Results</h2>
        <p className="mt-1 text-sm text-muted">Course, unit and topic performance use your latest completed result per topic.</p>
      </div>
      {actionError ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{actionError}</p> : null}

      <label className="block" htmlFor="student-results-course">
        <span className="text-sm font-semibold">Course</span>
        <select
          className="mt-2 min-h-11 w-full rounded-app border border-line bg-white px-3 text-sm font-semibold text-ink outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/20"
          id="student-results-course"
          onChange={(event) => setSelectedSubjectId(event.target.value)}
          value={selectedSubject.id}
        >
          {state.subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subjectName}
            </option>
          ))}
        </select>
      </label>

      <section aria-label={`${selectedSubject.subjectName} course performance`}>
        <h3 className="mb-3 font-bold">Course performance</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ResultMetric icon={<BookOpenCheck size={24} aria-hidden="true" />} label="Topics tried" value={`${courseResults.triedCount}/${courseResults.totalTopics}`} tone="teal" />
          <ResultMetric icon={<BarChart3 size={24} aria-hidden="true" />} label="Average" score={courseResults.averageScore} tone="blue" />
          <ResultMetric icon={<Trophy size={24} aria-hidden="true" />} label="Best" score={courseResults.bestScore} tone="amber" />
          <ResultMetric icon={<Trophy size={24} aria-hidden="true" />} label="Points" value={state.pointsTotal} tone="teal" />
        </div>
      </section>

      <div className="space-y-4">
        {courseResults.units.map((unit) => (
          <Panel className="overflow-hidden p-0" key={unit.id} tone="light">
            <div className="px-4 py-4 lg:px-5">
              <h3 className="text-lg font-bold">{unit.unitName}</h3>
            </div>

            <div className="grid gap-3 border-y border-line bg-mist px-4 py-3 text-sm sm:grid-cols-4 lg:px-5">
              <UnitSummary label="Unit average" score={unit.averageScore} />
              <UnitSummary label="Topics tried" value={`${unit.triedCount}/${unit.totalTopics}`} />
              <UnitSummary label="Best" score={unit.bestScore} />
              <UnitSummary label="Latest" score={unit.latestScore} />
            </div>

            <div className="hidden p-4 lg:block lg:p-5">
              <div className="overflow-x-auto rounded-app border border-line">
                <table className="min-w-[900px] w-full border-collapse bg-white text-sm">
                  <thead className="bg-mist text-left text-xs font-semibold text-muted">
                    <tr>
                      <th className="min-w-[260px] px-3 py-3">Topic</th>
                      <th className="whitespace-nowrap px-3 py-3">Best</th>
                      <th className="whitespace-nowrap px-3 py-3">Latest</th>
                      <th className="whitespace-nowrap px-3 py-3">Type</th>
                      <th className="whitespace-nowrap px-3 py-3">Assigned</th>
                      <th className="whitespace-nowrap px-3 py-3">Attempts</th>
                      <th className="whitespace-nowrap px-3 py-3">Last taken</th>
                      <th className="whitespace-nowrap px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {unit.topics.map((topic) => (
                      <tr key={topic.id}>
                        <td className="px-3 py-3 font-semibold">
                          <button
                            aria-label={`Start ${topic.topicName}`}
                            className="text-left font-bold text-blue underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue/25 disabled:cursor-not-allowed disabled:text-muted"
                            disabled={startingTopicId === topic.id || !topic.testId}
                            onClick={() => void startTopicTest(topic)}
                            type="button"
                          >
                            {startingTopicId === topic.id ? 'Starting...' : topic.topicName}
                          </button>
                        </td>
                        <td className={`whitespace-nowrap px-3 py-3 font-bold ${scoreTone(topic.bestScore)}`}>{formatScore(topic.bestScore)}</td>
                        <td className={`whitespace-nowrap px-3 py-3 font-bold ${scoreTone(topic.latestScore)}`}>{formatScore(topic.latestScore)}</td>
                        <td className="whitespace-nowrap px-3 py-3">{formatAttemptType(topic.latestAttemptType)}</td>
                        <td className="px-3 py-3">
                          <StatusBadge tone={topic.isAssigned ? 'blue' : 'neutral'}>{topic.isAssigned ? 'Yes' : 'No'}</StatusBadge>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">{topic.attemptCount}</td>
                        <td className="whitespace-nowrap px-3 py-3">{topic.lastTaken ? formatDate(topic.lastTaken) : '-'}</td>
                        <td className="whitespace-nowrap px-3 py-3"><StatusBadge tone={topic.statusTone}>{topic.statusLabel}</StatusBadge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="divide-y divide-line lg:hidden">
              {unit.topics.map((topic) => (
                <div className="px-4 py-4" key={topic.id}>
                  <div className="flex items-start justify-between gap-3">
                    <button
                      aria-label={`Start ${topic.topicName}`}
                      className="text-left font-bold text-blue underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue/25 disabled:cursor-not-allowed disabled:text-muted"
                      disabled={startingTopicId === topic.id || !topic.testId}
                      onClick={() => void startTopicTest(topic)}
                      type="button"
                    >
                      {startingTopicId === topic.id ? 'Starting...' : topic.topicName}
                    </button>
                    <StatusBadge tone={topic.statusTone}>{topic.statusLabel}</StatusBadge>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <Info label="Best" value={formatScore(topic.bestScore)} valueClassName={scoreTone(topic.bestScore)} />
                    <Info label="Latest" value={formatScore(topic.latestScore)} valueClassName={scoreTone(topic.latestScore)} />
                    <Info label="Type" value={formatAttemptType(topic.latestAttemptType)} />
                    <Info label="Assigned" value={topic.isAssigned ? 'Yes' : 'No'} />
                    <Info label="Attempts" value={`${topic.attemptCount}`} />
                    <Info label="Last taken" value={topic.lastTaken ? formatDate(topic.lastTaken) : '-'} />
                  </dl>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function ResultMetric({
  icon,
  label,
  value,
  score,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value?: string | number;
  score?: number;
  tone: 'amber' | 'blue' | 'teal';
}) {
  const toneClass = {
    amber: 'text-amber',
    blue: 'text-blue',
    teal: 'text-teal',
  }[tone];

  return (
    <div className="flex min-h-20 items-center gap-3 rounded-app border border-line bg-white p-4 shadow-panel">
      <div className={toneClass}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted">{label}</p>
        <p className={`mt-1 text-2xl font-bold tracking-normal ${typeof score === 'number' ? scoreTone(score) : ''}`}>
          {typeof score === 'number' ? formatScore(score) : value}
        </p>
      </div>
    </div>
  );
}

function UnitSummary({ label, value, score }: { label: string; value?: string; score?: number }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className={`mt-1 font-bold ${typeof score === 'number' ? scoreTone(score) : ''}`}>
        {typeof score === 'number' ? formatScore(score) : value}
      </p>
    </div>
  );
}

function ProfilePage() {
  const state = useAppState();
  const [joinCode, setJoinCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const classNames = currentStudentClassNames(state) || 'No class';

  const joinClass = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsJoining(true);
      setMessage('');
      setError('');
      const resultMessage = await state.joinClassByCode(joinCode);
      setJoinCode('');
      setMessage(resultMessage);
    } catch (caught) {
      setError(getActionError(caught));
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <h2 className="text-xl font-bold">Profile</h2>
      <Panel className="space-y-3 p-4 lg:p-5">
        <p className="text-sm text-[#b8c8d9]">Account details</p>
        <p className="text-lg font-bold">{state.currentStudent.firstName} {state.currentStudent.surname}</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Username" value={state.currentStudent.username} />
          <Info label="Student ID" value={state.currentStudent.publicStudentId} />
          <Info label="Status" value={state.statusName} />
          <Info label="Points" value={`${state.pointsTotal}`} />
          <Info label="Classes" value={classNames} />
        </dl>
      </Panel>
      <Panel className="p-4 lg:p-5">
        <h3 className="font-bold">Join a Class</h3>
        <form className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={joinClass}>
          <label className="space-y-2 text-sm font-semibold">
            <span>Class code</span>
            <input
              className="h-11 w-full rounded-app border border-line bg-mist px-3 text-sm text-ink shadow-inner [color-scheme:light] focus:border-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue/15"
              maxLength={6}
              onChange={(event) => setJoinCode(event.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
              placeholder="ABCDEF"
              value={joinCode}
            />
          </label>
          <Button className="self-end" disabled={isJoining || joinCode.length !== 6}>
            {isJoining ? 'Joining...' : 'Join class'}
          </Button>
        </form>
        {message ? <p className="mt-3 rounded-app bg-[#e7f7ef] p-3 text-sm font-semibold text-green">{message}</p> : null}
        {error ? <p className="mt-3 rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{error}</p> : null}
      </Panel>
    </div>
  );
}

function StudentLeaderboardPage() {
  const state = useAppState();
  const currentLeaderboardRow = state.leaderboardRows.find((row) => row.studentId === state.currentStudent.id);
  const currentAllTimeRow = state.allTimeLeaderboardRows.find((row) => row.studentId === state.currentStudent.id);
  const rank = currentLeaderboardRow?.rank ?? '-';
  const leaderboardPoints = currentLeaderboardRow?.points ?? state.pointsTotal;
  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <div>
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <p className="mt-1 text-sm text-muted">Keep practising to earn points and climb the class rankings.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <Panel className="overflow-hidden p-0">
          <div className="flex items-center gap-3 border-b border-[#2a3a50] px-4 py-4 lg:px-5">
            <span className="grid size-10 place-items-center rounded-xl border border-[#315071] bg-[#17304d] text-[#e6bc5c]">
              <Trophy size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b8c8d9]">Class leaderboard</p>
              <h3 className="mt-0.5 font-bold text-white">Current standings</h3>
            </div>
          </div>
          <div className="space-y-2 p-4 lg:p-5">
            {state.leaderboardRows.map((row) => {
              const isCurrentStudent = row.studentId === state.currentStudent.id;
              return (
                <div className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 text-sm ${isCurrentStudent ? 'border-blue bg-[#eaf5ff] text-ink' : 'border-line bg-white text-ink'}`} key={row.studentId}>
                  <span className={`grid size-9 place-items-center rounded-lg text-sm font-bold ${row.rank === 1 ? 'bg-[#f5d879] text-[#49380a]' : row.rank === 2 ? 'bg-[#dbe4ef] text-[#31445d]' : row.rank === 3 ? 'bg-[#e7bf99] text-[#603b1b]' : 'bg-[#eef4f8] text-[#42566f]'}`}>{row.rank}</span>
                  <span className="min-w-0 truncate font-bold">{row.displayName}</span>
                  <span className="font-semibold text-muted">{row.points} pts</span>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel className="overflow-hidden p-0">
          <div className="bg-[#17304d] px-5 py-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b8c8d9]">Your standing</p>
            <p className="mt-2 text-xl font-bold">{leaderboardDisplay(state.currentStudent)}</p>
            <div className="mt-5 flex items-end justify-between">
              <div><span className="block text-4xl font-bold text-[#f5d879]">#{rank}</span><span className="text-sm font-semibold text-[#b8c8d9]">Class rank</span></div>
              <div className="text-right"><span className="block text-xl font-bold">{leaderboardPoints}</span><span className="text-sm font-semibold text-[#b8c8d9]">Points earned</span></div>
            </div>
          </div>
          <div className="p-4 text-sm text-ink">
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-muted">Your classes</span>
            <span className="mt-1 block font-bold">{currentStudentClassNames(state) || 'No class'}</span>
          </div>
        </Panel>
      </div>
      <Panel className="overflow-hidden p-0">
        <div className="flex items-center justify-between gap-4 border-b border-[#2a3a50] px-4 py-4 lg:px-5">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl border border-[#315071] bg-[#17304d] text-[#e6bc5c]"><Trophy size={21} aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b8c8d9]">All-time ranking</p><h3 className="mt-0.5 font-bold text-white">Your place in csrevision</h3></div></div>
          {currentAllTimeRow ? <span className="rounded-full bg-[#203c63] px-3 py-1 text-sm font-bold text-[#e6bc5c]">You are #{currentAllTimeRow.rank}</span> : null}
        </div>
        <div className="space-y-2 p-4 lg:p-5">
          {state.allTimeLeaderboardRows.map((row) => {
            const isCurrentStudent = row.studentId === state.currentStudent.id;
            return <div className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 text-sm ${isCurrentStudent ? 'border-blue bg-[#eaf5ff] text-ink' : 'border-line bg-white text-ink'}`} key={`all-time-${row.studentId}`}><span className={`grid size-9 place-items-center rounded-lg text-sm font-bold ${row.rank === 1 ? 'bg-[#f5d879] text-[#49380a]' : row.rank === 2 ? 'bg-[#dbe4ef] text-[#31445d]' : row.rank === 3 ? 'bg-[#e7bf99] text-[#603b1b]' : 'bg-[#eef4f8] text-[#42566f]'}`}>{row.rank}</span><span className="min-w-0 truncate font-bold">{row.displayName.split(' - ')[0]}</span><span className="font-semibold text-muted">{row.points} pts</span></div>;
          })}
          {!state.allTimeLeaderboardRows.length ? <p className="text-sm text-[#b8c8d9]">All-time standings will appear as students complete tests.</p> : null}
        </div>
      </Panel>
    </div>
  );
}

function Info({ label, value, valueClassName = '' }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="rounded-app border border-line bg-white p-3 text-ink">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-1 font-bold ${valueClassName}`}>{value}</dd>
    </div>
  );
}
