import { describe, expect, it } from 'vitest';
import {
  buildCheckpoint,
  buildLesson,
  distractors,
  seededRandom,
  stepTargets,
  type LessonSentence,
  type LessonStep,
  type LessonWord,
} from './lesson-builder';

const w = (hanzi: string, pinyin: string, meaning: string): LessonWord => ({
  hanzi,
  pinyin,
  meaning,
  accepted: [meaning],
  syllables: null,
});

const words = [
  w('吃', 'chī', 'to eat'),
  w('喝', 'hē', 'to drink'),
  w('茶', 'chá', 'tea'),
  w('水', 'shuǐ', 'water'),
  w('米饭', 'mǐfàn', 'cooked rice'),
  w('菜', 'cài', 'dish'),
];
const earlier = [
  w('我', 'wǒ', 'I, me'),
  w('你', 'nǐ', 'you'),
  w('不', 'bù', 'not'),
  w('是', 'shì', 'to be'),
  w('四', 'sì', 'four'),
  w('十', 'shí', 'ten'),
];
const sentence = (hanzi: string, meaning: string, tokens: string[]): LessonSentence => ({
  hanzi,
  pinyin: '',
  meaning,
  tokens: tokens.map((text) => ({ text, pinyin: '' })),
});
const sentences = [
  sentence('我喝茶。', 'I drink tea.', ['我', '喝', '茶']),
  sentence('你吃米饭吗？', 'Do you eat rice?', ['你', '吃', '米饭', '吗']),
  sentence('我不喝水。', "I don't drink water.", ['我', '不', '喝', '水']),
];

function build(seed = 1): LessonStep[] {
  return buildLesson({
    words,
    review: earlier.slice(0, 2),
    pool: [...earlier, ...words],
    sentences,
    otherMeanings: ['Hello!', 'Thank you!', "What's your name?", 'Who is he?'],
    grammar: {
      slug: 'basic-svo',
      name: 'SVO',
      englishTitle: 'Word order',
      description: '',
      examples: [],
    },
    rand: seededRandom(seed),
  });
}

describe('buildLesson', () => {
  it('teaches every new word before testing it', () => {
    const steps = build();
    for (const word of words) {
      const taught = steps.findIndex((s) => s.kind === 'teach' && s.word.hanzi === word.hanzi);
      const tested = steps.findIndex(
        (s) => s.kind !== 'teach' && stepTargets(s).includes(word.hanzi),
      );
      expect(taught).toBeGreaterThanOrEqual(0);
      expect(tested).toBeGreaterThan(taught);
    }
  });

  it('includes the grammar card, a match, typing and all three sentence kinds', () => {
    const kinds = new Set(build().map((s) => s.kind));
    for (const k of [
      'grammar',
      'match',
      'type-meaning',
      'type-pinyin',
      'arrange',
      'translate',
      'fill',
    ]) {
      expect(kinds.has(k as LessonStep['kind']), k).toBe(true);
    }
  });

  it('always offers the right answer, with no duplicate options', () => {
    for (let seed = 1; seed < 30; seed++) {
      for (const step of build(seed)) {
        if (step.kind === 'choose' || step.kind === 'fill') {
          const hanzi = step.options.map((o) => o.hanzi);
          expect(hanzi).toContain(step.word.hanzi);
          expect(new Set(hanzi).size).toBe(hanzi.length);
        }
        if (step.kind === 'translate') expect(step.options).toContain(step.sentence.meaning);
        if (step.kind === 'arrange') {
          const tiles = step.tiles.map((t) => t.text);
          for (const t of step.sentence.tokens) expect(tiles).toContain(t.text);
        }
      }
    }
  });

  it('is repeatable for a seed', () => {
    expect(JSON.stringify(build(7))).toBe(JSON.stringify(build(7)));
  });
});

describe('distractors', () => {
  it('never offers a same-sounding word when listening', () => {
    const shi = w('是', 'shì', 'to be');
    const pool = [w('十', 'shí', 'ten'), w('事', 'shì', 'matter'), w('我', 'wǒ', 'I')];
    const out = distractors(shi, pool, 3, seededRandom(3), 'listen');
    expect(out.map((o) => o.hanzi)).toEqual(['我']);
  });

  it('never offers a word with the same meaning', () => {
    const out = distractors(
      w('再见', 'zàijiàn', 'goodbye'),
      [w('拜拜', 'báibái', 'goodbye')],
      3,
      Math.random,
    );
    expect(out).toEqual([]);
  });
});

describe('buildCheckpoint', () => {
  it('tests words without teaching them', () => {
    const steps = buildCheckpoint({
      words,
      pool: [...earlier, ...words],
      sentences,
      otherMeanings: [],
      rand: seededRandom(2),
    });
    expect(steps.some((s) => s.kind === 'teach')).toBe(false);
    expect(steps.length).toBeGreaterThanOrEqual(words.length);
  });
});
