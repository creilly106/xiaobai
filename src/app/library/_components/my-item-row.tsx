'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/audio-button';
import { Pinyin } from '@/components/pinyin';
import { removeMyWord } from '@/lib/actions/library';
import { removeMySentence } from '@/lib/actions/custom';
import type { MyItem } from '@/lib/queries/my-words';

const STATE = {
  new: 'New',
  learning: 'Learning',
  relearning: 'Relearning',
  review: 'Review',
} as const;

export function MyItemRow({ item }: { item: MyItem }) {
  const [pending, startTransition] = useTransition();
  const href = item.kind === 'word' ? `/characters/${encodeURIComponent(item.hanzi)}` : null;

  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3">
          {href ? (
            <Link href={href} lang="zh-Hans" className="text-xl hover:text-primary">
              {item.hanzi}
            </Link>
          ) : (
            <span lang="zh-Hans" className="text-xl">
              {item.hanzi}
            </span>
          )}
          <Pinyin text={item.pinyin} className="text-sm text-muted-foreground" />
          <span className="rounded-full border border-border/60 px-2 text-[11px] text-muted-foreground">
            {item.kind === 'sentence'
              ? 'Sentence'
              : item.source === 'dictionary'
                ? 'Dictionary'
                : 'Custom'}
            {' · '}
            {item.state ? (STATE[item.state as keyof typeof STATE] ?? item.state) : 'Not in study'}
          </span>
        </div>
        <p className="text-sm">{item.meaning}</p>
        {item.note && <p className="mt-0.5 text-xs text-muted-foreground">Note: {item.note}</p>}
      </div>
      <AudioButton text={item.hanzi} reading={item.kind === 'word' ? item.pinyin : undefined} />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Remove ${item.hanzi}`}
        title="Remove (also deletes its review history)"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res =
              item.kind === 'word' ? await removeMyWord(item.id) : await removeMySentence(item.id);
            if (res.ok) toast.success(res.message);
            else toast.error(res.message);
          })
        }
      >
        <Trash2 />
      </Button>
    </li>
  );
}
