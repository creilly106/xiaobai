import { describe, expect, it } from 'vitest';
import { LESSONS, wordsThrough } from '@/lib/curriculum';
import { pinyinSyllableCount } from '@/lib/pinyin-split';
import { segmentSpans } from '@/lib/segment';
import { EXAM_PASSAGES } from './exam-passages';

const HAN = /[㐀-鿿]/u;
const HAN_ALL = /[㐀-鿿]/gu;

describe('exam passages', () => {
  it('cover every examinable level once', () => {
    expect(EXAM_PASSAGES.map((p) => p.level)).toEqual([1, 2, 3, 4, 5]);
  });

  it.each(EXAM_PASSAGES)('HSK $level: uses only words up to its level', (passage) => {
    const last = LESSONS.filter((l) => l.unit.hskLevel === passage.level).at(-1)!;
    const reached = new Set(wordsThrough(last.index));
    const problems = passage.lines.flatMap((line) => {
      const covered = new Set(
        segmentSpans(line.hanzi, reached).flatMap((sp) =>
          Array.from({ length: sp.end - sp.start }, (_, i) => sp.start + i),
        ),
      );
      const left = Array.from(line.hanzi)
        .filter((c, i) => HAN.test(c) && !covered.has(i))
        .join('');
      return left ? [`${line.hanzi}: ${left}`] : [];
    });
    expect(problems).toEqual([]);
  });

  it.each(EXAM_PASSAGES)('HSK $level: one pinyin syllable per character', (passage) => {
    const bad = passage.lines.filter((l) => {
      const chars = l.hanzi.match(HAN_ALL) ?? [];
      return pinyinSyllableCount(l.pinyin) !== chars.length;
    });
    expect(bad.map((l) => `${l.hanzi} / ${l.pinyin}`)).toEqual([]);
  });

  it.each(EXAM_PASSAGES)('HSK $level: three well-formed questions', (passage) => {
    expect(passage.questions).toHaveLength(3);
    for (const q of passage.questions) {
      expect(q.options).toContain(q.answer);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  });
});
