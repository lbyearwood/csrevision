import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  ChevronRight,
  ClipboardList,
  Download,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Pencil,
  Save,
  Search,
  Settings,
  SquareCheck,
  SquareMinus,
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

const navItems = [
  { to: '/teacher', label: 'Dashboard', icon: Home },
  { to: '/teacher/classes', label: 'Classes', icon: GraduationCap },
  { to: '/teacher/students', label: 'Students', icon: UsersRound },
  { to: '/teacher/tests', label: 'Tests', icon: BookOpenCheck },
  { to: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/teacher/results', label: 'Results', icon: BarChart3 },
  { to: '/teacher/leaderboards', label: 'Leaderboards', icon: Trophy },
];

const darkSubtleText = 'text-[#b8c8d9]';
const nestedTableFrame = 'overflow-x-auto rounded-app border border-line bg-white text-ink';
const nestedTableHead = 'border-b border-line bg-mist text-xs text-muted';
const lightControlClass = 'h-11 w-full rounded-app border border-line bg-white px-3 text-sm text-ink [color-scheme:light]';

export function TeacherApp() {
  const { dataError, isLoadingData, isSupabaseBacked, signOut } = useAppState();

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
    <main className="min-h-screen bg-mist p-3 text-ink lg:p-6">
      <div className="mx-auto grid min-h-[860px] max-w-7xl overflow-hidden rounded-[18px] border border-[#d9e3ee] bg-mist shadow-panel lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-[#2a3a50] bg-[#14243a] p-4 text-white lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-app bg-teal text-white">
              <BookOpenCheck size={22} aria-hidden="true" />
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
          </Routes>
        </section>
      </div>
    </main>
  );
}

function TeacherDashboard() {
  const state = useAppState();
  const classRecord = state.classes[0];
  const classStudents = state.students.filter((student) => student.classId === classRecord.id);
  const completed = state.attempts.filter((attempt) => attempt.status === 'feedback_released').length;
  const flagged = state.attempts.reduce((total, attempt) => total + attempt.suspiciousEventCount, 0) + state.events.length;

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Dashboard</h1>
          <p className="text-sm text-muted">Class progress, assigned tests, results and activity alerts.</p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-3">
          <select className="h-12 min-w-0 rounded-app border border-[#2a3a50] bg-[#14243a] px-3 text-sm font-semibold text-white">
            <option>{classRecord.className}</option>
          </select>
          <select className="h-12 min-w-0 rounded-app border border-[#2a3a50] bg-[#14243a] px-3 text-sm font-semibold text-white">
            <option>{'OCR GCSE CS -> Hardware -> CPU'}</option>
          </select>
          <Button variant="dark"><Settings size={16} /> Settings</Button>
        </div>
      </div>

      <Panel className="grid grid-cols-2 overflow-hidden sm:grid-cols-5">
        <Metric label="Students" value={classStudents.length} />
        <Metric label="Tests Assigned" value={state.assignments.length} />
        <Metric label="Tests Completed" value={completed} />
        <Metric label="Average Score" value="72%" tone="green" />
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
                {state.tests.map((test, index) => (
                  <tr key={test.id}>
                    <td className="px-3 py-3 font-semibold">{test.testTitle}</td>
                    <td className="px-3 py-3">{index === 0 ? 'Practice' : '8A'}</td>
                    <td className="px-3 py-3">{completed}/{classStudents.length}</td>
                    <td className="px-3 py-3">{index === 0 ? '76%' : '72%'}</td>
                    <td className="px-3 py-3">{index === 0 ? 320 : 420} pts</td>
                    <td className="px-3 py-3"><StatusBadge tone={index === 0 ? 'amber' : 'red'}>{index + 1}</StatusBadge></td>
                  </tr>
                ))}
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
            {state.students.slice(0, 3).map((student, index) => (
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
                    <td className="px-3 py-3 font-bold text-green">{row.rank === 1 ? '84%' : row.rank === 2 ? '78%' : '72%'}</td>
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
          <SummaryRow label="Average Score" value="72%" />
          <Button className="mt-4 w-full" variant="secondary"><Download size={16} /> Export Report</Button>
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

function ClassesPage() {
  const state = useAppState();
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    className: '',
    academicYear: '',
    yearGroup: '',
    status: 'active' as (typeof state.classes)[number]['status'],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const startEditing = (classRecord: (typeof state.classes)[number]) => {
    setEditingClassId(classRecord.id);
    setDraft({
      className: classRecord.className,
      academicYear: classRecord.academicYear,
      yearGroup: classRecord.yearGroup,
      status: classRecord.status,
    });
    setMessage('');
    setError('');
  };

  const cancelEditing = () => {
    setEditingClassId(null);
    setMessage('');
    setError('');
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
      });
      setEditingClassId(null);
      setMessage(`${updatedClass.className} updated.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update class');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TeacherPage title="Classes">
      {message ? <p className="rounded-app bg-[#e7f7ef] p-3 text-sm font-semibold text-green">{message}</p> : null}
      {error ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm font-semibold text-danger">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {state.classes.map((classRecord) => {
          const isEditing = editingClassId === classRecord.id;
          const activeStudentCount = state.students.filter((student) => student.classId === classRecord.id).length;
          return (
            <Panel className="p-4" key={classRecord.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{classRecord.className}</h2>
                  <p className={`text-sm ${darkSubtleText}`}>{classRecord.academicYear || 'No academic year'} - Year {classRecord.yearGroup || '-'}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <StatusBadge tone={classRecord.status === 'active' ? 'green' : 'neutral'}>{classRecord.status}</StatusBadge>
                  {!isEditing ? (
                    <Button className="min-h-9 px-3" type="button" variant="secondary" onClick={() => startEditing(classRecord)}>
                      <Pencil size={15} aria-hidden="true" />
                      Edit details
                    </Button>
                  ) : null}
                </div>
              </div>
              <p className="mt-4 text-sm">{activeStudentCount} active students</p>

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
    </TeacherPage>
  );
}

function StudentsPage() {
  const state = useAppState();
  return (
    <TeacherPage title="Students">
      <Panel className="p-4">
        <div className={nestedTableFrame}>
          <table className="w-full min-w-[720px] text-left text-sm">
          <thead className={nestedTableHead}>
            <tr>
              <th className="px-4 py-3">Full name</th>
              <th className="px-3 py-3">Username</th>
              <th className="px-3 py-3">Student ID</th>
              <th className="px-3 py-3">Class</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Password</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {state.students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3 font-semibold">{student.firstName} {student.surname}</td>
                <td className="px-3 py-3">{student.username}</td>
                <td className="px-3 py-3">{student.publicStudentId}</td>
                <td className="px-3 py-3">{state.classes.find((item) => item.id === student.classId)?.className}</td>
                <td className="px-3 py-3"><StatusBadge tone="green">{student.accountStatus}</StatusBadge></td>
                <td className="px-3 py-3"><Button variant="secondary" className="min-h-9 px-3">Reset</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Panel>
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
    <TeacherPage title="Tests">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">Browse courses, then choose a unit, topic and test resource.</p>
        {selectedSubject ? (
          <Button className="min-h-10 px-3" variant="dark" onClick={resetToCourses}>
            <ArrowLeft size={17} aria-hidden="true" />
            Courses
          </Button>
        ) : null}
      </div>

      {!selectedSubject ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {state.subjects.map((subject) => {
            const testCount = countTestsForSubject(subject.id);
            return (
              <button
                className="rounded-app border border-[#2a3a50] bg-[#14243a] p-4 text-left text-white shadow-panel transition hover:border-blue hover:shadow-none lg:p-5"
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#b8c8d9]">Course</p>
                    <h2 className="mt-2 font-bold">{subject.subjectName}</h2>
                    <p className="mt-1 text-sm text-[#b8c8d9]">{subject.description}</p>
                  </div>
                  <ChevronRight className="mt-1 text-blue" size={20} aria-hidden="true" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-[#b8c8d9]">
                  <span>{state.units.filter((unit) => unit.subjectId === subject.id).length} units</span>
                  <span>{countTopicsForSubject(subject.id)} topics</span>
                  <span className="col-span-2 text-white">{testCount} test resources</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      {selectedSubject && !selectedUnit ? (
        <div className="space-y-4">
          <h2 className="font-bold">Units in {selectedSubject.subjectName}</h2>
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
                    <h2 className="mt-2 font-bold">{unit.unitName}</h2>
                    <p className="mt-1 text-sm text-[#b8c8d9]">
                      {state.topics.filter((topic) => topic.unitId === unit.id).length} topics - {countTestsForUnit(unit.id)} test resources
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
            <h2 className="font-bold">Topics in {selectedUnit.unitName}</h2>
            <Button className="min-h-10 px-3" variant="ghost" onClick={() => setSelectedUnitId(null)}>
              <ArrowLeft size={17} aria-hidden="true" />
              Units
            </Button>
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
                      topicTests.map((test) => {
                        const questionCount = test.version ? state.questions.filter((question) => question.testVersionId === test.version?.id).length : 0;
                        return (
                          <div className="rounded-app border border-line bg-white p-3 text-ink" key={test.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold text-blue">Test</p>
                                <h3 className="mt-1 text-sm font-bold">{test.testTitle}</h3>
                                <p className="mt-1 text-xs text-muted">{test.testDescription}</p>
                              </div>
                              <StatusBadge tone={test.status === 'published' ? 'green' : test.status === 'draft' ? 'amber' : 'neutral'}>
                                {test.status === 'published' ? 'Published' : test.status === 'draft' ? 'Draft' : 'Archived'}
                              </StatusBadge>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
                              <span>{test.version ? `v${test.version.versionNumber}` : 'No version'}</span>
                              <span>{questionCount} questions</span>
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

type AssignmentTab = 'create' | 'existing';

function dueDateInputToIso(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(`${value}T23:59:00`).toISOString();
}

function assignmentSortTime(value: string): number {
  return value ? new Date(value).getTime() : 0;
}

function AssignmentsPage() {
  const state = useAppState();
  const [activeTab, setActiveTab] = useState<AssignmentTab>('create');
  const [createClassId, setCreateClassId] = useState(() => state.classes[0]?.id ?? '');
  const [createSubjectId, setCreateSubjectId] = useState(() => state.subjects[0]?.id ?? '');
  const [historyClassId, setHistoryClassId] = useState('');
  const [historySubjectId, setHistorySubjectId] = useState(() => state.subjects[0]?.id ?? '');
  const dueDateInputRef = useRef<HTMLInputElement>(null);
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const firstClassId = state.classes[0]?.id ?? '';
    const firstSubjectId = state.subjects[0]?.id ?? '';
    if ((!createClassId && firstClassId) || (createClassId && !state.classes.some((classRecord) => classRecord.id === createClassId))) {
      setCreateClassId(firstClassId);
    }
    if (historyClassId && !state.classes.some((classRecord) => classRecord.id === historyClassId)) {
      setHistoryClassId('');
    }
    if ((!createSubjectId && firstSubjectId) || (createSubjectId && !state.subjects.some((subject) => subject.id === createSubjectId))) {
      setCreateSubjectId(firstSubjectId);
      setSelectedVersionIds([]);
    }
    if ((!historySubjectId && firstSubjectId) || (historySubjectId && !state.subjects.some((subject) => subject.id === historySubjectId))) {
      setHistorySubjectId(firstSubjectId);
    }
  }, [createClassId, createSubjectId, historyClassId, historySubjectId, state.classes, state.subjects]);

  const publishedTests = useMemo(
    () =>
      state.tests.flatMap((test) => {
        const version = state.testVersions.find((row) => row.testId === test.id && row.status === 'published');
        return test.status === 'published' && version ? [{ ...test, version }] : [];
      }),
    [state.testVersions, state.tests],
  );
  const createUnits = state.units.filter((unit) => unit.subjectId === createSubjectId);
  const historyUnits = state.units.filter((unit) => unit.subjectId === historySubjectId);
  const selectedVersions = useMemo(() => new Set(selectedVersionIds), [selectedVersionIds]);
  const selectedClass = state.classes.find((classRecord) => classRecord.id === createClassId);

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
      setHistoryClassId(createClassId);
      setHistorySubjectId(createSubjectId);
      setActiveTab('existing');
      setMessage(`${created.length} assignment${created.length === 1 ? '' : 's'} created for ${selectedClass?.className ?? 'class'}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create assignments');
    } finally {
      setIsSaving(false);
    }
  };

  const historyRows = useMemo(
    () =>
      historyUnits.flatMap((unit) =>
        state.topics
          .filter((topic) => topic.unitId === unit.id)
          .map((topic) => {
            const topicTests = publishedTests.filter((test) => test.topicId === topic.id);
            const versionIds = new Set(topicTests.map((test) => test.version.id));
            const assignments = state.assignments
              .filter((assignment) => assignment.classId === historyClassId && versionIds.has(assignment.testVersionId))
              .sort((first, second) => assignmentSortTime(second.dueAt || second.startAt) - assignmentSortTime(first.dueAt || first.startAt));
            const dueDates = assignments
              .filter((assignment) => assignment.dueAt)
              .sort((first, second) => assignmentSortTime(second.dueAt) - assignmentSortTime(first.dueAt))
              .slice(0, 5)
              .map((assignment) => formatDate(assignment.dueAt));
            return {
              unitName: unit.unitName,
              topicName: topic.topicName,
              testTitle: topicTests.map((test) => test.testTitle).join(', ') || '-',
              assignmentCount: assignments.length,
              dueDates,
            };
          }),
      ),
    [historyClassId, historyUnits, publishedTests, state.assignments, state.topics],
  );

  return (
    <TeacherPage title="Assignments">
      <div className="flex flex-wrap gap-2 rounded-app border border-line bg-white p-1">
        {[
          ['create', 'Create assignment'],
          ['existing', 'Existing assignments'],
        ].map(([id, label]) => (
          <button
            className={`min-h-10 rounded-[6px] px-4 text-sm font-semibold transition ${
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
          <Panel className="grid gap-4 p-4 lg:grid-cols-3">
            <label className="space-y-2 text-sm font-semibold">
              <span>Class</span>
              <select
                className={lightControlClass}
                value={createClassId}
                onChange={(event) => {
                  setCreateClassId(event.target.value);
                  setMessage('');
                  setError('');
                }}
              >
                {state.classes.map((classRecord) => (
                  <option key={classRecord.id} value={classRecord.id}>
                    {classRecord.className}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold">
              <span>Course</span>
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
              <span>Due date</span>
              <input
                className={lightControlClass}
                ref={dueDateInputRef}
                type="date"
              />
            </label>
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
                                    variant={allTopicTestsSelected ? 'secondary' : 'dark'}
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

      {activeTab === 'existing' ? (
        <div className="space-y-5">
          <Panel className="grid gap-4 p-4 lg:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold">
              <span>Class</span>
              <select
                className={lightControlClass}
                value={historyClassId}
                onChange={(event) => setHistoryClassId(event.target.value)}
              >
                <option value="">Select a class</option>
                {state.classes.map((classRecord) => (
                  <option key={classRecord.id} value={classRecord.id}>
                    {classRecord.className}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold">
              <span>Course</span>
              <select
                className={lightControlClass}
                value={historySubjectId}
                onChange={(event) => setHistorySubjectId(event.target.value)}
              >
                {state.subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </label>
          </Panel>

          {!historyClassId ? (
            <Panel className="p-4">
              <p className="font-bold">Select a class to view existing assignments.</p>
              <p className="mt-1 text-sm text-muted">Assignment history is class-specific.</p>
            </Panel>
          ) : (
            <Panel className="p-4">
              <div className="mb-4 flex flex-col gap-1">
                <h2 className="font-bold">Assignment history</h2>
                <p className="text-sm text-muted">Last five assigned dates use saved due dates and do not affect student access.</p>
              </div>
              <div className={nestedTableFrame}>
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className={nestedTableHead}>
                    <tr>
                      <th className="px-3 py-3">Unit</th>
                      <th className="px-3 py-3">Topic</th>
                      <th className="px-3 py-3">Available tests</th>
                      <th className="px-3 py-3">Times assigned</th>
                      <th className="px-3 py-3">Last five assigned dates</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {historyRows.map((row) => (
                      <tr key={`${row.unitName}-${row.topicName}`}>
                        <td className="px-3 py-3 font-semibold">{row.unitName}</td>
                        <td className="px-3 py-3">{row.topicName}</td>
                        <td className="px-3 py-3">{row.testTitle}</td>
                        <td className="px-3 py-3">{row.assignmentCount}</td>
                        <td className="px-3 py-3">
                          {row.dueDates.length ? (
                            <div className="flex flex-wrap gap-2">
                              {row.dueDates.map((date, index) => (
                                <StatusBadge key={`${row.topicName}-${date}-${index}`} tone="blue">
                                  {date}
                                </StatusBadge>
                              ))}
                            </div>
                          ) : row.assignmentCount ? (
                            <span className="text-muted">No due dates set</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>
      ) : null}
    </TeacherPage>
  );
}

function ResultsPage() {
  const state = useAppState();
  return (
    <TeacherPage title="Results">
      <Panel className="p-4">
        <div className={nestedTableFrame}>
          <table className="w-full min-w-[720px] text-left text-sm">
          <thead className={nestedTableHead}>
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-3 py-3">Test</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Score</th>
              <th className="px-3 py-3">Duration</th>
              <th className="px-3 py-3">Suspicious Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {state.attempts.map((attempt) => {
              const student = state.students.find((item) => item.id === attempt.studentId) ?? state.currentStudent;
              const test = state.tests.find((item) => item.id === attempt.testId);
              return (
                <tr key={attempt.id}>
                  <td className="px-4 py-3 font-semibold">{leaderboardDisplay(student)}</td>
                  <td className="px-3 py-3">{test?.testTitle}</td>
                  <td className="px-3 py-3">{attempt.status}</td>
                  <td className="px-3 py-3">{attempt.percentage ?? '-'}%</td>
                  <td className="px-3 py-3">{attempt.durationSeconds ? formatDate(attempt.startedAt) : 'In progress'}</td>
                  <td className="px-3 py-3">{attempt.suspiciousEventCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </Panel>
    </TeacherPage>
  );
}

function LeaderboardsPage() {
  const state = useAppState();
  return (
    <TeacherPage title="Leaderboards">
      <Panel className="p-4">
        <h2 className="font-bold">Class leaderboard</h2>
        <p className={`mb-4 text-sm ${darkSubtleText}`}>Whole-site leaderboard is disabled by default in MVP v1.</p>
        <div className="space-y-2">
          {state.leaderboardRows.map((row) => (
            <div className="grid grid-cols-[48px_1fr_90px_90px] items-center gap-3 rounded-app border border-line bg-white p-3 text-sm text-ink" key={row.studentId}>
              <span className="font-bold">#{row.rank}</span>
              <span className="font-semibold">{row.displayName}</span>
              <span>{row.points} pts</span>
              <StatusBadge tone="green">{row.status}</StatusBadge>
            </div>
          ))}
        </div>
      </Panel>
    </TeacherPage>
  );
}

function TeacherPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-5 p-4 lg:p-6">
      <h1 className="text-2xl font-bold tracking-normal">{title}</h1>
      {children}
    </div>
  );
}
