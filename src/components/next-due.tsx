'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatRelativeFuture } from '@/lib/dates';

/**
 * "6 cards come back in 4 min" — counts down, and refreshes the page once
 * they're due so the Review button appears without a manual reload.
 */
export function NextDue({
  inMs,
  count,
  prefix = '',
}: {
  /** Milliseconds until due, as of the server render. */
  inMs: number;
  count: number;
  prefix?: string;
}) {
  const router = useRouter();
  // Anchor to the client's clock on first render; the server's inMs is the start value.
  const [dueAt] = useState(() => Date.now() + inMs);
  const [left, setLeft] = useState(inMs);

  useEffect(() => {
    const tick = () => {
      const ms = dueAt - Date.now();
      setLeft(Math.max(0, ms));
      if (ms <= 0) router.refresh();
      return ms;
    };
    // Tick often near the end, rarely otherwise.
    const id = setInterval(tick, left < 120_000 ? 5_000 : 30_000);
    return () => clearInterval(id);
  }, [dueAt, left, router]);

  const what = count > 1 ? `${count} cards come back` : 'Your next card comes back';
  return (
    <>
      {prefix}
      {left > 0 ? `${what} in ${formatRelativeFuture(left)}.` : `${what} now — loading…`}
    </>
  );
}
