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
