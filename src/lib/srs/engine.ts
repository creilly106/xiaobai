import 'server-only';
import {
  fsrs,
  generatorParameters,
  Rating,
  State,
  createEmptyCard,
  type Card as FsrsCard,
  type FSRS,
  type ReviewLog,
} from 'ts-fsrs';
import type { Card as DbCard, CardState } from '@/db/schema';

export { Rating, State };

const engines = new Map<number, FSRS>();

function engineFor(requestRetention: number): FSRS {
  const r = Math.min(0.99, Math.max(0.7, requestRetention));
  const key = Math.round(r * 100);
  let e = engines.get(key);
  if (!e) {
    e = fsrs(generatorParameters({ request_retention: key / 100, enable_fuzz: true }));
    engines.set(key, e);
  }
  return e;
}

const stateToFsrs: Record<CardState, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
};

const fsrsToState: Record<State, CardState> = {
  [State.New]: 'new',
  [State.Learning]: 'learning',
  [State.Review]: 'review',
  [State.Relearning]: 'relearning',
};

type SrsFields = Pick<
  DbCard,
  | 'state'
  | 'stability'
  | 'difficulty'
  | 'due'
  | 'lastReview'
  | 'elapsedDays'
  | 'scheduledDays'
  | 'learningSteps'
  | 'reps'
  | 'lapses'
>;

export function toFsrsCard(row: SrsFields, now: Date): FsrsCard {
  if (row.state === 'new' && row.reps === 0) {
    return createEmptyCard(now);
  }
  return {
    due: row.due,
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsedDays,
    scheduled_days: row.scheduledDays,
    learning_steps: row.learningSteps,
    reps: row.reps,
    lapses: row.lapses,
    state: stateToFsrs[row.state],
    last_review: row.lastReview ?? undefined,
  };
}

export type NextStateResult = {
  next: SrsFields;
  log: ReviewLog;
};

export function nextState(
  row: SrsFields,
  rating: Exclude<Rating, Rating.Manual>,
  now: Date = new Date(),
  requestRetention = 0.9,
): NextStateResult {
  const fsrsCard = toFsrsCard(row, now);
  const result = engineFor(requestRetention).next(fsrsCard, now, rating);
  const c = result.card;
  return {
    next: {
      state: fsrsToState[c.state],
      stability: c.stability,
      difficulty: c.difficulty,
      due: c.due,
      lastReview: c.last_review ?? now,
      elapsedDays: c.elapsed_days,
      scheduledDays: c.scheduled_days,
      learningSteps: c.learning_steps,
      reps: c.reps,
      lapses: c.lapses,
    },
    log: result.log,
  };
}
