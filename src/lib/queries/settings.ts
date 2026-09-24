import 'server-only';
import { and, asc, eq, gt, gte, inArray, lte, sql } from 'drizzle-orm';
import { connection } from 'next/server';
import { db, schema } from '@/db/client';
import type { CardState } from '@/db/schema';
import { startOfLocalDay } from '@/lib/dates';
import { getNewCardPool } from './new-cards';
import { followUpsFrom, modeFilter } from '@/lib/card-modes';

export type AppSettings = {
  id: number | null;
  dailyNewLimit: number;
  dailyReviewLimit: number;
  retentionTarget: number;
  listeningEnabled: boolean;
  productionEnabled: boolean;
  dailyGoal: number;
  streakDays: number;
  lastStudyDate: string | null;
};

export const DEFAULT_SETTINGS: Omit<AppSettings, 'id'> = {
  dailyNewLimit: 15,
  dailyReviewLimit: 200,
  retentionTarget: 0.9,
  listeningEnabled: true,
  productionEnabled: true,
  dailyGoal: 20,
  streakDays: 0,
  lastStudyDate: null,
};

export async function getSettings(): Promise<AppSettings> {
  await connection();
  const [row] = await db.select().from(schema.settings).limit(1);
  if (!row) return { id: null, ...DEFAULT_SETTINGS };
  return {
    id: row.id,
    dailyNewLimit: row.dailyNewLimit,
    dailyReviewLimit: row.dailyReviewLimit,
    retentionTarget: row.retentionTarget,
    listeningEnabled: row.listeningEnabled,
    productionEnabled: row.productionEnabled,
    dailyGoal: row.dailyGoal,
    streakDays: row.streakDays,
    lastStudyDate: row.lastStudyDate,
  };
}

/**
 * How much of today's budget has been used. A review whose previous state
 * was "new" is the moment a new card was introduced.
 */
export async function getTodayCounts(now = new Date()) {
  await connection();
  const [row] = await db
    .select({
      introduced: sql<number>`sum(case when json_extract(${schema.reviews.prevState}, '$.state') = 'new' then 1 else 0 end)`,
      reviewed: sql<number>`sum(case when json_extract(${schema.reviews.prevState}, '$.state') = 'review' then 1 else 0 end)`,
      total: sql<number>`count(*)`,
    })
    .from(schema.reviews)
    .where(gte(schema.reviews.reviewedAt, startOfLocalDay(now)));
  return {
    newIntroduced: Number(row?.introduced ?? 0),
    reviewsDone: Number(row?.reviewed ?? 0),
    total: Number(row?.total ?? 0),
  };
}

export type Availability = {
  learningDue: number;
  reviewDue: number;
  newAvailable: number;
  newRemainingToday: number;
  reviewRemainingToday: number;
  totalDue: number;
  nextDueAt: number | null;
  /** Milliseconds from `now` until `nextDueAt` (computed here so pages stay pure). */
  nextDueInMs: number | null;
  /** Reviews are due but today's review limit is used up. */
  reviewLimitHit: boolean;
  /** New scenario sentences waiting until you know more of their words. */
  lockedSentences: number;
  /** New cards that could be studied if the daily limit allowed. */
  newInPool: number;
};

const LEARNING_STATES: CardState[] = ['learning', 'relearning'];

/** What can be studied right now, after applying the daily limits. */
export async function getAvailability(now = new Date()): Promise<Availability> {
  await connection();
  const [settings, counts] = await Promise.all([getSettings(), getTodayCounts(now)]);
  const newRemainingToday = Math.max(0, settings.dailyNewLimit - counts.newIntroduced);
  const reviewRemainingToday = Math.max(0, settings.dailyReviewLimit - counts.reviewsDone);

  const rows = await db
    .select({ state: schema.cards.state, n: sql<number>`count(*)` })
    .from(schema.cards)
    .where(
      and(
        eq(schema.cards.suspended, false),
        lte(schema.cards.due, now),
        modeFilter(followUpsFrom(settings)),
      ),
    )
    .groupBy(schema.cards.state);
  const by = new Map(rows.map((r) => [r.state, Number(r.n)]));
  const learningDue = (by.get('learning') ?? 0) + (by.get('relearning') ?? 0);
  const reviewDue = Math.min(by.get('review') ?? 0, reviewRemainingToday);
  const pool = await getNewCardPool(now, followUpsFrom(settings));
  const newAvailable = Math.min(pool.cardIds.length, newRemainingToday);

  let nextDueAt: number | null = null;
  if (learningDue + reviewDue + newAvailable === 0) {
    const [next] = await db
      .select({ due: schema.cards.due })
      .from(schema.cards)
      .where(
        and(
          eq(schema.cards.suspended, false),
          gt(schema.cards.due, now),
          modeFilter(followUpsFrom(settings)),
          inArray(schema.cards.state, [...LEARNING_STATES, 'review'] as CardState[]),
        ),
      )
      .orderBy(asc(schema.cards.due))
      .limit(1);
    nextDueAt = next?.due.getTime() ?? null;
  }

  return {
    learningDue,
    reviewDue,
    newAvailable,
    newRemainingToday,
    reviewRemainingToday,
    totalDue: learningDue + reviewDue + newAvailable,
    nextDueAt,
    nextDueInMs: nextDueAt == null ? null : Math.max(0, nextDueAt - now.getTime()),
    reviewLimitHit: reviewRemainingToday === 0 && (by.get('review') ?? 0) > 0,
    lockedSentences: pool.lockedSentences,
    newInPool: pool.cardIds.length,
  };
}
