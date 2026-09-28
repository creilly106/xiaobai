'use client';

import { useTransition } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { addScenarioToQueue, removeScenarioFromQueue } from '@/lib/actions/scenario';
import { useConfirmTap } from '@/lib/use-confirm-tap';

/** Add a whole scenario to study — or, once some of it is there, take it all out. */
export function AddScenarioButton({
  slug,
  remaining,
  queued,
}: {
  slug: string;
  /** Phrases not in your queue yet. */
  remaining: number;
  /** Phrases already in it. */
  queued: number;
}) {
  const [pending, startTransition] = useTransition();
  const confirm = useConfirmTap(4000);

  function removeAll() {
    confirm.disarm();
    startTransition(async () => {
      try {
        const { removed } = await removeScenarioFromQueue(slug);
        toast.success(
          removed > 0
            ? `Removed ${removed} sentence${removed === 1 ? '' : 's'} from study.`
            : 'Nothing from this scenario was in your queue.',
        );
      } catch {
        toast.error("Couldn't remove this scenario.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {remaining === 0 ? (
        <Button size="lg" variant="outline" disabled>
          <Check />
          In your queue
        </Button>
      ) : (
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
            ? 'Working…'
            : remaining === 1
              ? 'Add the last phrase'
              : `Add all ${remaining} phrases to study`}
        </Button>
      )}
      {queued > 0 &&
        (confirm.isArmed() ? (
          <Button size="lg" variant="destructive" disabled={pending} onClick={removeAll}>
            Remove all? (clears their review history)
          </Button>
        ) : (
          <Button size="lg" variant="ghost" disabled={pending} onClick={() => confirm.arm()}>
            Remove from study
          </Button>
        ))}
    </div>
  );
}
