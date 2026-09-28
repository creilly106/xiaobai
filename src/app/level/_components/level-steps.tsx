'use client';

import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/audio-button';
import { OptionButton, play, type Answer } from '@/app/learn/_components/steps';
import type { PassageStep, TonePairStep } from '@/lib/level/items';

const TONE_NAME: Record<string, string> = {
  '1': 'High',
  '2': 'Rising',
  '3': 'Dipping',
  '4': 'Falling',
  '5': 'Neutral',
};

/** "3-4" → "Dipping + Falling". */
export const tonePairLabel = (pair: string) =>
  pair
    .split('-')
    .map((t) => TONE_NAME[t])
    .join(' + ');

function useOptionChoice(
  answered: boolean,
  onAnswer: (a: Answer) => void,
  isRight: (i: number) => boolean,
) {
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => {
    if (answered || picked !== null) return;
    setPicked(i);
    onAnswer({ correct: isRight(i) });
  };
  const stateOf = (i: number): 'idle' | 'right' | 'wrong' | 'dim' =>
    picked === null ? 'idle' : isRight(i) ? 'right' : i === picked ? 'wrong' : 'dim';
  return { pick, stateOf, locked: answered || picked !== null };
}

/** Hear a two-syllable word and pick its tones. */
export function TonePairQuestion({
  step,
  answered,
  onAnswer,
}: {
  step: TonePairStep;
  answered: boolean;
  onAnswer: (a: Answer) => void;
}) {
  const { word, options, answer } = step;
  const { pick, stateOf, locked } = useOptionChoice(
    answered,
    onAnswer,
    (i) => options[i] === answer,
  );
  useEffect(() => play(word.hanzi, word.pinyin), [word.hanzi, word.pinyin]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-muted-foreground">Which tones did you hear?</p>
        <Button
          type="button"
          variant="outline"
          className="size-20 rounded-full"
          onClick={() => play(word.hanzi, word.pinyin)}
          aria-label="Play again"
        >
          <Volume2 className="size-8" />
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => (
          <OptionButton
            key={o}
            index={i}
            state={stateOf(i)}
            onClick={() => pick(i)}
            disabled={locked}
          >
            {tonePairLabel(o)}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

/** A question about the exam's reading passage. */
export function PassageQuestion({
  step,
  answered,
  onAnswer,
}: {
  step: PassageStep;
  answered: boolean;
  onAnswer: (a: Answer) => void;
}) {
  const { pick, stateOf, locked } = useOptionChoice(
    answered,
    onAnswer,
    (i) => step.options[i] === step.answer,
  );
  const text = step.lines.map((l) => l.hanzi).join('');
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border bg-card px-4 py-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Read: {step.title}
          </span>
          <AudioButton text={text} label="Read the passage aloud" />
        </div>
        <p lang="zh-Hans" className="text-xl leading-relaxed">
          {text}
        </p>
      </div>
      <p className="font-medium">{step.question}</p>
      <div className="grid gap-2">
        {step.options.map((o, i) => (
          <OptionButton
            key={o}
            index={i}
            state={stateOf(i)}
            onClick={() => pick(i)}
            disabled={locked}
          >
            {o}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
