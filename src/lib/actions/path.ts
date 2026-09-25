'use server';

import { revalidatePath } from 'next/cache';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { lessonById, unitById } from '@/lib/curriculum';
import { rateCard, type ReviewRating } from './study';

export type WordResult = { hanzi: string; mistakes: number };

/** A checkpoint needs this share of first-try answers right to pass. */
const PASS_MARK = 80;

/**
 * Put the words into spaced repetition. Words met for the first time get a
 * first rating from how the lesson went; words already being reviewed are
 * left to their schedule.
 */
async function scheduleWords(results: WordResult[], rating: (r: WordResult) => ReviewRating) {
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
    if (card?.state === 'new') await rateCard(card.id, rating(result));
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

/** Finish a lesson: record it and schedule its words for review. */
export async function completeLesson(lessonId: string, results: WordResult[], score: number) {
  const lesson = lessonById(lessonId);
  if (!lesson) throw new Error('Unknown lesson.');
  const inLesson = new Set(lesson.words);
  // A word you slipped up on comes back sooner (Hard) than one you got straight away.
  await scheduleWords(
    results.filter((r) => inLesson.has(r.hanzi)),
    (r) => (r.mistakes > 0 ? 2 : 3),
  );
  const best = clampScore(score);
  await db
    .insert(schema.lessonProgress)
    .values({ lessonId, status: 'done', bestScore: best, attempts: 1, completedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.lessonProgress.lessonId,
      set: {
        status: 'done',
        bestScore: sql`max(${schema.lessonProgress.bestScore}, ${best})`,
        attempts: sql`${schema.lessonProgress.attempts} + 1`,
        completedAt: new Date(),
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
): Promise<{ passed: boolean }> {
  const unit = unitById(unitId);
  if (!unit) throw new Error('Unknown unit.');
  const best = clampScore(score);
  if (best < PASS_MARK) return { passed: false };

  const unitWords = new Set(unit.lessons.flatMap((l) => l.words));
  const tested = new Map(results.filter((r) => unitWords.has(r.hanzi)).map((r) => [r.hanzi, r]));
  // Words the checkpoint didn't ask about count as known too.
  const all = [...unitWords].map((hanzi) => tested.get(hanzi) ?? { hanzi, mistakes: 0 });
  await scheduleWords(all, (r) => (r.mistakes > 0 ? 2 : 4));

  await db
    .insert(schema.lessonProgress)
    .values(
      unit.lessons.map((l) => ({
        lessonId: l.id,
        status: 'tested' as const,
        bestScore: best,
        completedAt: new Date(),
      })),
    )
    .onConflictDoNothing();
  revalidate();
  return { passed: true };
}
