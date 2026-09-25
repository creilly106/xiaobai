'use client';

import { useTransition } from 'react';
import { Check, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LocalDate } from '@/components/local-date';
import { deleteFlag, resolveFlag } from '@/lib/actions/flags';
import type { Flag } from '@/db/schema';

const REASON: Record<string, string> = {
  translation: 'Wrong translation',
  pinyin: 'Wrong pinyin',
  audio: 'Bad audio',
  'too-hard': 'Too hard',
  'too-easy': 'Too easy',
  other: 'Something else',
};

/** One line per flag, for pasting into a message. */
function asText(flags: Flag[]): string {
  return flags
    .map((f) =>
      [
        `- ${f.subject}`,
        f.detail ? `(${f.detail})` : '',
        `— ${REASON[f.reason] ?? f.reason}`,
        f.note ? `: ${f.note}` : '',
        f.context ? `[${f.context}]` : '',
      ]
        .filter(Boolean)
        .join(' '),
    )
    .join('\n');
}

export function FlagsPanel({ flags }: { flags: Flag[] }) {
  const [pending, startTransition] = useTransition();

  if (flags.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing flagged. Tap the flag icon on any card or sentence when something looks wrong.
      </p>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(asText(flags));
      toast.success(`Copied ${flags.length} flag${flags.length === 1 ? '' : 's'}.`);
    } catch {
      toast.error('Couldn’t copy — select the list and copy it instead.');
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {flags.length} open. Copy the list and send it over to get them fixed.
        </p>
        <Button type="button" size="sm" variant="outline" onClick={copy}>
          <Copy /> Copy list
        </Button>
      </div>
      <ul className="divide-y divide-border/60 rounded-md border border-border/60">
        {flags.map((f) => (
          <li key={f.id} className="flex items-start gap-3 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span lang="zh-Hans" className="text-lg">
                  {f.subject}
                </span>
                <span className="text-xs font-medium">{REASON[f.reason] ?? f.reason}</span>
              </div>
              {f.detail && <div className="text-xs text-muted-foreground">{f.detail}</div>}
              {f.note && <div className="text-sm">“{f.note}”</div>}
              <div className="text-[11px] text-muted-foreground">
                {f.context} · <LocalDate value={f.createdAt} />
              </div>
            </div>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Mark as fixed"
              title="Mark as fixed"
              disabled={pending}
              onClick={() => startTransition(() => resolveFlag(f.id))}
            >
              <Check />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Delete flag"
              title="Delete"
              disabled={pending}
              onClick={() => startTransition(() => deleteFlag(f.id))}
            >
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
