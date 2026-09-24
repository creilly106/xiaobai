'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { removeHskLevel, seedHskLevel } from '@/lib/actions/setup';

type Props = {
  level: number;
  inQueue: boolean;
};

export function HskLevelChip({ level, inQueue }: Props) {
  const [pending, startTransition] = useTransition();
  const [confirmRemove, setConfirmRemove] = useState(false);

  function add() {
    startTransition(async () => {
      const r = await seedHskLevel(level);
      if (r.created > 0) toast.success(r.message);
      else toast.info(r.message);
    });
  }

  function remove() {
    if (!confirmRemove) {
      setConfirmRemove(true);
      setTimeout(() => setConfirmRemove(false), 4000);
      return;
    }
    startTransition(async () => {
      const r = await removeHskLevel(level);
      if (r.removed > 0) toast.success(r.message);
      else toast.info(r.message);
      setConfirmRemove(false);
    });
  }

  if (inQueue) {
    return (
      <Button
        type="button"
        variant={confirmRemove ? 'destructive' : 'outline'}
        size="sm"
        disabled={pending}
        onClick={remove}
        title="Removes all cards for this level. SRS progress on those cards is lost."
      >
        {confirmRemove ? `Confirm remove HSK ${level}` : `Remove HSK ${level}`}
      </Button>
    );
  }
  return (
    <Button type="button" variant="default" size="sm" disabled={pending} onClick={add}>
      Add HSK {level}
    </Button>
  );
}
