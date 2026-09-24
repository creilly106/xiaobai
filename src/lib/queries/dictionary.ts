import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { asc, desc, inArray } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { shortMeaning } from '@/lib/dictionary-search';
import { charGlosses, parseGloss } from '@/lib/char-glosses';
import { allChars, getCharDatum } from '@/lib/ids-data';

export type DictEntry = {
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel: number | null;
  /**
   * 'word' = HSK vocabulary, 'char' = curated character gloss,
   * 'component' = fallback definition from the character dataset,
   * 'dictionary' = any other word, from CC-CEDICT.
   */
  kind: 'word' | 'char' | 'component' | 'dictionary';
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
  const missing = new Set<string>();
  for (const text of texts) {
    const chars = Array.from(text);
    for (let i = 0; i < chars.length; i++) {
      for (let len = 1; len <= MAX_WORD_LEN && i + len <= chars.length; len++) {
        const s = chars.slice(i, i + len).join('');
        if (full[s]) out[s] = full[s];
        else if (len > 1 && HAN_ONLY.test(s)) missing.add(s);
      }
    }
  }
  // Words outside the library (酒店, 菜单…) come from the full dictionary, so
  // hovering a sentence shows them as one word rather than separate characters.
  Object.assign(out, await cedictEntries([...missing]));
  return out;
}

const HAN_ONLY = /^[\u3400-\u9FFF]+$/u;

/** Best CC-CEDICT entry for each of `words` (everyday readings before names). */
async function cedictEntries(words: string[]): Promise<Dictionary> {
  const out: Dictionary = {};
  for (let i = 0; i < words.length; i += 500) {
    const rows = await db
      .select({
        simplified: schema.dictionary.simplified,
        pinyin: schema.dictionary.pinyin,
        definitions: schema.dictionary.definitions,
      })
      .from(schema.dictionary)
      .where(inArray(schema.dictionary.simplified, words.slice(i, i + 500)))
      .orderBy(
        asc(schema.dictionary.proper),
        desc(schema.dictionary.frequency),
        asc(schema.dictionary.id),
      );
    for (const r of rows) {
      if (out[r.simplified]) continue;
      out[r.simplified] = {
        hanzi: r.simplified,
        pinyin: r.pinyin,
        meaning: shortMeaning(r.definitions),
        hskLevel: null,
        kind: 'dictionary',
      };
    }
  }
  return out;
}

export async function lookupEntry(hanzi: string): Promise<DictEntry | null> {
  const full = await loadDictionary();
  if (full[hanzi]) return full[hanzi];
  return (await cedictEntries([hanzi]))[hanzi] ?? null;
}
