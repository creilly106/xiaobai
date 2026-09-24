import 'server-only';
import { connection } from 'next/server';
import { and, eq, inArray, isNotNull, isNull, lte, or, sql, type SQL } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { CardState } from '@/db/schema';
import { modeFilter } from '@/lib/card-modes';

export type QuizItemType = 'word' | 'sentence' | 'both';

export const CARD_STATES: readonly CardState[] = ['new', 'learning', 'review', 'relearning'];

export type QuizFilters = {
  itemType: QuizItemType;
  hskLevels?: number[];
  scenarioSlugs?: string[];
  cardStates?: CardState[];
  lastReviewOlderThanDays?: number;
  count: number;
};

export type QuizItem = {
  key: string;
  itemType: 'word' | 'sentence';
  hanzi: string;
  pinyin: string;
  meaning: string;
  cardId?: number;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function sentenceIdsForScenarios(slugs: string[]): Promise<number[]> {
  const rows = await db
    .selectDistinct({ id: schema.sentenceTags.sentenceId })
    .from(schema.sentenceTags)
    .innerJoin(schema.tags, eq(schema.tags.id, schema.sentenceTags.tagId))
    .where(inArray(schema.tags.slug, slugs));
  return rows.map((r) => r.id);
}

export async function getQuizQueue(filters: QuizFilters): Promise<QuizItem[]> {
  await connection();
  const count = Math.max(1, Math.min(filters.count, 100));
  const scenarioIds =
    filters.scenarioSlugs && filters.scenarioSlugs.length > 0
      ? await sentenceIdsForScenarios(filters.scenarioSlugs)
      : null;

  if (filters.cardStates && filters.cardStates.length > 0) {
    return fromCards(filters, count, scenarioIds);
  }
  return fromContent(filters, count, scenarioIds);
}

/** Practice straight from the dictionary / sentence bank (no cards needed). */
async function fromContent(
  filters: QuizFilters,
  count: number,
  scenarioIds: number[] | null,
): Promise<QuizItem[]> {
  const wantsWords = filters.itemType !== 'sentence';
  const wantsSentences = filters.itemType !== 'word';
  const hsk = filters.hskLevels ?? [];

  const [words, sentences] = await Promise.all([
    wantsWords
      ? db
          .select({
            id: schema.words.id,
            hanzi: schema.words.hanzi,
            pinyin: schema.words.pinyin,
            meaning: schema.words.meaning,
          })
          .from(schema.words)
          .where(hsk.length > 0 ? inArray(schema.words.hskLevel, hsk) : undefined)
          .orderBy(sql`RANDOM()`)
          .limit(count)
      : Promise.resolve([]),
    wantsSentences && (scenarioIds === null || scenarioIds.length > 0)
      ? db
          .select({
            id: schema.sentences.id,
            hanzi: schema.sentences.hanzi,
            pinyin: schema.sentences.pinyin,
            meaning: schema.sentences.meaning,
          })
          .from(schema.sentences)
          .where(scenarioIds ? inArray(schema.sentences.id, scenarioIds) : undefined)
          .orderBy(sql`RANDOM()`)
          .limit(count)
      : Promise.resolve([]),
  ]);

  const pool: QuizItem[] = [
    ...words.map((r) => ({ ...r, key: `word-${r.id}`, itemType: 'word' as const })),
    ...sentences.map((r) => ({
      ...r,
      key: `sentence-${r.id}`,
      itemType: 'sentence' as const,
    })),
  ].map(({ key, itemType, hanzi, pinyin, meaning }) => ({
    key,
    itemType,
    hanzi,
    pinyin,
    meaning,
  }));

  return shuffle(pool).slice(0, count);
}

/** Drill cards already in the study queue, filtered by their SRS state. */
async function fromCards(
  filters: QuizFilters,
  count: number,
  scenarioIds: number[] | null,
): Promise<QuizItem[]> {
  const wantsWords = filters.itemType !== 'sentence';
  const wantsSentences = filters.itemType !== 'word';
  const hsk = filters.hskLevels ?? [];

  const conditions: SQL[] = [
    eq(schema.cards.suspended, false),
    inArray(schema.cards.state, filters.cardStates!),
    // Quiz flashcards show the characters, so listening/production cards don't fit here.
    modeFilter({ listening: false, production: false })!,
  ];

  if (filters.lastReviewOlderThanDays !== undefined) {
    const cutoff = new Date(Date.now() - filters.lastReviewOlderThanDays * 86_400_000);
    conditions.push(or(isNull(schema.cards.lastReview), lte(schema.cards.lastReview, cutoff))!);
  }

  const wordSide: SQL | undefined = wantsWords
    ? and(
        isNotNull(schema.cards.wordId),
        hsk.length > 0 ? inArray(schema.words.hskLevel, hsk) : undefined,
      )
    : undefined;
  const sentenceSide: SQL | undefined =
    wantsSentences && (scenarioIds === null || scenarioIds.length > 0)
      ? and(
          isNotNull(schema.cards.sentenceId),
          scenarioIds ? inArray(schema.cards.sentenceId, scenarioIds) : undefined,
        )
      : undefined;
  const side = or(wordSide, sentenceSide);
  if (!side) return [];
  conditions.push(side);

  const rows = await db
    .select({
      id: schema.cards.id,
      wordId: schema.cards.wordId,
      wordHanzi: schema.words.hanzi,
      wordPinyin: schema.words.pinyin,
      wordMeaning: schema.words.meaning,
      sentHanzi: schema.sentences.hanzi,
      sentPinyin: schema.sentences.pinyin,
      sentMeaning: schema.sentences.meaning,
    })
    .from(schema.cards)
    .leftJoin(schema.words, eq(schema.cards.wordId, schema.words.id))
    .leftJoin(schema.sentences, eq(schema.cards.sentenceId, schema.sentences.id))
    .where(and(...conditions))
    .orderBy(sql`RANDOM()`)
    .limit(count);

  return rows.map((r) => {
    const isWord = r.wordId != null;
    return {
      key: `card-${r.id}`,
      itemType: isWord ? ('word' as const) : ('sentence' as const),
      hanzi: (isWord ? r.wordHanzi : r.sentHanzi) ?? '',
      pinyin: (isWord ? r.wordPinyin : r.sentPinyin) ?? '',
      meaning: (isWord ? r.wordMeaning : r.sentMeaning) ?? '',
      cardId: r.id,
    };
  });
}

export async function listHskLevels(): Promise<number[]> {
  await connection();
  const rows = await db
    .selectDistinct({ level: schema.words.hskLevel })
    .from(schema.words)
    .where(isNotNull(schema.words.hskLevel))
    .orderBy(schema.words.hskLevel);
  return rows.map((r) => r.level).filter((n): n is number => n != null);
}
