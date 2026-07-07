import { describe, expect, it } from 'vitest';
import { calculateAttemptPoints, nextStatus, statusForPoints } from './points';

describe('points and status rules', () => {
  it('awards assigned completion and threshold points once', () => {
    expect(
      calculateAttemptPoints({
        attemptType: 'assigned',
        percentage: 86,
        isFirstPracticeAttempt: false,
        completedWithinLimit: true,
      }).points,
    ).toBe(80);
  });

  it('does not award practice completion points for repeat attempts without improvement', () => {
    expect(
      calculateAttemptPoints({
        attemptType: 'practice',
        percentage: 60,
        isFirstPracticeAttempt: false,
        previousBestPercentage: 70,
        completedWithinLimit: true,
      }).points,
    ).toBe(20);
  });

  it('calculates status and next status', () => {
    expect(statusForPoints(1600).name).toBe('Scholar');
    expect(nextStatus(1600)?.name).toBe('Expert');
  });
});
