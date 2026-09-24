import type { FlashcardRating } from '@/components/flashcard';

// One palette for every place a recall rating is shown (study, quiz, stats).
export const RATING_TONE = {
  again: 'border-red-500/30 bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-300',
  hard: 'border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300',
  good: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300',
  easy: 'border-sky-500/30 bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 dark:text-sky-300',
} as const;

export type StudyRating = 'again' | 'hard' | 'good' | 'easy';

export const STUDY_RATINGS: readonly FlashcardRating<StudyRating>[] = [
  {
    key: 'again',
    label: 'Again',
    hint: '1',
    description: "Didn't remember — show it again soon",
    className: RATING_TONE.again,
  },
  {
    key: 'hard',
    label: 'Hard',
    hint: '2',
    description: 'Remembered, but with real effort',
    className: RATING_TONE.hard,
  },
  {
    key: 'good',
    label: 'Good',
    hint: '3',
    description: 'Remembered after a moment',
    className: RATING_TONE.good,
  },
  {
    key: 'easy',
    label: 'Easy',
    hint: '4',
    description: 'Knew it instantly',
    className: RATING_TONE.easy,
  },
];

export type QuizOutcome = 'missed' | 'hard' | 'good' | 'easy';

export const QUIZ_OUTCOMES: readonly FlashcardRating<QuizOutcome>[] = [
  { ...STUDY_RATINGS[0], key: 'missed', label: 'Missed', description: "Didn't know it" },
  { ...STUDY_RATINGS[1], key: 'hard' },
  { ...STUDY_RATINGS[2], key: 'good', label: 'Got it' },
  { ...STUDY_RATINGS[3], key: 'easy' },
];

export const STATE_LABEL: Record<string, string> = {
  new: 'New',
  learning: 'Learning',
  relearning: 'Relearning',
  review: 'Review',
};
