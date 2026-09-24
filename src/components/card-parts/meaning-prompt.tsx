'use client';

import { useState } from 'react';
import { Check, CircleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { gradeSentence, gradeWord, type Verdict } from '@/lib/meaning-grade';

export type MeaningAnswer = { verdict: Verdict; given: string; matched: string | null };

/**
 * Under the characters on a "type the meaning" card: an English answer box.
 * Render with `key` per card so the text resets.
 */
export function MeaningPrompt({
  itemType,
  meaning,
  accepted,
  onChecked,
  onGiveUp,
}: {
  itemType: 'word' | 'sentence';
  meaning: string;
  /** Senses a word answer may match; sentences are compared with `meaning`. */
  accepted?: string[];
  onChecked: (answer: MeaningAnswer) => void;
  onGiveUp: () => void;
}) {
  const [text, setText] = useState('');

  function check() {
    const given = text.trim();
    if (!given) return;
    const grade =
      itemType === 'word' ? gradeWord(given, accepted ?? [meaning]) : gradeSentence(given, meaning);
    onChecked({ ...grade, given });
  }

  return (
    // Clicks and keys in here mustn't flip the card underneath.
    <form
      className="flex w-full max-w-md flex-col items-center gap-2"
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        check();
      }}
    >
      <div className="flex w-full gap-2">
        <Input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={itemType === 'word' ? 'What does it mean?' : 'Translate into English'}
          aria-label="Your English answer"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="h-11 text-base"
        />
        <Button type="submit" className="h-11" disabled={!text.trim()}>
          Check
        </Button>
      </div>
      <button
        type="button"
        onClick={onGiveUp}
        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Not sure — show me
      </button>
    </form>
  );
}

const STYLE: Record<Verdict, string> = {
  right: 'border-emerald-500/40 bg-emerald-500/10',
  close: 'border-amber-500/40 bg-amber-500/10',
  wrong: 'border-red-500/40 bg-red-500/10',
};

/** Shown with the answer after a typed meaning was checked. */
export function MeaningResult({ answer }: { answer: MeaningAnswer }) {
  const Icon = answer.verdict === 'right' ? Check : answer.verdict === 'close' ? CircleAlert : X;
  return (
    <div
      className={`flex max-w-md items-start gap-2 rounded-lg border px-3 py-1.5 text-left text-sm ${STYLE[answer.verdict]}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>
        {answer.verdict === 'right' ? 'Right' : answer.verdict === 'close' ? 'Close' : 'Not quite'}{' '}
        — you wrote “{answer.given}”
        {answer.verdict !== 'wrong' && answer.matched && answer.matched !== answer.given && (
          <span className="text-muted-foreground"> (matches “{answer.matched}”)</span>
        )}
        <span className="block text-xs text-muted-foreground">
          {answer.verdict === 'right'
            ? 'Press Enter to accept, or pick another rating.'
            : 'The checker can miss a good paraphrase — if you knew it, rate it yourself.'}
        </span>
      </span>
    </div>
  );
}
