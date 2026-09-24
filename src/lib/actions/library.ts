'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import { shortMeaning } from '@/lib/dictionary-search';

export type AddResult =
  { ok: true; wordId: number; message: string } | { ok: false; message: string };

function revalidateLibrary(hanzi?: string) {
  revalidatePath('/library');
  revalidatePath('/');
  if (hanzi) revalidatePath(`/characters/${encodeURIComponent(hanzi)}`);
}

async function ensureRecognitionCard(wordId: number): Promise<boolean> {
  const created = await db
    .insert(schema.cards)
    .values({ wordId, mode: 'recognition' })
    .onConflictDoNothing()
    .returning({ id: schema.cards.id });
  return created.length > 0;
}

/**
 * Put a word into study. Pass a dictionary entry to bring a new word into your
 * library first, or a library word id (e.g. an HSK word not yet queued).
 */
export async function addToStudy(
  target: { dictionaryId: number } | { wordId: number },
): Promise<AddResult> {
  let wordId: number;
  let hanzi: string;

  if ('dictionaryId' in target) {
    if (!Number.isInteger(target.dictionaryId)) return { ok: false, message: 'Unknown word.' };
    const [entry] = await db
      .select()
      .from(schema.dictionary)
      .where(eq(schema.dictionary.id, target.dictionaryId))
      .limit(1);
    if (!entry) return { ok: false, message: 'That dictionary entry no longer exists.' };
    hanzi = entry.simplified;

    const [existing] = await db
      .select({ id: schema.words.id, pinyin: schema.words.pinyin })
      .from(schema.words)
      .where(eq(schema.words.hanzi, hanzi))
      .limit(1);
    if (existing) {
      wordId = existing.id;
    } else {
      const [row] = await db
        .insert(schema.words)
        .values({
          hanzi,
          pinyin: entry.pinyin,
          meaning: shortMeaning(entry.definitions),
          source: 'dictionary',
        })
        .returning({ id: schema.words.id });
      wordId = row.id;
    }
  } else {
    if (!Number.isInteger(target.wordId)) return { ok: false, message: 'Unknown word.' };
    const [word] = await db
      .select({ id: schema.words.id, hanzi: schema.words.hanzi })
      .from(schema.words)
      .where(eq(schema.words.id, target.wordId))
      .limit(1);
    if (!word) return { ok: false, message: 'Unknown word.' };
    wordId = word.id;
    hanzi = word.hanzi;
  }

  const created = await ensureRecognitionCard(wordId);
  revalidateLibrary(hanzi);
  return {
    ok: true,
    wordId,
    message: created ? `Added ${hanzi} to study.` : `${hanzi} is already in your study queue.`,
  };
}

/**
 * Take one of your own (non-HSK) words out of the library, with its cards and
 * review history. HSK words can't be removed, only suspended.
 */
export async function removeMyWord(wordId: number): Promise<{ ok: boolean; message: string }> {
  if (!Number.isInteger(wordId)) return { ok: false, message: 'Unknown word.' };
  const [word] = await db
    .select({ hanzi: schema.words.hanzi, source: schema.words.source })
    .from(schema.words)
    .where(eq(schema.words.id, wordId))
    .limit(1);
  if (!word) return { ok: false, message: 'Unknown word.' };
  if (word.source === 'hsk') return { ok: false, message: 'HSK words stay in the library.' };
  await db
    .delete(schema.words)
    .where(and(eq(schema.words.id, wordId), eq(schema.words.source, word.source)));
  revalidateLibrary(word.hanzi);
  return { ok: true, message: `Removed ${word.hanzi}.` };
}
