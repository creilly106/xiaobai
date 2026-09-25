import 'server-only';
import { eq, sql } from 'drizzle-orm';
import { connection } from 'next/server';
import { db, schema } from '@/db/client';
import { effectiveStreak } from '@/lib/dates';
import { getAvailability, getSettings, getTodayCounts, type Availability } from './settings';

export type DashboardStats = {
  totalWords: number;
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  reviewsToday: number;
  streakDays: number;
  dailyNewLimit: number;
  dailyGoal: number;
  availability: Availability;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  await connection();
  const now = new Date();

  const [[wordCount], cardsByState, settings, today, availability] = await Promise.all([
    db.select({ n: sql<number>`count(*)` }).from(schema.words),
    db
      .select({ state: schema.cards.state, n: sql<number>`count(*)` })
      .from(schema.cards)
      .where(eq(schema.cards.suspended, false))
      .groupBy(schema.cards.state),
    getSettings(),
    getTodayCounts(now),
    getAvailability(now),
  ]);

  const by = new Map(cardsByState.map((r) => [r.state, Number(r.n)]));
  // HSK words waiting for their Learn lesson aren't really in your queue yet.
  const newCards = Math.max(0, (by.get('new') ?? 0) - availability.pathWords);
  const learningCards = (by.get('learning') ?? 0) + (by.get('relearning') ?? 0);
  const reviewCards = by.get('review') ?? 0;

  return {
    totalWords: Number(wordCount?.n ?? 0),
    totalCards: newCards + learningCards + reviewCards,
    newCards,
    learningCards,
    reviewCards,
    reviewsToday: today.total,
    streakDays: effectiveStreak(settings.streakDays, settings.lastStudyDate, now),
    dailyNewLimit: settings.dailyNewLimit,
    dailyGoal: settings.dailyGoal,
    availability,
  };
}
