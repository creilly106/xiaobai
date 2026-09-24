// Parsing CC-CEDICT lines and working with its numbered pinyin ("ni3 hao3").
// Pure — used by scripts/import-cedict.ts, the search query and the add-word form.
import { markTone, toneless, type Tone } from './pinyin';
import { splitPinyinWord } from './pinyin-split';

export type CedictEntry = {
  traditional: string;
  simplified: string;
  /** "nǐ hǎo" */
  pinyin: string;
  /** "nihao" */
  pinyinPlain: string;
  /** "ni3hao3" (neutral tone = 5) */
  pinyinTones: string;
  definitions: string[];
  /** Names and places: CC-CEDICT capitalises their pinyin. */
  proper: boolean;
};

const LINE = /^(\S+) (\S+) \[([^\]]*)\] \/(.*)\/\s*$/;
const NUMBERED_SYLLABLE = /^([a-zA-Z:]+?)([1-5])$/;

/** "hao3" → "hǎo", "lu:4" → "lǜ", "ma5" → "ma"; anything else is returned as is. */
export function numberedSyllableToMarked(token: string): string {
  const m = NUMBERED_SYLLABLE.exec(token);
  if (!m) return token.replace(/u:/g, 'ü');
  const [, letters, tone] = m;
  const marked = markTone(letters.toLowerCase().replace(/u:/g, 'v'), Number(tone) as Tone);
  return letters[0] === letters[0].toUpperCase() && /[A-Z]/.test(letters[0])
    ? marked[0].toUpperCase() + marked.slice(1)
    : marked;
}

export function numberedToMarked(numbered: string): string {
  return numbered.split(/\s+/).filter(Boolean).map(numberedSyllableToMarked).join(' ');
}

/** Search keys for numbered pinyin: letters only, and letters + tone digits. */
export function numberedKeys(numbered: string): { plain: string; tones: string } {
  const syllables = numbered
    .toLowerCase()
    .replace(/u:/g, 'v')
    .split(/\s+/)
    .map((s) => /^([a-z]+)([1-5])?$/.exec(s))
    .filter((m): m is RegExpExecArray => m !== null);
  return {
    plain: syllables.map((m) => m[1]).join(''),
    tones: syllables.map((m) => m[1] + (m[2] ?? '5')).join(''),
  };
}

export function parseCedictLine(line: string): CedictEntry | null {
  if (!line || line.startsWith('#')) return null;
  const m = LINE.exec(line.trim());
  if (!m) return null;
  const [, traditional, simplified, numbered, defs] = m;
  const { plain, tones } = numberedKeys(numbered);
  return {
    traditional,
    simplified,
    pinyin: numberedToMarked(numbered),
    pinyinPlain: plain,
    pinyinTones: tones,
    definitions: defs.split('/').filter(Boolean),
    proper: /^[A-Z]/.test(numbered),
  };
}

/**
 * Turn what someone typed into search keys. Accepts "nihao", "ni hao",
 * "ni3hao3", "nǐhǎo" or "nǐ hǎo". `tones` is set only when every syllable
 * carries a tone (numbers or marks), so partial input still matches loosely.
 */
export function pinyinQueryKeys(query: string): { plain: string; tones: string | null } | null {
  const q = query.trim().toLowerCase().replace(/u:/g, 'v').replace(/ü/g, 'v');
  if (!q || /[^a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜv1-5\s']/.test(q)) return null;

  if (/[1-5]/.test(q)) {
    const parts = q.replace(/'/g, ' ').match(/[a-z]+[1-5]?/g) ?? [];
    const plain = parts.map((p) => p.replace(/[1-5]/, '')).join('');
    const allToned = parts.every((p) => /[1-5]$/.test(p));
    return { plain, tones: allToned ? parts.join('') : null };
  }

  const plain = toneless(q);
  const syllables = q
    .split(/[\s']+/)
    .filter(Boolean)
    .flatMap((w) => splitPinyinWord(w) ?? [w]);
  const toned = syllables.map((s) => {
    const marked = s.normalize('NFD').match(/[\u0300\u0301\u030C\u0304]/);
    if (!marked) return null;
    const tone = { '\u0304': 1, '\u0301': 2, '\u030C': 3, '\u0300': 4 }[marked[0]];
    return `${toneless(s)}${tone}`;
  });
  return { plain, tones: toned.every((t) => t !== null) ? toned.join('') : null };
}

/**
 * Numbered or marked pinyin typed into a form → tidy marked pinyin. Syllables
 * may be run together and punctuation is kept: "jiu3dian4." → "jiǔdiàn."
 */
export function normaliseTypedPinyin(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, ' ');
  return trimmed.replace(/[a-zA-Z:üÜ]+[1-5]/g, (syllable) =>
    numberedSyllableToMarked(syllable.replace(/[vü]/g, 'u:').replace(/[VÜ]/g, 'U:')),
  );
}
