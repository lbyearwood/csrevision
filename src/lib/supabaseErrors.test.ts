import { describe, expect, it } from 'vitest';
import { toLocalSupabaseError, withLocalSupabaseTimeout } from './supabaseErrors';

describe('toLocalSupabaseError', () => {
  it('turns raw fetch failures into an actionable local service message', () => {
    expect(toLocalSupabaseError(new TypeError('Failed to fetch'), 'Unable to sign in').message).toBe(
      'Local Supabase is unavailable. Start or restart Supabase, then retry.',
    );
    expect(
      toLocalSupabaseError(
        new Error('Failed to send a request to the Edge Function'),
        'Unable to save answer',
      ).message,
    ).toBe('Local Supabase is unavailable. Start or restart Supabase, then retry.');
    expect(toLocalSupabaseError(new Error('name resolution failed'), 'Unable to load').message).toBe(
      'Local Supabase is unavailable. Start or restart Supabase, then retry.',
    );
  });

  it('turns stale-schema failures into migration guidance', () => {
    expect(toLocalSupabaseError({ message: 'column student_answers.revision does not exist' }, 'Unable to load').message).toContain(
      'Apply the latest migrations',
    );
  });

  it('preserves specific application errors', () => {
    expect(toLocalSupabaseError(new Error('This account is inactive.'), 'Unable to sign in').message).toBe(
      'This account is inactive.',
    );
  });

  it('rejects a stalled local request within the configured watchdog limit', async () => {
    await expect(withLocalSupabaseTimeout(new Promise(() => undefined), 5)).rejects.toThrow(
      'Local Supabase request timed out',
    );
  });
});
