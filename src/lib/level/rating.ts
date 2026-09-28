// Skill ratings on an Elo-like scale, estimated the way adaptive tests do
// (item response theory): every question has a difficulty, and your rating is
// the one that best explains your answers, starting from what we believed
// before. Pure, so it can be tested.

import type { Skill } from '@/db/schema';

export type { Skill };

/** The skills that make up your HSK level. Tones are scored on their own. */
export const LEVEL_SKILLS = ['reading', 'listening', 'writing'] as const satisfies Skill[];
export const ALL_SKILLS = [...LEVEL_SKILLS, 'tones'] as const satisfies Skill[];

export const SKILL_NAME: Record<Skill, string> = {
  reading: 'Reading',
  listening: 'Listening',
  writing: 'Writing pinyin',
  tones: 'Tones',
};

/** Rating that means "at HSK 0" (before HSK 1); each HSK level is 200 more. */
const BASE = 1000;
const PER_LEVEL = 200;
/** Being "at" a level means getting 75% of its (unguessable) questions right. */
const AT_LEVEL = 0.75;
/** Rating gap for 10:1 odds. Steep enough that one HSK level up is a real jump (≈75% → ≈30%). */
const SCALE = 250;

/** How unsure a first guess is: about a level and a quarter either way. */
export const FIRST_SPREAD = 250;
/** Skills change: each week without a check, the estimate loosens by this much. */
const WEEKLY_DRIFT = 40;
/** Never be more sure than this, so one bad day can still move you. */
const MIN_SPREAD = 60;

/** The rating of someone who'd get 75% of HSK `level` questions right. */
export const ratingForLevel = (level: number) => BASE + PER_LEVEL * level;

/** Your rating as an HSK level, to one decimal: 1450 → 2.3. */
export function hskLevelOf(rating: number): number {
  return Math.max(0, Math.round(((rating - BASE) / PER_LEVEL) * 10) / 10);
}

/**
 * A question's difficulty for its HSK level, set so that someone exactly at
 * that level gets 75% of them right. `nudge` shifts it a little for longer
 * words or sentences.
 */
export function difficultyFor(level: number, nudge = 0): number {
  return ratingForLevel(level) - SCALE * Math.log10(AT_LEVEL / (1 - AT_LEVEL)) + nudge;
}

/**
 * Chance of answering right. `guess` is the chance of a lucky guess: 0.25
 * with four options, 0 for typed answers.
 */
export function expectedScore(rating: number, difficulty: number, guess = 0): number {
  const p = 1 / (1 + 10 ** ((difficulty - rating) / SCALE));
  return guess + (1 - guess) * p;
}

export type Answer = {
  skill: Skill;
  difficulty: number;
  guess: number;
  /** 1 right, 0 wrong; 0.5 for half right (e.g. pinyin with a tone slip). */
  score: number;
};

export type Estimate = { rating: number; spread: number };

const clamp01 = (n: number) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));

/**
 * The rating that best explains `answers` (all for one skill), starting from
 * `prior`: a short check leans on what we believed before, a long one on the
 * answers. Also how sure that makes us.
 */
export function estimate(prior: Estimate, answers: Omit<Answer, 'skill'>[]): Estimate {
  const points: [number, number][] = [];
  let best = -Infinity;
  for (let t = 400; t <= 2800; t += 5) {
    let lp = -((t - prior.rating) ** 2) / (2 * prior.spread ** 2);
    for (const a of answers) {
      const p = Math.min(0.999, Math.max(0.001, expectedScore(t, a.difficulty, a.guess)));
      const s = clamp01(a.score);
      lp += s * Math.log(p) + (1 - s) * Math.log(1 - p);
    }
    points.push([t, lp]);
    best = Math.max(best, lp);
  }
  const weights = points.map(([t, lp]) => [t, Math.exp(lp - best)] as const);
  const total = weights.reduce((n, [, w]) => n + w, 0);
  const rating = weights.reduce((n, [t, w]) => n + t * w, 0) / total;
  const spread = Math.sqrt(weights.reduce((n, [t, w]) => n + (t - rating) ** 2 * w, 0) / total);
  return { rating, spread: Math.max(MIN_SPREAD, spread) };
}

/** An estimate from `weeks` ago, loosened for how much you might have changed since. */
export function aged(e: Estimate, weeks: number): Estimate {
  return {
    rating: e.rating,
    spread: Math.sqrt(e.spread ** 2 + Math.max(0, weeks) * WEEKLY_DRIFT ** 2),
  };
}

/** Every skill's new estimate after a check or exam. */
export function estimateAll(
  priors: Record<Skill, Estimate>,
  answers: Answer[],
): Record<Skill, Estimate> {
  const out = { ...priors };
  for (const skill of ALL_SKILLS) {
    const mine = answers.filter((a) => a.skill === skill);
    if (mine.length > 0) out[skill] = estimate(priors[skill], mine);
  }
  return out;
}

/** The HSK level to ask next in a skill: a little above where you seem to be. */
export function nextLevel(e: Estimate, top = 5): number {
  return Math.max(1, Math.min(top, Math.round(hskLevelOf(e.rating) + 0.3)));
}

/** Your overall HSK level: the average of the three level skills. */
export function overallLevel(ratings: Partial<Record<Skill, Estimate>>): number | null {
  const known = LEVEL_SKILLS.map((s) => ratings[s]?.rating).filter((r): r is number => r != null);
  if (known.length < LEVEL_SKILLS.length) return null;
  return hskLevelOf(known.reduce((a, b) => a + b, 0) / known.length);
}

/** How well you hear tones, in words: tones aren't tied to an HSK level. */
export function toneLabel(rating: number): string {
  const level = (rating - BASE) / PER_LEVEL;
  return level < 1.5 ? 'Developing' : level < 3 ? 'Getting there' : level < 4.5 ? 'Solid' : 'Sharp';
}
