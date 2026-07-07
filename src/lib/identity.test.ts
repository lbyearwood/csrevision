import { describe, expect, it } from 'vitest';
import {
  buildUsernameStem,
  generatePublicStudentId,
  leaderboardDisplay,
  sanitizeUsername,
  studentUsernameToEmail,
  suggestUsernames,
} from './identity';

describe('identity helpers', () => {
  it('sanitizes usernames and synthetic emails', () => {
    expect(sanitizeUsername("J O'Patel 4821!")).toBe('jopatel4821');
    expect(studentUsernameToEmail("J O'Patel 4821!")).toBe('jopatel4821@students.local');
  });

  it('builds username suggestions without collisions', () => {
    expect(buildUsernameStem('Musa', 'Ahmed')).toBe('ma hmed'.replace(' ', ''));
    expect(suggestUsernames('Musa', 'Ahmed', ['ma hmed4821'.replace(' ', '')])).toEqual([
      'ma hmed6392'.replace(' ', ''),
      'ma hmed1748'.replace(' ', ''),
      'ma hmed9051'.replace(' ', ''),
    ]);
  });

  it('generates public Student IDs separately from usernames', () => {
    expect(generatePublicStudentId(['1000', '1001'])).toBe('1002');
  });

  it('formats leaderboard display without username', () => {
    expect(
      leaderboardDisplay({
        firstName: 'Musa',
        surname: 'Ahmed',
        publicStudentId: '1047',
      }),
    ).toBe('M Ahmed - ID 1047');
  });
});
