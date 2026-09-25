import 'server-only';
import { connection } from 'next/server';
import { and, eq, gte, inArray, isNotNull, lte, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { CardState } from '@/db/schema';
import { followUpsFrom, modeFilter } from '@/lib/card-modes';
import { addDays, startOfLocalDay } from '@/lib/dates';
import { bucketForecast, type ForecastDay } from '@/lib/forecast';
import { getSettings } from './settings';
import { userTimeZone } from '@/lib/timezone';

/** Reviews coming due each day for the next `days` days (overdue counts as today). */
export async function getForecast(days = 7): Promise<ForecastDay[]> {
  await connection();
  const now = new Date();
  const settings = await getSettings();
  const tz = await userTimeZone();
  const until = addDays(startOfLocalDay(now, tz), days);
  const rows = await db
    .select({ due: schema.cards.due })
    .from(schema.cards)
    .where(
      and(
        eq(schema.cards.suspended, false),
        inArray(schema.cards.state, ['learning', 'review', 'relearning'] as CardState[]),
        lte(schema.cards.due, until),
        modeFilter(followUpsFrom(settings)),
      ),
    );
  return bucketForecast(
    rows.map((r) => r.due.getTime()),
    now,
    days,
    tz,
  );
}

export type WordsKnown = {
  /** Words whose recognition card has graduated to long-term review. */
  known: number;
  /** Of those, words with an interval of three weeks or more. */
  mature: number;
  /** All vocabulary words in the library. */
  library: number;
};

const MATURE_DAYS = 21;

export async function getWordsKnown(): Promise<WordsKnown> {
  await connection();
  const [[counts], [library]] = await Promise.all([
    db
      .select({
        known: sql<number>`count(*)`,
        mature: sql<number>`sum(case when ${schema.cards.scheduledDays} >= ${MATURE_DAYS} then 1 else 0 end)`,
      })
      .from(schema.cards)
      .where(
        and(
          isNotNull(schema.cards.wordId),
          eq(schema.cards.mode, 'recognition'),
          inArray(schema.cards.state, ['review'] as CardState[]),
        ),
      ),
    db.select({ n: sql<number>`count(*)` }).from(schema.words),
  ]);
  return {
    known: Number(counts?.known ?? 0),
    mature: Number(counts?.mature ?? 0),
    library: Number(library?.n ?? 0),
  };
}

/** Reviews done today, for the daily goal. */
export async function getReviewsToday(): Promise<number> {
  await connection();
  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.reviews)
    .where(gte(schema.reviews.reviewedAt, startOfLocalDay(new Date(), await userTimeZone())));
  return Number(row?.n ?? 0);
}
