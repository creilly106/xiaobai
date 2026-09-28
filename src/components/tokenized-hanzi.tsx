'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, Volume2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { DictEntry, Dictionary } from '@/lib/queries/dictionary';
import { tokenize, tokenizePerChar } from '@/lib/tokenize';
import { speakWord } from '@/lib/tts';
import { useCoarsePointer } from '@/lib/use-client';

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
  // No hover on a phone: a tap opens the meaning instead of leaving the page.
  const touch = useCoarsePointer();

  if (touch) {
    return (
      <span className={className}>
        {tokens.map((t, i) =>
          t.isChinese ? (
            <TapWord key={i} text={t.text} entry={t.entry} dict={dict} linkable={linkable} />
          ) : (
            <span key={i}>{t.text}</span>
          ),
        )}
      </span>
    );
  }

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
                speakWord(t.text, t.entry?.pinyin);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  speakWord(t.text, t.entry?.pinyin);
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
                  speakWord(t.text, t.entry?.pinyin);
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
                <EntryCard entry={t.entry} dict={dict} />
                <div className="mt-1.5 text-[10px] opacity-60">
                  {linkable ? 'Click for details' : 'Click to hear it'}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </span>
    </TooltipProvider>
  );
}

/** A word on a touch screen: tap to hear it and see what it means. */
function TapWord({
  text,
  entry,
  dict,
  linkable,
}: {
  text: string;
  entry?: DictEntry;
  dict: Dictionary;
  linkable: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger
        nativeButton={false}
        render={<span role="button" tabIndex={0} className={`${TOKEN_CLASS} cursor-pointer`} />}
        onClick={(e) => {
          // Inside a flashcard a tap on the card reveals it; a word isn't the card.
          e.stopPropagation();
          speakWord(text, entry?.pinyin);
        }}
      >
        {text}
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-auto max-w-[min(20rem,calc(100vw-2rem))]"
        // Portalled, but React still bubbles its clicks to the card underneath.
        onClick={(e) => e.stopPropagation()}
      >
        {entry ? (
          <EntryCard entry={entry} dict={dict} inPopover />
        ) : (
          <div lang="zh-Hans" className="text-base font-medium">
            {text}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
            onClick={() => speakWord(text, entry?.pinyin)}
          >
            <Volume2 /> Play
          </button>
          {linkable && (
            <Link
              href={`/characters/${encodeURIComponent(text)}`}
              className={buttonVariants({ size: 'sm', variant: 'ghost' })}
            >
              Word page <ArrowRight />
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EntryCard({
  entry,
  dict,
  inPopover = false,
}: {
  entry: DictEntry;
  dict: Dictionary;
  inPopover?: boolean;
}) {
  const chars = Array.from(entry.hanzi);
  const parts =
    chars.length > 1 ? chars.map((c) => ({ c, e: dict[c] as DictEntry | undefined })) : [];
  return (
    <div className="min-w-40 text-left">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-base font-medium">
          <span lang="zh-Hans">{entry.hanzi}</span>
          <span className="ml-2 text-sm font-normal opacity-75">{entry.pinyin}</span>
        </span>
        <span className="text-[10px] uppercase tracking-wide opacity-60">
          {entry.kind === 'dictionary'
            ? 'dictionary'
            : entry.kind !== 'word'
              ? 'character'
              : entry.hskLevel != null
                ? `HSK ${entry.hskLevel}`
                : ''}
        </span>
      </div>
      <div className={`mt-0.5 leading-snug opacity-90 ${inPopover ? 'text-sm' : 'text-xs'}`}>
        {entry.meaning}
      </div>
      {parts.length > 0 && (
        <ul
          className={`mt-2 space-y-0.5 border-t pt-1.5 leading-snug ${
            inPopover ? 'border-border text-xs' : 'border-background/20 text-[11px]'
          }`}
        >
          {parts.map(({ c, e }, i) => (
            <li key={i} className="flex gap-1.5">
              <span lang="zh-Hans" className="font-medium">
                {c}
              </span>
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
    </div>
  );
}
