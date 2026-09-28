import { describe, expect, it } from 'vitest';
import {
  aged,
  difficultyFor,
  estimate,
  expectedScore,
  FIRST_SPREAD,
  hskLevelOf,
  nextLevel,
  overallLevel,
  ratingForLevel,
} from './rating';
import { examOpen, examResult, towardNext } from './ranks';

/** Seeded coin flips, so the simulations are repeatable. */
function coin(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

describe('ratings', () => {
  it('puts someone at a level on 75% of its typed questions', () => {
    for (const level of [1, 3, 5]) {
      expect(expectedScore(ratingForLevel(level), difficultyFor(level))).toBeCloseTo(0.75, 5);
    }
  });

  it('adds the guessing floor for multiple choice', () => {
    expect(expectedScore(0, 5000, 0.25)).toBeCloseTo(0.25, 3);
    expect(expectedScore(ratingForLevel(2), difficultyFor(2), 0.25)).toBeCloseTo(0.8125, 4);
  });

  it('reads a rating as an HSK level', () => {
    expect(hskLevelOf(ratingForLevel(3))).toBe(3);
    expect(hskLevelOf(1470)).toBe(2.4);
    expect(hskLevelOf(500)).toBe(0);
  });

  it('stays put with no answers, and moves with them', () => {
    const prior = { rating: ratingForLevel(2), spread: FIRST_SPREAD };
    expect(estimate(prior, []).rating).toBeCloseTo(ratingForLevel(2), 0);
    const hardRight = estimate(prior, [{ difficulty: difficultyFor(4), guess: 0, score: 1 }]);
    const easyWrong = estimate(prior, [{ difficulty: difficultyFor(1), guess: 0, score: 0 }]);
    expect(hardRight.rating).toBeGreaterThan(ratingForLevel(2) + 20);
    expect(easyWrong.rating).toBeLessThan(ratingForLevel(2) - 20);
    // Answers make it surer.
    expect(hardRight.spread).toBeLessThan(FIRST_SPREAD);
  });

  it('loosens an old estimate', () => {
    expect(aged({ rating: 1500, spread: 100 }, 4).spread).toBeGreaterThan(120);
    expect(aged({ rating: 1500, spread: 100 }, 0).spread).toBe(100);
  });

  it('finds a learner within half a level after a few weekly checks', () => {
    for (const truth of [1, 2.5, 4]) {
      const found: number[] = [];
      for (let seed = 1; seed <= 20; seed++) {
        const flip = coin(seed * 7919);
        let prior = { rating: ratingForLevel(2), spread: FIRST_SPREAD };
        for (let week = 0; week < 3; week++) {
          const answers: { difficulty: number; guess: number; score: number }[] = [];
          let now = prior;
          for (let i = 0; i < 5; i++) {
            const d = difficultyFor(nextLevel(now));
            const guess = i % 3 === 2 ? 0 : 0.25;
            const right = flip() < expectedScore(ratingForLevel(truth), d, guess);
            answers.push({ difficulty: d, guess, score: right ? 1 : 0 });
            now = estimate(prior, answers);
          }
          prior = aged(now, 1);
        }
        found.push(hskLevelOf(prior.rating));
      }
      const mean = found.reduce((a, b) => a + b, 0) / found.length;
      expect(Math.abs(mean - truth), `truth ${truth}: mean ${mean}`).toBeLessThan(0.5);
    }
  });

  it('asks a little above your level, within HSK 1–5', () => {
    expect(nextLevel({ rating: ratingForLevel(2.3), spread: 100 })).toBe(3);
    expect(nextLevel({ rating: ratingForLevel(0), spread: 100 })).toBe(1);
    expect(nextLevel({ rating: ratingForLevel(6), spread: 100 })).toBe(5);
  });

  it('needs every level skill for an overall level', () => {
    const r = (level: number) => ({ rating: ratingForLevel(level), spread: 100 });
    expect(overallLevel({ reading: r(3), listening: r(2) })).toBeNull();
    expect(overallLevel({ reading: r(3), listening: r(2), writing: r(4), tones: r(0) })).toBe(3);
  });
});

describe('ranks and exams', () => {
  it('opens the highest exam your level reaches, skipping ranks, up to HSK 5', () => {
    expect(examOpen(0, 2.7)).toBe(2);
    expect(examOpen(2, 2.9)).toBeNull();
    expect(examOpen(3, 6.2)).toBe(5);
    expect(examOpen(0, null)).toBeNull();
    expect(towardNext(2, 2.4)).toBeCloseTo(0.4);
  });

  it('passes at 80% overall with no skill under 60%', () => {
    expect(
      examResult({
        reading: { right: 8, total: 8 },
        listening: { right: 4, total: 5 },
        writing: { right: 3, total: 4 },
      }).passed,
    ).toBe(true);
    const lopsided = examResult({
      reading: { right: 10, total: 10 },
      listening: { right: 2, total: 5 },
      writing: { right: 4, total: 4 },
    });
    expect(lopsided.score).toBeCloseTo(16 / 19);
    expect(lopsided.passed).toBe(false);
    expect(lopsided.weakest).toBe('listening');
  });
});
