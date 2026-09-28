import 'server-only';
import { gte, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { addDays, startOfLocalDay } from '@/lib/dates';
import { tallyDays, type Activity, type DayTally } from '@/lib/goal';
import { getSettings } from './settings';

export type GoalProgress = {
  /** Points a day (0 = no goal). */
  goal: number;
  today: DayTally;
  /** The last seven days, oldest first (today last). */
  week: DayTally[];
};

/**
 * Today's points toward the daily goal, and the week so far. The time zone is
 * passed in because the daily reminder runs without the browser's cookie.
 */
export async function getGoalProgress(now: Date, timeZone?: string): Promise<GoalProgress> {
  const since = startOfLocalDay(addDays(now, -7), timeZone);
  const [settings, reviews, logged] = await Promise.all([
    getSettings(),
    db
      .select({
        at: schema.reviews.reviewedAt,
        via: sql<string | null>`json_extract(${schema.reviews.prevState}, '$.via')`,
      })
      .from(schema.reviews)
      .where(gte(schema.reviews.reviewedAt, since)),
    // Drill answers, and every finished lesson (logged by completeLesson at
    // the time it was done, so redoing one doesn't move old points).
    db
      .select({ at: schema.practiceLog.createdAt, kind: schema.practiceLog.kind })
      .from(schema.practiceLog)
      .where(gte(schema.practiceLog.createdAt, since)),
  ]);
  const events: { at: Date; kind: Activity }[] = [
    // A lesson already scores for itself; its first ratings of new words don't.
    ...reviews
      .filter((r) => r.via !== 'lesson')
      .map((r) => ({ at: r.at, kind: 'review' as const })),
    ...logged.map((p) => ({
      at: p.at,
      kind: p.kind === 'lesson' ? ('lesson' as const) : ('practice' as const),
    })),
  ];
  const week = tallyDays(events, now, 7, timeZone);
  return { goal: settings.dailyGoal, today: week[week.length - 1], week };
}
