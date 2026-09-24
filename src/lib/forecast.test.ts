import { describe, expect, it } from 'vitest';
import { bucketForecast } from './forecast';

describe('bucketForecast', () => {
  const now = new Date(2026, 8, 25, 15, 0);
  const at = (day: number, hour = 9) => new Date(2026, 8, day, hour).getTime();

  it('counts overdue cards toward today and drops ones past the window', () => {
    const days = bucketForecast(
      [at(20), at(25, 8), at(25, 22), at(26), at(27), at(27), at(30)],
      now,
      3,
    );
    expect(days).toEqual([
      { date: '2026-09-25', count: 3 },
      { date: '2026-09-26', count: 1 },
      { date: '2026-09-27', count: 2 },
    ]);
  });

  it('returns empty days when nothing is due', () => {
    expect(bucketForecast([], now, 2).map((d) => d.count)).toEqual([0, 0]);
  });
});
