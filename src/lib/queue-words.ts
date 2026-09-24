import 'server-only';
import { and, eq, inArray, isNotNull } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { segmentWords } from '@/lib/segment';

/**
 * Make sure every vocabulary word used in `sentences` has a study card, so
 * the words get taught before the sentences that need them. Returns how many
 * cards were created.
 */
export async function queueWordsFor(sentences: string[]): Promise<number> {
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
