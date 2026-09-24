import 'server-only';
import { and, eq, lte, ne } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { localDateKey } from '@/lib/dates';
import { segmentWords } from '@/lib/segment';
import { isListeningMode, modeFilter } from '@/lib/card-modes';

/**
 * A sentence card is introduced once you know most of its words — otherwise
 * it's a wall of unfamiliar characters you can only guess at.
 */
const UNLOCK_SHARE = 0.6;

export type NewCardPool = {
  /** Eligible new cards, in the order they should be introduced. */
  cardIds: number[];
  /** New sentence cards still waiting on their words. */
  lockedSentences: number;
};

/** Stable pseudo-random order that changes daily, so reloads don't reshuffle. */
function dailyRank(id: number, day: string): number {
  let h = 2166136261;
  for (const c of `${day}:${id}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

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
  const words: { id: number; needed: boolean; level: number; rank: number }[] = [];
  const day = localDateKey(now);

  const listening: number[] = [];
  for (const c of newCards) {
    // Listening cards only exist for material you already know, so no gating.
    if (isListeningMode(c.mode)) {
      listening.push(c.id);
      continue;
    }
    if (c.sentenceId != null && c.sentHanzi) {
      const parts = segmentWords(c.sentHanzi, vocab);
      const knownCount = parts.filter((w) => known.has(w)).length;
      const unknown = parts.length - knownCount;
      const unlocked =
        parts.length === 0 || unknown <= 1 || knownCount / parts.length >= UNLOCK_SHARE;
      if (unlocked) unlockedSentences.push(c.id);
      else lockedSentences += 1;
    } else if (c.wordHanzi) {
      words.push({
        id: c.id,
        needed: needed.has(c.wordHanzi),
        level: c.hskLevel ?? 99,
        rank: dailyRank(c.id, day),
      });
    }
  }

  words.sort((a, b) => Number(b.needed) - Number(a.needed) || a.level - b.level || a.rank - b.rank);

  // Needed words first, then listening cards take turns with the other words.
  const neededIds = words.filter((w) => w.needed).map((w) => w.id);
  const otherIds = words.filter((w) => !w.needed).map((w) => w.id);
  const mixed: number[] = [];
  for (let i = 0; i < Math.max(listening.length, otherIds.length); i++) {
    if (i < listening.length) mixed.push(listening[i]);
    if (i < otherIds.length) mixed.push(otherIds[i]);
  }

  return {
    cardIds: [...unlockedSentences.sort((a, b) => a - b), ...neededIds, ...mixed],
    lockedSentences,
  };
}
