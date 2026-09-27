import { describe, expect, it } from 'vitest';
import { pointsToGo, tallyDays } from './goal';

describe('tallyDays', () => {
  const now = new Date('2026-09-28T12:00:00Z');

  it('adds up points per day, oldest first', () => {
    const days = tallyDays(
      [
        { at: new Date('2026-09-28T09:00:00Z'), kind: 'review' },
        { at: new Date('2026-09-28T10:00:00Z'), kind: 'lesson' },
        { at: new Date('2026-09-27T10:00:00Z'), kind: 'practice' },
        { at: new Date('2026-09-20T10:00:00Z'), kind: 'lesson' }, // too old
      ],
      now,
      3,
      'UTC',
    );
    expect(days.map((d) => [d.key, d.points])).toEqual([
      ['2026-09-26', 0],
      ['2026-09-27', 1],
      ['2026-09-28', 11],
    ]);
    expect(days[2]).toMatchObject({ reviews: 1, lessons: 1, practice: 0 });
  });

  it('uses the local day', () => {
    // 23:30 on the 27th in London is already the 28th in Tokyo.
    const at = new Date('2026-09-27T22:30:00Z');
    const london = tallyDays([{ at, kind: 'review' }], now, 2, 'Europe/London');
    const tokyo = tallyDays([{ at, kind: 'review' }], now, 2, 'Asia/Tokyo');
    expect(london.find((d) => d.points)?.key).toBe('2026-09-27');
    expect(tokyo.find((d) => d.points)?.key).toBe('2026-09-28');
  });
});

describe('pointsToGo', () => {
  it('never goes below zero', () => {
    expect(pointsToGo(50, 20)).toBe(30);
    expect(pointsToGo(50, 80)).toBe(0);
  });
});
