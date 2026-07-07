import { describe, expect, it } from 'vitest';
import { assertNoUsernameLeak, rankLeaderboard } from './leaderboard';

describe('leaderboard helpers', () => {
  it('ranks by points and display name', () => {
    expect(
      rankLeaderboard([
        { studentId: '2', displayName: 'B Student - ID 2000', publicStudentId: '2000', className: '8A', points: 20, status: 'Starter' },
        { studentId: '1', displayName: 'A Student - ID 1000', publicStudentId: '1000', className: '8A', points: 20, status: 'Starter' },
      ]).map((row) => row.studentId),
    ).toEqual(['1', '2']);
  });

  it('detects username leaks in student-facing text', () => {
    expect(assertNoUsernameLeak('M Ahmed - ID 1047', ['ma hmed4821'.replace(' ', '')])).toBe(true);
    expect(assertNoUsernameLeak('ma hmed4821'.replace(' ', ''), ['ma hmed4821'.replace(' ', '')])).toBe(false);
  });
});
