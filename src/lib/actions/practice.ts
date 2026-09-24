'use server';

import { and, eq, gt, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import type { PracticeKind } from '@/db/schema';
import { addDays, startOfLocalDay } from '@/lib/dates';

export type PracticeEntry = {
  kind: PracticeKind;
  item: string;
  correct: boolean;
  /** Drill-specific extras; `word` (a vocabulary word) enables "review sooner". */
  detail?: Record<string, unknown> & { word?: string };
};

const KINDS: PracticeKind[] = ['tone', 'number', 'cloze', 'quiz'];
const MAX_ENTRIES = 50;

/**
 * Record practice answers. Words missed in fill-in-the-blank or quiz practice
 * that are already in long-term review come back by tomorrow instead of
 * waiting out their full interval.
 */
export async function logPractice(entries: PracticeEntry[]): Promise<{ reviewSooner: number }> {
  const clean = (Array.isArray(entries) ? entries : [])
    .slice(0, MAX_ENTRIES)
    .filter(
      (e) =>
        e &&
        KINDS.includes(e.kind) &&
        typeof e.item === 'string' &&
        e.item.length > 0 &&
        e.item.length <= 60 &&
        typeof e.correct === 'boolean',
    );
  if (clean.length === 0) return { reviewSooner: 0 };

  await db.insert(schema.practiceLog).values(
    clean.map((e) => ({
      kind: e.kind,
      item: e.item,
      correct: e.correct,
      detail: e.detail ? JSON.stringify(e.detail).slice(0, 2000) : null,
    })),
  );

  const missedWords = [
    ...new Set(
      clean
        .filter((e) => !e.correct && (e.kind === 'cloze' || e.kind === 'quiz'))
        .map((e) => e.detail?.word)
        .filter((w): w is string => typeof w === 'string' && w.length <= 12),
    ),
  ];
  let reviewSooner = 0;
  if (missedWords.length > 0) {
    const tomorrow = addDays(startOfLocalDay(new Date()), 1);
    const ids = await db
      .select({ id: schema.words.id })
      .from(schema.words)
      .where(inArray(schema.words.hanzi, missedWords));
    if (ids.length > 0) {
      const updated = await db
        .update(schema.cards)
        .set({ due: tomorrow })
        .where(
          and(
            inArray(
              schema.cards.wordId,
              ids.map((r) => r.id),
            ),
            eq(schema.cards.mode, 'recognition'),
            eq(schema.cards.state, 'review'),
            gt(schema.cards.due, tomorrow),
          ),
        )
        .returning({ id: schema.cards.id });
      reviewSooner = updated.length;
    }
  }
  revalidatePath('/stats');
  if (reviewSooner > 0) revalidatePath('/');
  return { reviewSooner };
}
