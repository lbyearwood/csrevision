import { describe, expect, it } from 'vitest';
import { isDateWithinInputRange } from './time';

describe('isDateWithinInputRange', () => {
  it('includes timestamps throughout both boundary dates', () => {
    const start = new Date('2026-07-21T00:00:00').toISOString();
    const end = new Date('2026-07-22T23:59:59.999').toISOString();

    expect(isDateWithinInputRange(start, '2026-07-21', '2026-07-22')).toBe(true);
    expect(isDateWithinInputRange(end, '2026-07-21', '2026-07-22')).toBe(true);
  });

  it('excludes timestamps outside the selected local date range', () => {
    const before = new Date('2026-07-20T23:59:59.999').toISOString();
    const after = new Date('2026-07-23T00:00:00').toISOString();

    expect(isDateWithinInputRange(before, '2026-07-21', '2026-07-22')).toBe(false);
    expect(isDateWithinInputRange(after, '2026-07-21', '2026-07-22')).toBe(false);
  });

  it('supports an open boundary and rejects invalid timestamps', () => {
    const value = new Date('2026-07-22T12:00:00').toISOString();

    expect(isDateWithinInputRange(value, '', '2026-07-22')).toBe(true);
    expect(isDateWithinInputRange(value, '2026-07-22', '')).toBe(true);
    expect(isDateWithinInputRange('not-a-date', '', '')).toBe(false);
  });
});
