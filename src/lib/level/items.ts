// What a Level check or promotion exam asks: lesson-style questions, each
// tagged with the skill it measures and how hard it is. Shared by the server
// (which builds them) and the browser (which asks them).

import type { PathSentence } from '@/lib/curriculum/types';
import type { LessonStep, LessonWord } from '@/lib/path/lesson-builder';
import type { Skill } from './rating';

/** Hear a two-syllable word, pick its tones. Options look like "3-4". */
export type TonePairStep = {
  kind: 'tone-pair';
  word: LessonWord;
  options: string[];
  answer: string;
};

/** A question about an exam-only passage. */
export type PassageStep = {
  kind: 'passage';
  title: string;
  lines: PathSentence[];
  question: string;
  options: string[];
  answer: string;
};

export type LevelStep = LessonStep | TonePairStep | PassageStep;

export type LevelItem = {
  id: string;
  skill: Skill;
  /** HSK level it's written at (tones: 0, not tied to a level). */
  level: number;
  difficulty: number;
  /** Chance of a lucky guess. */
  guess: number;
  step: LevelStep;
};

/** Questions to choose from: by skill, then by HSK level. */
export type LevelBank = Record<Skill, Record<number, LevelItem[]>>;

/** How a single answer scored: 1 right, 0.5 half right, 0 wrong. */
export type ScoredAnswer = {
  itemId: string;
  skill: Skill;
  level: number;
  difficulty: number;
  guess: number;
  score: number;
};
