'use server';

import { revalidatePath } from 'next/cache';
import { and, eq, inArray } from 'drizzle-orm';
import { db, schema } from '@/db/client';

function validLevel(level: unknown): level is number {
  return typeof level === 'number' && Number.isInteger(level) && level >= 1 && level <= 9;
}

export async function seedHskLevel(level: number) {
  if (!validLevel(level)) return { created: 0, message: 'Invalid HSK level.' };
  const words = await db
    .select({ id: schema.words.id })
    .from(schema.words)
    .where(eq(schema.words.hskLevel, level));

  if (words.length === 0) {
    return { created: 0, message: `No words found for HSK ${level}.` };
  }

  const wordIds = words.map((w) => w.id);
  const existing = await db
    .select({ wordId: schema.cards.wordId })
    .from(schema.cards)
    .where(
      and(
        inArray(schema.cards.wordId, wordIds),
        eq(schema.cards.mode, 'recognition'),
      ),
    );
  const existingIds = new Set(existing.map((r) => r.wordId));
  const toCreate = wordIds.filter((id) => !existingIds.has(id));

  if (toCreate.length === 0) {
    return { created: 0, message: `HSK ${level} already in your queue.` };
  }

  const deck = (
    await db
      .select()
      .from(schema.decks)
      .where(eq(schema.decks.name, `HSK ${level}`))
      .limit(1)
  )[0];

  await db.insert(schema.cards).values(
    toCreate.map((wordId) => ({
      wordId,
      deckId: deck?.id,
      mode: 'recognition' as const,
    })),
  );

  revalidatePath('/');
  revalidatePath('/library');
  return {
    created: toCreate.length,
    message: `Added ${toCreate.length} HSK ${level} card${toCreate.length === 1 ? '' : 's'}.`,
  };
}

export async function removeHskLevel(level: number) {
  if (!validLevel(level)) return { removed: 0, message: 'Invalid HSK level.' };
  const words = await db
    .select({ id: schema.words.id })
    .from(schema.words)
    .where(eq(schema.words.hskLevel, level));
  if (words.length === 0) {
    return { removed: 0, message: `No words found for HSK ${level}.` };
  }
  const wordIds = words.map((w) => w.id);
  const existing = await db
    .select({ id: schema.cards.id })
    .from(schema.cards)
    .where(inArray(schema.cards.wordId, wordIds));
  if (existing.length === 0) {
    return { removed: 0, message: `HSK ${level} isn’t in your queue.` };
  }
  await db.delete(schema.cards).where(inArray(schema.cards.wordId, wordIds));
  revalidatePath('/');
  revalidatePath('/library');
  return {
    removed: existing.length,
    message: `Removed ${existing.length} HSK ${level} card${existing.length === 1 ? '' : 's'}.`,
  };
}
