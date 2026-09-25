// Day boundaries follow the learner's timezone, not the server's: the app is
// hosted in UTC, but "today" for streaks and daily limits is their day. Pass
// the timeZone from userTimeZone() (a cookie the browser sets); without one,
// the process's own timezone is used (tests, scripts, local dev).

/** Cookie holding the browser's IANA timezone, e.g. "Asia/Shanghai". */
export const TZ_COOKIE = 'tz';

type Parts = { y: number; m: number; d: number; h: number; min: number; s: number };

function partsIn(date: Date, timeZone?: string): Parts {
  if (!timeZone) {
    return {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      min: date.getMinutes(),
      s: date.getSeconds(),
    };
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    y: get('year'),
    m: get('month'),
    d: get('day'),
    h: get('hour'),
    min: get('minute'),
    s: get('second'),
  };
}

/** "2026-09-26" for the calendar day `d` falls on. */
export function localDateKey(d: Date, timeZone?: string): string {
  const p = partsIn(d, timeZone);
  return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

export function daysBetweenKeys(aKey: string, bKey: string): number {
  const a = new Date(aKey + 'T00:00:00');
  const b = new Date(bKey + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** Midnight at the start of the day `now` falls on. */
export function startOfLocalDay(now = new Date(), timeZone?: string): Date {
  if (!timeZone) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const p = partsIn(now, timeZone);
  // How far that timezone's clock is ahead of UTC right now.
  const offset =
    Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - Math.floor(now.getTime() / 1000) * 1000;
  return new Date(Date.UTC(p.y, p.m - 1, p.d) - offset);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** A streak is only "live" if you studied today or yesterday. */
export function effectiveStreak(
  streakDays: number,
  lastStudyDate: string | null,
  now = new Date(),
  timeZone?: string,
): number {
  if (!lastStudyDate || streakDays <= 0) return 0;
  const gap = daysBetweenKeys(lastStudyDate, localDateKey(now, timeZone));
  return gap <= 1 ? streakDays : 0;
}

export function formatRelativeFuture(ms: number): string {
  const mins = Math.round(ms / 60_000);
  if (mins < 1) return 'less than a minute';
  if (mins < 60) return `${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}
