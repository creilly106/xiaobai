'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { DictEntry, Dictionary } from '@/lib/queries/dictionary';
import { tokenize, tokenizePerChar } from '@/lib/tokenize';
import { speak } from '@/lib/tts';

type Props = {
  hanzi: string;
  dict: Dictionary;
  className?: string;
  /** greedy = longest dictionary words; per-char = every character separately. */
  mode?: 'greedy' | 'per-char';
  /**
   * When true, tokens link to their character page. Turn off inside study and
   * quiz sessions so a stray click can't navigate away mid-session.
   */
  linkable?: boolean;
};

const TOKEN_CLASS =
  'rounded-sm decoration-primary/40 underline-offset-[6px] transition-colors hover:bg-primary/10 hover:underline hover:decoration-primary focus-visible:bg-primary/10 focus-visible:outline-none';

export function TokenizedHanzi({
  hanzi,
  dict,
  className,
  mode = 'greedy',
  linkable = true,
}: Props) {
  const tokens = useMemo(
    () => (mode === 'per-char' ? tokenizePerChar(hanzi, dict) : tokenize(hanzi, dict)),
    [hanzi, dict, mode],
  );

  return (
    <TooltipProvider delay={120}>
      <span className={className}>
        {tokens.map((t, i) => {
          if (!t.isChinese) return <span key={i}>{t.text}</span>;
          const href = `/characters/${encodeURIComponent(t.text)}`;
          const trigger = linkable ? (
            <Link href={href} className={TOKEN_CLASS} />
          ) : (
            // Inside study/quiz a click speaks the word instead of navigating.
            <span
              role="button"
              tabIndex={0}
              className={`${TOKEN_CLASS} cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                speak(t.text);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  speak(t.text);
                }
              }}
            />
          );
          if (!t.entry) {
            return linkable ? (
              <Link key={i} href={href} className={TOKEN_CLASS}>
                {t.text}
              </Link>
            ) : (
              <span
                key={i}
                role="button"
                tabIndex={0}
                className={`${TOKEN_CLASS} cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  speak(t.text);
                }}
              >
                {t.text}
              </span>
            );
          }
          return (
            <Tooltip key={i}>
              <TooltipTrigger render={trigger}>{t.text}</TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <EntryCard entry={t.entry} dict={dict} linkable={linkable} />
              </TooltipContent>
            </Tooltip>
          );
        })}
      </span>
    </TooltipProvider>
  );
}

function EntryCard({
  entry,
  dict,
  linkable,
}: {
  entry: DictEntry;
  dict: Dictionary;
  linkable: boolean;
}) {
  const chars = Array.from(entry.hanzi);
  const parts =
    chars.length > 1
      ? chars.map((c) => ({ c, e: dict[c] as DictEntry | undefined }))
      : [];
  return (
    <div className="min-w-40 text-left">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-base font-medium">
          {entry.hanzi}
          <span className="ml-2 text-sm font-normal opacity-75">{entry.pinyin}</span>
        </span>
        <span className="text-[10px] uppercase tracking-wide opacity-60">
          {entry.kind !== 'word' ? 'character' : entry.hskLevel != null ? `HSK ${entry.hskLevel}` : ''}
        </span>
      </div>
      <div className="mt-0.5 text-xs leading-snug opacity-90">{entry.meaning}</div>
      {parts.length > 0 && (
        <ul className="mt-2 space-y-0.5 border-t border-background/20 pt-1.5 text-[11px] leading-snug">
          {parts.map(({ c, e }, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="font-medium">{c}</span>
              {e ? (
                <span className="opacity-80">
                  {e.pinyin} — {e.meaning}
                </span>
              ) : (
                <span className="opacity-60">—</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-1.5 text-[10px] opacity-60">{linkable ? 'Click for details' : 'Click to hear it'}</div>
    </div>
  );
}
