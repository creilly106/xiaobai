'use client';

import { AudioButton } from '@/components/audio-button';
import { speak } from '@/lib/tts';
import { numberPinyin, toChinese } from '@/lib/numbers';

/** A digit tile that speaks itself when clicked. */
export function SpeakTile({ n }: { n: number }) {
  const zh = toChinese(n);
  return (
    <button
      type="button"
      onClick={() => speak(zh)}
      className="flex flex-col items-center gap-0.5 rounded-lg border border-border/60 bg-card px-2 py-3 transition-colors hover:border-primary/60 hover:bg-muted/40"
      title={`Play ${zh}`}
    >
      <span className="text-xs tabular-nums text-muted-foreground">{n}</span>
      <span lang="zh-Hans" className="text-3xl leading-tight">
        {zh}
      </span>
      <span className="text-xs text-muted-foreground">{numberPinyin(zh)}</span>
    </button>
  );
}

/** Inline example: "10005 → 一万零五" with audio. */
export function Example({ n, note }: { n: number; note?: string }) {
  const zh = toChinese(n);
  return (
    <li className="grid grid-cols-[5rem_1fr_auto] items-center gap-x-3 py-1.5">
      <span className="text-right font-mono text-sm tabular-nums text-muted-foreground">
        {n.toLocaleString('en-US')}
      </span>
      <span className="min-w-0">
        <span lang="zh-Hans" className="block text-lg leading-snug">
          {zh}
        </span>
        <span className="block text-xs text-muted-foreground">
          {numberPinyin(zh)}
          {note && <span className="text-foreground/70"> · {note}</span>}
        </span>
      </span>
      <AudioButton text={zh} />
    </li>
  );
}
