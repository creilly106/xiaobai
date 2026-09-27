'use server';

import { lookupEntries } from '@/lib/queries/dictionary';

export type CharInfo = { hanzi: string; pinyin: string; meaning: string; hskLevel: number | null };

/** Pinyin and meaning for "Find a character" results. */
export async function describeChars(chars: string[]): Promise<CharInfo[]> {
  const wanted = (Array.isArray(chars) ? chars : [])
    .filter((c) => typeof c === 'string' && Array.from(c).length === 1)
    .slice(0, 100);
  const dict = await lookupEntries(wanted);
  return wanted.map((hanzi) => {
    const entry = dict[hanzi];
    return {
      hanzi,
      pinyin: entry?.pinyin ?? '',
      meaning: entry?.meaning ?? '',
      hskLevel: entry?.hskLevel ?? null,
    };
  });
}
