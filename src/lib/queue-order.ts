// Pure ordering rules for the study queue. Kept free of database code so they
// can be unit-tested (see queue-order.test.ts).

/**
 * A sentence card is introduced once you know most of its words — otherwise
 * it's a wall of unfamiliar characters you can only guess at.
 */
export const UNLOCK_SHARE = 0.6;

/** `parts` = the sentence's vocabulary words; `known` = words you've started. */
export function isSentenceUnlocked(parts: string[], known: Set<string>): boolean {
  if (parts.length === 0) return true;
  const knownCount = parts.filter((w) => known.has(w)).length;
  return parts.length - knownCount <= 1 || knownCount / parts.length >= UNLOCK_SHARE;
}

/** Stable pseudo-random order that changes daily, so reloads don't reshuffle. */
export function dailyRank(id: number, day: string): number {
  let h = 2166136261;
  for (const c of `${day}:${id}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export type NewWord = { id: number; needed: boolean; level: number; rank: number };

/**
 * Final order of new cards: unlocked sentences, then words your queued
 * sentences need, then listening cards taking turns with the remaining words
 * (lowest HSK level first, shuffled daily within a level).
 */
export function orderNewCards({
  sentences,
  words,
  listening,
}: {
  sentences: number[];
  words: NewWord[];
  listening: number[];
}): number[] {
  const sorted = [...words].sort(
    (a, b) => Number(b.needed) - Number(a.needed) || a.level - b.level || a.rank - b.rank,
  );
  const needed = sorted.filter((w) => w.needed).map((w) => w.id);
  const others = sorted.filter((w) => !w.needed).map((w) => w.id);
  const mixed: number[] = [];
  for (let i = 0; i < Math.max(listening.length, others.length); i++) {
    if (i < listening.length) mixed.push(listening[i]);
    if (i < others.length) mixed.push(others[i]);
  }
  return [...[...sentences].sort((a, b) => a - b), ...needed, ...mixed];
}

/** Spread `extra` evenly through `base` so new cards don't all land at the end. */
export function interleave<T>(base: T[], extra: T[]): T[] {
  if (extra.length === 0) return base;
  if (base.length === 0) return extra;
  const out: T[] = [];
  const step = (base.length + extra.length) / extra.length;
  let nextExtraAt = step / 2;
  let bi = 0;
  let ei = 0;
  for (let i = 0; i < base.length + extra.length; i++) {
    if (ei < extra.length && (i >= nextExtraAt || bi >= base.length)) {
      out.push(extra[ei++]);
      nextExtraAt += step;
    } else {
      out.push(base[bi++]);
    }
  }
  return out;
}

/**
 * Learning cards are time-sensitive, so they go early — but never first and
 * never back to back: one struggling card shouldn't open every session.
 */
export function spreadEarly<T>(priority: T[], rest: T[]): T[] {
  if (rest.length === 0) return priority;
  const out: T[] = [];
  let pi = 0;
  let ri = 0;
  while (pi < priority.length || ri < rest.length) {
    if (ri < rest.length) out.push(rest[ri++]);
    if (pi < priority.length) out.push(priority[pi++]);
  }
  return out;
}
