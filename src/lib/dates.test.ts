import { describe, expect, it } from 'vitest';
import { effectiveStreak, localDateKey, startOfLocalDay } from './dates';

// 20:00 UTC on the 25th is 04:00 on the 26th in Shanghai and 16:00 on the 25th in New York.
const instant = new Date('2026-09-25T20:00:00Z');

describe('timezone-aware days', () => {
  it('puts an instant on the right calendar day', () => {
    expect(localDateKey(instant, 'UTC')).toBe('2026-09-25');
    expect(localDateKey(instant, 'Asia/Shanghai')).toBe('2026-09-26');
    expect(localDateKey(instant, 'America/New_York')).toBe('2026-09-25');
  });

  it('finds local midnight', () => {
    expect(startOfLocalDay(instant, 'UTC').toISOString()).toBe('2026-09-25T00:00:00.000Z');
    expect(startOfLocalDay(instant, 'Asia/Shanghai').toISOString()).toBe(
      '2026-09-25T16:00:00.000Z',
    );
    expect(startOfLocalDay(instant, 'America/New_York').toISOString()).toBe(
      '2026-09-25T04:00:00.000Z',
    );
  });

  it('keeps a streak alive by the learner’s calendar, not the server’s', () => {
    // Studied on the 25th (Shanghai time); at this instant it's the 26th there — still live.
    expect(effectiveStreak(3, '2026-09-25', instant, 'Asia/Shanghai')).toBe(3);
    // Studied on the 24th: in Shanghai that's two days ago now, so the streak is over.
    expect(effectiveStreak(3, '2026-09-24', instant, 'Asia/Shanghai')).toBe(0);
  });
});
