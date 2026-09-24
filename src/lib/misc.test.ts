import { describe, expect, it } from 'vitest';
import { audioFor } from './audio-text';
import { daysBetweenKeys, effectiveStreak, localDateKey } from './dates';
import { distractors, randomNumber, RANGES } from './number-drill';
import { backspace, draftSyllables, EMPTY_DRAFT, typeLetter, typeTone } from './pinyin-draft';
import { segmentSpans, segmentWords } from './segment';
import { sameChineseNumber, toChinese } from './numbers';

describe('segment', () => {
  const vocab = new Set(['我', '想要', '想', '要', '一', '碗', '面条']);
  it('takes the longest match', () => {
    expect(segmentWords('我想要一碗面条。', vocab)).toEqual(['我', '想要', '一', '碗', '面条']);
  });
  it('reports code-point offsets', () => {
    expect(segmentSpans('我想要', vocab)).toEqual([
      { word: '我', start: 0, end: 1 },
      { word: '想要', start: 1, end: 3 },
    ]);
  });
  it('skips characters outside the vocabulary', () => {
    expect(segmentWords('我吃', vocab)).toEqual(['我']);
  });
});

describe('dates', () => {
  it('counts days between local date keys', () => {
    expect(daysBetweenKeys('2026-09-24', '2026-09-25')).toBe(1);
    expect(daysBetweenKeys('2026-02-28', '2026-03-01')).toBe(1);
  });
  it('keeps a streak alive until a day is missed', () => {
    const now = new Date(2026, 8, 25, 12);
    expect(effectiveStreak(5, localDateKey(now), now)).toBe(5);
    expect(effectiveStreak(5, '2026-09-24', now)).toBe(5);
    expect(effectiveStreak(5, '2026-09-23', now)).toBe(0);
  });
});

describe('audioFor', () => {
  it('plays polyphones inside a word that fixes the reading', () => {
    expect(audioFor('干', 'gàn')).toEqual({ text: '干什么', via: '干什么' });
    expect(audioFor('行', 'háng')).toEqual({ text: '银行', via: '银行' });
  });
  it('leaves everything else alone', () => {
    expect(audioFor('好', 'hǎo')).toEqual({ text: '好', via: null });
    expect(audioFor('银行', 'yínháng')).toEqual({ text: '银行', via: null });
    expect(audioFor('了')).toEqual({ text: '了', via: null });
  });
});

describe('number drill', () => {
  it('keeps random numbers inside each range', () => {
    for (const range of RANGES) {
      for (let i = 0; i < 200; i++) {
        const n = randomNumber(range);
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(range.max);
      }
    }
  });
  it('offers three distinct wrong answers', () => {
    for (const n of [7, 45, 105, 1005, 6_500_041]) {
      const wrong = distractors(n, 99_999_999);
      expect(wrong).toHaveLength(3);
      expect(new Set(wrong).size).toBe(3);
      for (const w of wrong) expect(sameChineseNumber(w, toChinese(n))).toBe(false);
    }
  });
});

describe('pinyin keyboard draft', () => {
  it('builds syllables from letters and tones', () => {
    let d = EMPTY_DRAFT;
    for (const ch of 'ni') d = typeLetter(d, ch);
    d = typeTone(d, 3);
    for (const ch of 'hao') d = typeLetter(d, ch);
    d = typeTone(d, 3);
    expect(draftSyllables(d)).toEqual([
      { letters: 'ni', tone: 3 },
      { letters: 'hao', tone: 3 },
    ]);
  });
  it('re-tones the last syllable when nothing is being typed', () => {
    const d = typeTone(typeTone(typeLetter(EMPTY_DRAFT, 'a'), 1), 4);
    expect(draftSyllables(d)).toEqual([{ letters: 'a', tone: 4 }]);
  });
  it('backspace reopens the previous syllable', () => {
    const d = backspace(typeTone(typeLetter(typeLetter(EMPTY_DRAFT, 'm'), 'a'), 3));
    expect(d).toEqual({ done: [], current: 'ma' });
  });
});
