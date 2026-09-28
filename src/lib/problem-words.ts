// Working out why a word keeps slipping, from its review history. Pure, so it
// can be tested; the query lives in queries/problem-words.ts.

import { plainPinyin } from '@/lib/text';

/** Misses (Again ratings) before a word or sentence counts as a problem. */
export const PROBLEM_MISSES = 2;
/** How many recent answers to show. */
const RECENT = 8;

export type Skill = 'reading' | 'listening' | 'saying';

export const SKILL_LABEL: Record<Skill, string> = {
  reading: 'reading it',
  listening: 'hearing it',
  saying: 'saying it',
};

export type Rated = { rating: number; at: Date; mode: string };

export type History = {
  misses: number;
  lastMiss: Date | null;
  /** Your last few answers, oldest first: true = remembered. */
  recent: boolean[];
  /** Missed before, but the last three answers were all right. */
  improving: boolean;
  /** The skill most of the misses came from, when one stands out. */
  weakSpot: Skill | null;
};

/** Which skill a card tests (mode names as in card-modes.ts, which needs the database). */
export function skillOf(mode: string): Skill {
  return mode.endsWith('listening') ? 'listening' : mode === 'production' ? 'saying' : 'reading';
}

/** Sum up one item's ratings across all its cards (reading, listening, saying). */
export function summarise(ratings: Rated[]): History {
  const sorted = [...ratings].sort((a, b) => a.at.getTime() - b.at.getTime());
  const missed = sorted.filter((r) => r.rating === 1);
  const recent = sorted.slice(-RECENT).map((r) => r.rating > 1);
  const bySkill = new Map<Skill, number>();
  for (const r of missed) bySkill.set(skillOf(r.mode), (bySkill.get(skillOf(r.mode)) ?? 0) + 1);
  const [top] = [...bySkill.entries()].sort((a, b) => b[1] - a[1]);
  // Only worth saying when it isn't simply the one skill you practise.
  const weakSpot =
    top && bySkill.size > 1 && top[1] >= 2 && top[1] / missed.length >= 0.6 ? top[0] : null;
  const lastThree = sorted.slice(-3);
  return {
    misses: missed.length,
    lastMiss: missed.at(-1)?.at ?? null,
    recent,
    improving: missed.length > 0 && lastThree.length === 3 && lastThree.every((r) => r.rating > 1),
    weakSpot,
  };
}

export type Vocab = { hanzi: string; pinyin: string; meaning: string };

/** Words you've studied that sound the same once tones are ignored — easy to mix up. */
export function soundAlikes(word: Vocab, studied: Vocab[], limit = 3): Vocab[] {
  const key = plainPinyin(word.pinyin);
  if (!key) return [];
  return studied
    .filter((w) => w.hanzi !== word.hanzi && plainPinyin(w.pinyin) === key)
    .slice(0, limit);
}

/** Words you've studied that share a character with this one. */
export function sharesCharacter(word: Vocab, studied: Vocab[], limit = 3): Vocab[] {
  const chars = new Set(Array.from(word.hanzi));
  return studied
    .filter(
      (w) =>
        w.hanzi !== word.hanzi &&
        !w.hanzi.includes(word.hanzi) &&
        !word.hanzi.includes(w.hanzi) &&
        Array.from(w.hanzi).some((c) => chars.has(c)),
    )
    .slice(0, limit);
}
