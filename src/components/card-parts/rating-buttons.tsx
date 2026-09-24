'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export type FlashcardRating<K extends string = string> = {
  key: K;
  label: string;
  hint: string;
  description: string;
  className: string;
};

/** The row of recall ratings under a card; disabled until the answer shows. */
export function RatingButtons<K extends string>({
  ratings,
  enabled,
  onRate,
  suggested,
}: {
  ratings: readonly FlashcardRating<K>[];
  enabled: boolean;
  onRate: (key: K) => void;
  /** Highlighted after a typed answer is checked; you still choose. */
  suggested?: K;
}) {
  // Focus the suggestion so Enter (or Space) accepts it.
  const suggestedRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (enabled && suggested) suggestedRef.current?.focus({ preventScroll: true });
  }, [enabled, suggested]);

  return (
    <div className="mt-4 grid grid-cols-4 gap-2" role="group" aria-label="Rate your recall">
      {ratings.map((r) => (
        <motion.button
          key={r.key}
          ref={suggested === r.key ? suggestedRef : undefined}
          type="button"
          disabled={!enabled}
          onClick={() => onRate(r.key)}
          title={r.description}
          aria-keyshortcuts={r.hint}
          whileHover={enabled ? { y: -1 } : undefined}
          whileTap={enabled ? { scale: 0.97 } : undefined}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className={`flex flex-col items-center gap-0.5 rounded-lg border py-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none ${
            enabled ? r.className : 'border-transparent bg-muted text-muted-foreground opacity-60'
          } ${enabled && suggested === r.key ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
          aria-description={enabled && suggested === r.key ? 'Suggested' : undefined}
        >
          <span className="text-base font-semibold">{r.label}</span>
          <span className="font-mono text-xs opacity-70">{r.hint}</span>
        </motion.button>
      ))}
    </div>
  );
}
