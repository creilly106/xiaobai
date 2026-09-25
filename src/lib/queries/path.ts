import 'server-only';
import { connection } from 'next/server';
import { and, eq, ne } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { LessonStatus } from '@/db/schema';
import {
  LESSONS,
  UNITS,
  lessonById,
  unitById,
  wordsThrough,
  type PathLesson,
  type PathSentence,
  type Unit,
} from '@/lib/curriculum';
import { allExamples } from '@/lib/examples';
import { grammarPoints } from '@/lib/grammar-data';
import {
  buildCheckpoint,
  buildLesson,
  seededRandom,
  shuffle,
  type GrammarCard,
  type LessonSentence,
  type LessonStep,
  type LessonWord,
} from '@/lib/path/lesson-builder';
import { segmentSpans } from '@/lib/segment';
import { acceptedMeanings } from './accepted';
import { getDictionary } from './dictionary';
import { wordSyllables } from './tones';

export type LessonState = LessonStatus | 'known' | 'current' | 'locked';

export type PathLessonView = {
  id: string;
  title: string;
  words: string[];
  grammar: string | null;
  state: LessonState;
  bestScore: number | null;
};

export type PathUnitView = {
  id: string;
  hskLevel: number;
  title: string;
  description: string;
  scenario: string | null;
  lessons: PathLessonView[];
  /** Lessons finished, tested out of or already known. */
  finished: number;
};

export type PathView = {
  units: PathUnitView[];
  current: { id: string; title: string; unitTitle: string; index: number } | null;
  finished: number;
  total: number;
};

const FINISHED: LessonState[] = ['done', 'tested', 'known'];
export const isFinished = (state: LessonState) => FINISHED.includes(state);

/** Words whose recognition card has been studied at least once. */
async function startedWords(): Promise<Set<string>> {
  const rows = await db
    .select({ hanzi: schema.words.hanzi })
    .from(schema.cards)
    .innerJoin(schema.words, eq(schema.cards.wordId, schema.words.id))
    .where(and(eq(schema.cards.mode, 'recognition'), ne(schema.cards.state, 'new')));
  return new Set(rows.map((r) => r.hanzi));
}

/** Every lesson's state: finished ones, then the current one, then locked. */
export async function getPath(): Promise<PathView> {
  await connection();
  const [progress, started] = await Promise.all([
    db.select().from(schema.lessonProgress),
    startedWords(),
  ]);
  const byLesson = new Map(progress.map((p) => [p.lessonId, p]));

  let current: PathView['current'] = null;
  const states = new Map<string, LessonState>();
  for (const lesson of LESSONS) {
    const row = byLesson.get(lesson.id);
    const state: LessonState = row
      ? row.status
      : lesson.words.every((w) => started.has(w))
        ? 'known'
        : current
          ? 'locked'
          : 'current';
    if (state === 'current') {
      current = {
        id: lesson.id,
        title: lesson.title,
        unitTitle: lesson.unit.title,
        index: lesson.index,
      };
    }
    states.set(lesson.id, state);
  }

  const units = UNITS.map((unit) => {
    const lessons = unit.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      words: l.words,
      grammar: l.grammar ?? null,
      state: states.get(l.id)!,
      bestScore: byLesson.get(l.id)?.bestScore ?? null,
    }));
    return {
      id: unit.id,
      hskLevel: unit.hskLevel,
      title: unit.title,
      description: unit.description,
      scenario: unit.scenario ?? null,
      lessons,
      finished: lessons.filter((l) => isFinished(l.state)).length,
    };
  });
  return {
    units,
    current,
    finished: units.reduce((n, u) => n + u.finished, 0),
    total: LESSONS.length,
  };
}

type Vocab = Map<string, { pinyin: string; meaning: string }>;

async function loadVocab(): Promise<Vocab> {
  const rows = await db
    .select({
      hanzi: schema.words.hanzi,
      pinyin: schema.words.pinyin,
      meaning: schema.words.meaning,
    })
    .from(schema.words);
  return new Map(rows.map((r) => [r.hanzi, { pinyin: r.pinyin, meaning: r.meaning }]));
}

const HAN = /[㐀-鿿]/u;

/**
 * Split a sentence into vocabulary words, or null if it uses anything
 * outside `reached` — so practice only ever uses words you've been taught.
 */
function tokenise(text: string, vocab: Vocab, reached: Set<string>) {
  const spans = segmentSpans(text, vocab);
  const hanCount = Array.from(text).filter((c) => HAN.test(c)).length;
  const covered = spans.reduce((n, s) => n + s.end - s.start, 0);
  if (covered !== hanCount || spans.some((s) => !reached.has(s.word))) return null;
  return spans.map((s) => ({ text: s.word, pinyin: vocab.get(s.word)!.pinyin }));
}

function grammarCard(slug: string | undefined): GrammarCard | undefined {
  const g = slug ? grammarPoints.find((p) => p.slug === slug) : undefined;
  return g
    ? {
        slug: g.slug,
        name: g.name,
        englishTitle: g.englishTitle,
        formula: g.formula,
        description: g.description,
        examples: g.examples.slice(0, 3),
      }
    : undefined;
}

/**
 * Practice sentences for `targets`: hand-written ones first, then grammar
 * examples, your scenario sentences and Tatoeba — any that use only words
 * you've reached and include at least one target word.
 */
async function practiceSentences(
  handWritten: PathSentence[],
  targets: string[],
  vocab: Vocab,
  reached: Set<string>,
  rand: () => number,
  extra: PathSentence[] = [],
): Promise<{ sentences: LessonSentence[]; otherMeanings: string[] }> {
  const dbSentences = await db
    .select({
      hanzi: schema.sentences.hanzi,
      pinyin: schema.sentences.pinyin,
      meaning: schema.sentences.meaning,
    })
    .from(schema.sentences);
  const tatoeba = allExamples().map((e) => ({ hanzi: e.zh, pinyin: '', meaning: e.en }));
  const targetSet = new Set(targets);

  const usable = (list: PathSentence[]) =>
    list.flatMap((s) => {
      const tokens = tokenise(s.hanzi, vocab, reached);
      if (!tokens) return [];
      const pinyin = s.pinyin || tokens.map((t) => t.pinyin).join(' ');
      return [{ ...s, pinyin, tokens }];
    });
  const hand = usable(handWritten);
  const found = usable([...extra, ...dbSentences, ...tatoeba]).filter(
    (s) =>
      s.tokens.some((t) => targetSet.has(t.text)) &&
      !hand.some((h) => h.hanzi === s.hanzi) &&
      Array.from(s.hanzi).length <= 14,
  );
  // Short sentences read best; shuffle among the shortest few for variety.
  const shortest = [...found].sort((a, b) => a.tokens.length - b.tokens.length).slice(0, 12);
  const picked = [...shuffle(hand, rand), ...shuffle(shortest, rand)];
  const seen = new Set<string>();
  const sentences = picked.filter((s) => !seen.has(s.hanzi) && seen.add(s.hanzi));

  // Wrong answers for "what does this mean?": other sentences you could read.
  const otherMeanings = usable(LESSONS.flatMap((l) => l.sentences ?? []))
    .map((s) => s.meaning)
    .concat(found.map((s) => s.meaning));
  return { sentences, otherMeanings: [...new Set(otherMeanings)] };
}

async function lessonWords(hanzi: string[], vocab: Vocab): Promise<LessonWord[]> {
  const known = hanzi.filter((h) => vocab.has(h));
  const [accepted, dict] = await Promise.all([
    acceptedMeanings(known.map((h) => ({ hanzi: h, meaning: vocab.get(h)!.meaning }))),
    getDictionary(),
  ]);
  return known.map((h) => {
    const { pinyin, meaning } = vocab.get(h)!;
    return {
      hanzi: h,
      pinyin,
      meaning,
      accepted: accepted.get(h) ?? [meaning],
      syllables: wordSyllables(h, pinyin, dict),
    };
  });
}

const asPoolWord = (hanzi: string, vocab: Vocab): LessonWord[] => {
  const v = vocab.get(hanzi);
  return v ? [{ hanzi, ...v, accepted: [v.meaning], syllables: null }] : [];
};

export type LessonSession = {
  kind: 'lesson' | 'checkpoint';
  id: string;
  title: string;
  unitId: string;
  unitTitle: string;
  steps: LessonStep[];
  /** Words the session is about (a lesson's new words, or a unit's). */
  words: string[];
};

export async function getLessonSession(lessonId: string): Promise<LessonSession | null> {
  await connection();
  const lesson = lessonById(lessonId);
  if (!lesson) return null;
  const [vocab, started] = await Promise.all([loadVocab(), startedWords()]);
  const rand = seededRandom(Date.now());
  const reached = new Set([...wordsThrough(lesson.index), ...started]);
  const earlier = LESSONS.slice(0, lesson.index).flatMap((l) => l.words);

  const words = await lessonWords(lesson.words, vocab);
  const reviewHanzi = shuffle(earlier, rand).slice(0, 2);
  const grammar = grammarCard(lesson.grammar);
  const { sentences, otherMeanings } = await practiceSentences(
    lesson.sentences ?? [],
    lesson.words,
    vocab,
    reached,
    rand,
    grammar?.examples ?? [],
  );

  return {
    kind: 'lesson',
    id: lesson.id,
    title: lesson.title,
    unitId: lesson.unit.id,
    unitTitle: lesson.unit.title,
    words: lesson.words,
    steps: buildLesson({
      words,
      review: await lessonWords(reviewHanzi, vocab),
      pool: [...reached].flatMap((h) => asPoolWord(h, vocab)),
      grammar,
      sentences,
      otherMeanings,
      rand,
    }),
  };
}

export async function getCheckpointSession(unitId: string): Promise<LessonSession | null> {
  await connection();
  const unit = unitById(unitId);
  if (!unit) return null;
  const last = LESSONS.filter((l) => l.unit.id === unit.id).at(-1)!;
  const [vocab, started] = await Promise.all([loadVocab(), startedWords()]);
  const rand = seededRandom(Date.now());
  const unitWords = unit.lessons.flatMap((l) => l.words);
  const reached = new Set([...wordsThrough(last.index), ...started]);
  const { sentences, otherMeanings } = await practiceSentences(
    unit.lessons.flatMap((l) => l.sentences ?? []),
    unitWords,
    vocab,
    reached,
    rand,
  );
  return {
    kind: 'checkpoint',
    id: unit.id,
    title: `${unit.title} checkpoint`,
    unitId: unit.id,
    unitTitle: unit.title,
    words: unitWords,
    steps: buildCheckpoint({
      words: await lessonWords(unitWords, vocab),
      pool: [...reached].flatMap((h) => asPoolWord(h, vocab)),
      sentences,
      otherMeanings,
      rand,
    }),
  };
}

export type { PathLesson, Unit };
