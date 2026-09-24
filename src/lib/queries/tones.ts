import 'server-only';
import { cache } from 'react';
import { getDictionary } from '@/lib/queries/dictionary';
import { getCharDatum } from '@/lib/ids-data';
import {
  splitWordPinyin,
  spokenTones,
  syllablesFromPinyin,
  syllableTone,
  withSpokenAlternatives,
  toneless,
  type Syllable,
  type Tone,
} from '@/lib/pinyin';

export type ToneSingle = {
  hanzi: string;
  pinyin: string;
  tone: Tone;
  meaning: string;
  hskLevel: number | null;
  /** How many vocabulary words use this character — a stand-in for frequency. */
  familiarity: number;
};

export type TonePair = {
  hanzi: string;
  pinyin: string;
  syllables: [string, string];
  /** As written in the dictionary. */
  written: [Tone, Tone];
  /** As spoken (after the 3+3 → 2+3 change) — what the learner should hear. */
  heard: [Tone, Tone];
  meaning: string;
  hskLevel: number | null;
};

/** Same syllable, different tones — e.g. 买 mǎi "buy" vs 卖 mài "sell". */
export type ToneGroup = { syllable: string; items: ToneSingle[] };

export type ToneDrillData = {
  singles: ToneSingle[];
  pairs: TonePair[];
  groups: ToneGroup[];
};

const SINGLE_SYLLABLE = /^[a-zA-Züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+$/;

function shortMeaning(m: string): string {
  return m.split(/[;,/]/)[0].trim();
}

/** Readings we trust for a character: every dataset reading plus the dictionary's. */
function readingsOf(char: string, dictPinyin?: string): string[] {
  const d = getCharDatum(char);
  const all = [
    ...(d?.readings ?? (d?.pinyin ? [d.pinyin] : [])),
    ...(dictPinyin ? [dictPinyin] : []),
  ];
  return all.length > 0 ? all : [];
}

/**
 * Expected syllables for typing a word's pinyin, or null if the pinyin can't
 * be matched to its characters. 一 and 不 accept their context tones too.
 */
export function wordSyllables(
  hanzi: string,
  pinyin: string,
  dict: Record<string, { pinyin: string } | undefined>,
): Syllable[] | null {
  const chars = Array.from(hanzi);
  const parts =
    chars.length === 1
      ? [pinyin.trim()]
      : splitWordPinyin(
          pinyin,
          chars.map((c) => readingsOf(c, dict[c]?.pinyin)),
        );
  if (!parts || parts.length !== chars.length) return null;
  return withSpokenAlternatives(chars, syllablesFromPinyin(parts));
}

/**
 * Items for the tone trainer. Audio comes from the browser's speech engine,
 * which reads characters — so anything it might pronounce differently from
 * the answer is left out:
 *  - characters with more than one reading (了 le/liǎo, 行 xíng/háng),
 *  - neutral-tone singles (they only exist inside words),
 *  - 3rd tone + neutral pairs, where the first syllable changes unpredictably.
 */
export const getToneDrillData = cache(async (): Promise<ToneDrillData> => {
  const dict = await getDictionary();
  const singles: ToneSingle[] = [];

  // Characters that turn up in HSK words are the ones worth training on.
  const usage = new Map<string, number>();
  for (const e of Object.values(dict)) {
    if (e.kind !== 'word') continue;
    for (const ch of new Set(Array.from(e.hanzi))) usage.set(ch, (usage.get(ch) ?? 0) + 1);
  }
  const pairs: TonePair[] = [];

  for (const entry of Object.values(dict)) {
    const chars = Array.from(entry.hanzi);
    const py = entry.pinyin.trim();

    if (chars.length === 1) {
      if (entry.kind === 'component' || !SINGLE_SYLLABLE.test(py)) continue;
      const d = getCharDatum(entry.hanzi);
      if (d?.readings && new Set(d.readings.map((r) => r.toLowerCase())).size > 1) continue;
      const tone = syllableTone(py);
      if (tone === 5) continue;
      const familiarity = usage.get(entry.hanzi) ?? 0;
      if (familiarity === 0) continue;
      singles.push({
        hanzi: entry.hanzi,
        pinyin: py.toLowerCase(),
        tone,
        meaning: shortMeaning(entry.meaning),
        hskLevel: entry.hskLevel,
        familiarity,
      });
    } else if (chars.length === 2 && entry.kind === 'word') {
      const split = splitWordPinyin(
        py,
        chars.map((c) => readingsOf(c, dict[c]?.pinyin)),
      );
      if (!split) continue;
      const written = split.map(syllableTone) as [Tone, Tone];
      if (written[0] === 5) continue;
      if (written[0] === 3 && written[1] === 5) continue;
      pairs.push({
        hanzi: entry.hanzi,
        pinyin: py,
        syllables: [split[0].toLowerCase(), split[1].toLowerCase()],
        written,
        heard: spokenTones(written) as [Tone, Tone],
        meaning: shortMeaning(entry.meaning),
        hskLevel: entry.hskLevel,
      });
    }
  }

  // Minimal groups: one character per tone for each syllable, vocabulary first.
  const bySyllable = new Map<string, Map<Tone, ToneSingle>>();
  const ranked = [...singles].sort(
    (a, b) => (a.hskLevel ?? 9) - (b.hskLevel ?? 9) || b.familiarity - a.familiarity,
  );
  for (const s of ranked) {
    const key = toneless(s.pinyin);
    const byTone = bySyllable.get(key) ?? new Map<Tone, ToneSingle>();
    if (!byTone.has(s.tone)) byTone.set(s.tone, s);
    bySyllable.set(key, byTone);
  }
  const groups: ToneGroup[] = [];
  for (const [syllable, byTone] of bySyllable) {
    if (byTone.size < 2) continue;
    groups.push({ syllable, items: [...byTone.values()].sort((a, b) => a.tone - b.tone) });
  }

  return { singles, pairs, groups };
});
