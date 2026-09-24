import { syllableTone, type Tone } from './pinyin';

// Split free pinyin text ("Wǒ xiǎng yào yì wǎn miàntiáo.") into syllables so
// each can be coloured by tone. Words are split with a small dynamic program:
// every piece must look like a pinyin syllable and carry at most one tone mark.

const SYLLABLE =
  /^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?(iang|iong|uang|ueng|iao|ian|uai|uan|van|ang|eng|ing|ong|ai|ao|an|ei|en|er|ia|ie|in|iu|ou|ua|uo|ui|un|ue|ve|vn|a|e|i|o|u|v|m|n|ng)$/;
const MARKS = /[̀-ͯ]/g;

function bare(s: string): string {
  return s.normalize('NFD').replace(/ü/gi, 'v').replace(MARKS, '').toLowerCase();
}

function markCount(s: string): number {
  return (s.normalize('NFD').match(/[̀́̌̄]/g) ?? []).length;
}

function isSyllable(s: string): boolean {
  return SYLLABLE.test(bare(s)) && markCount(s) <= 1;
}

/** Split one word (letters only) into syllables, or null if it doesn't parse. */
export function splitPinyinWord(word: string): string[] | null {
  const chars = Array.from(word.normalize('NFC'));
  const n = chars.length;
  // best[i] = fewest syllables covering chars[i..]
  const best: (string[] | null)[] = Array(n + 1).fill(null);
  best[n] = [];
  for (let i = n - 1; i >= 0; i--) {
    for (let len = Math.min(6, n - i); len >= 1; len--) {
      const piece = chars.slice(i, i + len).join('');
      const rest = best[i + len];
      if (rest && isSyllable(piece) && (!best[i] || rest.length + 1 < best[i]!.length)) {
        best[i] = [piece, ...rest];
      }
    }
  }
  return best[0];
}

export type PinyinSegment = { text: string; tone: Tone | null };

/**
 * Segments for rendering. Syllables get their tone; spaces, punctuation and
 * anything unparseable come through with `tone: null`.
 */
export function splitPinyinText(text: string): PinyinSegment[] {
  const out: PinyinSegment[] = [];
  for (const part of text.split(/([^\p{L}̀-ͯ]+)/u)) {
    if (!part) continue;
    if (!/\p{L}/u.test(part)) {
      out.push({ text: part, tone: null });
      continue;
    }
    const syllables = splitPinyinWord(part);
    if (!syllables) {
      out.push({ text: part, tone: null });
      continue;
    }
    for (const s of syllables) out.push({ text: s, tone: syllableTone(s) });
  }
  return out;
}
