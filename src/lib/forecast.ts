import { addDays, localDateKey, startOfLocalDay } from './dates';

export type ForecastDay = { date: string; count: number };

/**
 * Count due dates per local day for the next `days` days, starting today.
 * Anything already overdue counts toward today; anything later is dropped.
 */
export function bucketForecast(
  dues: number[],
  now: Date,
  days: number,
  timeZone?: string,
): ForecastDay[] {
  const start = startOfLocalDay(now, timeZone);
  const buckets: ForecastDay[] = Array.from({ length: days }, (_, i) => ({
    date: localDateKey(addDays(start, i), timeZone),
    count: 0,
  }));
  const index = new Map(buckets.map((b, i) => [b.date, i]));
  for (const due of dues) {
    const key = due < start.getTime() ? buckets[0].date : localDateKey(new Date(due), timeZone);
    const i = index.get(key);
    if (i !== undefined) buckets[i].count += 1;
  }
  return buckets;
}
