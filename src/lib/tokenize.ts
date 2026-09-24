import type { Dictionary, DictEntry } from '@/lib/queries/dictionary';

export type Token = {
  text: string;
  entry?: DictEntry;
  isChinese: boolean;
};

const CJK_RE = /[一-鿿㐀-䶿]/;
const PUNCT_RE = /[　-〿＀-￯]/;

function isCjkChar(c: string): boolean {
  return CJK_RE.test(c) || PUNCT_RE.test(c);
}

function isChineseWordChar(c: string): boolean {
  return CJK_RE.test(c);
}

/**
 * Split into single-character tokens (each looked up individually).
 */
export function tokenizePerChar(text: string, dict: Dictionary): Token[] {
  return Array.from(text).map((c) => {
    if (!isCjkChar(c)) return { text: c, isChinese: false };
    return {
      text: c,
      entry: isChineseWordChar(c) ? dict[c] : undefined,
      isChinese: isChineseWordChar(c),
    };
  });
}

/**
 * Greedy longest-match segmentation against a Chinese dictionary.
 * Falls back to single characters when no multi-char match exists.
 */
export function tokenize(
  text: string,
  dict: Dictionary,
  maxLen = 5,
): Token[] {
  const chars = Array.from(text);
  const tokens: Token[] = [];
  let i = 0;
  while (i < chars.length) {
    const c = chars[i];
    if (!isCjkChar(c)) {
      // Coalesce non-CJK runs (spaces, latin, etc.) into one token.
      let j = i + 1;
      while (j < chars.length && !isCjkChar(chars[j])) j += 1;
      tokens.push({ text: chars.slice(i, j).join(''), isChinese: false });
      i = j;
      continue;
    }
    if (!isChineseWordChar(c)) {
      // Chinese punctuation.
      tokens.push({ text: c, isChinese: false });
      i += 1;
      continue;
    }
    let matched = false;
    for (let len = Math.min(maxLen, chars.length - i); len >= 2; len--) {
      const candidate = chars.slice(i, i + len).join('');
      const entry = dict[candidate];
      if (entry) {
        tokens.push({ text: candidate, entry, isChinese: true });
        i += len;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    // Single character fallback.
    tokens.push({
      text: c,
      entry: dict[c],
      isChinese: true,
    });
    i += 1;
  }
  return tokens;
}
