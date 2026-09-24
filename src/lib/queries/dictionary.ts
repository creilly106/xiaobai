import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { db, schema } from '@/db/client';
import { charGlosses, parseGloss } from '@/lib/char-glosses';
import { allChars, getCharDatum } from '@/lib/ids-data';

export type DictEntry = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel: number | null;
  /**
   * 'word' = HSK vocabulary, 'char' = curated character gloss,
   * 'component' = fallback definition from the character dataset.
   */
  kind: 'word' | 'char' | 'component';
};

export type Dictionary = Record<string, DictEntry>;

const MAX_WORD_LEN = 5;

/** Full dictionary: HSK words plus glosses for characters that aren't words. */
const loadDictionary = cache(async (): Promise<Dictionary> => {
  await connection();
  const rows = await db
    .select({
      hanzi: schema.words.hanzi,
      pinyin: schema.words.pinyin,
      meaning: schema.words.meaning,
      hskLevel: schema.words.hskLevel,
    })
    .from(schema.words);
  const dict: Dictionary = {};
  for (const r of rows) dict[r.hanzi] = { ...r, kind: 'word' };
  for (const [hanzi, raw] of Object.entries(charGlosses)) {
    if (!dict[hanzi]) {
      dict[hanzi] = { hanzi, ...parseGloss(raw), hskLevel: null, kind: 'char' };
    }
  }
  // Last resort: the Make Me a Hanzi definition, trimmed to its first sense.
  for (const hanzi of allChars()) {
    if (dict[hanzi]) continue;
    const datum = getCharDatum(hanzi);
    const meaning = datum?.definition?.split(';')[0].trim();
    if (meaning && datum?.pinyin) {
      dict[hanzi] = { hanzi, pinyin: datum.pinyin, meaning, hskLevel: null, kind: 'component' };
    }
  }
  return dict;
});

export async function getDictionary(): Promise<Dictionary> {
  return loadDictionary();
}

/**
 * Only the entries needed to annotate `texts` — every substring up to
 * MAX_WORD_LEN chars that exists in the dictionary. Keeps the client payload
 * to a few KB instead of shipping ~2,000 entries on every page.
 */
export async function getDictionaryFor(texts: string[]): Promise<Dictionary> {
  const full = await loadDictionary();
  const out: Dictionary = {};
  for (const text of texts) {
    const chars = Array.from(text);
    for (let i = 0; i < chars.length; i++) {
      for (let len = 1; len <= MAX_WORD_LEN && i + len <= chars.length; len++) {
        const s = chars.slice(i, i + len).join('');
        if (full[s]) out[s] = full[s];
      }
    }
  }
  return out;
}

export async function lookupEntry(hanzi: string): Promise<DictEntry | null> {
  const full = await loadDictionary();
  return full[hanzi] ?? null;
}
