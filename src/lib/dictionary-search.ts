// Ranking for dictionary search. Pure, so it can be tested; the database
// query that feeds it lives in queries/lookup.ts.

import { stem } from './meaning-grade';

export type Rankable = {
  id: number;
  simplified: string;
  traditional: string;
  definitions: string;
  proper: boolean;
  /** Commonness from the import (corpus count + HSK boost); higher first. */
  frequency: number;
};

const len = (s: string) => Array.from(s).length;

/** Senses from CC-CEDICT's " / "-joined definitions, minus classifier notes. */
export function senses(definitions: string): string[] {
  return definitions
    .split(' / ')
    .map((s) => s.trim())
    .filter((s) => s && !/^CL:/.test(s));
}

/** Readable meaning for a word card: the first few senses, trimmed. */
export function shortMeaning(definitions: string, maxSenses = 3, maxChars = 120): string {
  const text = senses(definitions).slice(0, maxSenses).join('; ');
  return text.length > maxChars ? `${text.slice(0, maxChars - 1).trimEnd()}…` : text;
}

/**
 * How well an English query matches an entry (lower is better):
 * 0 a sense is exactly the query ("to eat" counts for "eat"),
 * 1 a sense starts with it, 2 whole-word match, 3 substring, null no match.
 */
export function englishScore(query: string, definitions: string): number | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const word = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`);
  // "eats" / "eating" count as "eat". Short words are left alone: "us" isn't "use".
  const qStem = /^[a-z]{4,}$/.test(q) ? stem(q) : null;
  let best: number | null = null;
  for (const sense of senses(definitions)) {
    // Drop cross-references like "variant of 就[jiu4]" so pinyin-looking
    // queries ("jiu") don't match them as English.
    const text = sense.replace(/[^\s\x00-\x7f]+(\|[^\s\x00-\x7f]+)?\[[^\]]*\]/g, '');
    for (const part of text.toLowerCase().split(/;\s*/)) {
      // "to eat", "a man" and "the sun" count as exact senses.
      const bare = part
        .replace(/\([^)]*\)/g, '')
        .trim()
        .replace(/^(to|a|an|the) /, '');
      const score =
        bare === q || (qStem !== null && stem(bare) === qStem)
          ? 0
          : bare.startsWith(`${q} `)
            ? 1
            : word.test(part)
              ? 2
              : part.includes(q)
                ? 3
                : null;
      if (score !== null && (best === null || score < best)) best = score;
    }
  }
  return best;
}

/** Sort English matches: best score, then common words, shorter, fewer senses. */
export function rankEnglish<T extends Rankable>(query: string, entries: T[]): T[] {
  return entries
    .map((e) => ({ e, score: englishScore(query, e.definitions) }))
    .filter((x): x is { e: T; score: number } => x.score !== null)
    .sort(
      (a, b) =>
        a.score - b.score ||
        Number(a.e.proper) - Number(b.e.proper) ||
        b.e.frequency - a.e.frequency ||
        len(a.e.simplified) - len(b.e.simplified) ||
        senses(a.e.definitions).length - senses(b.e.definitions).length ||
        a.e.id - b.e.id,
    )
    .map((x) => x.e);
}

/** Sort character matches: exact, then starts-with, then contains; common and short first. */
export function rankHanzi<T extends Rankable>(query: string, entries: T[]): T[] {
  const rank = (e: T) =>
    e.simplified === query || e.traditional === query
      ? 0
      : e.simplified.startsWith(query) || e.traditional.startsWith(query)
        ? 1
        : 2;
  return [...entries].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      Number(a.proper) - Number(b.proper) ||
      b.frequency - a.frequency ||
      len(a.simplified) - len(b.simplified) ||
      a.id - b.id,
  );
}

export type PinyinKeys = { plain: string; tones: string | null };

/**
 * How an entry's reading matches a pinyin query: 0 the whole word, 1 the word
 * starts with it, null no match. With `strict`, a partial match has to end on
 * a syllable boundary, so "tea" finds 特 + ā… words but not 特奥会 (te-ao).
 */
export function pinyinMatch(query: PinyinKeys, pinyinTones: string, strict: boolean): 0 | 1 | null {
  const syllables = pinyinTones.match(/[a-z]+[1-5]/g) ?? [];
  let plain = '';
  let tones = '';
  for (const [i, s] of syllables.entries()) {
    plain += s.slice(0, -1);
    tones += s;
    if (query.tones ? tones === query.tones : plain === query.plain) {
      return i === syllables.length - 1 ? 0 : 1;
    }
  }
  if (strict) return null;
  return (query.tones ? tones.startsWith(query.tones) : plain.startsWith(query.plain)) ? 1 : null;
}

/** Sort pinyin matches: whole words first, then common, shorter. */
export function rankPinyin<T extends Rankable & { pinyinTones: string }>(
  query: PinyinKeys,
  entries: T[],
  strict: boolean,
): T[] {
  return entries
    .map((e) => ({ e, score: pinyinMatch(query, e.pinyinTones, strict) }))
    .filter((x): x is { e: T; score: 0 | 1 } => x.score !== null)
    .sort(
      (a, b) =>
        a.score - b.score ||
        Number(a.e.proper) - Number(b.e.proper) ||
        b.e.frequency - a.e.frequency ||
        len(a.e.simplified) - len(b.e.simplified) ||
        a.e.id - b.e.id,
    )
    .map((x) => x.e);
}

/**
 * FTS5 queries for English search (every word must appear, stemmed: "eats"
 * finds "to eat"). `exact` matches whole words; `prefix` also lets the last
 * word be half-typed ("hote" → hotel). Null when there are no words.
 */
export function ftsQueries(query: string): { exact: string; prefix: string } | null {
  const words = query.toLowerCase().match(/[a-z0-9]+/g);
  if (!words) return null;
  const quoted = words.map((w) => `"${w}"`);
  return { exact: quoted.join(' '), prefix: `${quoted.join(' ')}*` };
}
