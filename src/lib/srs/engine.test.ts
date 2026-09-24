import { describe, expect, it } from 'vitest';
import { nextState, Rating } from './engine';

const fresh = {
  state: 'new' as const,
  stability: 0,
  difficulty: 0,
  due: new Date(2026, 0, 1),
  lastReview: null,
  elapsedDays: 0,
  scheduledDays: 0,
  learningSteps: 0,
  reps: 0,
  lapses: 0,
};
const now = new Date(2026, 0, 1, 9);
const DAY = 86_400_000;

describe('FSRS engine', () => {
  it('keeps a failed new card in short-term learning', () => {
    const { next } = nextState(fresh, Rating.Again, now);
    expect(next.state).toBe('learning');
    expect(next.due.getTime() - now.getTime()).toBeLessThan(DAY);
  });

  it('graduates an easy new card to long-term review', () => {
    const { next } = nextState(fresh, Rating.Easy, now);
    expect(next.state).toBe('review');
    expect(next.due.getTime() - now.getTime()).toBeGreaterThanOrEqual(DAY);
  });

  it('schedules a review sooner when the retention target is higher', () => {
    const graduated = nextState(fresh, Rating.Easy, now).next;
    const later = new Date(graduated.due);
    const relaxed = nextState(graduated, Rating.Good, later, 0.8).next;
    const strict = nextState(graduated, Rating.Good, later, 0.97).next;
    expect(strict.due.getTime()).toBeLessThan(relaxed.due.getTime());
  });

  it('counts a lapse when a review card is forgotten', () => {
    const graduated = nextState(fresh, Rating.Easy, now).next;
    const { next } = nextState(graduated, Rating.Again, new Date(graduated.due));
    expect(next.state).toBe('relearning');
    expect(next.lapses).toBe(1);
  });
});
