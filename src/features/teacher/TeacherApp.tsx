import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  Download,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  Settings,
  Trophy,
  UsersRound,
} from 'lucide-react';
import { Route, Routes, NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
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

export function TeacherApp() {
  const { signOut } = useAppState();
  return (
    <main className="min-h-screen bg-mist p-3 text-ink lg:p-6">
      <div className="mx-auto grid min-h-[860px] max-w-7xl overflow-hidden rounded-[18px] border border-[#c8d3df] bg-white shadow-panel lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-line bg-white p-4 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-app bg-teal text-white">
              <BookOpenCheck size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold">csrevision</p>
              <p className="text-xs text-muted">Teacher console</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                end={item.to === '/teacher'}
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-app px-3 text-sm font-semibold ${isActive ? 'bg-[#e5f4f5] text-teal' : 'text-ink hover:bg-mist'}`
                }
              >
                <item.icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-3">
              <button className="grid h-10 w-10 place-items-center rounded-app border border-line lg:hidden">
                <Menu size={20} />
              </button>
              <div>
                <p className="font-bold">csrevision</p>
                <p className="text-xs text-muted">All times shown in your local time zone.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold">J. Doe</p>
                <p className="text-xs text-muted">Teacher</p>
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-line font-bold">JD</button>
              <button className="grid h-10 w-10 place-items-center rounded-app border border-line" onClick={signOut} title="Sign out">
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
          <select className="h-12 min-w-0 rounded-app border border-line px-3 text-sm font-semibold">
            <option>{classRecord.className}</option>
          </select>
          <select className="h-12 min-w-0 rounded-app border border-line px-3 text-sm font-semibold">
            <option>{'OCR GCSE CS -> Hardware -> CPU'}</option>
          </select>
          <Button variant="secondary"><Settings size={16} /> Settings</Button>
        </div>
      </div>

      <Panel className="grid grid-cols-2 divide-x divide-y divide-line overflow-hidden sm:grid-cols-5 sm:divide-y-0">
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="py-2">Test Name</th>
                  <th>Assigned</th>
                  <th>Completed</th>
                  <th>Avg. Score</th>
                  <th>Points</th>
                  <th>Flagged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {state.tests.map((test, index) => (
                  <tr key={test.id}>
                    <td className="py-3 font-semibold">{test.testTitle}</td>
                    <td>{index === 0 ? 'Practice' : '8A'}</td>
                    <td>{completed}/{classStudents.length}</td>
                    <td>{index === 0 ? '76%' : '72%'}</td>
                    <td>{index === 0 ? 320 : 420} pts</td>
                    <td><StatusBadge tone={index === 0 ? 'amber' : 'red'}>{index + 1}</StatusBadge></td>
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
              <div className="rounded-app border border-line p-3 text-sm" key={student.id}>
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
            <Search className="text-muted" size={18} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="py-2">#</th>
                  <th>Student (ID)</th>
                  <th>Tests Completed</th>
                  <th>Average Score</th>
                  <th>Points Earned</th>
                  <th>Last Active</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {state.leaderboardRows.map((row) => (
                  <tr key={row.studentId}>
                    <td className="py-3">{row.rank}</td>
                    <td className="font-semibold">{row.displayName}</td>
                    <td>4/4</td>
                    <td className="font-bold text-green">{row.rank === 1 ? '84%' : row.rank === 2 ? '78%' : '72%'}</td>
                    <td>{row.points} pts</td>
                    <td>16 May, 10:12 AM</td>
                    <td><StatusBadge tone={row.rank <= 3 ? 'green' : 'amber'}>{row.rank <= 3 ? 'On Track' : 'Needs Support'}</StatusBadge></td>
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
    <div className="flex items-center justify-between border-b border-line py-3 text-sm last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function ClassesPage() {
  const state = useAppState();
  return (
    <TeacherPage title="Classes">
      <div className="grid gap-4 lg:grid-cols-2">
        {state.classes.map((classRecord) => (
          <Panel className="p-4" key={classRecord.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold">{classRecord.className}</h2>
                <p className="text-sm text-muted">{classRecord.academicYear} • Year {classRecord.yearGroup}</p>
              </div>
              <StatusBadge tone="green">{classRecord.status}</StatusBadge>
            </div>
            <p className="mt-4 text-sm">{state.students.filter((student) => student.classId === classRecord.id).length} active students</p>
          </Panel>
        ))}
      </div>
    </TeacherPage>
  );
}

function StudentsPage() {
  const state = useAppState();
  return (
    <TeacherPage title="Students">
      <Panel className="overflow-hidden">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-mist text-xs text-muted">
            <tr>
              <th className="px-4 py-3">Full name</th>
              <th>Username</th>
              <th>Student ID</th>
              <th>Class</th>
              <th>Status</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {state.students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3 font-semibold">{student.firstName} {student.surname}</td>
                <td>{student.username}</td>
                <td>{student.publicStudentId}</td>
                <td>{state.classes.find((item) => item.id === student.classId)?.className}</td>
                <td><StatusBadge tone="green">{student.accountStatus}</StatusBadge></td>
                <td><Button variant="secondary" className="min-h-9 px-3">Reset</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </TeacherPage>
  );
}

function TestsPage() {
  const state = useAppState();
  return (
    <TeacherPage title="Tests">
      <div className="grid gap-4 lg:grid-cols-2">
        {state.tests.map((test) => (
          <Panel className="p-4" key={test.id}>
            <p className="text-xs font-semibold text-muted">{'Subject -> Unit -> Topic'}</p>
            <h2 className="mt-2 font-bold">{test.testTitle}</h2>
            <p className="mt-1 text-sm text-muted">{test.testDescription}</p>
            <p className="mt-3 text-sm">Published versions are immutable once attempts exist.</p>
          </Panel>
        ))}
      </div>
    </TeacherPage>
  );
}

function AssignmentsPage() {
  const state = useAppState();
  return (
    <TeacherPage title="Assignments">
      {state.assignments.map((assignment) => (
        <Panel className="mb-4 p-4" key={assignment.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">CPU Timed Assessment</h2>
              <p className="text-sm text-muted">One attempt consumed at start • Due {formatDate(assignment.dueAt)}</p>
            </div>
            <StatusBadge tone="blue">{assignment.status}</StatusBadge>
          </div>
          <div className="mt-4 space-y-2">
            {state.attempts.filter((attempt) => attempt.assignmentId === assignment.id).map((attempt) => (
              <div className="flex items-center justify-between rounded-app border border-line p-3 text-sm" key={attempt.id}>
                <span>{leaderboardDisplay(state.currentStudent)} • {attempt.status}</span>
                <Button variant="danger" className="min-h-9 px-3" onClick={() => state.voidAssignedAttempt(attempt.id, 'Teacher reset for technical issue')}>
                  <RotateCcw size={15} /> Void
                </Button>
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </TeacherPage>
  );
}

function ResultsPage() {
  const state = useAppState();
  return (
    <TeacherPage title="Results">
      <Panel className="overflow-hidden">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-mist text-xs text-muted">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th>Test</th>
              <th>Status</th>
              <th>Score</th>
              <th>Duration</th>
              <th>Suspicious Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {state.attempts.map((attempt) => {
              const student = state.students.find((item) => item.id === attempt.studentId) ?? state.currentStudent;
              const test = state.tests.find((item) => item.id === attempt.testId);
              return (
                <tr key={attempt.id}>
                  <td className="px-4 py-3 font-semibold">{leaderboardDisplay(student)}</td>
                  <td>{test?.testTitle}</td>
                  <td>{attempt.status}</td>
                  <td>{attempt.percentage ?? '-'}%</td>
                  <td>{attempt.durationSeconds ? formatDate(attempt.startedAt) : 'In progress'}</td>
                  <td>{attempt.suspiciousEventCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
        <p className="mb-4 text-sm text-muted">Whole-site leaderboard is disabled by default in MVP v1.</p>
        <div className="space-y-2">
          {state.leaderboardRows.map((row) => (
            <div className="grid grid-cols-[48px_1fr_90px_90px] items-center gap-3 rounded-app border border-line p-3 text-sm" key={row.studentId}>
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
