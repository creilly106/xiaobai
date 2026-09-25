import { describe, expect, it } from 'vitest';
import { grammarPoints } from './grammar-data';
import { pinyinSyllableCount } from './pinyin-split';

const HAN = /[㐀-鿿]/gu;

describe('grammar data', () => {
  it('has unique slugs', () => {
    const slugs = grammarPoints.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has one pinyin syllable per character in every example (erhua 儿 aside)', () => {
    const bad = grammarPoints.flatMap((g) =>
      g.examples.flatMap((ex) => {
        const chars = ex.hanzi.match(HAN) ?? [];
        const erhua = chars.filter((c, i) => c === '儿' && i > 0).length;
        const n = pinyinSyllableCount(ex.pinyin);
        return n === chars.length || n === chars.length - erhua
          ? []
          : [`${g.slug}: ${ex.hanzi} / ${ex.pinyin} (${n} vs ${chars.length})`];
      }),
    );
    expect(bad).toEqual([]);
  });
});
