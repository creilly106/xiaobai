'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/audio-button';
import { unsuspendCard } from '@/lib/actions/study';

type Item = { id: number; hanzi: string; pinyin: string; meaning: string };

export function SuspendedList({ cards }: { cards: Item[] }) {
  const [pending, startTransition] = useTransition();
  if (cards.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No suspended cards. You can suspend a card from the ⋯ menu during study.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
      {cards.map((c) => (
        <li key={c.id} className="flex items-center gap-3 px-3 py-2">
          <span lang="zh-Hans" className="text-lg">
            {c.hanzi}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            {c.pinyin} — {c.meaning}
          </span>
          <AudioButton text={c.hanzi} reading={c.pinyin} />
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await unsuspendCard(c.id);
                toast.success(`${c.hanzi} is back in your queue.`);
              })
            }
          >
            Unsuspend
          </Button>
        </li>
      ))}
    </ul>
  );
}
