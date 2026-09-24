import { describe, expect, it } from 'vitest';
import {
  englishScore,
  pinyinMatch,
  rankEnglish,
  rankHanzi,
  rankPinyin,
  shortMeaning,
} from './dictionary-search';

const entry = (
  id: number,
  simplified: string,
  definitions: string,
  proper = false,
  frequency = 0,
) => ({
  id,
  simplified,
  traditional: simplified,
  definitions,
  proper,
  frequency,
});

describe('englishScore', () => {
  it('prefers exact senses, then prefixes, then whole words', () => {
    expect(englishScore('eat', 'to eat / to consume')).toBe(0);
    expect(englishScore('eat', 'to eat (a meal)')).toBe(0);
    expect(englishScore('green', 'green tea')).toBe(1);
    expect(englishScore('tea', 'green tea')).toBe(2);
    expect(englishScore('tea', 'teapot')).toBe(3);
    expect(englishScore('tea', 'coffee')).toBeNull();
    expect(englishScore('jiu', 'variant of 就[jiu4] / old variant of 捄|救[jiu4]')).toBeNull();
  });
});

describe('rankEnglish', () => {
  it('puts the everyday word first', () => {
    const ranked = rankEnglish('eat', [
      entry(3, '吃饭', 'to have a meal / to eat'),
      entry(1, '食', 'to eat / food / (literary)'),
      entry(2, '吃', 'to eat / to consume'),
      entry(4, '吃力', 'to entail strenuous effort'),
      entry(5, '伊特', 'Eat (name)', true),
    ]);
    expect(ranked.map((e) => e.simplified)).toEqual(['吃', '食', '吃饭', '伊特']);
  });
});

describe('rankHanzi', () => {
  it('orders exact, prefix, then contains', () => {
    const ranked = rankHanzi('茶', [
      entry(3, '奶茶', 'milk tea'),
      entry(2, '茶杯', 'teacup'),
      entry(1, '茶', 'tea'),
    ]);
    expect(ranked.map((e) => e.simplified)).toEqual(['茶', '茶杯', '奶茶']);
  });
});

describe('pinyinMatch', () => {
  it('matches whole words and syllable-boundary prefixes', () => {
    expect(pinyinMatch({ plain: 'jiudian', tones: null }, 'jiu3dian4', true)).toBe(0);
    expect(pinyinMatch({ plain: 'jiu', tones: null }, 'jiu3dian4', true)).toBe(1);
    expect(pinyinMatch({ plain: 'jiudian', tones: 'jiu3dian4' }, 'jiu3dian4', true)).toBe(0);
    expect(pinyinMatch({ plain: 'jiudian', tones: 'jiu3dian3' }, 'jiu3dian4', true)).toBeNull();
  });

  it('only allows mid-syllable prefixes when not strict', () => {
    expect(pinyinMatch({ plain: 'tea', tones: null }, 'te4ao4hui4', true)).toBeNull();
    expect(pinyinMatch({ plain: 'zho', tones: null }, 'zhong1guo2', false)).toBe(1);
  });
});

describe('rankPinyin', () => {
  it('puts whole-word, common matches first', () => {
    const e = (id: number, simplified: string, pinyinTones: string, frequency: number) => ({
      ...entry(id, simplified, '', false, frequency),
      pinyinTones,
    });
    const ranked = rankPinyin(
      { plain: 'jiu', tones: null },
      [
        e(1, '啾', 'jiu1', 0),
        e(2, '酒店', 'jiu3dian4', 18),
        e(3, '就', 'jiu4', 10731),
        e(4, '特', 'te4', 5),
      ],
      true,
    );
    expect(ranked.map((x) => x.simplified)).toEqual(['就', '啾', '酒店']);
  });
});

describe('shortMeaning', () => {
  it('drops classifier notes and keeps a few senses', () => {
    expect(shortMeaning('table / desk / CL:張|张[zhang1] / extra / more')).toBe(
      'table; desk; extra',
    );
  });
});
