// The daily goal: points for any kind of study, so a day of lessons or
// practice counts as much as a day of reviews.

import { localDateKey } from '@/lib/dates';

export const POINTS = { review: 1, practice: 1, lesson: 10 } as const;

export type Activity = keyof typeof POINTS;

export const GOAL_PRESETS = [
  { value: 0, label: 'Off', hint: 'No daily goal' },
  { value: 20, label: 'Casual', hint: 'About 5 minutes' },
  { value: 50, label: 'Regular', hint: 'About 15 minutes' },
  { value: 100, label: 'Serious', hint: 'About 30 minutes' },
  { value: 150, label: 'Intense', hint: 'About 45 minutes' },
] as const;

export type DayTally = {
  /** Local date, YYYY-MM-DD. */
  key: string;
  reviews: number;
  practice: number;
  lessons: number;
  points: number;
};

/** Points per local day for the `days` days ending today, oldest first. */
export function tallyDays(
  events: { at: Date; kind: Activity }[],
  now: Date,
  days: number,
  timeZone?: string,
): DayTally[] {
  // Step back half a day at a time: shorter than any day, so clock changes
  // can't make us skip one; repeats are dropped.
  const keys: string[] = [];
  for (let t = now.getTime(); keys.length < days; t -= 43_200_000) {
    const key = localDateKey(new Date(t), timeZone);
    if (!keys.includes(key)) keys.push(key);
  }
  keys.reverse();
  const byKey = new Map<string, DayTally>(
    keys.map((key) => [key, { key, reviews: 0, practice: 0, lessons: 0, points: 0 }]),
  );
  for (const e of events) {
    const day = byKey.get(localDateKey(e.at, timeZone));
    if (!day) continue;
    if (e.kind === 'review') day.reviews++;
    else if (e.kind === 'practice') day.practice++;
    else day.lessons++;
    day.points += POINTS[e.kind];
  }
  return keys.map((k) => byKey.get(k)!);
}

/** Points still needed today. */
export function pointsToGo(goal: number, points: number): number {
  return Math.max(0, goal - points);
}
