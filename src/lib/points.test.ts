import { describe, expect, it } from 'vitest';
import { calculateAttemptPoints, nextStatus, statusForPoints } from './points';

describe('points and status rules', () => {
  it('awards an on-time assigned completion and threshold points once', () => {
    expect(
      calculateAttemptPoints({
        attemptType: 'assigned',
        percentage: 86,
        isFirstPracticeAttempt: false,
        assignmentTiming: 'on_time',
      }).points,
    ).toBe(70);
  });

  it('does not award practice completion points for repeat attempts without improvement', () => {
    expect(
      calculateAttemptPoints({
        attemptType: 'practice',
        percentage: 60,
        isFirstPracticeAttempt: false,
        previousBestPercentage: 70,
      }).points,
    ).toBe(0);
  });

  it('deducts points when an assigned test is submitted late', () => {
    expect(
      calculateAttemptPoints({
        attemptType: 'assigned',
        percentage: 60,
        isFirstPracticeAttempt: false,
        assignmentTiming: 'late',
      }).points,
    ).toBe(10);
  });

  it('awards a small mastery reward after two completed attempts of the same test', () => {
    expect(
      calculateAttemptPoints({
        attemptType: 'practice',
        percentage: 100,
        isFirstPracticeAttempt: false,
        isPointsEligible: false,
      }),
    ).toEqual({
      points: 5,
      reasons: ['Scored 100% on an additional attempt'],
    });
  });

  it('calculates status and next status', () => {
    expect(statusForPoints(1600).name).toBe('Scholar');
    expect(nextStatus(1600)?.name).toBe('Expert');
  });
});
