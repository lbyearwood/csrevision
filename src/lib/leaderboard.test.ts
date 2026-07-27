import { describe, expect, it } from 'vitest';
import { assertNoUsernameLeak, rankLeaderboard } from './leaderboard';
import { buildLeaderboardFromPoints } from './supabaseData';

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

  it('excludes archived students when rebuilding from points', () => {
    const rows = buildLeaderboardFromPoints(
      [
        {
          id: 'student-active',
          profileId: 'profile-active',
          firstName: 'Ada',
          surname: 'Byron',
          username: 'abyron1000',
          publicStudentId: '1000',
          classIds: ['class-1'],
          classId: 'class-1',
          accountStatus: 'active',
        },
        {
          id: 'student-archived',
          profileId: 'profile-archived',
          firstName: 'Grace',
          surname: 'Hopper',
          username: 'ghopper2000',
          publicStudentId: '2000',
          classIds: ['class-1'],
          classId: 'class-1',
          accountStatus: 'archived',
        },
      ],
      [
        {
          id: 'class-1',
          className: '8A Computing',
          academicYear: '2026/27',
          yearGroup: '8',
          ownerTeacherId: 'teacher-1',
          status: 'active',
          joinCode: 'ABCDEF',
          acceptingStudents: false,
          isSystem: false,
        },
      ],
      [
        { id: 'points-1', studentId: 'student-active', points: 10, reason: 'test', createdAt: '2026-07-26T00:00:00Z' },
        { id: 'points-2', studentId: 'student-archived', points: 999, reason: 'test', createdAt: '2026-07-26T00:00:00Z' },
      ],
    );

    expect(rows.map((row) => row.studentId)).toEqual(['student-active']);
  });
});
