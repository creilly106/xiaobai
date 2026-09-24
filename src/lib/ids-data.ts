// Character decompositions (Ideographic Description Sequences) and etymology,
// generated from Make Me a Hanzi by scripts/build-char-data.ts. Server-only in
// practice: the JSON is ~280 KB, so never import this from a client component.
//
// IDS layout operators (U+2FF0–U+2FFB):
//   ⿰ left→right, ⿱ top→bottom, ⿲ left→middle→right, ⿳ top→middle→bottom,
//   ⿴ full surround, ⿵ surround from above, ⿶ surround from below,
//   ⿷ surround from left, ⿸ from upper-left, ⿹ from upper-right,
//   ⿺ from lower-left, ⿻ overlaid.
import rawData from './generated/char-data.json';

export type Etymology = {
  type: 'ideographic' | 'pictographic' | 'pictophonetic';
  hint?: string;
  /** Meaning-carrying component (pictophonetic only). */
  semantic?: string;
  /** Sound-carrying component (pictophonetic only). */
  phonetic?: string;
};

export type CharDatum = {
  ids: string;
  radical: string;
  pinyin?: string;
  /** Every reading, only present when there is more than one (了 le/liǎo). */
  readings?: string[];
  definition?: string;
  etymology?: Etymology;
};

const data = rawData as Record<string, CharDatum>;

export const IDC_LAYOUTS: Record<string, string> = {
  '⿰': 'left + right',
  '⿱': 'top + bottom',
  '⿲': 'left + middle + right',
  '⿳': 'top + middle + bottom',
  '⿴': 'surrounded',
  '⿵': 'enclosed from above',
  '⿶': 'enclosed from below',
  '⿷': 'enclosed from the left',
  '⿸': 'wrapped from the upper left',
  '⿹': 'wrapped from the upper right',
  '⿺': 'wrapped from the lower left',
  '⿻': 'overlapping',
};

const IDC_RE = /[⿰-⿻]/u;
const UNKNOWN = '？';

/** CJK Radicals Supplement code points that have an everyday equivalent. */
const RADICAL_SUPPLEMENT: Record<string, string> = {
  '⻏': '阝',
  '⻖': '阝',
  '⻍': '辶',
  '⻌': '辶',
  '⺡': '氵',
  '⺅': '亻',
  '⺘': '扌',
  '⺖': '忄',
};

function normalize(c: string): string {
  return RADICAL_SUPPLEMENT[c] ?? c;
}

export function allChars(): string[] {
  return Object.keys(data);
}

export function getCharDatum(hanzi: string): CharDatum | null {
  return data[hanzi] ?? null;
}

/**
 * Top-level parts of a character, in reading order. Nested structures are
 * flattened to their leaves; unencodable pieces (？) and self-references are
 * dropped, and duplicates (林 = 木 + 木) are kept so the count reads right.
 */
export function decompose(hanzi: string): string[] {
  const datum = data[hanzi];
  if (!datum) return [];
  return Array.from(datum.ids)
    .filter((c) => !IDC_RE.test(c) && c !== UNKNOWN && c !== hanzi)
    .map(normalize);
}

/** Layout of the outermost IDS operator, e.g. "left + right". */
export function layoutOf(hanzi: string): string | null {
  const first = data[hanzi]?.ids[0];
  return first ? (IDC_LAYOUTS[first] ?? null) : null;
}

/** True when the dataset has no smaller parts for this character. */
export function isAtomic(hanzi: string): boolean {
  return decompose(hanzi).length === 0;
}

/** Every character in the dataset whose top-level parts include one of `parts`. */
export function charactersUsing(parts: string[]): string[] {
  const wanted = new Set(parts);
  return Object.keys(data).filter(
    (c) => !wanted.has(c) && decompose(c).some((p) => wanted.has(p)),
  );
}

export function etymologyOf(hanzi: string): Etymology | null {
  return data[hanzi]?.etymology ?? null;
}
