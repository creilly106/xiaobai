import 'server-only';
import { and, eq, lte, ne } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { localDateKey } from '@/lib/dates';
import { segmentWords } from '@/lib/segment';
import { isListeningMode, modeFilter } from '@/lib/card-modes';
import { dailyRank, isSentenceUnlocked, orderNewCards, type NewWord } from '@/lib/queue-order';

export type NewCardPool = {
  /** Eligible new cards, in the order they should be introduced. */
  cardIds: number[];
  /** New sentence cards still waiting on their words. */
  lockedSentences: number;
};

/**
 * Orders every new card:
 *   1. scenario sentences whose words you mostly know,
 *   2. words needed by your queued scenario sentences,
 *   3. everything else by HSK level (shuffled daily within a level).
 * Sentences that aren't unlocked yet are left out entirely.
 */
export async function getNewCardPool(
  now = new Date(),
  listeningEnabled = true,
): Promise<NewCardPool> {
  const [newCards, wordRows, startedWordRows, sentenceCards] = await Promise.all([
    db
      .select({
        id: schema.cards.id,
        mode: schema.cards.mode,
        wordId: schema.cards.wordId,
        sentenceId: schema.cards.sentenceId,
        wordHanzi: schema.words.hanzi,
        hskLevel: schema.words.hskLevel,
        sentHanzi: schema.sentences.hanzi,
      })
      .from(schema.cards)
      .leftJoin(schema.words, eq(schema.cards.wordId, schema.words.id))
      .leftJoin(schema.sentences, eq(schema.cards.sentenceId, schema.sentences.id))
      .where(
        and(
          eq(schema.cards.state, 'new'),
          eq(schema.cards.suspended, false),
          lte(schema.cards.due, now),
          modeFilter(listeningEnabled),
        ),
      ),
    db.select({ hanzi: schema.words.hanzi }).from(schema.words),
    db
      .select({ hanzi: schema.words.hanzi })
      .from(schema.cards)
      .innerJoin(schema.words, eq(schema.cards.wordId, schema.words.id))
      .where(ne(schema.cards.state, 'new')),
    // Every unsuspended sentence card (any state) — their words are worth learning.
    db
      .select({ hanzi: schema.sentences.hanzi })
      .from(schema.cards)
      .innerJoin(schema.sentences, eq(schema.cards.sentenceId, schema.sentences.id))
      .where(eq(schema.cards.suspended, false)),
  ]);

  const vocab = new Set(wordRows.map((w) => w.hanzi));
  const known = new Set(startedWordRows.map((w) => w.hanzi));

  const needed = new Set<string>();
  for (const s of sentenceCards) {
    for (const w of segmentWords(s.hanzi, vocab)) if (!known.has(w)) needed.add(w);
  }

  const unlockedSentences: number[] = [];
  let lockedSentences = 0;
  const words: NewWord[] = [];
  const day = localDateKey(now);

  const listening: number[] = [];
  for (const c of newCards) {
    // Listening cards only exist for material you already know, so no gating.
    if (isListeningMode(c.mode)) {
      listening.push(c.id);
      continue;
    }
    if (c.sentenceId != null && c.sentHanzi) {
      if (isSentenceUnlocked(segmentWords(c.sentHanzi, vocab), known)) {
        unlockedSentences.push(c.id);
      } else lockedSentences += 1;
    } else if (c.wordHanzi) {
      words.push({
        id: c.id,
        needed: needed.has(c.wordHanzi),
        level: c.hskLevel ?? 99,
        rank: dailyRank(c.id, day),
      });
    }
  }

  return {
    cardIds: orderNewCards({ sentences: unlockedSentences, words, listening }),
    lockedSentences,
  };
}
