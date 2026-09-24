'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { seedHskLevel } from '@/lib/actions/setup';

export function SetupHskButton({ level, label }: { level: number; label: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="lg"
      className="min-w-40"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await seedHskLevel(level);
          if (result.created > 0) toast.success(result.message);
          else toast.info(result.message);
        })
      }
    >
      {pending ? 'Adding...' : label}
    </Button>
  );
}
