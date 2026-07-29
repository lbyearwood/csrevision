import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  ChevronRight,
  Clock3,
  Download,
  Home,
  ListChecks,
  LogOut,
  Code2,
  Trophy,
  UserRound,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../../app/AppState';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { leaderboardDisplay } from '../../lib/identity';
import { formatDate } from '../../lib/time';
import { downloadTestSummaryPdf } from '../../lib/testSummaryPdf';
import { AntiCheatLayer } from '../tests/AntiCheatLayer';
import type { LeaderboardRow } from '../../types/domain';

const navItems = [
  { to: '/student', label: 'Home', icon: Home },
  { to: '/student/practice', label: 'Practice', icon: BookOpenCheck },
  { to: '/student/assigned', label: 'My assignments', icon: ListChecks },
  { to: '/student/results', label: 'My results', icon: BarChart3 },
  { to: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function StudentApp() {
  const state = useAppState();
  const { currentStudent, dataError, isLoadingData, isSupabaseBacked, signOut } = state;
  const outstandingAssignmentCount = currentStudentAssignments(state).length;
  const unfinishedPracticeCount = state.attempts.filter(
    (attempt) => attempt.studentId === currentStudent.id && attempt.attemptType === 'practice' && attempt.status === 'in_progress',
  ).length;

  if (isSupabaseBacked && dataError) {
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

  if (isSupabaseBacked && isLoadingData) {
    return <main aria-label="Loading your workspace" className="min-h-screen bg-mist" />;
  }

  return (
    <main className="min-h-screen bg-mist text-ink">
      <div className="mx-auto min-h-screen max-w-[430px] bg-mist shadow-panel md:my-6 md:min-h-[860px] md:rounded-[28px] md:border md:border-line lg:mx-0 lg:my-0 lg:grid lg:min-h-screen lg:w-full lg:max-w-none lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6 lg:border-0 lg:bg-transparent lg:p-6 lg:shadow-none">
        <aside className="hidden rounded-app border border-[#6474df] bg-[linear-gradient(165deg,#16235d_0%,#202a6f_48%,#43308f_100%)] p-4 text-white shadow-[0_18px_42px_rgba(32,42,111,0.24)] lg:flex lg:self-start lg:flex-col">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-app border border-[#7e8eff] bg-[linear-gradient(135deg,#3857df_0%,#7650cf_100%)] text-white shadow-[0_8px_18px_rgba(56,87,223,0.28)]">
              <Code2 size={23} strokeWidth={2.4} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold">csrevision</p>
              <p className="text-xs font-semibold text-[#d9dfff]">Student portal</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                end={item.to === '/student'}
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-app px-3 py-3 text-sm font-semibold ${isActive ? 'bg-[#fffaf0] text-[#182347]' : 'text-[#d9dfff] hover:bg-[#2d3d9b] hover:text-white'}`
                }
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"><item.icon size={18} aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">{item.label}</span>
                {item.to === '/student/practice' && unfinishedPracticeCount > 0 ? <span className="grid min-w-6 place-items-center rounded-full bg-[#5a55d8] px-1.5 py-0.5 text-xs font-bold text-white shadow-sm" aria-label={`${unfinishedPracticeCount} unfinished practice tests`}>{unfinishedPracticeCount}</span> : null}
                {item.to === '/student/assigned' && outstandingAssignmentCount > 0 ? <span className="grid min-w-6 place-items-center rounded-full bg-[#e5484d] px-1.5 py-0.5 text-xs font-bold text-white shadow-sm" aria-label={`${outstandingAssignmentCount} outstanding assignments`}>{outstandingAssignmentCount}</span> : null}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 border-t border-[#4b59bd] pt-3">
            <NavLink to="/student/profile" className={({ isActive }) => `flex items-center gap-3 rounded-app px-3 py-3 ${isActive ? 'bg-[#fffaf0] text-[#182347]' : 'text-[#e5e8ff] hover:bg-[#2d3d9b]'}`}>
              {({ isActive }) => <>
                <div className="grid h-9 w-9 place-items-center rounded-full border border-[#9ca8ff] bg-[linear-gradient(135deg,#4d6cf0_0%,#9a55db_100%)] text-sm font-bold text-white shadow-[0_5px_12px_rgba(67,83,218,0.32)]">{currentStudent.firstName[0]}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{leaderboardDisplay(currentStudent).split(' - ')[0]}</p><p className={`text-xs ${isActive ? 'text-muted' : 'text-[#d9dfff]'}`}>View profile</p></div>
                <UserRound size={18} aria-hidden="true" />
              </>}
            </NavLink>
            <button className="mt-2 flex w-full items-center gap-3 rounded-app px-3 py-3 text-sm font-semibold text-[#d9dfff] hover:bg-[#2d3d9b] hover:text-white" onClick={signOut}>
              <LogOut size={18} aria-hidden="true" /> Sign out
            </button>
          </div>
        </aside>

        <section className="min-w-0 lg:self-start">
          <header className="flex items-center justify-between border-b border-[#6474df] bg-[linear-gradient(135deg,#202a6f_0%,#413093_100%)] px-4 py-4 text-white lg:hidden">
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-app border border-[#7e8eff] bg-[linear-gradient(135deg,#3857df_0%,#7650cf_100%)] shadow-[0_8px_18px_rgba(56,87,223,0.28)]"><Code2 size={21} strokeWidth={2.4} aria-hidden="true" /></div><p className="font-bold">csrevision</p></div>
            <NavLink className="grid h-10 w-10 place-items-center rounded-full border border-[#4b59bd] bg-[#2d3d9b]" to="/student/profile" title="Profile"><UserRound size={18} aria-hidden="true" /></NavLink>
          </header>
          <div className="pb-24 lg:pb-0">
          <Routes>
            <Route index element={<StudentHome />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="assigned" element={<AssignedPage />} />
            <Route path="test/:attemptId" element={<ActiveTestPage />} />
            <Route path="summary/:attemptId" element={<AttemptSummaryPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="leaderboard" element={<StudentLeaderboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
          </div>
        </section>

        <nav className="fixed bottom-0 left-1/2 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-6 border-t border-[#6474df] bg-[linear-gradient(135deg,#202a6f_0%,#413093_100%)] px-2 py-2 md:bottom-6 md:rounded-b-[28px] lg:hidden">
          {navItems.map((item) => (
            <NavLink
              end={item.to === '/student'}
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-app text-[10px] font-semibold ${isActive ? 'text-white' : 'text-[#d9dfff]'}`
              }
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
              {item.to === '/student/practice' && unfinishedPracticeCount > 0 ? <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-[#5a55d8] px-1 py-0.5 text-[10px] font-bold text-white shadow-sm" aria-label={`${unfinishedPracticeCount} unfinished practice tests`}>{unfinishedPracticeCount}</span> : null}
              {item.to === '/student/assigned' && outstandingAssignmentCount > 0 ? <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-[#e5484d] px-1 py-0.5 text-[10px] font-bold text-white shadow-sm" aria-label={`${outstandingAssignmentCount} outstanding assignments`}>{outstandingAssignmentCount}</span> : null}
            </NavLink>
          ))}
        </nav>
      </div>
    </main>
  );
}

function classLeaderboardForCurrentStudent(state: ReturnType<typeof useAppState>) {
  const className = state.classes.find((classRecord) => classRecord.id === state.currentStudent.classId)?.className;
  if (!className) return [];
  return withCompetitionRanks(state.leaderboardRows
    .filter((row) => row.className === className)
    .sort((first, second) => second.points - first.points || first.displayName.localeCompare(second.displayName)));
}

function withCompetitionRanks(rows: LeaderboardRow[]): LeaderboardRow[] {
  let previousPoints: number | undefined;
  let rank = 0;
  return rows.map((row, index) => {
    if (row.points !== previousPoints) rank = index + 1;
    previousPoints = row.points;
    return { ...row, rank };
  });
}

function rankMedal(rank: number | string) {
  return rank === 1 ? '🏆' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
}

function StudentHome() {
  const state = useAppState();
  const navigate = useNavigate();
  const outstandingAssignments = currentStudentAssignments(state).sort(
    (first, second) => new Date(first.dueAt || '9999-12-31').getTime() - new Date(second.dueAt || '9999-12-31').getTime(),
  );
  const nextDueAssignment = outstandingAssignments[0];
  const recentAttempts = state.attempts.filter((attempt) => attempt.studentId === state.currentStudent.id);
  const courseResults = state.subjects[0] ? buildCourseResults(state, state.subjects[0].id) : null;
  const classLeaderboardRows = classLeaderboardForCurrentStudent(state);
  const currentLeaderboardRow = classLeaderboardRows.find((row) => row.studentId === state.currentStudent.id);
  const classRank = currentLeaderboardRow?.rank ?? '-';
  const classPoints = currentLeaderboardRow?.points ?? state.pointsTotal;
  const studentAhead = currentLeaderboardRow ? classLeaderboardRows.find((row) => row.rank === currentLeaderboardRow.rank - 1) : undefined;
  const pointsToNextRank = studentAhead ? Math.max(studentAhead.points - classPoints + 1, 0) : 0;
  const studentBehind = currentLeaderboardRow ? classLeaderboardRows.find((row) => row.rank === currentLeaderboardRow.rank + 1) : undefined;
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
      <section className="learning-surface rounded-app border border-line px-5 py-5 shadow-panel lg:px-7 lg:py-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)] lg:items-center">
          <div className="rounded-xl border border-[#dfe3ff] bg-[linear-gradient(135deg,#fbfcff_0%,#f2f4ff_100%)] px-5 py-5 shadow-[0_10px_22px_rgba(66,91,177,0.08)] lg:px-6 lg:py-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5969aa]">Your learning space</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ink lg:text-3xl">Hello, {state.currentStudent.firstName}!</p>
            <p className="mt-1 max-w-xl text-sm text-muted">Keep up the momentum — small steps lead to big results.</p>
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[#4c6786]"><span>Course progress</span><span>{completedTopicCount}/{totalTopicCount} topics</span></div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#dfe3ff] p-0.5"><div className="h-full rounded-full bg-[linear-gradient(90deg,#4667db_0%,#7550cd_100%)]" style={{ width: `${completionPercentage}%` }} /></div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-[#80c8ff] bg-gradient-to-br from-[#13336b] via-[#2e62ce] to-[#7041b3] p-4 text-white shadow-[0_12px_28px_rgba(45,95,205,0.28)] lg:p-5">
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#dceeff]">Class challenge 🏆</p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/15 text-[#ffe37b] shadow-inner"><Trophy size={23} aria-hidden="true" /></span>
                      <div><p className="text-2xl font-bold leading-none text-[#ffe37b]">{classPoints.toLocaleString()}</p><p className="mt-1 text-[11px] font-semibold text-[#dceeff]">points earned</p></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5"><p className="text-[11px] font-semibold text-[#dceeff]">Your rank</p><p className="mt-1 text-2xl font-bold leading-none">#{classRank}</p></div>
                </div>
            </div>
            <div className="mt-3 space-y-2 border-t border-white/20 pt-3 text-sm font-semibold leading-snug">
              <p className="rounded-lg bg-white/10 px-3 py-2">{studentAhead ? `🚀 ${pointsToNextRank} points to rank #${studentAhead.rank}` : '🏆 You are leading the class'}</p>
              {studentBehind ? <p className="rounded-lg bg-white/10 px-3 py-2 text-[#e3efff]">{studentBehind.displayName.split(' - ')[0]} is {leadOverStudentBehind} points behind you.</p> : null}
            </div>
          </div>
        </div>
      </section>
      <Panel className="relative overflow-hidden border border-[#efca7e] bg-[linear-gradient(135deg,#fffdf8_0%,#fff5d8_100%)] p-4 shadow-[0_14px_28px_rgba(224,157,35,0.12)] lg:p-5">
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9a6500]">Learning gaps 🎯</p>
            <h2 className="mt-1 text-xl font-bold text-ink">Strengthen your weaker topics</h2>
            <p className="mt-1 text-sm text-muted">Practise these areas to build secure understanding before moving on.</p>
          </div>
          <Button variant="primary" className="min-h-9 shrink-0 px-3" onClick={() => navigate('/student/practice')}>Practise now<ChevronRight size={17} aria-hidden="true" /></Button>
        </div>
        {learningGapTopics.length ? <div className="relative mt-4 space-y-2">{learningGapTopics.map((topic) => <div className="flex items-center justify-between gap-3 rounded-xl border border-[#f0d59e] bg-white/95 p-3 text-sm text-ink shadow-sm" key={topic.id}><span className="font-bold">{topic.topicName}</span><span className="shrink-0 rounded-lg bg-[#fff0c7] px-2 py-1 font-bold text-[#a36500]">{topic.latestScore}%</span></div>)}</div> : <div className="relative mt-4 flex items-center gap-3 rounded-xl border border-[#cfe9db] bg-white/95 p-3 text-sm font-medium text-[#237748] shadow-sm"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#e2f7ed] text-base" aria-hidden="true">✓</span><p>You have no current learning gaps. Keep practising to stay confident.</p></div>}
      </Panel>
      <div className="space-y-5">
      <button
        className="w-full rounded-app border border-[#c7c2f1] bg-[linear-gradient(135deg,#f8f7ff_0%,#f0efff_100%)] p-4 text-left shadow-[0_12px_24px_rgba(76,77,197,0.1)] transition hover:-translate-y-0.5 hover:border-[#8a81e7] hover:shadow-[0_16px_28px_rgba(76,77,197,0.16)] lg:p-5"
        onClick={() => navigate('/student/assigned')}
      >
        <div className="flex items-center gap-3">
          <span className={`grid size-11 shrink-0 place-items-center rounded-2xl text-white shadow-sm ${outstandingAssignments.length ? 'bg-[linear-gradient(135deg,#e5484d_0%,#d83670_100%)]' : 'bg-[linear-gradient(135deg,#5662cb_0%,#7855cb_100%)]'}`}><ListChecks size={23} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5c56a7]">My assignments</p>
            <h2 className="mt-1 text-lg font-bold text-ink">{outstandingAssignments.length ? `${outstandingAssignments.length} assignment${outstandingAssignments.length === 1 ? '' : 's'} to complete` : 'No new assignments'}</h2>
            <p className="mt-1 text-sm text-muted">{nextDueAssignment?.dueAt ? `Next due ${formatDate(nextDueAssignment.dueAt)}.` : outstandingAssignments.length ? 'Your teacher has set work ready for you to complete.' : 'Your teacher has not set you any new assignments.'}</p>
          </div>
          <ChevronRight className="shrink-0 text-[#554fd1]" size={21} aria-hidden="true" />
        </div>
      </button>

      <section>
        <div className="mb-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Keep learning</p><h2 className="mt-1 text-lg font-bold">Choose what to do next</h2></div>
        <div className="space-y-3">
          <button className="flex w-full items-center gap-4 rounded-app border border-[#7988ff] bg-[linear-gradient(135deg,#365df0_0%,#6246d8_100%)] p-4 text-left text-white shadow-[0_16px_28px_rgba(68,79,209,0.28)] transition hover:-translate-y-0.5 hover:shadow-none" onClick={() => navigate('/student/practice')}>
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/30 bg-white/15 text-[#fff1a9] shadow-[0_7px_14px_rgba(22,22,115,0.22)]"><BookOpenCheck size={23} /></span>
            <div className="min-w-0 flex-1"><p className="text-sm font-bold">Practise a topic</p><p className="text-xs text-white/80">Choose a skill to strengthen and take a practice test.</p><p className="mt-2 text-xs font-bold text-[#fff1a9]">Choose a topic</p></div><ChevronRight className="text-white/80" size={18} aria-hidden="true" />
          </button>
          <button className="flex w-full items-center gap-4 rounded-app border border-[#ff9c7c] bg-[linear-gradient(135deg,#f56f55_0%,#e5478d_100%)] p-4 text-left text-white shadow-[0_16px_28px_rgba(226,76,119,0.24)] transition hover:-translate-y-0.5 hover:shadow-none" onClick={() => navigate('/student/results')}>
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/30 bg-white/15 text-[#fff1a9] shadow-[0_7px_14px_rgba(112,23,65,0.2)]"><Clock3 size={23} /></span>
            <div className="min-w-0 flex-1"><p className="text-sm font-bold">Review completed tests</p><p className="text-xs text-white/80">See your answers, scores, and what to improve next.</p><p className="mt-2 text-xs font-bold text-[#fff1a9]">View your results</p></div><ChevronRight className="text-white/80" size={18} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-app border border-[#28b9c7] bg-[linear-gradient(135deg,#00a7a0_0%,#087ec4_100%)] p-4 text-white shadow-[0_16px_30px_rgba(0,133,172,0.25)] lg:p-5">
        <span className="pointer-events-none absolute -right-2 -top-5 text-7xl opacity-20" aria-hidden="true">🚀</span>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/80"><span className="grid size-5 place-items-center rounded-md bg-white/15 text-[#fff1a9]"><BookOpenCheck size={12} aria-hidden="true" /></span>Your course progress</p>
            <h2 className="mt-1 text-lg font-bold">{state.subjects[0]?.subjectName ?? 'Your course'}</h2>
          </div>
          <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-bold text-white shadow-sm">{completionPercentage}% complete</span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full border border-white/25 bg-[#075b95] p-0.5 shadow-inner" aria-label={`${completionPercentage}% of topics completed`}>
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#fff36e_0%,#ffbd3e_100%)] transition-all" style={{ width: `${completionPercentage}%` }} />
        </div>
        <p className="mt-3 text-sm text-white/80">
          {completedTopicCount} of {totalTopicCount} topics practised{remainingTopicCount ? ` · ${remainingTopicCount} still to explore` : ' · You have practised every topic'}
        </p>
        <div className="mt-4 divide-y divide-white/20 border-t border-white/20">
          <div className="flex items-center justify-between py-3"><span className="text-sm font-semibold text-white/80">Completed test attempts</span><span className="rounded-lg bg-white/15 px-2.5 py-1 text-lg font-bold text-white shadow-sm">{recentAttempts.filter((attempt) => typeof attempt.percentage === 'number').length}</span></div>
          <div className="flex items-center justify-between py-3"><span className="text-sm font-semibold text-white/80">Points earned</span><span className="rounded-lg bg-[#fff1a9] px-2.5 py-1 text-lg font-bold text-[#263e72] shadow-sm">{state.pointsTotal} pts</span></div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-app border border-[#9e69e4] bg-[linear-gradient(135deg,#7044cb_0%,#ae4fc4_100%)] p-4 text-white shadow-[0_16px_30px_rgba(125,67,191,0.25)] lg:p-5">
        <span className="pointer-events-none absolute -right-1 -top-4 text-7xl opacity-20" aria-hidden="true">⭐</span>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/80"><span className="grid size-5 place-items-center rounded-md bg-white/15 text-[#fff1a9]"><BarChart3 size={12} aria-hidden="true" /></span>Your performance</p>
            <h2 className="mt-1 text-lg font-bold">Your performance snapshot</h2>
          </div>
          <NavLink className="shrink-0 text-sm font-semibold text-[#fff1a9]" to="/student/results">View results</NavLink>
        </div>
        {courseResults?.averageScore !== undefined ? <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/25 bg-white/15 p-3 shadow-sm"><p className="text-xs font-semibold text-white/75">Average score</p><p className="mt-1 text-2xl font-bold text-[#fff1a9]">{courseResults.averageScore}%</p></div><div className="rounded-xl border border-white/25 bg-white/15 p-3 shadow-sm"><p className="text-xs font-semibold text-white/75">Strongest topic</p><p className="mt-1 text-sm font-bold text-[#d5ffbe]">{strongestTopic?.topicName ?? 'Keep practising'}</p></div></div>
          <div className="mt-5 border-t border-white/20 pt-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold">Topic scores</p><p className="text-xs text-white/75">Latest test result</p></div><div className="mt-3 space-y-3">{topicScoreChart.map((topic) => <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3" key={topic.id}><div className="min-w-0"><div className="flex items-center justify-between gap-3"><span className="truncate text-sm font-semibold">{topic.topicName}</span><span className={`shrink-0 text-sm font-bold ${topic.latestScore! >= 80 ? 'text-[#d5ffbe]' : 'text-[#fff1a9]'}`}>{topic.latestScore}%</span></div><div className="mt-1.5 h-2.5 overflow-hidden rounded-full border border-white/20 bg-[#51339e] p-0.5"><div className={`h-full rounded-full ${topic.latestScore! >= 80 ? 'bg-[linear-gradient(90deg,#8df1b7_0%,#d5ffbe_100%)]' : 'bg-[linear-gradient(90deg,#ffd263_0%,#fff1a9_100%)]'}`} style={{ width: `${topic.latestScore}%` }} /></div></div></div>)}</div></div>
        </> : <p className="mt-4 text-sm text-white/80">Take a practice test to see what is going well and what to work on next.</p>}
      </section>
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
  return state.assignments.filter((assignment) => {
    if (!classIds.has(assignment.classId) || assignment.status !== 'open') return false;
    if (assignment.recipientScope === 'selected' && !assignment.recipientStudentIds.includes(state.currentStudent.id)) return false;
    return !state.attempts.some(
      (attempt) =>
        attempt.studentId === state.currentStudent.id &&
        attempt.assignmentId === assignment.id &&
        (Boolean(attempt.submittedAt) ||
          typeof attempt.score === 'number' ||
          typeof attempt.percentage === 'number' ||
          ['submitted', 'timed_out', 'marked', 'feedback_released'].includes(attempt.status)),
    );
  });
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
  const attempts = sortAttemptsByStartedAt(
    state.attempts.filter(
      (attempt) =>
        attempt.studentId === state.currentStudent.id &&
        attempt.assignmentId === assignmentId &&
        attempt.status !== 'voided' &&
        attempt.status !== 'not_started',
    ),
  );
  return attempts.find((attempt) => attempt.status === 'in_progress') ?? attempts[0];
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
  const [practiceTab, setPracticeTab] = useState<'continue' | 'start'>('start');
  const [hasChosenPracticeTab, setHasChosenPracticeTab] = useState(false);
  const [actionError, setActionError] = useState('');
  const availableSubjectIds = useMemo(() => {
    const activeClassIds = state.currentStudent.classIds;
    return new Set(
      state.classes
        .filter((classRecord) => activeClassIds.includes(classRecord.id) && classRecord.status === 'active')
        .flatMap((classRecord) => classRecord.courseIds),
    );
  }, [state.classes, state.currentStudent.classIds]);
  const availableSubjects = useMemo(
    () => state.subjects.filter((subject) => availableSubjectIds.has(subject.id)),
    [availableSubjectIds, state.subjects],
  );
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
  const selectedSubject = availableSubjects.find((subject) => subject.id === selectedSubjectId);
  const selectedUnit = state.units.find((unit) => unit.id === selectedUnitId);
  const subjectUnits = state.units.filter((unit) => unit.subjectId === selectedSubjectId);
  const unitTopics = state.topics.filter((topic) => topic.unitId === selectedUnitId);
  const unfinishedPracticeAttempts = useMemo(() => {
    const subjectIds = new Set(availableSubjects.map((subject) => subject.id));
    return state.attempts
      .filter((attempt) => attempt.studentId === state.currentStudent.id && attempt.attemptType === 'practice' && attempt.status === 'in_progress')
      .map((attempt) => {
        const test = state.tests.find((item) => item.id === attempt.testId);
        const topic = state.topics.find((item) => item.id === test?.topicId);
        const unit = state.units.find((item) => item.id === topic?.unitId);
        const questionCount = state.questions.filter((question) => question.testVersionId === attempt.testVersionId).length;
        return { attempt, test, topic, unit, questionCount };
      })
      .filter((item) => item.test && item.topic && item.unit && subjectIds.has(item.unit.subjectId))
      .sort((first, second) => new Date(second.attempt.startedAt).getTime() - new Date(first.attempt.startedAt).getTime());
  }, [availableSubjects, state.attempts, state.currentStudent.id, state.questions, state.tests, state.topics, state.units]);

  useEffect(() => {
    if (!hasChosenPracticeTab) setPracticeTab(unfinishedPracticeAttempts.length ? 'continue' : 'start');
  }, [hasChosenPracticeTab, unfinishedPracticeAttempts.length]);

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
          <h2 className="text-xl font-bold lg:text-3xl">Practice</h2>
          <p className="mt-1 text-sm text-muted">
            Choose a course, then practise the topics that matter most to you.
          </p>
        </div>
      </div>

      {actionError ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{actionError}</p> : null}

      {!selectedSubject ? (
        <div className="space-y-4">
          <div className="inline-flex rounded-xl border border-[#dedbf0] bg-white p-1 shadow-sm" role="tablist" aria-label="Practice options">
            <button aria-controls="continue-practising-panel" aria-selected={practiceTab === 'continue'} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${practiceTab === 'continue' ? 'bg-[#514bd0] text-white shadow-sm' : 'text-[#554fd1] hover:bg-[#f0efff]'}`} onClick={() => { setHasChosenPracticeTab(true); setPracticeTab('continue'); }} role="tab" type="button">Continue practising{unfinishedPracticeAttempts.length ? ` (${unfinishedPracticeAttempts.length})` : ''}</button>
            <button aria-controls="start-new-practice-panel" aria-selected={practiceTab === 'start'} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${practiceTab === 'start' ? 'bg-[#514bd0] text-white shadow-sm' : 'text-[#554fd1] hover:bg-[#f0efff]'}`} onClick={() => { setHasChosenPracticeTab(true); setPracticeTab('start'); }} role="tab" type="button">Start new practice</button>
          </div>

          {practiceTab === 'continue' ? (
            <section id="continue-practising-panel" role="tabpanel" aria-label="Continue practising">
              <div className="mb-3"><h3 className="text-lg font-bold">Continue practising</h3><p className="mt-1 text-sm text-muted">Pick up any practice test exactly where you left off.</p></div>
              {unfinishedPracticeAttempts.length ? <div className="space-y-3">{unfinishedPracticeAttempts.map(({ attempt, test, topic, unit, questionCount }) => {
                const resumeQuestion = Math.min(Math.max(attempt.resumeQuestionIndex + 1, 1), Math.max(questionCount, 1));
                return <div className="flex flex-col gap-3 rounded-app border-2 border-[#dedbf0] bg-white p-4 shadow-[0_10px_22px_rgba(58,55,143,0.08)] sm:flex-row sm:items-center sm:justify-between" key={attempt.id}><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">{unit!.unitName}</p><h4 className="mt-1 text-lg font-bold text-ink">{test!.testTitle}</h4><p className="mt-1 text-sm text-muted">{topic!.topicName} · Question {resumeQuestion} of {questionCount || 1}</p></div><Button className="min-h-10 shrink-0 px-4" onClick={() => navigate(`/student/test/${attempt.id}`)}>Continue<ChevronRight size={17} aria-hidden="true" /></Button></div>;
              })}</div> : <div className="rounded-app border border-dashed border-line bg-white p-4 text-sm text-muted">You do not have any unfinished practice tests. Choose a course to start one.</div>}
            </section>
          ) : (
            <section id="start-new-practice-panel" role="tabpanel" aria-label="Start new practice">
              <div className="mb-3"><h3 className="text-lg font-bold">Start new practice</h3><p className="mt-1 text-sm text-muted">Choose a course, then a topic and practice test.</p></div>
              <div className="grid gap-4">
          {availableSubjects.map((subject) => {
            const resourceCount = countResourcesForSubject(subject.id);
            const unitCount = state.units.filter((unit) => unit.subjectId === subject.id).length;
            const topicCount = countTopicsForSubject(subject.id);
            return (
              <button
                className="group flex w-full items-center gap-4 rounded-app border-2 border-[#dedbf0] bg-white p-4 text-left text-ink shadow-[0_10px_22px_rgba(58,55,143,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#7164e8] hover:shadow-[0_16px_28px_rgba(58,55,143,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:gap-5 lg:p-5"
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#5157dd] to-[#7b45d5] text-white shadow-[0_8px_16px_rgba(76,79,202,0.24)] lg:size-16" aria-hidden="true"><BookOpenCheck size={28} /></span>
                <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Practice course</p><h3 className="mt-1 text-xl font-bold tracking-tight lg:text-2xl">{subject.subjectName}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted lg:text-base">{subject.description}</p></div>
                <div className="hidden grid-cols-3 gap-2 sm:grid lg:min-w-[22rem]">
                  {[[unitCount, 'Units'], [topicCount, 'Topics'], [resourceCount, 'Practice tests']].map(([value, label]) => <div className="rounded-xl bg-[#f0efff] px-3 py-3" key={label as string}><span className="block text-xl font-bold text-[#514bd0]">{value}</span><span className="mt-0.5 block text-xs font-semibold text-[#71699b]">{label}</span></div>)}
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f0efff] text-[#554fd1] transition group-hover:bg-[#554fd1] group-hover:text-white" aria-hidden="true"><ChevronRight size={21} /></span>
              </button>
            );
          })}
          {!availableSubjects.length ? (
            <div className="rounded-app border border-line bg-white p-5 text-ink">
              <p className="font-bold">Your class does not have a course assigned yet.</p>
              <p className="mt-1 text-sm text-muted">Ask your teacher to add a course to your class before you start practising.</p>
            </div>
          ) : null}
              </div>
            </section>
          )}
        </div>
      ) : null}

      {selectedSubject && !selectedUnit ? (
        <div className="space-y-4">
          <div>
            <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue transition hover:text-ink" onClick={resetToCourses}>
              <ArrowLeft size={16} aria-hidden="true" />
              All courses
            </button>
            <h3 className="mt-2 font-bold">Units in {selectedSubject.subjectName}</h3>
          </div>
          <div className="space-y-3">
            {subjectUnits.map((unit, unitIndex) => {
              const unitAccent = ['from-[#5157dd] to-[#7b45d5]', 'from-[#0d9f9b] to-[#2bbd9d]', 'from-[#ef7b50] to-[#f0ad4e]', 'from-[#b45bc7] to-[#7c5be2]'][unitIndex % 4];
              return (
              <button
                className="group flex w-full items-center gap-4 rounded-app border-2 border-[#dedbf0] bg-white p-4 text-left text-ink shadow-[0_10px_22px_rgba(58,55,143,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-[#7164e8] hover:shadow-[0_16px_28px_rgba(58,55,143,0.15)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:gap-5 lg:p-5"
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
              >
                <span className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${unitAccent} text-xl font-bold text-white shadow-[0_8px_16px_rgba(76,79,202,0.24)] lg:size-16 lg:text-2xl`} aria-hidden="true">{unit.unitName.match(/^\d+/)?.[0] ?? unitIndex + 1}</span>
                <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Unit</p><h3 className="mt-1 text-lg font-bold tracking-tight lg:text-xl">{unit.unitName}</h3><div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted"><span>{state.topics.filter((topic) => topic.unitId === unit.id).length} topics</span><span aria-hidden="true">•</span><span>{countResourcesForUnit(unit.id)} practice tests</span></div></div>
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
            <h3 className="mt-2 font-bold">Topics in {selectedUnit.unitName}</h3>
          </div>
          <div className="space-y-3">
            {unitTopics.map((topic, topicIndex) => {
              const topicResources = resources.filter((resource) => resource.topicId === topic.id);
              const testResources = topicResources.filter((resource) => resource.type === 'test');
              const topicAccent = ['bg-[#6259df]', 'bg-[#0ca89c]', 'bg-[#ef8b4f]', 'bg-[#a15bd0]'][topicIndex % 4];
              return (
                <Panel className="overflow-hidden p-0" key={topic.id} tone="light">
                  <div className="flex items-start gap-4 px-4 py-4 lg:items-center lg:px-5"><span className={`mt-0.5 size-3 shrink-0 rounded-full ${topicAccent} lg:size-4`} aria-hidden="true" /><div className="min-w-0 flex-1"><h3 className="text-lg font-bold lg:text-xl">{topic.topicName}</h3></div><span className="shrink-0 rounded-lg bg-[#f0efff] px-2.5 py-1 text-sm font-bold text-[#554fd1]">{testResources.length} {testResources.length === 1 ? 'test' : 'tests'}</span></div>
                  <div className="space-y-3 border-t border-[#e2dff4] bg-[#faf9ff] px-4 py-3 lg:px-5">
                    {testResources.length ? (
                      testResources.map((resource) => (
                        <div className="flex flex-col gap-3 rounded-app border border-[#dedbf0] bg-white p-3 text-ink sm:flex-row sm:items-center sm:justify-between" key={resource.id}>
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-3 sm:block">
                              <div>
                              <h4 className="text-sm font-bold">{resource.title}</h4>
                              <p className="mt-1 text-xs text-muted">{resource.description}</p>
                              </div>
                              <StatusBadge tone={resource.status === 'available' ? 'green' : 'blue'}>{resource.status === 'available' ? 'Ready' : 'Soon'}</StatusBadge>
                            </div>
                          </div>
                          <Button className="min-h-10 shrink-0 px-4" variant="secondary" onClick={() => startResource(resource)}>Start</Button>
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
        <h2 className="text-xl font-bold lg:text-3xl">My assignments</h2>
        <p className="mt-1 text-sm text-muted lg:text-base">Complete tests your teacher has set for your class.</p>
      </div>
      {actionError ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{actionError}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {assignments.map((assignment) => {
          const version = state.testVersions.find((item) => item.id === assignment.testVersionId);
          const test = state.tests.find((item) => item.id === version?.testId);
          const display = getStudentTestDisplay(state, test?.id);
          const consumed = findExistingAssignedAttempt(state, assignment.id);
          return (
            <Panel className="border-2 border-[#dedbf0] bg-white p-4 text-ink shadow-[0_10px_22px_rgba(58,55,143,0.08)] transition hover:-translate-y-0.5 hover:border-[#7164e8] hover:shadow-[0_16px_28px_rgba(58,55,143,0.15)] lg:p-6" key={assignment.id} tone="light">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#71699b] lg:text-sm">🎯 {display.resourceLabel} set by your teacher</p>
                  <h3 className="mt-2 font-bold lg:text-xl">{display.title}</h3>
                  {display.context ? <p className="mt-1 text-sm text-muted lg:text-base">{display.context}</p> : null}
                  <p className="mt-1 text-sm text-muted lg:text-base">
                    {assignment.dueAt ? `Due ${formatDate(assignment.dueAt)}` : 'No due date set'}
                  </p>
                </div>
                <StatusBadge tone={consumed?.status === 'in_progress' ? 'blue' : consumed ? 'green' : 'amber'}>
                  {consumed?.status === 'in_progress' ? 'In progress' : consumed ? 'Completed' : 'Ready'}
                </StatusBadge>
              </div>
              <Button
                className="mt-4 w-full lg:mt-6 lg:min-h-14 lg:text-base"
                onClick={async () => {
                  try {
                    setActionError('');
                    const attempt = await state.beginAttempt({ testId: test!.id, assignmentId: assignment.id });
                    navigate(`/student/test/${attempt.id}`);
                  } catch (caught) {
                    setActionError(getActionError(caught));
                  }
                }}
              >
                {consumed?.status === 'in_progress' ? 'Continue assessment' : consumed ? 'Try again' : 'Start assessment'}
              </Button>
            </Panel>
          );
        })}
      </div>
      {!assignments.length ? (
        <section className="flex flex-col gap-4 rounded-app border-2 border-[#dedbf0] bg-white p-5 text-ink shadow-[0_10px_22px_rgba(58,55,143,0.08)] sm:flex-row sm:items-center lg:p-6">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#5157dd] to-[#7b45d5] text-white shadow-[0_8px_16px_rgba(76,79,202,0.24)]" aria-hidden="true"><ListChecks size={27} /></span>
          <div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">All clear</p><h3 className="mt-1 text-lg font-bold">No assigned tests right now</h3><p className="mt-1 text-sm text-muted">Your teacher’s assignments will appear here when they are set.</p></div>
        </section>
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
  const [index, setIndex] = useState(() => Math.min(Math.max(0, attempt?.resumeQuestionIndex ?? 0), Math.max(0, attemptQuestions.length - 1)));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const question = attemptQuestions[index];
  const answeredCount = state.answers.filter((answer) => answer.attemptId === attemptId && answer.answer).length;
  const selectedAnswer = state.answers.find((answer) => answer.attemptId === attemptId && answer.questionId === question?.id)?.answer;

  if (!attempt || !question) {
    return <div className="p-4">Attempt not found.</div>;
  }

  const submit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError('');
      await state.submitAttempt(attempt.id);
      navigate(`/student/summary/${attempt.id}`);
    } catch (caught) {
      setSubmitError(getActionError(caught));
      setIsSubmitting(false);
    }
  };

  const moveToQuestion = (nextIndex: number) => {
    const safeIndex = Math.min(Math.max(0, nextIndex), attemptQuestions.length - 1);
    setIndex(safeIndex);
    state.saveAttemptProgress(attempt.id, safeIndex);
  };

  return (
    <div className="active-test-surface relative space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <AntiCheatLayer attemptId={attempt.id} onLog={state.logAttemptEvent} />
      <div className="flex items-center justify-between">
        <button className="text-sm font-semibold text-blue" onClick={() => navigate(attempt.assignmentId ? '/student/assigned' : '/student/practice')}>Back</button>
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

      <Panel tone="light" className="watermark-grid relative overflow-hidden border-[#c8c3ff] p-4 shadow-sm lg:p-5">
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center text-3xl font-bold uppercase text-ink/10 rotate-[-32deg]">
          {leaderboardDisplay(state.currentStudent)}<br />Do not share
        </div>
        <div className="relative">
          <p className="text-base font-bold leading-7 text-ink">{index + 1}. {question.questionText}</p>
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
        <Button variant="secondary" disabled={index === 0} onClick={() => moveToQuestion(index - 1)}>Previous</Button>
        {index === attemptQuestions.length - 1 ? (
          <Button disabled={isSubmitting} onClick={submit}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
        ) : (
          <Button onClick={() => moveToQuestion(index + 1)}>Next</Button>
        )}
      </div>
      {submitError ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{submitError}</p> : null}
    </div>
  );
}

function AttemptSummaryPage() {
  const { attemptId = '' } = useParams();
  const navigate = useNavigate();
  const state = useAppState();
  const attempt = state.attempts.find((row) => row.id === attemptId);
  const test = state.tests.find((row) => row.id === attempt?.testId);
  const display = getStudentTestDisplay(state, test?.id);
  const [review, setReview] = useState<Awaited<ReturnType<typeof state.getAttemptReview>> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!attemptId) return;
    let active = true;
    void state.getAttemptReview(attemptId)
      .then((nextReview) => { if (active) setReview(nextReview); })
      .catch((caught: unknown) => { if (active) setError(getActionError(caught)); });
    return () => { active = false; };
  }, [attemptId, state]);

  if (!attempt) {
    return <div className="p-4">Test summary not found.</div>;
  }

  if (!review && !error) {
    return <Panel className="p-5"><p className="font-bold">Preparing your test summary...</p><p className="mt-1 text-sm text-white/75">Your answers are being marked and checked.</p></Panel>;
  }

  if (error || !review) {
    return <Panel tone="light" className="p-5"><p className="font-bold text-ink">We could not load this test summary.</p><p className="mt-1 text-sm text-muted">{error}</p><Button className="mt-4" onClick={() => navigate('/student/results')}>Go to my results</Button></Panel>;
  }

  const correctAnswers = review.questions.filter((question) => question.isCorrect).length;
  const incorrectAnswers = review.questions.length - correctAnswers;
  const downloadPdf = () => downloadTestSummaryPdf({
    title: display.fullPath || display.title,
    percentage: review.attempt.percentage,
    score: review.attempt.score,
    maxScore: review.attempt.maxScore,
    correctAnswers,
    totalQuestions: review.questions.length,
    questions: review.questions,
  });

  return (
    <div className="space-y-5 px-4 py-5 lg:px-0 lg:py-0">
      <section className="overflow-hidden rounded-app border border-[#7d6bff] bg-[linear-gradient(135deg,#232f8d_0%,#6844df_100%)] p-5 text-white shadow-[0_16px_30px_rgba(61,53,164,0.25)] lg:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#fff1a9]">Test complete</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-2xl font-bold lg:text-3xl">{display.title}</h1><p className="mt-1 text-sm text-white/80">Here is how you did and what to revisit next.</p></div>
          <div className="rounded-2xl border border-white/25 bg-white/15 px-5 py-3 text-center"><p className="text-3xl font-bold text-[#fff1a9]">{review.attempt.percentage}%</p><p className="text-xs font-semibold text-white/85">{review.attempt.score} of {review.attempt.maxScore} marks</p></div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/20 bg-white/10 p-3"><p className="text-xs font-semibold text-white/75">Correct answers</p><p className="mt-1 text-xl font-bold text-[#d5ffbe]">{correctAnswers} of {review.questions.length}</p></div><div className="rounded-xl border border-white/20 bg-white/10 p-3"><p className="text-xs font-semibold text-white/75">Questions to improve</p><p className="mt-1 text-xl font-bold text-[#fff1a9]">{incorrectAnswers}</p></div></div>
      </section>

      <div className="flex flex-wrap gap-3"><Button onClick={() => navigate('/student/results')}>View my results</Button><Button variant="secondary" onClick={downloadPdf}><Download size={17} aria-hidden="true" />Download PDF summary</Button></div>

      <section className="space-y-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Answer review</p><h2 className="mt-1 text-xl font-bold">See what went well and what to practise</h2></div>{review.questions.map((question) => <Panel key={question.id} tone="light" className={`p-4 ${question.isCorrect ? 'border-[#9bd986]' : 'border-[#ffb19d]'}`}><div className="flex items-start gap-3"><span className={`grid size-8 shrink-0 place-items-center rounded-full ${question.isCorrect ? 'bg-[#e6f8d8] text-[#278244]' : 'bg-[#fff0eb] text-[#d04d3f]'}`}>{question.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-ink">{question.questionOrder}. {question.questionText}</p><span className="text-sm font-bold text-muted">{question.marksAwarded}/{question.maxMarks} marks</span></div><div className="mt-3 space-y-2 text-sm"><p><span className="font-semibold text-muted">Your answer: </span><span className="font-semibold text-ink">{question.answerText}</span></p>{!question.isCorrect ? <p><span className="font-semibold text-muted">Correct answer: </span><span className="font-semibold text-[#278244]">{question.correctAnswerText}</span></p> : null}{question.feedback ? <p className="rounded-lg bg-white/80 p-2 text-muted">{question.feedback}</p> : null}</div></div></div></Panel>)}</section>
    </div>
  );
}

function ResultsPage() {
  const state = useAppState();
  const navigate = useNavigate();
  const availableSubjectIds = useMemo(
    () => new Set(
      state.classes
        .filter((classRecord) => state.currentStudent.classIds.includes(classRecord.id) && classRecord.status === 'active')
        .flatMap((classRecord) => classRecord.courseIds),
    ),
    [state.classes, state.currentStudent.classIds],
  );
  const availableSubjects = useMemo(
    () => state.subjects.filter((subject) => availableSubjectIds.has(subject.id)),
    [availableSubjectIds, state.subjects],
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => availableSubjects[0]?.id ?? '');
  const [actionError, setActionError] = useState('');
  const [startingTopicId, setStartingTopicId] = useState('');
  const [expandedUnitIds, setExpandedUnitIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (availableSubjects.some((subject) => subject.id === selectedSubjectId)) return;
    setSelectedSubjectId(availableSubjects[0]?.id ?? '');
  }, [availableSubjects, selectedSubjectId]);

  const selectedSubject = availableSubjects.find((subject) => subject.id === selectedSubjectId) ?? availableSubjects[0];
  const courseResults = selectedSubject ? buildCourseResults(state, selectedSubject.id) : null;

  const startTopicTest = async (topic: TopicResultSummary) => {
    if (!topic.testId) {
      setActionError(`No test is available for ${topic.topicName}.`);
      return;
    }

    try {
      setActionError('');
      setStartingTopicId(topic.id);
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
        <h2 className="text-xl font-bold lg:text-3xl">My results</h2>
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
        <h2 className="text-xl font-bold lg:text-3xl">My results</h2>
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
          {availableSubjects.map((subject) => (
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
            <button
              aria-expanded={expandedUnitIds.has(unit.id)}
              className={`flex w-full items-center justify-between gap-3 border-b-4 border-[#c8c3ff] px-4 py-4 text-left transition ${expandedUnitIds.has(unit.id) ? 'bg-[#f0efff]' : 'bg-white hover:bg-[#f0efff]'} focus:outline-none lg:px-5`}
              onClick={() => setExpandedUnitIds((current) => {
                const next = new Set(current);
                if (next.has(unit.id)) next.delete(unit.id);
                else next.add(unit.id);
                return next;
              })}
              type="button"
            >
              <div><h3 className="text-lg font-bold">{unit.unitName}</h3><p className="mt-1 text-sm text-muted">View topic breakdown</p></div>
              <ChevronRight className={`shrink-0 text-blue transition-transform ${expandedUnitIds.has(unit.id) ? 'rotate-90' : ''}`} size={21} aria-hidden="true" />
            </button>

            <div className="grid gap-3 bg-white px-4 py-3 text-sm sm:grid-cols-4 lg:px-5">
              <UnitSummary label="Unit average" score={unit.averageScore} />
              <UnitSummary label="Topics tried" value={`${unit.triedCount}/${unit.totalTopics}`} />
              <UnitSummary label="Best" score={unit.bestScore} />
              <UnitSummary label="Latest" score={unit.latestScore} />
            </div>

            {expandedUnitIds.has(unit.id) ? <>
            <div className="hidden p-4 lg:block lg:p-5">
              <div className="overflow-x-auto rounded-app border border-line">
                <table className="min-w-[900px] w-full border-collapse bg-white text-sm">
                  <thead className="border-b-4 border-[#c8c3ff] bg-white text-left text-xs font-semibold text-muted">
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
            </> : null}
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
        {typeof score === 'number' ? formatScore(score) : (value ?? '-')}
      </p>
    </div>
  );
}

function ProfilePage() {
  const state = useAppState();
  const classNames = currentStudentClassNames(state) || 'No class';

  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <h2 className="text-xl font-bold">Profile</h2>
      <Panel tone="light" className="overflow-hidden border-[#c9d5ff] bg-[linear-gradient(135deg,#f8f9ff_0%,#f1efff_100%)] p-0 shadow-[0_16px_30px_rgba(76,77,197,0.14)]">
        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="bg-[linear-gradient(145deg,#3159de_0%,#7046c8_100%)] px-5 py-6 text-white lg:px-6">
            <div className="flex items-center gap-3 lg:block">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-white/30 bg-white/15 text-xl font-bold shadow-[0_8px_18px_rgba(26,27,117,0.22)] lg:mb-4">{state.currentStudent.firstName[0]}</div>
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">Your profile</p><p className="mt-1 text-xl font-bold">{state.currentStudent.firstName} {state.currentStudent.surname}</p><span className="mt-2 inline-flex rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-xs font-bold text-[#fff1a9]">{state.statusName}</span></div>
            </div>
          </div>
          <div className="p-4 lg:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5969aa]">Account details</p>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Username" value={state.currentStudent.username} />
              <Info label="Student ID" value={state.currentStudent.publicStudentId} />
              <Info label="Points" value={`${state.pointsTotal}`} valueClassName="text-blue" />
              <Info label="Classes" value={classNames} />
            </dl>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function standingTileTone(rank: number | string, defaultTone: 'purple' | 'green') {
  if (rank === 1) return { surface: 'border-[#efd166] bg-[#fff8d8]', label: 'text-[#876710]', value: 'text-[#8b6500]', meta: 'text-[#876710]' };
  if (rank === 2) return { surface: 'border-[#cbd6e2] bg-[#f1f5f9]', label: 'text-[#536477]', value: 'text-[#42566f]', meta: 'text-[#536477]' };
  if (rank === 3) return { surface: 'border-[#e4b28d] bg-[#fff0e6]', label: 'text-[#865333]', value: 'text-[#8d4a24]', meta: 'text-[#865333]' };
  return defaultTone === 'purple'
    ? { surface: 'border-[#a49aee] bg-[#eeebff]', label: 'text-[#514bd0]', value: 'text-[#3930ae]', meta: 'text-[#68628e]' }
    : { surface: 'border-[#8dcc9a] bg-[#e4f6e7]', label: 'text-[#28733d]', value: 'text-[#17662b]', meta: 'text-[#4e7658]' };
}

function StudentLeaderboardPage() {
  const state = useAppState();
  const [isPointsGuideOpen, setIsPointsGuideOpen] = useState(false);
  const classLeaderboardRows = classLeaderboardForCurrentStudent(state);
  const allTimeLeaderboardRows = withCompetitionRanks([...state.allTimeLeaderboardRows]
    .sort((first, second) => second.points - first.points || first.displayName.localeCompare(second.displayName)));
  const currentLeaderboardRow = classLeaderboardRows.find((row) => row.studentId === state.currentStudent.id);
  const currentAllTimeRow = allTimeLeaderboardRows.find((row) => row.studentId === state.currentStudent.id);
  const rank = currentLeaderboardRow?.rank ?? '-';
  const leaderboardPoints = currentLeaderboardRow?.points ?? state.pointsTotal;
  const allTimeRank = currentAllTimeRow?.rank ?? '-';
  const allTimePoints = currentAllTimeRow?.points ?? state.pointsTotal;
  const classStandingTone = standingTileTone(rank, 'purple');
  const allTimeStandingTone = standingTileTone(allTimeRank, 'green');
  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <div>
        <h2 className="text-xl font-bold lg:text-3xl">Leaderboard</h2>
        <p className="mt-1 text-sm text-muted lg:text-base">Keep practising to earn points and climb the class rankings. <button type="button" className="font-bold text-[#554fd1] underline decoration-[#9b95ec] underline-offset-2" onClick={() => setIsPointsGuideOpen(true)}>See how to earn points.</button></p>
      </div>
      <div className="flex flex-col gap-4">
        <Panel className="order-first overflow-hidden border-2 border-[#c8c3ff] bg-white p-0 text-ink shadow-[0_10px_22px_rgba(58,55,143,0.1)]" tone="light">
          <div className="border-b-4 border-[#c8c3ff] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Your standings</p>
            <p className="mt-1 text-xl font-bold">{leaderboardDisplay(state.currentStudent).split(' - ')[0]}</p>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:p-5">
            <div className={`rounded-app border-2 p-4 ${classStandingTone.surface}`}><p className={`text-xs font-bold uppercase tracking-[0.12em] ${classStandingTone.label}`}>Class leaderboard</p><div className="mt-3 flex items-end justify-between gap-3"><div><span className={`block text-4xl font-bold ${classStandingTone.value}`}>#{rank}{rankMedal(rank) ? ` ${rankMedal(rank)}` : ''}</span><span className={`text-sm font-semibold ${classStandingTone.meta}`}>Class rank</span></div><div className="text-right"><span className={`block text-lg font-bold ${classStandingTone.value}`}>{leaderboardPoints}</span><span className={`text-xs font-semibold ${classStandingTone.meta}`}>points</span></div></div></div>
            <div className={`rounded-app border-2 p-4 ${allTimeStandingTone.surface}`}><p className={`text-xs font-bold uppercase tracking-[0.12em] ${allTimeStandingTone.label}`}>All-time ranking</p><div className="mt-3 flex items-end justify-between gap-3"><div><span className={`block text-4xl font-bold ${allTimeStandingTone.value}`}>#{allTimeRank}{rankMedal(allTimeRank) ? ` ${rankMedal(allTimeRank)}` : ''}</span><span className={`text-sm font-semibold ${allTimeStandingTone.meta}`}>Overall rank</span></div><div className="text-right"><span className={`block text-lg font-bold ${allTimeStandingTone.value}`}>{allTimePoints}</span><span className={`text-xs font-semibold ${allTimeStandingTone.meta}`}>points</span></div></div></div>
          </div>
          <div className="border-t border-[#dedbf0] px-4 py-3 text-sm lg:px-5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-[#71699b]">Your classes</span><span className="ml-2 font-bold">{currentStudentClassNames(state) || 'No class'}</span></div>
        </Panel>
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Panel className="overflow-hidden border-2 border-[#dedbf0] bg-white p-0 shadow-[0_10px_22px_rgba(58,55,143,0.08)]" tone="light">
          <div className="flex items-center gap-3 border-b-4 border-[#c8c3ff] bg-white px-4 py-4 lg:px-5">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#5157dd] to-[#7b45d5] text-[#fff1a9] shadow-[0_7px_14px_rgba(76,79,202,0.24)]">
              <Trophy size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71699b]">Class leaderboard</p>
              <h3 className="mt-0.5 font-bold text-ink">Current standings</h3>
            </div>
          </div>
          <div className="space-y-2 p-4 lg:p-5">
            {classLeaderboardRows.map((row) => {
              const isCurrentStudent = row.studentId === state.currentStudent.id;
              return (
                <div className={`flex items-center gap-3 rounded-xl border p-3 text-sm lg:gap-4 lg:border-2 lg:p-4 ${isCurrentStudent ? 'border-blue bg-[#eaf5ff] text-ink' : 'border-line bg-white text-ink'}`} key={row.studentId}>
                  <span className={`grid size-9 place-items-center rounded-lg text-sm font-bold lg:size-11 lg:text-base ${row.rank === 1 ? 'bg-[#f5d879] text-[#49380a]' : row.rank === 2 ? 'bg-[#dbe4ef] text-[#31445d]' : row.rank === 3 ? 'bg-[#e7bf99] text-[#603b1b]' : 'bg-[#eef4f8] text-[#42566f]'}`}>{row.rank}</span>
                  <span className="min-w-0 max-w-[min(42vw,26rem)] truncate font-bold lg:text-base">{row.displayName.split(' - ')[0]}{row.rank === 1 ? ' 🏆' : row.rank === 2 ? ' 🥈' : row.rank === 3 ? ' 🥉' : ''}</span>
                  <span className="shrink-0 rounded-xl bg-[#eef0ff] px-3 py-2 text-base font-bold text-[#393cc4] lg:px-4 lg:text-lg">{row.points} <span className="text-xs font-semibold lg:text-sm">pts</span></span>
                </div>
              );
            })}
          </div>
        </Panel>
      <Panel className="overflow-hidden border-2 border-[#dedbf0] bg-white p-0 shadow-[0_10px_22px_rgba(58,55,143,0.08)]" tone="light">
        <div className="flex items-center justify-between gap-4 border-b-4 border-[#9edfd9] bg-white px-4 py-4 lg:px-5">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#0d9f9b] to-[#2bbd9d] text-[#fff1a9] shadow-[0_7px_14px_rgba(13,159,155,0.2)]"><Trophy size={21} aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#598781]">All-time ranking</p><h3 className="mt-0.5 font-bold text-ink">Your place in csrevision</h3></div></div>
          {currentAllTimeRow ? <span className="rounded-full bg-[#e4f8f5] px-3 py-1 text-sm font-bold text-[#087c75]">You are #{currentAllTimeRow.rank}</span> : null}
        </div>
        <div className="space-y-2 p-4 lg:p-5">
          {allTimeLeaderboardRows.map((row) => {
            const isCurrentStudent = row.studentId === state.currentStudent.id;
            return <div className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${isCurrentStudent ? 'border-blue bg-[#eaf5ff] text-ink' : 'border-line bg-white text-ink'}`} key={`all-time-${row.studentId}`}><span className={`grid size-9 place-items-center rounded-lg text-sm font-bold ${row.rank === 1 ? 'bg-[#f5d879] text-[#49380a]' : row.rank === 2 ? 'bg-[#dbe4ef] text-[#31445d]' : row.rank === 3 ? 'bg-[#e7bf99] text-[#603b1b]' : 'bg-[#eef4f8] text-[#42566f]'}`}>{row.rank}</span><span className="min-w-0 max-w-[min(42vw,26rem)] truncate font-bold">{row.displayName.split(' - ')[0]}{row.rank === 1 ? ' 🏆' : row.rank === 2 ? ' 🥈' : row.rank === 3 ? ' 🥉' : ''}</span><span className="shrink-0 rounded-xl bg-[#eef0ff] px-3 py-2 text-base font-bold text-[#393cc4]">{row.points} <span className="text-xs font-semibold">pts</span></span></div>;
          })}
          {!allTimeLeaderboardRows.length ? <p className="text-sm text-muted">All-time standings will appear as students complete tests.</p> : null}
        </div>
      </Panel>
        </div>
      </div>
      {isPointsGuideOpen ? <div className="fixed inset-0 z-50 grid place-items-center bg-[#131544]/45 p-4" role="presentation" onMouseDown={() => setIsPointsGuideOpen(false)}>
        <section className="w-full max-w-lg rounded-app border border-[#c8c3ff] bg-white p-5 text-ink shadow-[0_24px_60px_rgba(24,27,80,0.3)] lg:p-6" role="dialog" aria-modal="true" aria-labelledby="points-guide-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#635dc0]">Leaderboard guide</p><h3 id="points-guide-title" className="mt-1 text-2xl font-bold">How to earn points</h3></div><button type="button" className="rounded-lg border border-[#d8d5ef] px-3 py-1.5 text-sm font-bold text-[#4b467c] hover:bg-[#f4f3ff]" onClick={() => setIsPointsGuideOpen(false)}>Close</button></div>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#4b536c]">
            <li><strong className="text-ink">Teacher-set test:</strong> 20 points for completion.</li>
            <li><strong className="text-ink">First practice attempt:</strong> 10 points for completion.</li>
            <li><strong className="text-ink">Submitted by the due date:</strong> +10 points; submitted late: −10 points.</li>
            <li><strong className="text-ink">Score rewards:</strong> +20 for 70–84%, +40 for 85–99%, or +75 for 100%.</li>
            <li><strong className="text-ink">Improvement:</strong> +30 for improving your previous best on a test by at least 10 percentage points.</li>
          </ul>
        </section>
      </div> : null}
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
