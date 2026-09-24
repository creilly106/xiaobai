'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Undo2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { STUDY_RATINGS, type StudyRating } from '@/components/rating-styles';

export function SessionComplete({
  learned,
  rated,
  tally,
  pending,
  onUndo,
  goal,
}: {
  learned: number;
  rated: number;
  tally: Record<StudyRating, number>;
  pending: boolean;
  onUndo: () => void;
  goal?: { target: number; done: number };
}) {
  const recalled = tally.hard + tally.good + tally.easy;
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold"
      >
        Session complete
      </motion.h1>
      <p className="mt-2 text-muted-foreground">
        {learned > 0 && `${learned} new card${learned === 1 ? '' : 's'} learned · `}
        {rated} review{rated === 1 ? '' : 's'}
        {rated > 0 && ` · recalled ${Math.round((recalled / rated) * 100)}%`}
      </p>
      {goal && goal.target > 0 && (
        <p className="mt-1 text-sm">
          {goal.done >= goal.target ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              Daily goal met — {goal.done} of {goal.target} reviews today.
            </span>
          ) : (
            <span className="text-muted-foreground">
              {goal.target - goal.done} more review{goal.target - goal.done === 1 ? '' : 's'} to
              reach today&apos;s goal of {goal.target}.
            </span>
          )}
        </p>
      )}
      {rated > 0 && (
        <div className="mt-5 grid grid-cols-4 gap-2 text-sm">
          {STUDY_RATINGS.map((r) => (
            <div key={r.key} className={`rounded-md border py-2 ${r.className}`}>
              <div className="font-semibold">{r.label}</div>
              <div className="tabular-nums">{tally[r.key]}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({})}>
          Back to home
        </Link>
        <Link href="/study" className={buttonVariants({ variant: 'outline' })}>
          Check for more
        </Link>
        <Button variant="ghost" onClick={onUndo} disabled={pending || rated === 0}>
          <Undo2 /> Undo last
        </Button>
      </div>
    </div>
  );
}
