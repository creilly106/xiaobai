import 'server-only';
import { LESSONS, wordsThrough } from '@/lib/curriculum';
import { allExamples } from '@/lib/examples';
import { passageFor } from '@/lib/level/exam-passages';
import type { LevelBank, LevelItem, LevelStep } from '@/lib/level/items';
import { difficultyFor, type Skill } from '@/lib/level/rating';
import {
  distractors,
  seededRandom,
  shuffle,
  type LessonSentence,
  type LessonWord,
} from '@/lib/path/lesson-builder';
import { normalise } from '@/lib/meaning-grade';
import { asPoolWord, lessonWords, loadVocab, tokenise, type Vocab } from './path';

const LEVELS = [1, 2, 3, 4, 5] as const;
const MAX_SENTENCE_CHARS = 16;

/** Everything one HSK level offers to ask about. */
type LevelSource = {
  level: number;
  words: string[];
  pool: LessonWord[];
  sentences: LessonSentence[];
};

/** The words first taught at each HSK level, and sentences that need them. */
function levelSources(vocab: Vocab): LevelSource[] {
  const tatoeba = allExamples().map((e) => ({ hanzi: e.zh, pinyin: '', meaning: e.en }));
  return LEVELS.map((level) => {
    const lessons = LESSONS.filter((l) => l.unit.hskLevel === level);
    const words = [...new Set(lessons.flatMap((l) => l.words))].filter((w) => vocab.has(w));
    const own = new Set(words);
    const reached = new Set(wordsThrough(lessons.at(-1)!.index));
    const seen = new Set<string>();
    const sentences = [...lessons.flatMap((l) => l.sentences ?? []), ...tatoeba].flatMap((s) => {
      if (seen.has(s.hanzi) || Array.from(s.hanzi).length > MAX_SENTENCE_CHARS) return [];
      seen.add(s.hanzi);
      const tokens = tokenise(s.hanzi, vocab, reached);
      // Readable at this level, and needing at least one of its words.
      if (!tokens || tokens.length < 3 || !tokens.some((t) => own.has(t.text))) return [];
      return [{ ...s, pinyin: s.pinyin || tokens.map((t) => t.pinyin).join(' '), tokens }];
    });
    return { level, words, pool: words.flatMap((w) => asPoolWord(w, vocab)), sentences };
  });
}

let counter = 0;
const item = (
  skill: Skill,
  level: number,
  step: LevelStep,
  guess: number,
  nudge = 0,
): LevelItem => ({
  id: `q${++counter}`,
  skill,
  level,
  difficulty: difficultyFor(level, nudge),
  guess,
  step,
});

/** A sentence's difficulty nudge: longer ones are a little harder. */
const sentenceNudge = (s: LessonSentence) => (s.tokens.length - 5) * 8;

function translate(
  src: LevelSource,
  sentence: LessonSentence,
  rand: () => number,
  listen: boolean,
): LevelStep | null {
  const wrong = shuffle(
    src.sentences.filter((o) => normalise(o.meaning) !== normalise(sentence.meaning)),
    rand,
  )
    .slice(0, 3)
    .map((o) => o.meaning);
  if (wrong.length < 3) return null;
  return {
    kind: 'translate',
    sentence,
    options: shuffle([sentence.meaning, ...wrong], rand),
    targets: [],
    listen,
  };
}

function fill(src: LevelSource, sentence: LessonSentence, rand: () => number): LevelStep | null {
  const own = new Set(src.words);
  const blank = sentence.tokens.findIndex((t) => own.has(t.text));
  const word = src.pool.find((w) => w.hanzi === sentence.tokens[blank]?.text);
  if (blank < 0 || !word) return null;
  const others = distractors(word, src.pool, 3, rand).filter(
    (w) => !sentence.tokens.some((t) => t.text === w.hanzi),
  );
  if (others.length < 3) return null;
  return { kind: 'fill', sentence, blank, word, options: shuffle([word, ...others], rand) };
}

const choose = (
  prompt: 'meaning' | 'listen',
  word: LessonWord,
  src: LevelSource,
  rand: () => number,
): LevelStep => ({
  kind: 'choose',
  prompt,
  word,
  options: shuffle([word, ...distractors(word, src.pool, 3, rand, prompt)], rand),
});

const TONE_PAIRS = [1, 2, 3, 4].flatMap((a) => [1, 2, 3, 4, 5].map((b) => `${a}-${b}`));

/** Two-syllable words whose tones are said as written (no 3-3, no 一 or 不). */
function toneItems(words: LessonWord[], count: number, rand: () => number): LevelItem[] {
  const usable = words.filter((w) => {
    const s = w.syllables;
    if (!s || s.length !== 2 || s[0].tone === 5) return false;
    if (s[0].tone === 3 && s[1].tone === 3) return false;
    return !/^[一不]/.test(w.hanzi) && !s.some((x) => x.alt?.length);
  });
  return shuffle(usable, rand)
    .slice(0, count)
    .map((word) => {
      const answer = `${word.syllables![0].tone}-${word.syllables![1].tone}`;
      const wrong = shuffle(
        TONE_PAIRS.filter((p) => p !== answer),
        rand,
      ).slice(0, 3);
      // Tones aren't tied to a level: every pair is pitched at the middle of the scale.
      const step: LevelStep = {
        kind: 'tone-pair',
        word,
        options: shuffle([answer, ...wrong], rand),
        answer,
      };
      return { ...item('tones', 0, step, 0.25), difficulty: difficultyFor(3) };
    });
}

export type BankShape = { reading: number; listening: number; writing: number; tones: number };

/**
 * Questions for a Level check: `shape` of each skill at every HSK level (the
 * check picks among them as it learns where you are), plus tone questions.
 */
export async function buildLevelBank(
  shape: BankShape,
  rand: () => number = seededRandom(Date.now()),
): Promise<LevelBank> {
  const vocab = await loadVocab();
  const sources = levelSources(vocab);
  const bank: LevelBank = { reading: {}, listening: {}, writing: {}, tones: {} };
  const toneCandidates: string[] = [];

  for (const src of sources) {
    const L = src.level;
    // Words to ask about: typed pinyin needs their syllables, so load them properly.
    const picked = shuffle(src.words, rand).slice(
      0,
      shape.reading + shape.listening + shape.writing + 6,
    );
    const words = shuffle(await lessonWords(picked, vocab), rand);
    const sentences = shuffle(src.sentences, rand);
    if (L <= 3) toneCandidates.push(...picked);

    const reading: LevelItem[] = [];
    const listening: LevelItem[] = [];
    const writing: LevelItem[] = [];
    let w = 0;
    let s = 0;
    const nextWord = () => words[w++ % words.length];
    const nextSentence = () => sentences[s++ % Math.max(1, sentences.length)];

    for (let i = 0; reading.length < shape.reading && i < shape.reading * 3; i++) {
      const kind = i % 3;
      if (kind === 0)
        reading.push(item('reading', L, choose('meaning', nextWord(), src, rand), 0.25));
      else {
        const sentence = nextSentence();
        const step =
          sentence &&
          (kind === 1 ? translate(src, sentence, rand, false) : fill(src, sentence, rand));
        if (step) reading.push(item('reading', L, step, 0.25, sentenceNudge(sentence)));
      }
    }
    for (let i = 0; listening.length < shape.listening && i < shape.listening * 3; i++) {
      if (i % 2 === 0)
        listening.push(item('listening', L, choose('listen', nextWord(), src, rand), 0.25));
      else {
        const sentence = nextSentence();
        const step = sentence && translate(src, sentence, rand, true);
        if (step) listening.push(item('listening', L, step, 0.25, sentenceNudge(sentence)));
      }
    }
    for (const word of words.filter((x) => x.syllables)) {
      if (writing.length >= shape.writing) break;
      writing.push(item('writing', L, { kind: 'type-pinyin', word }, 0));
    }
    bank.reading[L] = reading;
    bank.listening[L] = listening;
    bank.writing[L] = writing;
  }

  const toneWords = await lessonWords([...new Set(toneCandidates)], vocab);
  bank.tones[0] = toneItems(toneWords, shape.tones, rand);
  return bank;
}

export type ExamQuestions = { level: number; items: LevelItem[] };

/** A promotion exam: every skill at exactly HSK `level`, then the level's passage. */
export async function buildExam(
  level: number,
  rand: () => number = seededRandom(Date.now()),
): Promise<ExamQuestions | null> {
  const passage = passageFor(level);
  if (!passage) return null;
  const vocab = await loadVocab();
  const src = levelSources(vocab).find((x) => x.level === level)!;
  const words = shuffle(await lessonWords(shuffle(src.words, rand).slice(0, 20), vocab), rand);
  const sentences = shuffle(src.sentences, rand);
  const items: LevelItem[] = [];
  let w = 0;
  let s = 0;
  const nextWord = () => words[w++ % words.length];
  /** Whether there's another sentence (they're read as sentences[s - 1]). */
  const nextSentence = () => s++ < sentences.length;
  const add = (skill: Skill, step: LevelStep | null | false, guess: number) => {
    if (step) items.push(item(skill, level, step, guess));
  };

  for (let i = 0; i < 2; i++) add('reading', choose('meaning', nextWord(), src, rand), 0.25);
  for (let i = 0; i < 2; i++)
    add('reading', nextSentence() && translate(src, sentences[s - 1], rand, false), 0.25);
  for (let i = 0; i < 2; i++)
    add('reading', nextSentence() && fill(src, sentences[s - 1], rand), 0.25);
  for (let i = 0; i < 3; i++) add('listening', choose('listen', nextWord(), src, rand), 0.25);
  for (let i = 0; i < 2; i++)
    add('listening', nextSentence() && translate(src, sentences[s - 1], rand, true), 0.25);
  for (const word of words.filter((x) => x.syllables).slice(0, 4)) {
    add('writing', { kind: 'type-pinyin', word }, 0);
  }
  const toneWords = await lessonWords(
    LESSONS.filter((l) => l.unit.hskLevel <= Math.min(level, 3)).flatMap((l) => l.words),
    vocab,
  );
  items.push(...toneItems(toneWords, 2, rand));

  // Shuffle the questions, then finish on the passage.
  const questions = shuffle(items, rand);
  for (const q of passage.questions) {
    questions.push(
      item(
        'reading',
        level,
        {
          kind: 'passage',
          title: passage.title,
          lines: passage.lines,
          question: q.question,
          options: shuffle(q.options, rand),
          answer: q.answer,
        },
        1 / q.options.length,
      ),
    );
  }
  return { level, items: questions };
}
