'use server';

import { revalidatePath } from 'next/cache';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { lessonById, unitById } from '@/lib/curriculum';
import { CHECKPOINT_PASS_MARK } from '@/lib/path/lesson-states';
import { markStudied } from '@/lib/streak';
import { rateCard, type ReviewRating } from './study';

export type WordResult = { hanzi: string; mistakes: number };

/**
 * Put the words into spaced repetition. Words met for the first time get a
 * first rating from how the lesson went; words already being reviewed are
 * left to their schedule.
 */
async function scheduleWords(
  results: WordResult[],
  rating: (r: WordResult) => ReviewRating,
  at?: number,
) {
  if (results.length === 0) return;
  const words = await db
    .select({ id: schema.words.id, hanzi: schema.words.hanzi })
    .from(schema.words)
    .where(
      inArray(
        schema.words.hanzi,
        results.map((r) => r.hanzi),
      ),
    );
  const idByHanzi = new Map(words.map((w) => [w.hanzi, w.id]));
  const wordIds = words.map((w) => w.id);
  await db
    .insert(schema.cards)
    .values(wordIds.map((wordId) => ({ wordId, mode: 'recognition' as const })))
    .onConflictDoNothing();
  const cards = await db
    .select({ id: schema.cards.id, wordId: schema.cards.wordId, state: schema.cards.state })
    .from(schema.cards)
    .where(and(inArray(schema.cards.wordId, wordIds), eq(schema.cards.mode, 'recognition')));
  const cardByWord = new Map(cards.map((c) => [c.wordId, c]));
  for (const result of results) {
    const card = cardByWord.get(idByHanzi.get(result.hanzi) ?? -1);
    if (card?.state === 'new') await rateCard(card.id, rating(result), 0, 'lesson', at);
  }
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(score) ? score : 0)));
}

function revalidate() {
  revalidatePath('/learn');
  revalidatePath('/');
  revalidatePath('/study');
}

/** Offline finishes are sent later with their time; accept it if it's plausible. */
function finishedAt(at: number | undefined): Date {
  const now = Date.now();
  return at != null && Number.isFinite(at) && at <= now && at > now - 30 * 86_400_000
    ? new Date(at)
    : new Date(now);
}

/**
 * Finish a lesson: record it, log it for the daily goal (every finish, at the
 * time it happened), and schedule its words for review.
 */
export async function completeLesson(
  lessonId: string,
  results: WordResult[],
  score: number,
  /** When it was finished, if earlier (done offline, sent later). Epoch ms. */
  at?: number,
) {
  const lesson = lessonById(lessonId);
  if (!lesson) throw new Error('Unknown lesson.');
  const when = finishedAt(at);
  const inLesson = new Set(lesson.words);
  // A word you slipped up on comes back sooner (Hard) than one you got straight away.
  await scheduleWords(
    results.filter((r) => inLesson.has(r.hanzi)),
    (r) => (r.mistakes > 0 ? 2 : 3),
    when.getTime(),
  );
  const best = clampScore(score);
  await db
    .insert(schema.practiceLog)
    .values({ kind: 'lesson', item: lessonId, correct: true, createdAt: when });
  await markStudied(when);
  await db
    .insert(schema.lessonProgress)
    .values({ lessonId, status: 'done', bestScore: best, attempts: 1, completedAt: when })
    .onConflictDoUpdate({
      target: schema.lessonProgress.lessonId,
      set: {
        status: 'done',
        bestScore: sql`max(${schema.lessonProgress.bestScore}, ${best})`,
        attempts: sql`${schema.lessonProgress.attempts} + 1`,
        completedAt: when,
      },
    });
  revalidate();
}

/**
 * Test out of a unit. On a pass, its unfinished lessons are marked tested and
 * its words go into review with long first intervals — you know them.
 */
export async function completeCheckpoint(
  unitId: string,
  results: WordResult[],
  score: number,
  at?: number,
): Promise<{ passed: boolean }> {
  const unit = unitById(unitId);
  if (!unit) throw new Error('Unknown unit.');
  const when = finishedAt(at);
  const best = clampScore(score);
  if (best < CHECKPOINT_PASS_MARK) return { passed: false };

  const unitWords = new Set(unit.lessons.flatMap((l) => l.words));
  const tested = new Map(results.filter((r) => unitWords.has(r.hanzi)).map((r) => [r.hanzi, r]));
  // Words the checkpoint didn't ask about count as known too.
  const all = [...unitWords].map((hanzi) => tested.get(hanzi) ?? { hanzi, mistakes: 0 });
  await scheduleWords(all, (r) => (r.mistakes > 0 ? 2 : 4), when.getTime());

  await db
    .insert(schema.lessonProgress)
    .values(
      unit.lessons.map((l) => ({
        lessonId: l.id,
        status: 'tested' as const,
        bestScore: best,
        completedAt: when,
      })),
    )
    .onConflictDoNothing();
  revalidate();
  return { passed: true };
}

/**
 * Send a lesson or checkpoint finished offline. 'skipped' when it can never be
 * saved (the lesson has since left the curriculum), so it doesn't block the
 * rest of the queue. Other failures throw, to be retried later.
 */
export async function replayCompletion(
  kind: 'lesson' | 'checkpoint',
  id: string,
  results: WordResult[],
  score: number,
  at: number,
): Promise<'saved' | 'skipped'> {
  if (kind === 'lesson') {
    if (!lessonById(id)) return 'skipped';
    await completeLesson(id, results, score, at);
  } else {
    if (!unitById(id)) return 'skipped';
    await completeCheckpoint(id, results, score, at);
  }
  return 'saved';
}
