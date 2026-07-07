import type { LeaderboardRow } from '../types/domain';

export function rankLeaderboard(rows: Omit<LeaderboardRow, 'rank'>[]): LeaderboardRow[] {
  return [...rows]
    .sort((a, b) => b.points - a.points || a.displayName.localeCompare(b.displayName))
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function assertNoUsernameLeak(studentFacingText: string, usernames: string[]): boolean {
  const lower = studentFacingText.toLowerCase();
  return usernames.every((username) => !lower.includes(username.toLowerCase()));
}
