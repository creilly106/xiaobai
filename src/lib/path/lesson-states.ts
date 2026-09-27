import type { LessonStatus } from '@/db/schema';

/** A checkpoint needs this share of first-try answers right to pass. */
export const CHECKPOINT_PASS_MARK = 80;

/**
 * Where each lesson stands on the path:
 *  - done / tested: saved progress;
 *  - known: every word already studied elsewhere;
 *  - current: the next lesson to do;
 *  - new: a lesson added to the path *behind* where you've got to (the path
 *    grows over time) — open, optional, and it doesn't pull you back;
 *  - locked: further on.
 */
export type LessonState = LessonStatus | 'known' | 'current' | 'new' | 'locked';

export function lessonStates(
  lessons: { id: string; words: string[] }[],
  saved: Map<string, LessonStatus>,
  started: Set<string>,
): LessonState[] {
  // How far you've got counts lessons you finished or tested out of — not
  // ones whose words you happen to know, which can sit far ahead.
  const furthest = lessons.map((l) => saved.has(l.id)).lastIndexOf(true);
  let current = false;
  return lessons.map((lesson, i) => {
    const status = saved.get(lesson.id);
    if (status) return status;
    if (lesson.words.every((w) => started.has(w))) return 'known';
    if (i < furthest) return 'new';
    if (current) return 'locked';
    current = true;
    return 'current';
  });
}
