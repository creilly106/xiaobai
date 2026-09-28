import 'server-only';
import { connection } from 'next/server';
import { and, eq, inArray, isNotNull, ne, or } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import {
  PROBLEM_MISSES,
  sharesCharacter,
  soundAlikes,
  summarise,
  type History,
  type Vocab,
} from '@/lib/problem-words';

export type ProblemItem = History & {
  key: string;
  kind: 'word' | 'sentence';
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  note: string | null;
  /** Every card for it is suspended. */
  suspended: boolean;
  soundAlikes: Vocab[];
  sharesCharacter: Vocab[];
};

/**
 * Words and sentences you've missed at least PROBLEM_MISSES times, counting
 * all their cards (reading, listening, saying), the most-missed first — with
 * what might be tripping you up.
 */
export async function getProblemItems(): Promise<ProblemItem[]> {
  await connection();
  const missedCards = await db
    .select({ id: schema.reviews.cardId })
    .from(schema.reviews)
    .where(eq(schema.reviews.rating, 1))
    .groupBy(schema.reviews.cardId);
  if (missedCards.length === 0) return [];

  const cards = await db
    .select({ wordId: schema.cards.wordId, sentenceId: schema.cards.sentenceId })
    .from(schema.cards)
    .where(
      inArray(
        schema.cards.id,
        missedCards.map((c) => c.id),
      ),
    );
  // An item's other cards count too: a word missed once reading and once listening is a problem.
  const wordIds = [...new Set(cards.flatMap((c) => (c.wordId ? [c.wordId] : [])))];
  const sentenceIds = [...new Set(cards.flatMap((c) => (c.sentenceId ? [c.sentenceId] : [])))];
  const allCards = await db
    .select({
      id: schema.cards.id,
      mode: schema.cards.mode,
      suspended: schema.cards.suspended,
      wordId: schema.cards.wordId,
      sentenceId: schema.cards.sentenceId,
    })
    .from(schema.cards)
    .where(
      or(
        wordIds.length ? inArray(schema.cards.wordId, wordIds) : undefined,
        sentenceIds.length ? inArray(schema.cards.sentenceId, sentenceIds) : undefined,
      ),
    );
  const keyOf = (c: { wordId: number | null; sentenceId: number | null }) =>
    c.wordId != null ? `w${c.wordId}` : `s${c.sentenceId}`;
  const cardById = new Map(allCards.map((c) => [c.id, c]));

  const ratings = await db
    .select({
      cardId: schema.reviews.cardId,
      rating: schema.reviews.rating,
      at: schema.reviews.reviewedAt,
    })
    .from(schema.reviews)
    .where(
      inArray(
        schema.reviews.cardId,
        allCards.map((c) => c.id),
      ),
    );
  const byItem = new Map<string, { rating: number; at: Date; mode: string }[]>();
  for (const r of ratings) {
    const card = cardById.get(r.cardId)!;
    const key = keyOf(card);
    byItem.set(key, [...(byItem.get(key) ?? []), { rating: r.rating, at: r.at, mode: card.mode }]);
  }
  const histories = new Map(
    [...byItem].flatMap(([key, list]) => {
      const h = summarise(list);
      return h.misses >= PROBLEM_MISSES ? [[key, h] as const] : [];
    }),
  );
  if (histories.size === 0) return [];

  const keys = [...histories.keys()];
  const problemWordIds = keys.filter((k) => k[0] === 'w').map((k) => Number(k.slice(1)));
  const problemSentenceIds = keys.filter((k) => k[0] === 's').map((k) => Number(k.slice(1)));
  const [words, sentences, studied] = await Promise.all([
    problemWordIds.length
      ? db
          .select({
            id: schema.words.id,
            hanzi: schema.words.hanzi,
            pinyin: schema.words.pinyin,
            meaning: schema.words.meaning,
            note: schema.words.note,
          })
          .from(schema.words)
          .where(inArray(schema.words.id, problemWordIds))
      : [],
    problemSentenceIds.length
      ? db
          .select({
            id: schema.sentences.id,
            hanzi: schema.sentences.hanzi,
            pinyin: schema.sentences.pinyin,
            meaning: schema.sentences.meaning,
            note: schema.sentences.note,
          })
          .from(schema.sentences)
          .where(inArray(schema.sentences.id, problemSentenceIds))
      : [],
    // Words you've actually met, to compare against.
    db
      .selectDistinct({
        hanzi: schema.words.hanzi,
        pinyin: schema.words.pinyin,
        meaning: schema.words.meaning,
      })
      .from(schema.cards)
      .innerJoin(schema.words, eq(schema.cards.wordId, schema.words.id))
      .where(and(isNotNull(schema.cards.wordId), ne(schema.cards.state, 'new'))),
  ]);

  const suspendedOf = (key: string) =>
    allCards.filter((c) => keyOf(c) === key).every((c) => c.suspended);
  const items: ProblemItem[] = [
    ...words.map((w) => ({ ...w, kind: 'word' as const, key: `w${w.id}` })),
    ...sentences.map((s) => ({ ...s, kind: 'sentence' as const, key: `s${s.id}` })),
  ].map((item) => ({
    ...item,
    ...histories.get(item.key)!,
    suspended: suspendedOf(item.key),
    soundAlikes: item.kind === 'word' ? soundAlikes(item, studied) : [],
    sharesCharacter: item.kind === 'word' ? sharesCharacter(item, studied) : [],
  }));

  // Still slipping before getting better; then the most misses, most recent first.
  return items.sort(
    (a, b) =>
      Number(a.improving) - Number(b.improving) ||
      b.misses - a.misses ||
      (b.lastMiss?.getTime() ?? 0) - (a.lastMiss?.getTime() ?? 0),
  );
}
