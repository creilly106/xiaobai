/** 1–4 = the four tones, 5 = neutral (light) tone. */
export type Tone = 1 | 2 | 3 | 4 | 5;

const MARK_TONE: Record<string, Tone> = {
  '̄': 1, // macron  ā
  '́': 2, // acute   á
  '̌': 3, // caron   ǎ
  '̀': 4, // grave   à
};

/** Tone of a single pinyin syllable written with tone marks ("mǎ" → 3, "ma" → 5). */
export function syllableTone(syllable: string): Tone {
  for (const ch of syllable.normalize('NFD')) {
    const t = MARK_TONE[ch];
    if (t) return t;
  }
  return 5;
}

/** Lowercase, no tone marks, no separators; ü → v. "Běi jīng" → "beijing". */
export function toneless(pinyin: string): string {
  return pinyin
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, (m) => (m === '̈' ? '̈' : ''))
    .normalize('NFC')
    .replace(/ü/g, 'v')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

/**
 * Split a word's pinyin into one syllable per character, using each
 * character's known readings to find the boundaries ("xīnqíng" + 心,情 →
 * ["xīn", "qíng"]). Returns null when the readings don't line up.
 */
export function splitWordPinyin(pinyin: string, readingsPerChar: string[][]): string[] | null {
  const spaced = pinyin.trim().split(/[\s']+/).filter(Boolean);
  if (spaced.length === readingsPerChar.length) return spaced;

  const letters = pinyin.replace(/[\s']+/g, '');
  const out: string[] = [];
  let pos = 0;
  for (const readings of readingsPerChar) {
    const options = [...new Set(readings.map(toneless))].sort((a, b) => b.length - a.length);
    let matched = false;
    for (const opt of options) {
      // Walk forward until the toneless prefix equals this reading.
      for (let end = pos + 1; end <= letters.length; end++) {
        const slice = letters.slice(pos, end);
        const bare = toneless(slice);
        if (bare.length > opt.length) break;
        if (bare === opt) {
          out.push(slice);
          pos = end;
          matched = true;
          break;
        }
      }
      if (matched) break;
    }
    if (!matched) return null;
  }
  return pos === letters.length ? out : null;
}

/**
 * Tones as actually spoken. Only the 3+3 rule is applied here: word lists
 * write 你好 as nǐhǎo but everyone says níhǎo. (一 and 不 changes are already
 * written into HSK pinyin, e.g. yìqǐ, búcuò.)
 */
export function spokenTones(written: Tone[]): Tone[] {
  const out = [...written];
  for (let i = out.length - 2; i >= 0; i--) {
    if (written[i] === 3 && out[i + 1] === 3) out[i] = 2;
  }
  return out;
}

const TONE_MARKS: Record<string, string[]> = {
  a: ['ā', 'á', 'ǎ', 'à'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

/**
 * Put the tone mark on the right vowel: a or e if present, the o of "ou",
 * otherwise the last vowel ("liù", "guì"). `v` is written as ü.
 */
export function markTone(letters: string, tone: Tone | null): string {
  const s = letters.toLowerCase().replace(/v/g, 'ü');
  if (!tone || tone === 5) return s;
  let idx = s.search(/[ae]/);
  if (idx < 0) idx = s.indexOf('ou');
  if (idx < 0) {
    for (let i = s.length - 1; i >= 0; i--) {
      if ('iouü'.includes(s[i])) {
        idx = i;
        break;
      }
    }
  }
  if (idx < 0) return s;
  return s.slice(0, idx) + TONE_MARKS[s[idx]][tone - 1] + s.slice(idx + 1);
}

/** A typed or expected syllable: bare letters (ü as v) plus a tone. */
export type Syllable = {
  letters: string;
  tone: Tone;
  /** Other acceptable tones — 一 and 不 change with context. */
  alt?: Tone[];
};

export function syllablesFromPinyin(parts: string[]): Syllable[] {
  return parts.map((p) => ({ letters: toneless(p), tone: syllableTone(p) }));
}

export type PinyinGrade = 'correct' | 'tones' | 'wrong';

/**
 * Compare typed syllables against the expected ones. Syllable breaks don't
 * have to match: each typed tone applies to the expected syllable that its
 * last letter falls in, and expected syllables that received no tone count
 * as neutral. "tones" means the sounds were right but a tone was not.
 */
export function gradePinyin(typed: Syllable[], expected: Syllable[]): PinyinGrade {
  const typedLetters = typed.map((s) => s.letters).join('');
  const expectedLetters = expected.map((s) => s.letters).join('');
  if (typedLetters !== expectedLetters) return 'wrong';

  const got: Tone[] = expected.map(() => 5);
  let pos = 0;
  const ends = expected.map((s) => (pos += s.letters.length));
  let cursor = 0;
  for (const s of typed) {
    cursor += s.letters.length;
    const target = ends.findIndex((end) => cursor <= end);
    if (target >= 0 && s.tone !== 5) got[target] = s.tone;
  }
  const ok = expected.every(
    (s, i) => got[i] === s.tone || (s.alt?.includes(got[i]) ?? false),
  );
  return ok ? 'correct' : 'tones';
}

export const TONE_NAMES: Record<Tone, string> = {
  1: 'High and flat',
  2: 'Rising',
  3: 'Low, dipping',
  4: 'Falling',
  5: 'Neutral (light)',
};

/** Pleco-style tone colours, readable on light and dark backgrounds. */
export const TONE_TEXT: Record<Tone, string> = {
  1: 'text-red-600 dark:text-red-400',
  2: 'text-orange-600 dark:text-orange-400',
  3: 'text-green-600 dark:text-green-400',
  4: 'text-blue-600 dark:text-blue-400',
  5: 'text-zinc-500 dark:text-zinc-400',
};

export const TONE_BORDER: Record<Tone, string> = {
  1: 'border-red-500/50 bg-red-500/10',
  2: 'border-orange-500/50 bg-orange-500/10',
  3: 'border-green-500/50 bg-green-500/10',
  4: 'border-blue-500/50 bg-blue-500/10',
  5: 'border-zinc-500/50 bg-zinc-500/10',
};

/** Pitch contour on the 1–5 Chao scale (5 = highest), for drawing. */
export const TONE_CONTOUR: Record<Tone, number[]> = {
  1: [5, 5],
  2: [3, 5],
  3: [2, 1, 4],
  4: [5, 1],
  5: [3],
};
