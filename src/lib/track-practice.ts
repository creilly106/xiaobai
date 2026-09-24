'use client';

import { toast } from 'sonner';
import { logPractice, type PracticeEntry } from '@/lib/actions/practice';

/**
 * Record a practice answer without making the drill wait. A failed write
 * only loses one data point, so it's logged rather than interrupting you.
 */
export function trackPractice(entry: PracticeEntry): void {
  logPractice([entry])
    .then(({ reviewSooner }) => {
      if (reviewSooner > 0) {
        toast.info(`${entry.detail?.word ?? 'That word'} will come up in tomorrow's review.`);
      }
    })
    .catch((err) => console.error('Could not save practice result', err));
}
