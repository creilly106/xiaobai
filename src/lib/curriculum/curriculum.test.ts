import { describe, expect, it } from 'vitest';
import { hsk1 } from '../../../scripts/data/hsk1';
import { hsk2 } from '../../../scripts/data/hsk2';
import { hsk3 } from '../../../scripts/data/hsk3';
import { hsk4 } from '../../../scripts/data/hsk4';
import { grammarPoints } from '../grammar-data';
import { scenarios } from '../scenario-data';
import { pinyinSyllableCount } from '../pinyin-split';
import { segmentSpans } from '../segment';
import { COMPLETE_LEVELS, LESSONS, UNITS, wordsThrough } from './index';

const HSK: Record<number, string[]> = Object.fromEntries(
  [hsk1, hsk2, hsk3, hsk4].map((list, i) => [i + 1, list.map((w) => w.hanzi)]),
);
const HAN = /[㐀-鿿]/u;
const HAN_ALL = /[㐀-鿿]/gu;

describe('curriculum', () => {
  it('has unique, well-formed ids', () => {
    const ids = [...UNITS.map((u) => u.id), ...LESSONS.map((l) => l.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of LESSONS) expect(l.id.startsWith(`${l.unit.id}-l`)).toBe(true);
  });

  it('covers every word of a complete HSK level exactly once, at that level', () => {
    for (const level of COMPLETE_LEVELS) {
      const taught = LESSONS.filter((l) => l.unit.hskLevel === level).flatMap((l) => l.words);
      const dupes = taught.filter((w, i) => taught.indexOf(w) !== i);
      expect(dupes).toEqual([]);
      // A word listed at two levels (还, 长) is stored once, at the lower one.
      const lower = new Set(
        Object.keys(HSK)
          .filter((l) => Number(l) < level)
          .flatMap((l) => HSK[Number(l)]),
      );
      const expected = HSK[level].filter((w) => !lower.has(w));
      expect([...taught].sort()).toEqual([...expected].sort());
    }
  });

  it('keeps lessons short', () => {
    for (const l of LESSONS) expect(l.words.length).toBeLessThanOrEqual(7);
  });

  it('links units to real scenarios', () => {
    const slugs = new Set(scenarios.map((s) => s.slug));
    for (const u of UNITS) if (u.scenario) expect(slugs.has(u.scenario), u.scenario).toBe(true);
  });

  it('has one pinyin syllable per character in every sentence (erhua 儿 aside)', () => {
    const bad = LESSONS.flatMap((l) =>
      (l.sentences ?? []).flatMap((s) => {
        const chars = s.hanzi.match(HAN_ALL) ?? [];
        const erhua = chars.filter((ch, i) => ch === '儿' && i > 0).length;
        const n = pinyinSyllableCount(s.pinyin);
        return n === chars.length || n === chars.length - erhua
          ? []
          : [`${l.id}: ${s.hanzi} / ${s.pinyin}`];
      }),
    );
    expect(bad).toEqual([]);
  });

  it('only references real grammar points', () => {
    const slugs = new Set(grammarPoints.map((g) => g.slug));
    for (const l of LESSONS) if (l.grammar) expect(slugs.has(l.grammar), l.grammar).toBe(true);
  });

  it('writes sentences using only words taught so far', () => {
    const allWords = new Set(Object.values(HSK).flat());
    for (const l of LESSONS) {
      const reached = new Set(wordsThrough(l.index));
      for (const sentence of l.sentences ?? []) {
        const spans = segmentSpans(sentence.hanzi, allWords);
        const covered = spans.reduce((n, sp) => n + sp.end - sp.start, 0);
        const hanCount = Array.from(sentence.hanzi).filter((c) => HAN.test(c)).length;
        const unknown = spans.map((sp) => sp.word).filter((w) => !reached.has(w));
        expect({ sentence: sentence.hanzi, covered, unknown }).toEqual({
          sentence: sentence.hanzi,
          covered: hanCount,
          unknown: [],
        });
      }
    }
  });
});
