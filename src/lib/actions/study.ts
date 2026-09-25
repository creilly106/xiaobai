'use server';

import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import { nextState, Rating } from '@/lib/srs/engine';
import type { CardState } from '@/db/schema';
import { getStudyCard, type StudyCard } from '@/lib/queries/study';
import { addDays, daysBetweenKeys, localDateKey, startOfLocalDay } from '@/lib/dates';
import { backfillFollowUpCards } from '@/lib/listening-backfill';
import { writeBackupFile } from '@/lib/backup';
import { userTimeZone } from '@/lib/timezone';

export type ReviewRating = 1 | 2 | 3 | 4;

export type RateResult = {
  nextDue: number;
  state: CardState;
};

function assertCardId(id: unknown): asserts id is number {
  if (!Number.isInteger(id) || (id as number) <= 0) {
    throw new Error('Invalid card id.');
  }
}

function revalidateStudy() {
  revalidatePath('/');
  revalidatePath('/stats');
  revalidatePath('/settings');
}

export async function rateCard(
  cardId: number,
  rating: ReviewRating,
  elapsedMs = 0,
  /** 'lesson' when a Learn lesson introduces the card: it doesn't use the daily new-card limit. */
  via?: 'lesson',
): Promise<RateResult> {
  assertCardId(cardId);
  if (![1, 2, 3, 4].includes(rating)) throw new Error('Invalid rating.');
  const duration = Number.isFinite(elapsedMs)
    ? Math.min(Math.max(0, Math.round(elapsedMs)), 60 * 60 * 1000)
    : 0;
  const now = new Date();

  const [[row], [settings]] = await Promise.all([
    db.select().from(schema.cards).where(eq(schema.cards.id, cardId)).limit(1),
    db.select().from(schema.settings).limit(1),
  ]);
  if (!row) throw new Error(`Card ${cardId} not found`);

  const prevSnapshot = JSON.stringify({
    state: row.state,
    stability: row.stability,
    difficulty: row.difficulty,
    due: row.due.getTime(),
    lastReview: row.lastReview?.getTime() ?? null,
    elapsedDays: row.elapsedDays,
    scheduledDays: row.scheduledDays,
    learningSteps: row.learningSteps,
    reps: row.reps,
    lapses: row.lapses,
    ...(via === 'lesson' ? { via } : {}),
  });

  const { next } = nextState(
    row,
    rating as Exclude<Rating, Rating.Manual>,
    now,
    settings?.retentionTarget ?? 0.9,
  );

  await db
    .update(schema.cards)
    .set({
      state: next.state,
      stability: next.stability,
      difficulty: next.difficulty,
      due: next.due,
      lastReview: next.lastReview,
      elapsedDays: next.elapsedDays,
      scheduledDays: next.scheduledDays,
      learningSteps: next.learningSteps,
      reps: next.reps,
      lapses: next.lapses,
    })
    .where(eq(schema.cards.id, cardId));

  await db.insert(schema.reviews).values({
    cardId,
    rating,
    reviewedAt: now,
    durationMs: duration,
    prevState: prevSnapshot,
    nextDue: next.due,
  });

  // Graduated? Its listening card joins the queue (see Settings to turn off).
  if (next.state === 'review') {
    await backfillFollowUpCards(db, {
      listening: settings?.listeningEnabled ?? true,
      production: settings?.productionEnabled ?? true,
    });
  }

  const todayKey = localDateKey(now, await userTimeZone());
  if (settings && settings.lastStudyDate !== todayKey) {
    // First review of the day: keep a local backup (last 7 days are kept).
    try {
      await writeBackupFile('auto');
    } catch (err) {
      console.error('Automatic backup failed', err);
    }
    const continues =
      settings.lastStudyDate != null && daysBetweenKeys(settings.lastStudyDate, todayKey) === 1;
    await db
      .update(schema.settings)
      .set({
        streakDays: continues ? settings.streakDays + 1 : 1,
        lastStudyDate: todayKey,
        updatedAt: now,
      })
      .where(eq(schema.settings.id, settings.id));
  }

  revalidateStudy();
  return { nextDue: next.due.getTime(), state: next.state };
}

export type UndoResult =
  | { undone: false; message: string }
  | { undone: true; rating: number; restored: StudyCard; message: string };

export async function undoLastReview(): Promise<UndoResult> {
  const [last] = await db.select().from(schema.reviews).orderBy(desc(schema.reviews.id)).limit(1);
  if (!last) return { undone: false, message: 'Nothing to undo.' };

  let prev: Record<string, unknown> = {};
  try {
    prev = JSON.parse(last.prevState ?? '{}');
  } catch {
    return { undone: false, message: 'Cannot parse previous state.' };
  }

  const [cardRow] = await db
    .select({ id: schema.cards.id })
    .from(schema.cards)
    .where(eq(schema.cards.id, last.cardId))
    .limit(1);
  if (!cardRow) return { undone: false, message: 'Card no longer exists.' };

  await db
    .update(schema.cards)
    .set({
      state: prev.state as CardState,
      stability: (prev.stability as number) ?? 0,
      difficulty: (prev.difficulty as number) ?? 0,
      due: new Date((prev.due as number) ?? Date.now()),
      lastReview: prev.lastReview != null ? new Date(prev.lastReview as number) : null,
      elapsedDays: (prev.elapsedDays as number) ?? 0,
      scheduledDays: (prev.scheduledDays as number) ?? 0,
      learningSteps: (prev.learningSteps as number) ?? 0,
      reps: (prev.reps as number) ?? 0,
      lapses: (prev.lapses as number) ?? 0,
    })
    .where(eq(schema.cards.id, last.cardId));

  await db.delete(schema.reviews).where(eq(schema.reviews.id, last.id));

  const restored = await getStudyCard(last.cardId);
  if (!restored) return { undone: false, message: 'Card no longer exists.' };

  revalidateStudy();
  return { undone: true, rating: last.rating, restored, message: 'Undone.' };
}

export type CardSnapshot = { id: number; due: number; suspended: boolean };

async function snapshot(cardId: number): Promise<CardSnapshot> {
  const [row] = await db
    .select({ id: schema.cards.id, due: schema.cards.due, suspended: schema.cards.suspended })
    .from(schema.cards)
    .where(eq(schema.cards.id, cardId))
    .limit(1);
  if (!row) throw new Error(`Card ${cardId} not found`);
  return { id: row.id, due: row.due.getTime(), suspended: row.suspended };
}

/** Hide a card until tomorrow without rating it. Memory state is untouched. */
export async function buryCard(cardId: number): Promise<CardSnapshot> {
  assertCardId(cardId);
  const before = await snapshot(cardId);
  const tomorrow = addDays(startOfLocalDay(new Date(), await userTimeZone()), 1);
  await db.update(schema.cards).set({ due: tomorrow }).where(eq(schema.cards.id, cardId));
  revalidateStudy();
  return before;
}

/** Take a card out of study until you unsuspend it (Settings → Suspended cards). */
export async function suspendCard(cardId: number): Promise<CardSnapshot> {
  assertCardId(cardId);
  const before = await snapshot(cardId);
  await db.update(schema.cards).set({ suspended: true }).where(eq(schema.cards.id, cardId));
  revalidateStudy();
  return before;
}

/** Undo a bury or suspend by putting the card back exactly as it was. */
export async function restoreCard(snap: CardSnapshot): Promise<StudyCard | null> {
  assertCardId(snap?.id);
  if (!Number.isFinite(snap.due)) throw new Error('Invalid snapshot.');
  await db
    .update(schema.cards)
    .set({ due: new Date(snap.due), suspended: Boolean(snap.suspended) })
    .where(eq(schema.cards.id, snap.id));
  revalidateStudy();
  return getStudyCard(snap.id);
}

export async function unsuspendCard(cardId: number) {
  assertCardId(cardId);
  await db.update(schema.cards).set({ suspended: false }).where(eq(schema.cards.id, cardId));
  revalidateStudy();
  return { ok: true };
}

export async function resetReviewHistory() {
  const rows = await db.delete(schema.reviews).returning({ id: schema.reviews.id });
  // Also reset streak so stats stay consistent.
  const [settings] = await db.select().from(schema.settings).limit(1);
  if (settings) {
    await db
      .update(schema.settings)
      .set({
        streakDays: 0,
        lastStudyDate: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.settings.id, settings.id));
  }
  revalidateStudy();
  return {
    removed: rows.length,
    message: `Cleared ${rows.length} review${rows.length === 1 ? '' : 's'}.`,
  };
}
