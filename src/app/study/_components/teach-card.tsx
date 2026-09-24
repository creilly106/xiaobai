'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/audio-button';
import { Pinyin } from '@/components/pinyin';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { ReadingNote } from '@/components/card-parts/listen-notes';
import { WordTools } from '@/components/card-parts/word-tools';
import { ExampleLine } from '@/components/card-parts/example-line';
import { audioFor } from '@/lib/audio-text';
import { speak } from '@/lib/tts';
import { tokenize } from '@/lib/tokenize';
import type { Dictionary } from '@/lib/queries/dictionary';
import type { StudyCard } from '@/lib/queries/study';

type Props = {
  card: StudyCard;
  dict?: Dictionary;
  onContinue: () => void;
  disabled?: boolean;
};

/**
 * First meeting with a new card: everything is shown up front, then the card
 * comes back a few cards later as a real recall test. You can't recall
 * something you've never seen, so rating a first sighting is meaningless.
 */
export function TeachCard({ card, dict, onContinue, disabled }: Props) {
  const isWord = card.itemType === 'word';

  useEffect(() => {
    speak(audioFor(card.hanzi, card.pinyin).text);
  }, [card.hanzi, card.pinyin]);

  const parts =
    !isWord && dict ? tokenize(card.hanzi, dict).filter((t) => t.isChinese && t.entry) : [];

  return (
    <>
      <motion.div
        key={`teach-${card.id}`}
        initial={{ opacity: 0, x: 48, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="flex min-h-[20rem] flex-1 flex-col"
      >
        <Card className="flex flex-1 flex-col items-center justify-center gap-4 border-2 border-primary/40 px-6 py-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
            <Sparkles className="size-3.5" />
            {isWord ? 'New word' : 'New sentence'}
          </span>
          <div
            lang="zh-Hans"
            className={
              isWord
                ? 'text-7xl font-medium leading-tight sm:text-8xl'
                : 'max-w-xl text-4xl font-medium leading-snug sm:text-5xl'
            }
          >
            {dict ? (
              <TokenizedHanzi
                hanzi={card.hanzi}
                dict={dict}
                mode={isWord ? 'per-char' : 'greedy'}
                linkable={false}
              />
            ) : (
              card.hanzi
            )}
          </div>
          <div className="flex items-center gap-1">
            <Pinyin text={card.pinyin} className="text-2xl text-muted-foreground" />
            <AudioButton text={card.hanzi} reading={card.pinyin} />
          </div>
          <div className="max-w-md text-lg">{card.meaning}</div>
          <ReadingNote hanzi={card.hanzi} pinyin={card.pinyin} />
          {card.example && <ExampleLine example={card.example} dict={dict} />}

          {parts.length > 1 && (
            <ul className="mt-1 flex max-w-lg flex-wrap justify-center gap-2 text-sm">
              {parts.map((t, i) => (
                <li
                  key={`${t.text}-${i}`}
                  className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1"
                >
                  <span lang="zh-Hans" className="font-medium">
                    {t.text}
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {t.entry!.pinyin} · {t.entry!.meaning.split(/[;,]/)[0]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {isWord && <WordTools key={card.id} hanzi={card.hanzi} />}
        </Card>
      </motion.div>

      <div className="mt-4">
        <Button
          type="button"
          size="lg"
          className="h-14 w-full text-base"
          onClick={onContinue}
          disabled={disabled}
          aria-keyshortcuts="Space Enter"
        >
          Got it — test me in a moment
        </Button>
      </div>
    </>
  );
}
