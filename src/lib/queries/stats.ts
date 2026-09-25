import 'server-only';
import { connection } from 'next/server';
import { and, eq, gte, inArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { CardState } from '@/db/schema';
import { addDays, effectiveStreak, localDateKey, startOfLocalDay as startOfDay } from '@/lib/dates';
import { userTimeZone } from '@/lib/timezone';

export type StatsSummary = {
  totalReviews: number;
  activeCards: number;
  retention30d: number | null;
  streakDays: number;
};

export type HeatmapDay = { date: string; count: number };
export type RatingDist = { rating: 1 | 2 | 3 | 4; count: number };

export async function getStatsSummary(): Promise<StatsSummary> {
  await connection();
  const now = new Date();
  const thirtyDaysAgo = addDays(startOfDay(now, await userTimeZone()), -30);

  const [totalRow] = await db.select({ n: sql<number>`count(*)` }).from(schema.reviews);

  const [activeRow] = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.cards)
    .where(
      and(
        eq(schema.cards.suspended, false),
        inArray(schema.cards.state, ['learning', 'review', 'relearning'] as CardState[]),
      ),
    );

  const recent = await db
    .select({ rating: schema.reviews.rating })
    .from(schema.reviews)
    .where(gte(schema.reviews.reviewedAt, thirtyDaysAgo));

  let retention: number | null = null;
  if (recent.length > 0) {
    // Standard FSRS/Anki definition: a card is "recalled" unless rated Again.
    // So retention = 1 - lapse rate = (Hard + Good + Easy) / total.
    const recalled = recent.filter((r) => r.rating >= 2).length;
    retention = recalled / recent.length;
  }

  const [settings] = await db.select().from(schema.settings).limit(1);

  return {
    totalReviews: Number(totalRow?.n ?? 0),
    activeCards: Number(activeRow?.n ?? 0),
    retention30d: retention,
    streakDays: effectiveStreak(
      settings?.streakDays ?? 0,
      settings?.lastStudyDate ?? null,
      now,
      await userTimeZone(),
    ),
  };
}

export async function getHeatmap(days = 84): Promise<HeatmapDay[]> {
  await connection();
  const tz = await userTimeZone();
  const today = startOfDay(new Date(), tz);
  const first = addDays(today, -(days - 1));
  const rows = await db
    .select({ reviewedAt: schema.reviews.reviewedAt })
    .from(schema.reviews)
    .where(gte(schema.reviews.reviewedAt, first));

  const bucket = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    bucket.set(localDateKey(addDays(first, i), tz), 0);
  }
  for (const r of rows) {
    const key = localDateKey(new Date(r.reviewedAt), tz);
    bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }
  return Array.from(bucket, ([date, count]) => ({ date, count }));
}

export async function getRatingDistribution(days = 30): Promise<RatingDist[]> {
  await connection();
  const cutoff = addDays(startOfDay(new Date(), await userTimeZone()), -days);
  const rows = await db
    .select({
      rating: schema.reviews.rating,
      n: sql<number>`count(*)`,
    })
    .from(schema.reviews)
    .where(gte(schema.reviews.reviewedAt, cutoff))
    .groupBy(schema.reviews.rating);
  const map = new Map<number, number>();
  for (const r of rows) map.set(r.rating, Number(r.n));
  return [1, 2, 3, 4].map((r) => ({
    rating: r as 1 | 2 | 3 | 4,
    count: map.get(r) ?? 0,
  }));
}

export async function getCardsByState() {
  await connection();
  const rows = await db
    .select({ state: schema.cards.state, n: sql<number>`count(*)` })
    .from(schema.cards)
    .where(eq(schema.cards.suspended, false))
    .groupBy(schema.cards.state);
  const out: Record<string, number> = {
    new: 0,
    learning: 0,
    review: 0,
    relearning: 0,
  };
  for (const r of rows) out[r.state] = Number(r.n);
  return out;
}
