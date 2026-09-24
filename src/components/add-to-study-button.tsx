'use client';

import { useState, useTransition } from 'react';
import { Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { addToStudy } from '@/lib/actions/library';

/** "Add to study" for a dictionary entry or a library word; turns into a ✓ when done. */
export function AddToStudyButton({
  target,
  inStudy,
  size = 'sm',
}: {
  target: { dictionaryId: number } | { wordId: number };
  inStudy: boolean;
  size?: 'sm' | 'default';
}) {
  const [added, setAdded] = useState(inStudy);
  const [pending, startTransition] = useTransition();

  if (added) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Check className="size-3.5" /> In study
      </span>
    );
  }
  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      disabled={pending}
      onClick={(e) => {
        e.stopPropagation();
        startTransition(async () => {
          const res = await addToStudy(target);
          if (res.ok) {
            setAdded(true);
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        });
      }}
    >
      <Plus /> {pending ? 'Adding…' : 'Add to study'}
    </Button>
  );
}
