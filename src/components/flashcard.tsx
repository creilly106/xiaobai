'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/audio-button';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { ListenNotes, ListenPrompt, ReadingNote } from '@/components/card-parts/listen-notes';
import { RatingButtons, type FlashcardRating } from '@/components/card-parts/rating-buttons';
import { useCardAudio } from '@/components/card-parts/use-card-audio';
import { WordTools } from '@/components/card-parts/word-tools';
import type { Dictionary } from '@/lib/queries/dictionary';
import type { ListeningInfo, ProductionInfo } from '@/lib/queries/study';
import type { PinyinGrade } from '@/lib/pinyin';
import {
  ProductionPrompt,
  TypedResult,
  type TypedAnswer,
} from '@/components/card-parts/production-prompt';

export type { FlashcardRating };

export type FlashcardItem = {
  key: string | number;
  itemType: 'word' | 'sentence';
  hanzi: string;
  pinyin: string;
  meaning: string;
  /** Small caption above the hanzi, e.g. "New" or "Review". */
  label?: string;
  /** Listening cards: the front is audio only. */
  listening?: ListeningInfo;
  /** Production cards: the front is the English; you produce the Chinese. */
  production?: ProductionInfo;
};

type Props<K extends string> = {
  item: FlashcardItem;
  flipped: boolean;
  onFlip: () => void;
  onRate: (key: K) => void;
  ratings: readonly FlashcardRating<K>[];
  disabled?: boolean;
  dict?: Dictionary;
  showPinyinOnFront?: boolean;
  /** Shows a "Hint" button on the front that reveals the pinyin. */
  onHint?: () => void;
  /** Which rating to suggest after a typed answer is checked. */
  gradeToRating?: Partial<Record<PinyinGrade, K>>;
};

export function Flashcard<K extends string>({
  item,
  flipped,
  onFlip,
  onRate,
  ratings,
  disabled,
  dict,
  showPinyinOnFront,
  onHint,
  gradeToRating,
}: Props<K>) {
  const isWord = item.itemType === 'word';
  // A typed answer belongs to one card; ignore it once the card changes.
  const [typed, setTyped] = useState<{ key: FlashcardItem['key']; answer: TypedAnswer } | null>(
    null,
  );
  const typedAnswer = typed?.key === item.key ? typed.answer : null;
  useCardAudio({
    cardKey: item.key,
    hanzi: item.hanzi,
    pinyin: item.pinyin,
    flipped,
    listenAudio: item.listening?.audio,
  });

  return (
    <>
      <div className="relative flex min-h-[20rem] flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: 48, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -48, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="flex flex-1 flex-col"
          >
            <Card
              {...(!flipped
                ? { role: 'button', tabIndex: 0, 'aria-label': 'Show answer', onClick: onFlip }
                : {})}
              className={`flex flex-1 flex-col items-center justify-center gap-5 border-2 px-6 py-10 text-center transition-colors ${
                flipped ? '' : 'cursor-pointer hover:border-primary/40'
              }`}
            >
              {item.label && (
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {item.label}
                </span>
              )}
              {item.listening && !flipped ? (
                <ListenPrompt listening={item.listening} />
              ) : item.production && !flipped ? (
                <ProductionPrompt
                  key={item.key}
                  meaning={item.meaning}
                  charCount={Array.from(item.hanzi).length}
                  pinyin={item.pinyin}
                  syllables={item.production.syllables}
                  onChecked={(answer) => {
                    setTyped({ key: item.key, answer });
                    onFlip();
                  }}
                />
              ) : (
                <div
                  lang="zh-Hans"
                  className={
                    isWord
                      ? 'text-7xl font-medium leading-tight sm:text-8xl'
                      : 'max-w-xl text-4xl font-medium leading-snug sm:text-5xl'
                  }
                >
                  {flipped && dict ? (
                    <TokenizedHanzi
                      hanzi={item.hanzi}
                      dict={dict}
                      mode={isWord ? 'per-char' : 'greedy'}
                      linkable={false}
                    />
                  ) : (
                    item.hanzi
                  )}
                </div>
              )}
              {showPinyinOnFront && !flipped && (
                <div className="text-xl text-muted-foreground">{item.pinyin}</div>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {flipped ? (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-2xl text-muted-foreground">{item.pinyin}</span>
                      <AudioButton text={item.hanzi} reading={item.pinyin} />
                    </div>
                    <div className="max-w-md text-lg">{item.meaning}</div>
                    {typedAnswer && <TypedResult answer={typedAnswer} pinyin={item.pinyin} />}
                    {item.listening ? (
                      <ListenNotes
                        hanzi={item.hanzi}
                        pinyin={item.pinyin}
                        listening={item.listening}
                      />
                    ) : (
                      <ReadingNote hanzi={item.hanzi} pinyin={item.pinyin} />
                    )}
                    {dict && (
                      <p className="text-xs text-muted-foreground">
                        Hover a character to see what it means on its own.
                      </p>
                    )}
                    {isWord && <WordTools key={item.key} hanzi={item.hanzi} />}
                  </motion.div>
                ) : (
                  <FrontHint
                    kind={
                      item.listening ? 'listening' : item.production ? 'production' : 'recognition'
                    }
                    onHint={showPinyinOnFront ? undefined : onHint}
                  />
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <RatingButtons
        ratings={ratings}
        enabled={flipped && !disabled}
        onRate={onRate}
        suggested={typedAnswer ? gradeToRating?.[typedAnswer.grade] : undefined}
      />
    </>
  );
}

const FRONT_PROMPT = {
  recognition: 'Recall the meaning, then',
  listening: 'Listen, recall the meaning, then',
  production: 'Say it aloud, then',
} as const;

function FrontHint({ kind, onHint }: { kind: keyof typeof FRONT_PROMPT; onHint?: () => void }) {
  return (
    <motion.p
      key="hint"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="text-sm text-muted-foreground"
    >
      {FRONT_PROMPT[kind]}{' '}
      <span className="pointer-coarse:hidden">
        press{' '}
        <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">Space</kbd>{' '}
        or{' '}
      </span>
      tap the card
      {onHint && (
        <span className="mt-3 block">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onHint();
            }}
            aria-keyshortcuts="H"
          >
            <Lightbulb /> Hint: show pinyin
            <span className="font-mono text-xs opacity-60 pointer-coarse:hidden">H</span>
          </Button>
        </span>
      )}
    </motion.p>
  );
}
