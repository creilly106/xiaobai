'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Lightbulb, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/audio-button';
import { HanziStrokes } from '@/components/hanzi-strokes';
import { HandwritingPractice } from '@/components/handwriting-practice';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import type { Dictionary } from '@/lib/queries/dictionary';
import type { ListeningInfo } from '@/lib/queries/study';
import { AUTOPLAY_AUDIO_KEY } from '@/lib/prefs';
import { speak } from '@/lib/tts';
import { useStoredPref } from '@/lib/use-client';

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
};

function ListenPrompt({ listening }: { listening: ListeningInfo }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="size-24 rounded-full"
        aria-label="Play the audio again"
        onClick={(e) => {
          e.stopPropagation();
          speak(listening.audio);
        }}
      >
        <Volume2 className="size-10" />
      </Button>
      <span className="text-xs text-muted-foreground">
        Click or press <kbd className="font-mono">P</kbd> to replay
      </span>
      {listening.viaWord && (
        <p className="max-w-sm text-sm text-muted-foreground">
          This sound has several words, so it&apos;s said the way people name a character:{' '}
          <span className="text-foreground">“[a longer word] 的 [the word]”</span>. The word is the
          last one you hear.
        </p>
      )}
    </div>
  );
}

function ListenNotes({ item }: { item: FlashcardItem }) {
  const { viaWord, soundAlikes } = item.listening!;
  if (!viaWord && soundAlikes.length === 0) return null;
  return (
    <div className="max-w-md rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-left text-xs">
      {viaWord && (
        <p>
          Played as{' '}
          <span lang="zh-Hans" className="text-sm text-foreground">
            {viaWord}的{item.hanzi}
          </span>{' '}
          — “the {item.hanzi} in {viaWord}”.
        </p>
      )}
      {soundAlikes.length > 0 && (
        <p className={viaWord ? 'mt-1' : ''}>
          Sounds exactly the same:{' '}
          {soundAlikes.map((w, i) => (
            <span key={w.hanzi}>
              {i > 0 && ' · '}
              <span lang="zh-Hans" className="text-sm text-foreground">
                {w.hanzi}
              </span>{' '}
              {w.meaning.split(/[;,]/)[0]}
            </span>
          ))}
          {!viaWord && '. If you thought of one of these, you heard it right.'}
        </p>
      )}
    </div>
  );
}

export type FlashcardRating<K extends string = string> = {
  key: K;
  label: string;
  hint: string;
  description: string;
  className: string;
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
}: Props<K>) {
  const isWord = item.itemType === 'word';
  const [autoplay] = useStoredPref(AUTOPLAY_AUDIO_KEY, '1');

  // Hear it as soon as the answer shows (toggle in the study toolbar / Settings).
  useEffect(() => {
    if (flipped && autoplay === '1') speak(item.hanzi);
  }, [flipped, autoplay, item.hanzi, item.key]);

  // Listening cards play their audio as soon as they appear.
  const listenAudio = item.listening?.audio;
  useEffect(() => {
    if (listenAudio && !flipped) speak(listenAudio);
  }, [listenAudio, flipped, item.key]);

  // P replays: the answer once revealed, or the prompt on a listening card.
  useEffect(() => {
    if (!flipped && !listenAudio) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return;
      if (e.key.toLowerCase() === 'p') speak(flipped ? item.hanzi : listenAudio!);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, item.hanzi, listenAudio]);

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
                ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': 'Show answer',
                    onClick: onFlip,
                  }
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
                      <AudioButton text={item.hanzi} />
                    </div>
                    <div className="max-w-md text-lg">{item.meaning}</div>
                    {item.listening && <ListenNotes item={item} />}
                    {dict && (
                      <p className="text-xs text-muted-foreground">
                        Hover a character to see what it means on its own.
                      </p>
                    )}
                    {isWord && <WordTools key={item.key} hanzi={item.hanzi} />}
                  </motion.div>
                ) : (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm text-muted-foreground"
                  >
                    {item.listening
                      ? 'Listen, recall the meaning, then'
                      : 'Recall the meaning, then'}{' '}
                    <span className="pointer-coarse:hidden">
                      press{' '}
                      <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">
                        Space
                      </kbd>{' '}
                      or{' '}
                    </span>
                    tap the card
                    {onHint && !showPinyinOnFront && (
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
                          <span className="font-mono text-xs opacity-60 pointer-coarse:hidden">
                            H
                          </span>
                        </Button>
                      </span>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2" role="group" aria-label="Rate your recall">
        {ratings.map((r) => (
          <motion.button
            key={r.key}
            type="button"
            disabled={!flipped || disabled}
            onClick={() => onRate(r.key)}
            title={r.description}
            aria-keyshortcuts={r.hint}
            whileHover={flipped && !disabled ? { y: -1 } : undefined}
            whileTap={flipped && !disabled ? { scale: 0.97 } : undefined}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className={`flex flex-col items-center gap-0.5 rounded-lg border py-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none ${
              flipped ? r.className : 'border-transparent bg-muted text-muted-foreground opacity-60'
            }`}
          >
            <span className="text-base font-semibold">{r.label}</span>
            <span className="font-mono text-xs opacity-70">{r.hint}</span>
          </motion.button>
        ))}
      </div>
    </>
  );
}

/** Stroke order + handwriting tools for a word. Keyed by card so it resets per card. */
export function WordTools({ hanzi }: { hanzi: string }) {
  const [showStrokes, setShowStrokes] = useState(false);
  return showStrokes ? (
    <HanziStrokes hanzi={hanzi} />
  ) : (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="outline" size="sm" type="button" onClick={() => setShowStrokes(true)}>
        Show stroke order
      </Button>
      <HandwritingPractice hanzi={hanzi} />
    </div>
  );
}
