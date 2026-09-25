// Turns a lesson's words, grammar point and sentences into a sequence of
// steps: teach two words, check them, repeat; then the grammar; then mixed
// practice ending on sentences. Pure (randomness is passed in) so the same
// seed always builds the same lesson — handy for tests.
import { normalise } from '@/lib/meaning-grade';
import { toneless } from '@/lib/pinyin';
import type { Syllable } from '@/lib/pinyin';

export type LessonWord = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  /** Senses a typed English answer may match. */
  accepted: string[];
  /** For checking typed pinyin (null = letters only). */
  syllables: Syllable[] | null;
};

export type Tile = { text: string; pinyin: string };

export type LessonSentence = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  /** The sentence split into words (punctuation dropped), for tiles and blanks. */
  tokens: Tile[];
};

export type GrammarCard = {
  slug: string;
  name: string;
  englishTitle: string;
  formula?: string;
  description: string;
  examples: { hanzi: string; pinyin: string; meaning: string }[];
};

export type ChoosePrompt = 'meaning' | 'hanzi' | 'listen';

export type LessonStep =
  | { kind: 'teach'; word: LessonWord; review?: boolean }
  | { kind: 'grammar'; point: GrammarCard }
  | { kind: 'choose'; prompt: ChoosePrompt; word: LessonWord; options: LessonWord[] }
  | { kind: 'match'; words: LessonWord[]; order: number[] }
  | { kind: 'type-meaning'; word: LessonWord }
  | { kind: 'type-pinyin'; word: LessonWord }
  | { kind: 'arrange'; sentence: LessonSentence; tiles: Tile[]; targets: string[] }
  | { kind: 'translate'; sentence: LessonSentence; options: string[]; targets: string[] }
  | {
      kind: 'fill';
      sentence: LessonSentence;
      blank: number;
      options: LessonWord[];
      word: LessonWord;
    };

export type BuildInput = {
  /** The lesson's new words. */
  words: LessonWord[];
  /** Earlier words to refresh (a couple is plenty). */
  review: LessonWord[];
  /** Every word reached so far — where wrong options come from. */
  pool: LessonWord[];
  grammar?: GrammarCard;
  /** Practice sentences, best first. */
  sentences: LessonSentence[];
  /** English meanings of other sentences, for translation options. */
  otherMeanings: string[];
  rand: () => number;
};

/** Hanzi a step tests, for scoring words. */
export function stepTargets(step: LessonStep): string[] {
  switch (step.kind) {
    case 'teach':
    case 'grammar':
      return [];
    case 'match':
      return step.words.map((w) => w.hanzi);
    case 'arrange':
    case 'translate':
      return step.targets;
    default:
      return [step.word.hanzi];
  }
}

/** Whether a step is a question (teach and grammar cards are not). */
export const isQuestion = (step: LessonStep) => step.kind !== 'teach' && step.kind !== 'grammar';

export function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Small deterministic RNG (mulberry32). */
export function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const len = (s: string) => Array.from(s).length;

/**
 * Up to `count` wrong options for `target`: never the same meaning, and for
 * listening never the same sound — otherwise two answers would be right.
 * Words of the same length come first, so the answer doesn't stand out.
 */
export function distractors(
  target: LessonWord,
  pool: LessonWord[],
  count: number,
  rand: () => number,
  prompt: ChoosePrompt = 'meaning',
): LessonWord[] {
  const meaning = normalise(target.meaning);
  const sound = toneless(target.pinyin).replace(/\s/g, '');
  const seen = new Set([target.hanzi]);
  const ok = pool.filter((w) => {
    if (seen.has(w.hanzi)) return false;
    seen.add(w.hanzi);
    if (normalise(w.meaning) === meaning) return false;
    if (prompt === 'listen' && toneless(w.pinyin).replace(/\s/g, '') === sound) return false;
    return true;
  });
  const same = shuffle(
    ok.filter((w) => len(w.hanzi) === len(target.hanzi)),
    rand,
  );
  const other = shuffle(
    ok.filter((w) => len(w.hanzi) !== len(target.hanzi)),
    rand,
  );
  return [...same, ...other].slice(0, count);
}

function choose(
  prompt: ChoosePrompt,
  word: LessonWord,
  pool: LessonWord[],
  rand: () => number,
): LessonStep {
  const options = shuffle([word, ...distractors(word, pool, 3, rand, prompt)], rand);
  return { kind: 'choose', prompt, word, options };
}

const MAX_TILES = 9;

function arrange(sentence: LessonSentence, lessonWords: LessonWord[], rand: () => number) {
  const inSentence = new Set(sentence.tokens.map((t) => t.text));
  const extra = shuffle(
    lessonWords.filter((w) => !inSentence.has(w.hanzi)),
    rand,
  )
    .slice(0, sentence.tokens.length >= 4 ? 2 : 1)
    .map((w) => ({ text: w.hanzi, pinyin: w.pinyin }));
  return {
    kind: 'arrange' as const,
    sentence,
    tiles: shuffle([...sentence.tokens, ...extra], rand),
    targets: sentence.tokens
      .map((t) => t.text)
      .filter((t) => lessonWords.some((w) => w.hanzi === t)),
  };
}

function targetsIn(sentence: LessonSentence, words: LessonWord[]): string[] {
  const texts = new Set(sentence.tokens.map((t) => t.text));
  return words.filter((w) => texts.has(w.hanzi)).map((w) => w.hanzi);
}

export function buildLesson(input: BuildInput): LessonStep[] {
  const { words, review, pool, rand } = input;
  const steps: LessonStep[] = [];

  // 1. Teach in pairs, each pair checked straight away.
  for (let i = 0; i < words.length; i += 2) {
    const pair = words.slice(i, i + 2);
    for (const w of pair) steps.push({ kind: 'teach', word: w });
    steps.push(choose('meaning', pair[0], pool, rand));
    if (pair[1]) steps.push(choose('listen', pair[1], pool, rand));
  }

  // 2. The grammar point, once the words are in place.
  if (input.grammar) steps.push({ kind: 'grammar', point: input.grammar });

  // 3. Mixed practice: every new word again in a harder form.
  const practice: LessonStep[] = [];
  const forms = ['type-meaning', 'type-pinyin', 'hanzi', 'listen'] as const;
  shuffle(words, rand).forEach((w, i) => {
    const form = forms[i % forms.length];
    practice.push(
      form === 'type-meaning' || form === 'type-pinyin'
        ? { kind: form, word: w }
        : choose(form, w, pool, rand),
    );
  });
  for (const w of review) practice.push(choose('meaning', w, pool, rand));
  const shuffled = shuffle(practice, rand);

  if (words.length >= 3) {
    const picked = shuffle(words, rand).slice(0, 5);
    steps.push({ kind: 'match', words: picked, order: shuffle([...picked.keys()], rand) });
  }
  steps.push(...shuffled);

  // 4. Sentences last: build one, read one, complete one.
  const usable = input.sentences.filter(
    (s) => s.tokens.length >= 2 && s.tokens.length <= MAX_TILES,
  );
  const [first, second, third] = usable;
  if (first) steps.push(arrange(first, words, rand));
  if (second) {
    const wrong = shuffle(
      input.otherMeanings.filter((m) => normalise(m) !== normalise(second.meaning)),
      rand,
    ).slice(0, 3);
    if (wrong.length >= 2) {
      steps.push({
        kind: 'translate',
        sentence: second,
        options: shuffle([second.meaning, ...wrong], rand),
        targets: targetsIn(second, words),
      });
    }
  }
  if (third) {
    const blank = third.tokens.findIndex((t) => words.some((w) => w.hanzi === t.text));
    if (blank >= 0) {
      const word = words.find((w) => w.hanzi === third.tokens[blank].text)!;
      steps.push({
        kind: 'fill',
        sentence: third,
        blank,
        word,
        options: shuffle([word, ...distractors(word, pool, 3, rand)], rand),
      });
    }
  }
  return steps;
}

/**
 * A unit checkpoint (to test out of it): no teaching, a sample of its words
 * in varied forms, then sentences.
 */
export function buildCheckpoint(input: Omit<BuildInput, 'review' | 'grammar'>): LessonStep[] {
  const { rand, pool } = input;
  const sample = shuffle(input.words, rand).slice(0, 10);
  const forms = ['meaning', 'listen', 'type-meaning', 'hanzi', 'type-pinyin'] as const;
  const steps: LessonStep[] = sample.map((w, i) => {
    const form = forms[i % forms.length];
    return form === 'type-meaning' || form === 'type-pinyin'
      ? { kind: form, word: w }
      : choose(form, w, pool, rand);
  });
  const usable = input.sentences.filter(
    (s) => s.tokens.length >= 2 && s.tokens.length <= MAX_TILES,
  );
  for (const s of shuffle(usable, rand).slice(0, 2)) steps.push(arrange(s, input.words, rand));
  return shuffle(steps.slice(0, sample.length), rand).concat(steps.slice(sample.length));
}

/** A step answered wrong comes back later; teach/grammar never repeat. */
export const MAX_RETRIES = 2;
