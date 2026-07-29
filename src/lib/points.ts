import type { AttemptType, StatusLevel } from '../types/domain';

export interface PointsInput {
  attemptType: AttemptType;
  percentage: number;
  isFirstPracticeAttempt: boolean;
  previousBestPercentage?: number;
  assignmentTiming?: 'on_time' | 'late';
  isPointsEligible?: boolean;
}

export const statusLevels: StatusLevel[] = [
  { id: 'starter', name: 'Starter', minPoints: 0, maxPoints: 249 },
  { id: 'learner', name: 'Learner', minPoints: 250, maxPoints: 749 },
  { id: 'builder', name: 'Builder', minPoints: 750, maxPoints: 1499 },
  { id: 'scholar', name: 'Scholar', minPoints: 1500, maxPoints: 2499 },
  { id: 'expert', name: 'Expert', minPoints: 2500, maxPoints: 3999 },
  { id: 'master', name: 'Master', minPoints: 4000 },
];

export function calculateAttemptPoints(input: PointsInput): { points: number; reasons: string[] } {
  const reasons: string[] = [];
  let points = 0;

  if (input.isPointsEligible === false) {
    if (input.percentage >= 100) return { points: 5, reasons: ['Scored 100% on an additional attempt'] };
    if (input.percentage >= 85) return { points: 2, reasons: ['Scored 85% or above on an additional attempt'] };
    return { points: 1, reasons: ['Completed additional practice attempt'] };
  }

  if (input.attemptType === 'assigned') {
    points += 20;
    reasons.push('Completed assigned test');
    if (input.assignmentTiming === 'on_time') {
      points += 10;
      reasons.push('Submitted by the due date');
    } else if (input.assignmentTiming === 'late') {
      points -= 10;
      reasons.push('Submitted after the due date');
    }
  }

  if (input.attemptType === 'practice' && input.isFirstPracticeAttempt) {
    points += 10;
    reasons.push('Completed practice test first attempt');
  }

  if (input.percentage >= 100) {
    points += 75;
    reasons.push('Scored 100%');
  } else if (input.percentage >= 85) {
    points += 40;
    reasons.push('Scored 85% or above');
  } else if (input.percentage >= 70) {
    points += 20;
    reasons.push('Scored 70% or above');
  }

  if (
    input.previousBestPercentage !== undefined &&
    input.percentage - input.previousBestPercentage >= 10
  ) {
    points += 30;
    reasons.push('Improved previous best by at least 10%');
  }

  return { points, reasons };
}

export function statusForPoints(points: number, levels = statusLevels): StatusLevel {
  return (
    levels.find(
      (level) => points >= level.minPoints && (level.maxPoints === undefined || points <= level.maxPoints),
    ) ?? levels[0]
  );
}

export function nextStatus(points: number, levels = statusLevels): StatusLevel | undefined {
  return levels.find((level) => level.minPoints > points);
}
