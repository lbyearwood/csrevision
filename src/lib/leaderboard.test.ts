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
          yearGroup: 'Year 8',
          joinedOn: '2025-09-01',
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
          yearGroup: 'Year 8',
          joinedOn: '2025-09-01',
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
          courseIds: [],
        },
      ],
      [
        { id: 'points-1', studentId: 'student-active', points: 10, reason: 'test', createdAt: '2026-07-26T00:00:00Z' },
        { id: 'points-2', studentId: 'student-archived', points: 999, reason: 'test', createdAt: '2026-07-26T00:00:00Z' },
      ],
    );

    expect(rows.map((row) => row.studentId)).toEqual(['student-active']);
  });

  it('uses shared competition ranks for tied scores', () => {
    const rows = buildLeaderboardFromPoints(
      [
        { id: 'student-a', profileId: 'profile-a', firstName: 'Ada', surname: 'A', username: 'adaa', publicStudentId: '1001', yearGroup: 'Year 10', joinedOn: '2025-09-01', classIds: ['class-1'], classId: 'class-1', accountStatus: 'active' },
        { id: 'student-b', profileId: 'profile-b', firstName: 'Bea', surname: 'B', username: 'beab', publicStudentId: '1002', yearGroup: 'Year 10', joinedOn: '2025-09-01', classIds: ['class-1'], classId: 'class-1', accountStatus: 'active' },
        { id: 'student-c', profileId: 'profile-c', firstName: 'Cal', surname: 'C', username: 'calc', publicStudentId: '1003', yearGroup: 'Year 10', joinedOn: '2025-09-01', classIds: ['class-1'], classId: 'class-1', accountStatus: 'active' },
      ],
      [{ id: 'class-1', className: '10A Computing', academicYear: '2026/27', yearGroup: '10', ownerTeacherId: 'teacher-1', status: 'active', joinCode: 'ABCDEF', acceptingStudents: false, isSystem: false, courseIds: [] }],
      [
        { id: 'points-a', studentId: 'student-a', points: 100, reason: 'test', createdAt: '2026-07-26T00:00:00Z' },
        { id: 'points-b', studentId: 'student-b', points: 100, reason: 'test', createdAt: '2026-07-26T00:00:00Z' },
        { id: 'points-c', studentId: 'student-c', points: 90, reason: 'test', createdAt: '2026-07-26T00:00:00Z' },
      ],
    );

    expect(rows.map((row) => row.rank)).toEqual([1, 1, 3]);
  });
});
