import { BookOpenCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';
import { signInStaff, signInStudent } from '../../lib/auth';
import { useAppState } from '../../app/AppState';

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
      navigate(result.role === 'student' ? '/student' : '/teacher');
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
            <div className="grid h-12 w-12 place-items-center rounded-app bg-teal text-white">
              <BookOpenCheck size={26} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-normal">csrevision</h1>
              <p className="text-sm text-[#b8c8d9]">Sign in to continue.</p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-app border border-[#3a4e68] bg-[#0f1d2e] p-1">
            <button
              aria-pressed={mode === 'student'}
              className={`rounded-[6px] px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue/25 ${mode === 'student' ? 'bg-blue text-white shadow-sm' : 'text-[#b8c8d9] hover:bg-[#20344f] hover:text-white'}`}
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
              className={`rounded-[6px] px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue/25 ${mode === 'staff' ? 'bg-blue text-white shadow-sm' : 'text-[#b8c8d9] hover:bg-[#20344f] hover:text-white'}`}
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
            <p className="text-center text-xs leading-5 text-[#b8c8d9]">
              No self-registration is available. Student accounts are issued by a teacher or admin.
            </p>
          </form>
        </Panel>
      </div>
    </main>
  );
}
