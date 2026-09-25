import { hsk1Units } from './hsk1';
import type { Lesson, Unit } from './types';

export type { DialogueLine, Lesson, PathSentence, Unit } from './types';

/** Every unit, in path order. */
export const UNITS: Unit[] = [...hsk1Units];

/** HSK levels whose words are all covered by the path. */
export const COMPLETE_LEVELS = [1];

export type PathLesson = Lesson & {
  unit: Unit;
  /** Position in the whole path, from 0. */
  index: number;
  /** Position within its unit, from 0. */
  unitIndex: number;
};

export const LESSONS: PathLesson[] = UNITS.flatMap((unit) =>
  unit.lessons.map((lesson, unitIndex) => ({ ...lesson, unit, unitIndex, index: 0 })),
).map((lesson, index) => ({ ...lesson, index }));

const byId = new Map(LESSONS.map((l) => [l.id, l]));
const unitsById = new Map(UNITS.map((u) => [u.id, u]));

export const lessonById = (id: string) => byId.get(id);
export const unitById = (id: string) => unitsById.get(id);

/** Words taught by the path up to and including lesson `index`. */
export function wordsThrough(index: number): string[] {
  return LESSONS.slice(0, index + 1).flatMap((l) => l.words);
}
