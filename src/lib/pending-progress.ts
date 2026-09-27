// Finished lessons and checkpoints waiting to be saved. Each result is written
// here before it's sent, and removed once the server has it — so a save that
// fails (most often because the app was updated while the page was open, which
// makes its server calls stale) is retried from a fresh page instead of lost.
// Re-sending is safe: the server only schedules words that are still new.

import type { WordResult } from '@/lib/actions/path';

export type PendingCompletion = {
  kind: 'lesson' | 'checkpoint';
  /** Lesson id, or unit id for a checkpoint. */
  id: string;
  results: WordResult[];
  score: number;
  at: number;
};

const KEY = 'xiaobai:pending-progress';
/** Results older than this are dropped rather than replayed. */
const MAX_AGE_MS = 30 * 86_400_000;

export function readPending(): PendingCompletion[] {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) ?? '[]') as PendingCompletion[];
    return Array.isArray(items) ? items.filter((i) => Date.now() - i.at < MAX_AGE_MS) : [];
  } catch {
    return [];
  }
}

function write(items: PendingCompletion[]) {
  try {
    if (items.length) localStorage.setItem(KEY, JSON.stringify(items));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable (private mode): the direct save is all we have.
  }
}

export function addPending(item: PendingCompletion) {
  write([...readPending().filter((i) => !(i.kind === item.kind && i.id === item.id)), item]);
}

export function removePending(kind: PendingCompletion['kind'], id: string) {
  write(readPending().filter((i) => !(i.kind === kind && i.id === id)));
}

/** A review rating made offline, sent later with the time it was made. */
export type PendingRating = {
  cardId: number;
  /** 1 Again … 4 Easy. */
  rating: 1 | 2 | 3 | 4;
  elapsedMs: number;
  at: number;
};

const RATINGS_KEY = 'xiaobai:pending-ratings';

export function readPendingRatings(): PendingRating[] {
  try {
    const items = JSON.parse(localStorage.getItem(RATINGS_KEY) ?? '[]') as PendingRating[];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeRatings(items: PendingRating[]) {
  try {
    if (items.length) localStorage.setItem(RATINGS_KEY, JSON.stringify(items));
    else localStorage.removeItem(RATINGS_KEY);
  } catch {
    // Storage unavailable: nothing more we can do offline.
  }
}

export function addPendingRating(item: PendingRating) {
  writeRatings([...readPendingRatings(), item]);
}

/** Drop the oldest rating once it's been saved (they're sent in order). */
export function shiftPendingRating() {
  writeRatings(readPendingRatings().slice(1));
}

/** Everything still waiting to be saved. */
export function pendingCount(): number {
  return readPending().length + readPendingRatings().length;
}
