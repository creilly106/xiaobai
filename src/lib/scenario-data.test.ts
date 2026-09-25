import { describe, expect, it } from 'vitest';
import { splitPinyinWord } from './pinyin-split';
import { scenarios } from './scenario-data';

const HAN = /[㐀-鿿]/gu;

/** Pinyin syllables in a line ("nǐ hǎo, wǒ jiào Kāngnà." → 5). */
function syllableCount(pinyin: string): number | null {
  let total = 0;
  for (const word of pinyin.split(/[^\p{L}’']+/u).filter(Boolean)) {
    const parts = word.split(/[’']/);
    for (const part of parts) {
      const lower = part.toLowerCase();
      // Erhua: "nǎr", "diǎnr" are one syllable plus r.
      const split =
        splitPinyinWord(lower) ??
        (lower.endsWith('r') ? splitPinyinWord(lower.slice(0, -1)) : null);
      if (!split) return null;
      total += split.length;
    }
  }
  return total;
}

const allLines = scenarios.flatMap((s) => [
  ...s.sentences.flatMap((p) => [p, ...(p.variants ?? [])]).map((l) => ({ slug: s.slug, ...l })),
  ...(s.dialogues ?? []).flatMap((d) => d.lines.map((l) => ({ slug: s.slug, ...l }))),
]);

describe('scenario data', () => {
  it('has unique slugs and no duplicate phrases within a scenario', () => {
    expect(new Set(scenarios.map((s) => s.slug)).size).toBe(scenarios.length);
    for (const s of scenarios) {
      const hanzi = s.sentences.map((p) => p.hanzi);
      expect(
        hanzi.filter((h, i) => hanzi.indexOf(h) !== i),
        s.slug,
      ).toEqual([]);
    }
  });

  it('gives each variant its own text and time label', () => {
    for (const s of scenarios) {
      for (const p of s.sentences) {
        if (!p.variants) continue;
        const labels = [p.label ?? 'Now', ...p.variants.map((v) => v.label)];
        expect(new Set(labels).size, p.hanzi).toBe(labels.length);
        for (const v of p.variants) expect(v.hanzi, p.hanzi).not.toBe(p.hanzi);
      }
    }
  });

  it('has one pinyin syllable per character (erhua 儿 aside)', () => {
    // Lines with Latin text in the Chinese (Wi-Fi) can't be counted.
    const mismatches = allLines
      .filter((l) => !/[a-z]/i.test(l.hanzi))
      .flatMap((l) => {
        const chars = l.hanzi.match(HAN) ?? [];
        const erhua = chars.filter((c, i) => c === '儿' && i > 0).length;
        const syllables = syllableCount(l.pinyin);
        const ok =
          syllables !== null && (syllables === chars.length || syllables === chars.length - erhua);
        return ok ? [] : [`${l.slug}: ${l.hanzi} / ${l.pinyin} (${syllables} vs ${chars.length})`];
      });
    expect(mismatches).toEqual([]);
  });

  it('gives a repeated line the same pinyin and meaning everywhere', () => {
    // Lines are stored once by their Chinese, so versions would overwrite each other.
    const seen = new Map<string, string>();
    const conflicts: string[] = [];
    for (const l of allLines) {
      const value = `${l.pinyin} | ${l.meaning}`;
      const before = seen.get(l.hanzi);
      if (before !== undefined && before !== value)
        conflicts.push(`${l.hanzi}: ${before} ≠ ${value}`);
      seen.set(l.hanzi, before ?? value);
    }
    expect(conflicts).toEqual([]);
  });

  it('has a meaning for every line', () => {
    for (const l of allLines) expect(l.meaning.trim().length, l.hanzi).toBeGreaterThan(0);
  });
});
