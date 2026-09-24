'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { resetReviewHistory } from '@/lib/actions/study';

export function ResetReviewsButton() {
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();

  function click() {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 4000);
      return;
    }
    startTransition(async () => {
      const r = await resetReviewHistory();
      if (r.removed > 0) toast.success(r.message);
      else toast.info(r.message);
      setConfirm(false);
    });
  }

  return (
    <Button
      type="button"
      variant={confirm ? 'destructive' : 'ghost'}
      size="sm"
      disabled={pending}
      onClick={click}
      title="Deletes all reviews and resets streak. Card SRS state is kept."
    >
      {confirm ? 'Confirm reset review history' : 'Reset review history'}
    </Button>
  );
}
