'use client';

import { useTransition } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { addScenarioToQueue } from '@/lib/actions/scenario';

export function AddScenarioButton({ slug, remaining }: { slug: string; remaining: number }) {
  const [pending, startTransition] = useTransition();

  if (remaining === 0) {
    return (
      <Button size="lg" variant="outline" disabled>
        <Check />
        In your queue
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await addScenarioToQueue(slug);
          if (result.created > 0) toast.success(result.message);
          else toast.info(result.message);
        })
      }
    >
      {pending
        ? 'Adding…'
        : remaining === 1
          ? 'Add the last phrase'
          : `Add all ${remaining} phrases to study`}
    </Button>
  );
}
