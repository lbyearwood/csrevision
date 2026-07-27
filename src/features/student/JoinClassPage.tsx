import { BookOpenCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../../app/AppState';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';

function normalizeJoinCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
}

export function JoinClassPage() {
  const { code = '' } = useParams();
  const navigate = useNavigate();
  const state = useAppState();
  const normalizedCode = useMemo(() => normalizeJoinCode(code), [code]);
  const [attemptedKey, setAttemptedKey] = useState('');
  const [message, setMessage] = useState('Checking class code...');
  const [error, setError] = useState('');

  useEffect(() => {
    if (normalizedCode.length !== 6) {
      setMessage('');
      setError('This class link is not valid.');
      return;
    }

    if (!state.session.role) {
      window.localStorage.setItem('pendingJoinCode', normalizedCode);
      navigate('/', { replace: true });
      return;
    }

    if (state.session.role !== 'student') {
      setMessage('');
      setError('Sign in with a student account to join a class.');
      return;
    }

    const joinKey = `${state.session.role}:${normalizedCode}`;
    if (attemptedKey === joinKey) return;
    setAttemptedKey(joinKey);
    setMessage('Joining class...');
    setError('');

    void state
      .joinClassByCode(normalizedCode)
      .then((resultMessage) => {
        window.localStorage.removeItem('pendingJoinCode');
        setMessage(resultMessage);
      })
      .catch((caught: unknown) => {
        setMessage('');
        setError(caught instanceof Error ? caught.message : 'Unable to join class');
      });
  }, [attemptedKey, navigate, normalizedCode, state]);

  return (
    <main className="min-h-screen bg-mist px-4 py-8 text-ink">
      <Panel className="mx-auto max-w-md p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-app bg-teal text-white">
            <BookOpenCheck size={23} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-normal">csrevision</h1>
            <p className="text-sm text-[#b8c8d9]">Class code {normalizedCode || '-'}</p>
          </div>
        </div>
        {message ? <p className="rounded-app bg-[#e7f7ef] p-3 text-sm font-semibold text-green">{message}</p> : null}
        {error ? <p className="rounded-app bg-[#fff1f1] p-3 text-sm text-danger">{error}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => navigate('/student/profile')}>
            Go to profile
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/')}>
            Back to sign in
          </Button>
        </div>
      </Panel>
    </main>
  );
}
