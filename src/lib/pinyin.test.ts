import { describe, expect, it } from 'vitest';
import {
  gradePinyin,
  markTone,
  splitWordPinyin,
  spokenTones,
  syllableTone,
  toneless,
  withSpokenAlternatives,
  type Syllable,
} from './pinyin';

describe('syllableTone', () => {
  it.each([
    ['mā', 1],
    ['má', 2],
    ['mǎ', 3],
    ['mà', 4],
    ['ma', 5],
    ['lǜ', 4],
    ['nǚ', 3],
  ])('%s is tone %i', (s, t) => {
    expect(syllableTone(s)).toBe(t);
  });
});

describe('toneless', () => {
  it('strips marks, spaces and case; keeps ü as v', () => {
    expect(toneless('Běi jīng')).toBe('beijing');
    expect(toneless('lǜ')).toBe('lv');
    expect(toneless("Xī'ān")).toBe('xian');
  });
});

describe('markTone', () => {
  it.each([
    ['hao', 3, 'hǎo'],
    ['liu', 4, 'liù'],
    ['gui', 4, 'guì'],
    ['shou', 3, 'shǒu'],
    ['xue', 2, 'xué'],
    ['lv', 4, 'lǜ'],
    ['nv', 3, 'nǚ'],
    ['ma', 5, 'ma'],
  ] as const)('%s + tone %i → %s', (letters, tone, expected) => {
    expect(markTone(letters, tone)).toBe(expected);
  });
});

describe('splitWordPinyin', () => {
  it('splits using each character’s readings', () => {
    expect(splitWordPinyin('xīnqíng', [['xīn'], ['qíng']])).toEqual(['xīn', 'qíng']);
    expect(splitWordPinyin('fāngàn', [['fāng'], ['àn']])).toEqual(['fāng', 'àn']);
  });
  it('respects spaces and apostrophes', () => {
    expect(splitWordPinyin("Xī'ān", [['xī'], ['ān']])).toEqual(['Xī', 'ān']);
    expect(splitWordPinyin('bú kèqi', [['bù'], ['kè']])).toEqual(['bú', 'kèqi']);
  });
  it('handles a neutral second syllable', () => {
    expect(splitWordPinyin('bàba', [['bà'], ['bà']])).toEqual(['bà', 'ba']);
  });
  it('returns null when readings do not line up', () => {
    expect(splitWordPinyin('nǐhǎo', [['wǒ'], ['hǎo']])).toBeNull();
  });
});

describe('spokenTones', () => {
  it('turns 3+3 into 2+3', () => {
    expect(spokenTones([3, 3])).toEqual([2, 3]);
  });
  it('leaves other pairs alone', () => {
    expect(spokenTones([3, 4])).toEqual([3, 4]);
    expect(spokenTones([4, 3])).toEqual([4, 3]);
  });
});

describe('withSpokenAlternatives', () => {
  it('accepts the rising first syllable of a 3+3 pair', () => {
    const [ni, hao] = withSpokenAlternatives(
      ['你', '好'],
      [
        { letters: 'ni', tone: 3 },
        { letters: 'hao', tone: 3 },
      ],
    );
    expect(ni.alt).toEqual([2]);
    expect(hao.alt).toBeUndefined();
    expect(
      gradePinyin(
        [
          { letters: 'ni', tone: 2 },
          { letters: 'hao', tone: 3 },
        ],
        [ni, hao],
      ),
    ).toBe('correct');
  });
  it('lets 一 and 不 take their context tones', () => {
    const [yi] = withSpokenAlternatives(['一'], [{ letters: 'yi', tone: 1 }]);
    expect(yi.alt?.sort()).toEqual([2, 4]);
    const [bu] = withSpokenAlternatives(['不'], [{ letters: 'bu', tone: 4 }]);
    expect(bu.alt).toEqual([2]);
  });
});

describe('gradePinyin', () => {
  const nihao: Syllable[] = [
    { letters: 'ni', tone: 3 },
    { letters: 'hao', tone: 3 },
  ];
  const s = (letters: string, tone: 1 | 2 | 3 | 4 | 5): Syllable => ({ letters, tone });

  it('accepts the exact answer', () => {
    expect(gradePinyin([s('ni', 3), s('hao', 3)], nihao)).toBe('correct');
  });
  it('flags right sounds with a wrong tone', () => {
    expect(gradePinyin([s('ni', 2), s('hao', 3)], nihao)).toBe('tones');
  });
  it('treats an untoned syllable as neutral, not a wildcard', () => {
    expect(gradePinyin([s('nihao', 3)], nihao)).toBe('tones');
  });
  it('rejects wrong letters', () => {
    expect(gradePinyin([s('ni', 3), s('hou', 3)], nihao)).toBe('wrong');
  });
  it('accepts context tones for 不', () => {
    const bushi: Syllable[] = [
      { letters: 'bu', tone: 4, alt: [2] },
      { letters: 'shi', tone: 4 },
    ];
    expect(gradePinyin([s('bu', 2), s('shi', 4)], bushi)).toBe('correct');
  });
});
