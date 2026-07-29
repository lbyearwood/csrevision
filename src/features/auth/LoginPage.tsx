import { Code2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';
import { signInStaff, signInStudent } from '../../lib/auth';
import { useAppState } from '../../app/AppState';

const pendingJoinMaxAgeMs = 10 * 60 * 1000;

function takePendingJoinCode(): string {
  const raw = window.sessionStorage.getItem('pendingJoinCode');
  window.sessionStorage.removeItem('pendingJoinCode');
  if (!raw) return '';
  try {
    const pending = JSON.parse(raw) as { code?: unknown; createdAt?: unknown };
    const code = typeof pending.code === 'string' ? pending.code : '';
    const createdAt = typeof pending.createdAt === 'number' ? pending.createdAt : 0;
    return /^[A-Z]{6}$/.test(code) && Date.now() - createdAt >= 0 && Date.now() - createdAt <= pendingJoinMaxAgeMs ? code : '';
  } catch {
    return '';
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const { dataError, setSession } = useAppState();
  const [mode, setMode] = useState<'student' | 'staff'>('student');
  const [identifier, setIdentifier] = useState('asingh5827');
  const [password, setPassword] = useState('Localdev1!');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const result =
        mode === 'student'
          ? await signInStudent(identifier, password)
          : await signInStaff(identifier, password);
      setSession(result);
      // Old and expired class-link handoffs are discarded before normal routing.
      window.localStorage.removeItem('pendingJoinCode');
      const pendingJoinCode = takePendingJoinCode();
      navigate(result.role === 'student' && pendingJoinCode ? `/join/${pendingJoinCode}` : result.role === 'student' ? '/student' : '/teacher');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-mist px-4 py-8 text-ink">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <Panel className="mx-auto w-full max-w-md p-5">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-app border border-[#7e8eff] bg-[linear-gradient(135deg,#3857df_0%,#7650cf_100%)] text-white shadow-[0_8px_18px_rgba(56,87,223,0.28)]">
              <Code2 size={26} strokeWidth={2.4} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-normal">csrevision</h1>
              <p className="text-sm text-[#d9dfff]">Sign in to continue.</p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-app border border-[#4b59bd] bg-[#202a6f] p-1">
            <button
              aria-pressed={mode === 'student'}
              className={`rounded-[6px] px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue/25 ${mode === 'student' ? 'bg-blue text-white shadow-sm' : 'text-[#d9dfff] hover:bg-[#2d3d9b] hover:text-white'}`}
              onClick={() => {
                setMode('student');
                setIdentifier('asingh5827');
                setPassword('Localdev1!');
              }}
              type="button"
            >
              Student
            </button>
            <button
              aria-pressed={mode === 'staff'}
              className={`rounded-[6px] px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue/25 ${mode === 'staff' ? 'bg-blue text-white shadow-sm' : 'text-[#d9dfff] hover:bg-[#2d3d9b] hover:text-white'}`}
              onClick={() => {
                setMode('staff');
                setIdentifier('j.doe@school.example');
                setPassword('Localdev1!');
              }}
              type="button"
            >
              Teacher/Admin
            </button>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-semibold" htmlFor="identifier">
                {mode === 'student' ? 'Username' : 'Email'}
              </label>
              <input
                className="mt-2 h-12 w-full rounded-app border border-line bg-white px-3 text-base text-ink outline-none focus:border-blue focus:ring-2 focus:ring-blue/15"
                id="identifier"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete={mode === 'student' ? 'username' : 'email'}
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="password">
                Password
              </label>
              <input
                className="mt-2 h-12 w-full rounded-app border border-line bg-white px-3 text-base text-ink outline-none focus:border-blue focus:ring-2 focus:ring-blue/15"
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            {dataError ? <p className="rounded-app bg-[#fff7e8] p-3 text-sm font-semibold text-amber">{dataError}</p> : null}
            {error ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{error}</p> : null}
            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="text-center text-xs leading-5 text-[#d9dfff]">
              No self-registration is available. Student accounts are issued by a teacher or admin.
            </p>
          </form>
        </Panel>
      </div>
    </main>
  );
}
