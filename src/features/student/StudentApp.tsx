import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Home,
  ListChecks,
  LogOut,
  Trophy,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../../app/AppState';
import { Button } from '../../components/ui/Button';
import { Metric } from '../../components/ui/Metric';
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
  { to: '/student/profile', label: 'Profile', icon: UserRound },
];

export function StudentApp() {
  const { currentStudent, pointsTotal, signOut, statusName } = useAppState();
  return (
    <main className="min-h-screen bg-mist text-ink">
      <div className="mx-auto min-h-screen max-w-[430px] bg-mist shadow-panel md:my-6 md:min-h-[860px] md:rounded-[28px] md:border md:border-line lg:my-0 lg:grid lg:min-h-screen lg:max-w-7xl lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6 lg:border-0 lg:bg-transparent lg:p-6 lg:shadow-none">
        <aside className="hidden rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-white shadow-panel lg:flex lg:flex-col">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="grid h-11 w-11 place-items-center rounded-app bg-teal text-white">
              <BookOpenCheck size={23} aria-hidden="true" />
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
          <div className="mt-auto rounded-app bg-white p-3 text-ink">
            <p className="text-xs font-semibold text-muted">Status</p>
            <p className="mt-1 font-bold">{statusName}</p>
            <p className="mt-1 text-sm text-muted">{pointsTotal} points earned</p>
          </div>
        </aside>

        <section className="min-w-0 lg:space-y-5">
          <header className="flex items-center justify-between border-b border-[#2a3a50] bg-[#14243a] px-4 py-4 text-white lg:rounded-app lg:border lg:px-6 lg:shadow-panel">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-teal text-lg font-bold text-white">
                {currentStudent.firstName[0]}
              </div>
              <div>
                <p className="font-bold">{leaderboardDisplay(currentStudent).split(' - ')[0]}</p>
                <p className="text-sm text-[#a9bbcf]">Student ID: {currentStudent.publicStudentId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full border border-[#3a4e68] bg-[#0f1d2e]" title="Notifications">
                <Bell size={20} aria-hidden="true" />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-[#3a4e68] bg-[#0f1d2e]" onClick={signOut} title="Sign out">
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>
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
  const assigned = state.assignments[0];
  const assignedTest = state.tests.find((test) => test.id === 'test-cpu-assessment');
  const recentAttempts = state.attempts.filter((attempt) => attempt.studentId === state.currentStudent.id);
  const flaggedCount = recentAttempts.reduce((total, attempt) => total + attempt.suspiciousEventCount, 0);

  return (
    <div className="space-y-5 px-4 py-5 lg:px-0 lg:py-0">
      <section className="rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-white shadow-panel lg:p-5">
        <p className="text-xs font-semibold text-[#b8c8d9]">{'Subject -> Unit -> Topic'}</p>
        <p className="mt-2 text-sm font-bold lg:text-base">{'OCR GCSE Computer Science -> Hardware -> CPU'}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)] lg:items-start">
        <div className="space-y-5">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Assigned Assessments</h2>
          <NavLink className="text-sm font-semibold text-blue" to="/student/assigned">View all</NavLink>
        </div>
        <button
          className="w-full rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-left text-white shadow-panel lg:p-5"
          onClick={() => {
            const attempt = state.beginAttempt({ testId: 'test-cpu-assessment', assignmentId: assigned.id });
            navigate(`/student/test/${attempt.id}`);
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold">{assignedTest?.testTitle}</p>
              <p className="mt-1 text-sm text-[#b8c8d9]">One attempt - 2 questions - 20 pts</p>
              <p className="mt-3 text-sm">Due: {formatDate(assigned.dueAt)}, 11:59 PM</p>
            </div>
            <StatusBadge tone="amber">Not Started</StatusBadge>
          </div>
        </button>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Quick Practice</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-left text-white shadow-panel" onClick={() => navigate('/student/practice')}>
            <BookOpenCheck className="mb-3 text-blue" size={24} />
            <p className="text-sm font-bold">Practice by Topic</p>
            <p className="text-xs text-[#b8c8d9]">Strengthen skills</p>
          </button>
          <button className="rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-left text-white shadow-panel" onClick={() => navigate('/student/results')}>
            <Clock3 className="mb-3 text-teal" size={24} />
            <p className="text-sm font-bold">Past Tests</p>
            <p className="text-xs text-[#b8c8d9]">Review and learn</p>
          </button>
        </div>
      </section>

        </div>

        <div className="space-y-5">
      <Panel className="p-4 lg:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Your Progress</h2>
          <NavLink className="text-sm font-semibold text-blue" to="/student/results">View results</NavLink>
        </div>
        <div className="grid grid-cols-3 divide-x divide-line text-center">
          <Metric label="Tests Taken" value={recentAttempts.length} />
          <Metric label="Average Score" value="76%" />
          <Metric label="Points Earned" value={`${state.pointsTotal} pts`} />
        </div>
      </Panel>

      <Panel className="divide-y divide-line">
        <AlertRow icon={<AlertTriangle size={21} />} title="Suspicious Activity" body={`${flaggedCount} flagged in your recent tests`} tone="amber" />
        <AlertRow icon={<CheckCircle2 size={21} />} title="Saved Progress" body="Your last attempt was saved" tone="green" />
      </Panel>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ icon, title, body, tone }: { icon: ReactNode; title: string; body: string; tone: 'amber' | 'green' }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className={tone === 'amber' ? 'text-amber' : 'text-green'}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-muted">{body}</p>
      </div>
      <ChevronRight size={18} className="text-muted" />
    </div>
  );
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

const practiceResourceLabels: Record<PracticeResourceType, string> = {
  test: 'Tests',
  revision_lesson: 'Revision lessons',
  tutorial: 'Tutorials',
  worksheet: 'Worksheets',
};

function PracticePage() {
  const state = useAppState();
  const navigate = useNavigate();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
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

  const startResource = (resource: PracticeResource) => {
    if (resource.type !== 'test' || !resource.testId) return;
    const attempt = state.beginAttempt({ testId: resource.testId });
    navigate(`/student/test/${attempt.id}`);
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
            Browse available courses, then choose a unit, topic and resource.
          </p>
        </div>
        {selectedSubject ? (
          <Button className="min-h-10 px-3" variant="dark" onClick={resetToCourses}>
            <ArrowLeft size={17} aria-hidden="true" />
            Courses
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
        <span className="rounded-app border border-[#2a3a50] bg-[#14243a] px-3 py-2 text-white">Courses</span>
        {selectedSubject ? <span className="rounded-app border border-[#2a3a50] bg-[#14243a] px-3 py-2 text-white">{selectedSubject.subjectName}</span> : null}
        {selectedUnit ? <span className="rounded-app border border-[#2a3a50] bg-[#14243a] px-3 py-2 text-white">{selectedUnit.unitName}</span> : null}
      </div>

      {!selectedSubject ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {state.subjects.map((subject) => {
            const resourceCount = countResourcesForSubject(subject.id);
            return (
              <button
                className="rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-left text-white shadow-panel transition hover:border-blue hover:shadow-none lg:p-5"
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#b8c8d9]">Course</p>
                    <h3 className="mt-2 font-bold">{subject.subjectName}</h3>
                    <p className="mt-1 text-sm text-[#b8c8d9]">{subject.description}</p>
                  </div>
                  <ChevronRight className="mt-1 text-blue" size={20} aria-hidden="true" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-[#b8c8d9]">
                  <span>{state.units.filter((unit) => unit.subjectId === subject.id).length} units</span>
                  <span>{countTopicsForSubject(subject.id)} topics</span>
                  <span className="col-span-2 text-white">{resourceCount} available practice resources</span>
                </div>
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
                  <div className="mt-4 rounded-app border border-line bg-white p-3 text-ink">
                    <div className="flex items-center gap-2 text-muted">
                      <ListChecks size={16} aria-hidden="true" />
                      <span className="text-[11px] font-semibold">Tests</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-ink">{testResources.length ? `${testResources.length} ready` : 'None available'}</p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {testResources.length ? (
                      testResources.map((resource) => (
                        <div className="rounded-app border border-line bg-white p-3 text-ink" key={resource.id}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-blue">{practiceResourceLabels[resource.type]}</p>
                              <h4 className="mt-1 text-sm font-bold">{resource.title}</h4>
                              <p className="mt-1 text-xs text-muted">{resource.description}</p>
                            </div>
                            <StatusBadge tone={resource.status === 'available' ? 'green' : 'blue'}>
                              {resource.status === 'available' ? 'Ready' : 'Soon'}
                            </StatusBadge>
                          </div>
                          <Button className="mt-3 w-full" variant="dark" onClick={() => startResource(resource)}>
                            Start practice
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
  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <h2 className="text-xl font-bold">Assigned</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {state.assignments.map((assignment) => {
          const version = state.testVersions.find((item) => item.id === assignment.testVersionId);
          const test = state.tests.find((item) => item.id === version?.testId);
          const consumed = state.attempts.find((attempt) => attempt.assignmentId === assignment.id && attempt.status !== 'voided');
          return (
            <Panel className="p-4 lg:p-5" key={assignment.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-muted">One-attempt assigned assessment</p>
                  <h3 className="mt-2 font-bold">{test?.testTitle}</h3>
                  <p className="mt-1 text-sm text-muted">Due {formatDate(assignment.dueAt)} - {formatDuration(assignment.timeLimitSeconds)}</p>
                </div>
                <StatusBadge tone={consumed ? 'blue' : 'amber'}>{consumed ? 'Started' : 'Ready'}</StatusBadge>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={Boolean(consumed && consumed.status !== 'in_progress')}
                onClick={() => {
                  const attempt = state.beginAttempt({ testId: test!.id, assignmentId: assignment.id });
                  navigate(`/student/test/${attempt.id}`);
                }}
              >
                {consumed?.status === 'in_progress' ? 'Continue attempt' : consumed ? 'Attempt consumed' : 'Start assessment'}
              </Button>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function ActiveTestPage() {
  const { attemptId = '' } = useParams();
  const navigate = useNavigate();
  const state = useAppState();
  const attempt = state.attempts.find((row) => row.id === attemptId);
  const test = state.tests.find((row) => row.id === attempt?.testId);
  const attemptQuestions = state.questions.filter((question) => question.testVersionId === attempt?.testVersionId);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(attempt?.timeLimitSeconds ?? 0);
  const question = attemptQuestions[index];
  const answeredCount = state.answers.filter((answer) => answer.attemptId === attemptId && answer.answer).length;
  const selectedAnswer = state.answers.find((answer) => answer.attemptId === attemptId && answer.questionId === question?.id)?.answer;

  useEffect(() => {
    if (!remaining || attempt?.status !== 'in_progress') return;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [attempt?.status, remaining]);

  useEffect(() => {
    if (remaining === 0 && attempt?.status === 'in_progress') {
      state.submitAttempt(attempt.id);
      navigate('/student/results');
    }
  }, [attempt, navigate, remaining, state]);

  if (!attempt || !question) {
    return <div className="p-4">Attempt not found.</div>;
  }

  const submit = () => {
    state.submitAttempt(attempt.id);
    navigate('/student/results');
  };

  return (
    <div className="active-test-surface relative space-y-4 px-4 py-5 lg:mx-auto lg:max-w-4xl lg:px-0 lg:py-0">
      <AntiCheatLayer attemptId={attempt.id} onLog={state.logAttemptEvent} />
      <div className="flex items-center justify-between">
        <button className="text-sm font-semibold text-blue" onClick={() => navigate('/student/assigned')}>Back</button>
        <h2 className="max-w-[230px] truncate text-sm font-bold">{test?.testTitle}</h2>
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
          <p className="mt-4 rounded-app border border-[#cfe3ff] bg-[#eaf4ff] p-3 text-sm">
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
          <Button onClick={submit}>Submit</Button>
        ) : (
          <Button onClick={() => setIndex((value) => Math.min(attemptQuestions.length - 1, value + 1))}>Next</Button>
        )}
      </div>
      <p className="text-xs text-[#a9bbcf]">
        All changes saved. The platform deters copying, printing and screenshot-based sharing through watermarking, randomised questions, shuffled answers, timers and activity logging. It cannot fully prevent external screenshots or photographs.
      </p>
    </div>
  );
}

function ResultsPage() {
  const state = useAppState();
  const rows = state.attempts.filter((attempt) => attempt.studentId === state.currentStudent.id);
  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <h2 className="text-xl font-bold">Results</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((attempt) => {
          const test = state.tests.find((item) => item.id === attempt.testId);
          return (
            <Panel className="p-4 lg:p-5" key={attempt.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{test?.testTitle}</h3>
                  <p className="mt-1 text-sm text-muted">{attempt.attemptType} - {formatDate(attempt.startedAt)}</p>
                  <p className="mt-2 text-sm">Score: {attempt.percentage ?? 'Pending'}%</p>
                </div>
                <StatusBadge tone={attempt.status === 'feedback_released' ? 'green' : 'blue'}>{attempt.status.replaceAll('_', ' ')}</StatusBadge>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function ProfilePage() {
  const state = useAppState();
  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <h2 className="text-xl font-bold">Profile</h2>
      <Panel className="max-w-3xl space-y-3 p-4 lg:p-5">
        <p className="text-sm text-[#b8c8d9]">Account details</p>
        <p className="text-lg font-bold">{state.currentStudent.firstName} {state.currentStudent.surname}</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Username" value={state.currentStudent.username} />
          <Info label="Student ID" value={state.currentStudent.publicStudentId} />
          <Info label="Status" value={state.statusName} />
          <Info label="Points" value={`${state.pointsTotal}`} />
          <Info label="Class" value={state.classes.find((item) => item.id === state.currentStudent.classId)?.className ?? ''} />
        </dl>
      </Panel>
    </div>
  );
}

function StudentLeaderboardPage() {
  const state = useAppState();
  const rank = state.leaderboardRows.find((row) => row.studentId === state.currentStudent.id)?.rank ?? '-';
  return (
    <div className="space-y-4 px-4 py-5 lg:px-0 lg:py-0">
      <div>
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <p className="mt-1 text-sm text-muted">Class standings use your public display name and Student ID.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <Panel className="p-4 lg:p-5">
          <h3 className="font-bold">Class Leaderboard</h3>
          <div className="mt-4 space-y-2">
            {state.leaderboardRows.map((row) => (
              <div className="flex items-center justify-between rounded-app border border-line bg-white p-3 text-sm text-ink" key={row.studentId}>
                <span className="font-semibold">#{row.rank} {row.displayName}</span>
                <span>{row.points} pts</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-4 lg:p-5">
          <p className="text-sm text-[#b8c8d9]">Your leaderboard display</p>
          <p className="mt-2 text-lg font-bold">{leaderboardDisplay(state.currentStudent)}</p>
          <div className="mt-4 grid gap-3 text-sm">
            <Info label="Class rank" value={`#${rank}`} />
            <Info label="Points" value={`${state.pointsTotal}`} />
            <Info label="Class" value={state.classes.find((item) => item.id === state.currentStudent.classId)?.className ?? ''} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-app border border-line bg-white p-3 text-ink">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-bold">{value}</dd>
    </div>
  );
}
