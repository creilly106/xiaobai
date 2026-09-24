'use client';

import { useState } from 'react';
import { CircleAlert, Check, Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PinyinKeyboard } from '@/components/pinyin-keyboard';
import type { PinyinGrade, Syllable } from '@/lib/pinyin';
import { EMPTY_DRAFT, draftIsEmpty, gradeDraft, type PinyinDraft } from '@/lib/pinyin-draft';

export type TypedAnswer = { grade: PinyinGrade; given: string };

/**
 * Front of a production card: the English meaning, and an optional pinyin
 * keyboard. Saying it aloud and flipping works too — typing just gets it
 * checked. Render with `key` per card so the draft resets.
 */
export function ProductionPrompt({
  meaning,
  charCount,
  pinyin,
  syllables,
  onChecked,
}: {
  meaning: string;
  charCount: number;
  pinyin: string;
  syllables: Syllable[] | null;
  onChecked: (answer: TypedAnswer) => void;
}) {
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState<PinyinDraft>(EMPTY_DRAFT);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <div className="text-3xl font-medium leading-snug">{meaning}</div>
      <div className="text-xs text-muted-foreground">
        {charCount} character{charCount === 1 ? '' : 's'} · say it in Chinese
        {typing ? '' : ', or type the pinyin'}
      </div>
      {typing ? (
        // Clicks inside the keyboard mustn't flip the card underneath.
        <div className="w-full" onClick={(e) => e.stopPropagation()}>
          <PinyinKeyboard
            value={draft}
            onChange={setDraft}
            onSubmit={() => {
              if (!draftIsEmpty(draft)) onChecked(gradeDraft(draft, syllables, pinyin));
            }}
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setTyping(true);
          }}
        >
          <Keyboard /> Type pinyin to check
        </Button>
      )}
    </div>
  );
}

/** Shown on the back when the answer was typed. */
export function TypedResult({ answer, pinyin }: { answer: TypedAnswer; pinyin: string }) {
  const tone =
    answer.grade === 'correct'
      ? 'border-emerald-500/40 bg-emerald-500/10'
      : answer.grade === 'tones'
        ? 'border-amber-500/40 bg-amber-500/10'
        : 'border-red-500/40 bg-red-500/10';
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${tone}`}>
      {answer.grade === 'correct' ? (
        <Check className="size-4" />
      ) : answer.grade === 'tones' ? (
        <CircleAlert className="size-4" />
      ) : (
        <X className="size-4" />
      )}
      {answer.grade === 'correct'
        ? `Correct — ${pinyin}`
        : answer.grade === 'tones'
          ? `Right sounds, check the tones — you typed ${answer.given}`
          : `You typed ${answer.given}`}
    </div>
  );
}
