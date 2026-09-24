'use server';

import { and, eq, inArray, isNotNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import { segmentWords } from '@/lib/segment';

/**
 * Make sure every vocabulary word used in `sentences` has a study card, so
 * the words get taught before the sentences that need them.
 */
async function queueWordsFor(sentences: string[]): Promise<number> {
  const vocab = await db
    .select({ id: schema.words.id, hanzi: schema.words.hanzi })
    .from(schema.words);
  const idByHanzi = new Map(vocab.map((w) => [w.hanzi, w.id]));
  const vocabSet = new Set(idByHanzi.keys());

  const neededIds = new Set<number>();
  for (const s of sentences) {
    for (const w of segmentWords(s, vocabSet)) neededIds.add(idByHanzi.get(w)!);
  }
  if (neededIds.size === 0) return 0;

  const existing = await db
    .select({ wordId: schema.cards.wordId })
    .from(schema.cards)
    .where(
      and(
        isNotNull(schema.cards.wordId),
        inArray(schema.cards.wordId, [...neededIds]),
        eq(schema.cards.mode, 'recognition'),
      ),
    );
  const have = new Set(existing.map((r) => r.wordId));
  const toCreate = [...neededIds].filter((id) => !have.has(id));
  if (toCreate.length > 0) {
    await db
      .insert(schema.cards)
      .values(toCreate.map((wordId) => ({ wordId, mode: 'recognition' as const })));
  }
  return toCreate.length;
}

export async function addScenarioToQueue(slug: string) {
  if (typeof slug !== 'string' || !/^[a-z0-9-]{1,64}$/.test(slug)) {
    return { created: 0, message: 'Scenario not found.' };
  }
  const [tag] = await db.select().from(schema.tags).where(eq(schema.tags.slug, slug)).limit(1);
  if (!tag) return { created: 0, message: 'Scenario not found.' };

  const sentenceRows = await db
    .select({ id: schema.sentences.id, hanzi: schema.sentences.hanzi })
    .from(schema.sentenceTags)
    .innerJoin(schema.sentences, eq(schema.sentences.id, schema.sentenceTags.sentenceId))
    .where(eq(schema.sentenceTags.tagId, tag.id));
  const sentenceIds = sentenceRows.map((r) => r.id);
  if (sentenceIds.length === 0) {
    return { created: 0, message: 'No sentences in this scenario.' };
  }

  const existing = await db
    .select({ sentenceId: schema.cards.sentenceId })
    .from(schema.cards)
    .where(
      and(
        inArray(schema.cards.sentenceId, sentenceIds),
        eq(schema.cards.mode, 'sentence-recognition'),
      ),
    );
  const existingSet = new Set(
    existing.map((r) => r.sentenceId).filter((n): n is number => n != null),
  );
  const toCreate = sentenceIds.filter((id) => !existingSet.has(id));

  if (toCreate.length === 0) {
    return { created: 0, message: `${tag.name} already in your queue.` };
  }

  await db.insert(schema.cards).values(
    toCreate.map((sentenceId) => ({
      sentenceId,
      mode: 'sentence-recognition' as const,
    })),
  );
  const wordsAdded = await queueWordsFor(sentenceRows.map((r) => r.hanzi));

  revalidatePath('/');
  revalidatePath('/scenarios');
  revalidatePath(`/scenarios/${slug}`);
  revalidatePath('/library');
  const s = toCreate.length;
  return {
    created: s,
    message:
      `Added ${s} sentence${s === 1 ? '' : 's'} from ${tag.name}` +
      (wordsAdded > 0
        ? ` and ${wordsAdded} word${wordsAdded === 1 ? '' : 's'} they use. You'll learn the words first.`
        : '.'),
  };
}
