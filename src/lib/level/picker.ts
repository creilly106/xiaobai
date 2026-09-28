// Choosing the next question in a Level check: for the skill whose turn it
// is, one near where your answers so far put you. Pure, so it can be tested.

import type { LevelBank, LevelItem, ScoredAnswer } from './items';
import { estimate, nextLevel, type Estimate, type Skill } from './rating';

/** The order skills are asked in: mixed, so no stretch feels like one drill. */
export const CHECK_PLAN: Skill[] = [
  'reading',
  'listening',
  'writing',
  'reading',
  'listening',
  'writing',
  'tones',
  'reading',
  'listening',
  'writing',
  'reading',
  'listening',
  'writing',
  'tones',
  'reading',
];
/** The first check has less to go on, so it asks a few more. */
export const FIRST_CHECK_PLAN: Skill[] = [...CHECK_PLAN, 'listening', 'writing', 'reading'];

/** Where the answers so far put you in `skill`. */
export function currentEstimate(prior: Estimate, answers: ScoredAnswer[], skill: Skill): Estimate {
  return estimate(
    prior,
    answers.filter((a) => a.skill === skill),
  );
}

/**
 * An unused question for `skill` at the level your estimate calls for, or
 * the nearest level that still has one (a level above first, on a tie).
 */
export function pickNext(
  bank: LevelBank,
  used: Set<string>,
  skill: Skill,
  now: Estimate,
): LevelItem | null {
  const byLevel = bank[skill];
  const levels = Object.keys(byLevel).map(Number);
  if (levels.length === 0) return null;
  const target = skill === 'tones' ? levels[0] : nextLevel(now);
  const order = [...levels].sort((a, b) => Math.abs(a - target) - Math.abs(b - target) || b - a);
  for (const level of order) {
    const item = byLevel[level].find((i) => !used.has(i.id));
    if (item) return item;
  }
  return null;
}
