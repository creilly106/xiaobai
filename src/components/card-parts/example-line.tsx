'use client';

import { AudioButton } from '@/components/audio-button';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import type { Dictionary } from '@/lib/queries/dictionary';

/** One example sentence under a card's answer. Tokens speak on click. */
export function ExampleLine({
  example,
  dict,
}: {
  example: { zh: string; en: string };
  dict?: Dictionary;
}) {
  return (
    <div className="flex max-w-md items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-left">
      <div className="min-w-0 flex-1">
        <div lang="zh-Hans" className="text-base">
          {dict ? <TokenizedHanzi hanzi={example.zh} dict={dict} linkable={false} /> : example.zh}
        </div>
        <div className="text-xs text-muted-foreground">{example.en}</div>
      </div>
      <AudioButton text={example.zh} label="Play the example sentence" />
    </div>
  );
}
