import 'server-only';
import { cache } from 'react';
import { and, asc, eq, inArray, lte, sql } from 'drizzle-orm';
import { connection } from 'next/server';
import type { CardState } from '@/db/schema';
import { db, schema } from '@/db/client';
import { getAvailability, getSettings } from './settings';
import {
  followUpsFrom,
  isListeningMode,
  isProductionMode,
  modeFilter,
  type FollowUpSettings,
} from '@/lib/card-modes';
import { audioFor } from '@/lib/audio-text';
import { getNewCardPool } from './new-cards';
import { interleave, spreadEarly } from '@/lib/queue-order';
import type { Syllable } from '@/lib/pinyin';
import { getDictionary } from './dictionary';
import { wordSyllables } from './tones';
import { examplesFor } from '@/lib/examples';

export type StudyCard = {
  id: number;
  mode: string;
  itemType: 'word' | 'sentence';
  hanzi: string;
  pinyin: string;
  meaning: string;
  state: string;
  due: number;
  /** Times this card has been rated Again — used to spot "leeches". */
  fails: number;
  /** Your own note on the word or sentence. */
  note: string | null;
  /** Present on listening cards: what to play and what else sounds the same. */
  listening?: ListeningInfo;
  /** Present on production cards (English → Chinese). */
  production?: ProductionInfo;
  /** A real sentence using the word (Tatoeba), for the answer side. */
  example?: { zh: string; en: string };
};

export type ProductionInfo = {
  /** Expected syllables for checking typed pinyin (null = letters only). */
  syllables: Syllable[] | null;
};

export type ListeningInfo = {
  /** Text for the speech engine — sometimes "他们的他" rather than just "他". */
  audio: string;
  /** Set when `audio` names the word through a longer word containing it. */
  viaWord: string | null;
  /** Set when a character with several readings is played inside this word. */
  inWord: string | null;
  /** Other vocabulary with exactly the same sound (tones included). */
  soundAlikes: { hanzi: string; pinyin: string; meaning: string }[];
};

export const CARD_COLUMNS = {
  id: schema.cards.id,
  mode: schema.cards.mode,
  state: schema.cards.state,
  due: schema.cards.due,
  wordId: schema.cards.wordId,
  sentenceId: schema.cards.sentenceId,
  wordHanzi: schema.words.hanzi,
  wordPinyin: schema.words.pinyin,
  wordMeaning: schema.words.meaning,
  wordNote: schema.words.note,
  sentHanzi: schema.sentences.hanzi,
  sentPinyin: schema.sentences.pinyin,
  sentMeaning: schema.sentences.meaning,
  sentNote: schema.sentences.note,
  fails: sql<number>`(select count(*) from reviews r where r.card_id = ${schema.cards.id} and r.rating = 1)`,
} as const;

type CardRow = {
  id: number;
  mode: string;
  state: string;
  due: Date;
  wordId: number | null;
  sentenceId: number | null;
  wordHanzi: string | null;
  wordPinyin: string | null;
  wordMeaning: string | null;
  sentHanzi: string | null;
  sentPinyin: string | null;
  sentMeaning: string | null;
  wordNote?: string | null;
  sentNote?: string | null;
  fails?: number | null;
};

export function rowToStudyCard(r: CardRow): StudyCard {
  const isWord = r.wordId != null;
  return {
    id: r.id,
    mode: r.mode,
    itemType: isWord ? 'word' : 'sentence',
    hanzi: (isWord ? r.wordHanzi : r.sentHanzi) ?? '',
    pinyin: (isWord ? r.wordPinyin : r.sentPinyin) ?? '',
    meaning: (isWord ? r.wordMeaning : r.sentMeaning) ?? '',
    state: r.state,
    due: r.due.getTime(),
    fails: Number(r.fails ?? 0),
    note: (isWord ? r.wordNote : r.sentNote) ?? null,
  };
}

function cardsQuery() {
  return db
    .select(CARD_COLUMNS)
    .from(schema.cards)
    .leftJoin(schema.words, eq(schema.cards.wordId, schema.words.id))
    .leftJoin(schema.sentences, eq(schema.cards.sentenceId, schema.sentences.id));
}

function dueCards(states: CardState[], now: Date, followUps: FollowUpSettings) {
  return cardsQuery().where(
    and(
      eq(schema.cards.suspended, false),
      modeFilter(followUps),
      lte(schema.cards.due, now),
      inArray(schema.cards.state, states),
    ),
  );
}

/** One card, e.g. to put it back in the session after an undo. */
export async function getStudyCard(id: number): Promise<StudyCard | null> {
  const [row] = await cardsQuery().where(eq(schema.cards.id, id)).limit(1);
  return row ? (await decorate([rowToStudyCard(row)]))[0] : null;
}

export async function getSuspendedCards(): Promise<StudyCard[]> {
  await connection();
  const rows = await cardsQuery()
    .where(eq(schema.cards.suspended, true))
    .orderBy(asc(schema.cards.id));
  return rows.map(rowToStudyCard);
}

const loadVocab = cache(async () =>
  db
    .select({
      hanzi: schema.words.hanzi,
      pinyin: schema.words.pinyin,
      meaning: schema.words.meaning,
      hskLevel: schema.words.hskLevel,
    })
    .from(schema.words),
);

/** Exact sound, tones included: "Tā" and "tā" match, "tǎ" doesn't. */
function soundKey(pinyin: string): string {
  return pinyin
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\s'’·-]/g, '');
}

/** Attach what listening and production cards need to be shown. */
async function decorate(cards: StudyCard[]): Promise<StudyCard[]> {
  const withExamples = cards.map((card) => {
    if (card.itemType !== 'word') return card;
    const [ex] = examplesFor(card.hanzi, 1);
    return ex ? { ...card, example: { zh: ex.zh, en: ex.en } } : card;
  });
  return withProduction(await withListening(withExamples));
}

async function withProduction(cards: StudyCard[]): Promise<StudyCard[]> {
  if (!cards.some((c) => isProductionMode(c.mode))) return cards;
  const dict = await getDictionary();
  return cards.map((card) =>
    isProductionMode(card.mode)
      ? { ...card, production: { syllables: wordSyllables(card.hanzi, card.pinyin, dict) } }
      : card,
  );
}

/**
 * Work out what a listening card should play. Most words are unambiguous, but
 * single characters like 他/她/它 (all "tā") share a sound with other words. For
 * those we play "他们的他" — "the tā of tāmen" — which is how Chinese speakers
 * themselves say which character they mean.
 */
async function withListening(cards: StudyCard[]): Promise<StudyCard[]> {
  if (!cards.some((c) => isListeningMode(c.mode))) return cards;
  const vocab = await loadVocab();
  const bySound = new Map<string, typeof vocab>();
  for (const w of vocab) {
    const k = soundKey(w.pinyin);
    bySound.set(k, [...(bySound.get(k) ?? []), w]);
  }

  return cards.map((card) => {
    if (!isListeningMode(card.mode)) return card;
    if (card.itemType === 'sentence') {
      return {
        ...card,
        listening: { audio: card.hanzi, viaWord: null, inWord: null, soundAlikes: [] },
      };
    }
    const soundAlikes = (bySound.get(soundKey(card.pinyin)) ?? [])
      .filter((w) => w.hanzi !== card.hanzi)
      .map(({ hanzi, pinyin, meaning }) => ({ hanzi, pinyin, meaning }));

    let viaWord: string | null = null;
    if (soundAlikes.length > 0 && Array.from(card.hanzi).length === 1) {
      // Easiest longer word that contains it, e.g. 他 → 他们, 块 → 一块.
      viaWord =
        vocab
          .filter((w) => w.hanzi !== card.hanzi && w.hanzi.includes(card.hanzi))
          .sort(
            (a, b) =>
              (a.hskLevel ?? 9) - (b.hskLevel ?? 9) ||
              Array.from(a.hanzi).length - Array.from(b.hanzi).length,
          )[0]?.hanzi ?? null;
    }
    // A character with several readings is played inside a word instead —
    // "X的Y" would still end on the ambiguous character by itself.
    const reading = audioFor(card.hanzi, card.pinyin);
    if (reading.via) {
      return {
        ...card,
        listening: { audio: reading.via, viaWord: null, inWord: reading.via, soundAlikes },
      };
    }
    return {
      ...card,
      listening: {
        audio: viaWord ? `${viaWord}的${card.hanzi}` : card.hanzi,
        viaWord,
        inWord: null,
        soundAlikes,
      },
    };
  });
}

export type StudyQueueOptions = {
  sessionSize?: number;
  /** New cards allowed beyond today's limit ("learn 5 more"). */
  extraNew?: number;
};

/**
 * Build a study session that respects today's limits. Reviews come first as a
 * warm-up with new cards spread between them; learning cards fill every other
 * slot near the start.
 */
export async function getStudyQueue({
  sessionSize = 30,
  extraNew = 0,
}: StudyQueueOptions = {}): Promise<StudyCard[]> {
  await connection();
  const now = new Date();
  const settings = await getSettings();
  const [avail, pool] = await Promise.all([
    getAvailability(now),
    getNewCardPool(now, followUpsFrom(settings), settings.newWordsFrom),
  ]);

  const learning = await dueCards(['learning', 'relearning'], now, followUpsFrom(settings))
    .orderBy(asc(schema.cards.due))
    .limit(sessionSize);

  let room = sessionSize - learning.length;
  const reviewTake = Math.min(room, avail.reviewDue);
  const reviews =
    reviewTake > 0
      ? await dueCards(['review'], now, followUpsFrom(settings))
          .orderBy(asc(schema.cards.due))
          .limit(reviewTake)
      : [];
  room -= reviews.length;

  const newTake = Math.max(
    0,
    Math.min(room, pool.cardIds.length, avail.newRemainingToday + Math.max(0, extraNew)),
  );
  const newIds = pool.cardIds.slice(0, newTake);
  const newRows =
    newIds.length > 0 ? await cardsQuery().where(inArray(schema.cards.id, newIds)) : [];
  const byId = new Map(newRows.map((r) => [r.id, r]));
  const news = newIds.flatMap((id) => {
    const row = byId.get(id);
    return row ? [row] : [];
  });

  return decorate(spreadEarly(learning, interleave(reviews, news)).map(rowToStudyCard));
}
