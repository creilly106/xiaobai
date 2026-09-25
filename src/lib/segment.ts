const HAN = /[㐀-鿿]/u;

export type WordSpan = {
  word: string;
  /** Character offsets (code points, not UTF-16 units) into the text. */
  start: number;
  end: number;
};

/**
 * Greedy longest-match split of `text` into vocabulary words from `words`.
 * Characters that aren't part of any known word are skipped.
 */
/** Anything that can say whether a string is a word (a Set, or a Map keyed by word). */
export type WordLookup = { has(word: string): boolean };

export function segmentSpans(text: string, words: WordLookup, maxLen = 5): WordSpan[] {
  const chars = Array.from(text);
  const out: WordSpan[] = [];
  let i = 0;
  while (i < chars.length) {
    if (!HAN.test(chars[i])) {
      i += 1;
      continue;
    }
    let len = Math.min(maxLen, chars.length - i);
    for (; len >= 1; len--) {
      if (words.has(chars.slice(i, i + len).join(''))) break;
    }
    if (len >= 1) {
      out.push({ word: chars.slice(i, i + len).join(''), start: i, end: i + len });
      i += len;
    } else {
      i += 1;
    }
  }
  return out;
}

/** Just the matched words, in order (duplicates kept). */
export function segmentWords(text: string, words: WordLookup, maxLen = 5): string[] {
  return segmentSpans(text, words, maxLen).map((s) => s.word);
}
