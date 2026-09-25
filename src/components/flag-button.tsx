'use client';

import { useState, useTransition } from 'react';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { flagItem } from '@/lib/actions/flags';
import type { FlagReason } from '@/db/schema';

const REASONS: { key: FlagReason; label: string }[] = [
  { key: 'translation', label: 'Wrong translation' },
  { key: 'pinyin', label: 'Wrong pinyin' },
  { key: 'audio', label: 'Bad audio' },
  { key: 'too-hard', label: 'Too hard' },
  { key: 'too-easy', label: 'Too easy' },
  { key: 'other', label: 'Something else' },
];

/**
 * "Something's off here" — flags a word, sentence or lesson to be fixed.
 * Two taps: pick a reason, send. Flags are listed in Settings.
 */
export function FlagButton({
  subject,
  detail,
  context,
  className,
}: {
  /** What's being flagged: the Chinese text, or a lesson id. */
  subject: string;
  /** Pinyin / meaning as shown, so the flag is recognisable later. */
  detail?: string;
  /** Where you were; defaults to the current page. */
  context?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<FlagReason | null>(null);
  const [note, setNote] = useState('');
  const [pending, startTransition] = useTransition();

  function send() {
    if (!reason) return;
    startTransition(async () => {
      try {
        await flagItem({
          subject,
          detail,
          reason,
          note,
          context: context ?? window.location.pathname,
        });
        toast.success('Flagged — thanks. It’s listed in Settings.');
        setOpen(false);
        setReason(null);
        setNote('');
      } catch {
        toast.error("Couldn't save that flag.");
      }
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={className}
            aria-label="Flag a problem with this"
            title="Flag a problem with this"
            onClick={(e) => e.stopPropagation()}
          />
        }
      >
        <Flag />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 gap-3 p-3">
        {/* Clicks in here mustn't reach a flippable card underneath. */}
        <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-3">
          <div>
            <div className="text-sm font-medium">What’s wrong?</div>
            <div lang="zh-Hans" className="truncate text-xs text-muted-foreground">
              {subject}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {REASONS.map((r) => (
              <Chip key={r.key} selected={reason === r.key} onClick={() => setReason(r.key)}>
                {r.label}
              </Chip>
            ))}
          </div>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            aria-label="Note"
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
          />
          <Button type="button" size="sm" onClick={send} disabled={!reason || pending}>
            {pending ? 'Sending…' : 'Send'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
