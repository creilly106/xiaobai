import 'server-only';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { LESSONS } from '@/lib/curriculum';
import { getDictionaryFor } from './dictionary';
import { tokenize } from '@/lib/tokenize';

/** How well you know a word: from its recognition card. */
export type WordStatus = 'known' | 'learning' | 'queued' | 'new';

export type BreakdownWord = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel: number | null;
  status: WordStatus;
  /** Your library's word, if it's there. */
  wordId: number | null;
  /** Otherwise the dictionary entry "Add to study" brings in. */
  dictionaryId: number | null;
  /** For an HSK word you haven't started: the Learn lesson that teaches it. */
  lesson: { id: string; title: string } | null;
};

export type Breakdown = {
  /** The text in order: Chinese words (with `word` set) and everything between. */
  pieces: { text: string; word?: string }[];
  words: Record<string, BreakdownWord>;
};

/** Longest text we'll break down in one go. */
export const MAX_BREAKDOWN_CHARS = 3000;

const lessonByWord = new Map(LESSONS.flatMap((l) => l.words.map((w) => [w, l] as const)));

/** Split pasted Chinese into words, each with its meaning and how well you know it. */
export async function breakDown(text: string): Promise<Breakdown> {
  const clipped = Array.from(text).slice(0, MAX_BREAKDOWN_CHARS).join('');
  const dict = await getDictionaryFor([clipped]);

  // Words and the text between them; runs of punctuation/spaces stay together.
  const pieces: Breakdown['pieces'] = [];
  for (const t of tokenize(clipped, dict)) {
    const last = pieces[pieces.length - 1];
    if (t.isChinese) pieces.push({ text: t.text, word: t.text });
    else if (last && !last.word) last.text += t.text;
    else pieces.push({ text: t.text });
  }

  const hanzi = [...new Set(pieces.flatMap((p) => (p.word ? [p.word] : [])))];
  if (hanzi.length === 0) return { pieces, words: {} };

  const [library, cedict] = await Promise.all([
    db
      .select({
        id: schema.words.id,
        hanzi: schema.words.hanzi,
        pinyin: schema.words.pinyin,
        meaning: schema.words.meaning,
        hskLevel: schema.words.hskLevel,
        state: schema.cards.state,
      })
      .from(schema.words)
      .leftJoin(
        schema.cards,
        and(eq(schema.cards.wordId, schema.words.id), eq(schema.cards.mode, 'recognition')),
      )
      .where(inArray(schema.words.hanzi, hanzi)),
    db
      .select({ id: schema.dictionary.id, simplified: schema.dictionary.simplified })
      .from(schema.dictionary)
      .where(inArray(schema.dictionary.simplified, hanzi))
      .orderBy(
        asc(schema.dictionary.proper),
        desc(schema.dictionary.frequency),
        asc(schema.dictionary.id),
      ),
  ]);
  const inLibrary = new Map(library.map((r) => [r.hanzi, r]));
  const dictionaryId = new Map<string, number>();
  for (const r of cedict) if (!dictionaryId.has(r.simplified)) dictionaryId.set(r.simplified, r.id);

  const words: Breakdown['words'] = {};
  for (const h of hanzi) {
    const mine = inLibrary.get(h);
    const entry = dict[h];
    const status: WordStatus =
      mine?.state === 'review'
        ? 'known'
        : mine?.state === 'learning' || mine?.state === 'relearning'
          ? 'learning'
          : mine?.state === 'new'
            ? 'queued'
            : 'new';
    const lesson = status === 'new' ? lessonByWord.get(h) : undefined;
    words[h] = {
      hanzi: h,
      pinyin: (mine?.pinyin ?? entry?.pinyin ?? '').replace(/\s+/g, ''),
      meaning: mine?.meaning ?? entry?.meaning ?? '',
      hskLevel: mine?.hskLevel ?? entry?.hskLevel ?? null,
      status,
      wordId: mine?.id ?? null,
      dictionaryId: mine ? null : (dictionaryId.get(h) ?? null),
      lesson: lesson ? { id: lesson.id, title: lesson.title } : null,
    };
  }
  return { pieces, words };
}
