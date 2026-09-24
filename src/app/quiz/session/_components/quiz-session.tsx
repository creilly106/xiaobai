'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { buttonVariants } from '@/components/ui/button';
import { Flashcard } from '@/components/flashcard';
import { QUIZ_OUTCOMES, type QuizOutcome } from '@/components/rating-styles';
import { primeVoices } from '@/lib/tts';
import { celebrate } from '@/lib/celebrate';
import { rateCard, type ReviewRating } from '@/lib/actions/study';
import type { QuizItem } from '@/lib/queries/quiz';
import { trackPractice } from '@/lib/track-practice';
import type { Dictionary } from '@/lib/queries/dictionary';

/** Typed-meaning verdict → the rating suggested (you can still pick another). */
const VERDICT_TO_OUTCOME = { right: 'good', close: 'hard', wrong: 'missed' } as const;

const OUTCOME_TO_RATING: Record<QuizOutcome, ReviewRating> = {
  missed: 1,
  hard: 2,
  good: 3,
  easy: 4,
};

export function QuizSession({
  initialQueue,
  srsMode = false,
  dict,
  showPinyinOnFront = false,
  answerMode = 'rate',
}: {
  initialQueue: QuizItem[];
  srsMode?: boolean;
  dict?: Dictionary;
  showPinyinOnFront?: boolean;
  /** rate: recall then rate yourself; type: type the English, get it checked. */
  answerMode?: 'rate' | 'type';
}) {
  const typing = answerMode === 'type';
  const queue = initialQueue;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [srsWrites, setSrsWrites] = useState(0);
  const [tally, setTally] = useState<Record<QuizOutcome, number>>({
    missed: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [pending, startTransition] = useTransition();

  const current = queue[index];
  const done = index >= queue.length;
  const recalled = tally.hard + tally.good + tally.easy;

  useEffect(() => {
    primeVoices();
  }, []);

  useEffect(() => {
    if (!done || queue.length === 0) return;
    const pct = recalled / queue.length;
    celebrate(pct >= 0.9 ? 'big' : pct >= 0.6 ? 'medium' : 'small');
  }, [done, queue.length, recalled]);

  const submit = useCallback(
    (outcome: QuizOutcome) => {
      if (!current || pending || !flipped) return;
      trackPractice({
        kind: 'quiz',
        item: current.hanzi,
        correct: outcome !== 'missed',
        detail: { outcome, ...(current.itemType === 'word' ? { word: current.hanzi } : {}) },
      });
      const advance = () => {
        setTally((t) => ({ ...t, [outcome]: t[outcome] + 1 }));
        setIndex((i) => i + 1);
        setFlipped(false);
        setStartedAt(Date.now());
      };
      const cardId = current.cardId;
      if (!srsMode || cardId == null) {
        advance();
        return;
      }
      const elapsedMs = Date.now() - startedAt;
      startTransition(async () => {
        try {
          await rateCard(cardId, OUTCOME_TO_RATING[outcome], elapsedMs);
          setSrsWrites((n) => n + 1);
          advance();
        } catch {
          toast.error("Couldn't save that rating to your queue.");
        }
      });
    },
    [current, pending, flipped, srsMode, startedAt],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, [role="dialog"]')) {
        return;
      }
      if (!current || e.repeat) return;
      if (!flipped) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          setFlipped(true);
        }
        return;
      }
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < QUIZ_OUTCOMES.length) {
        e.preventDefault();
        submit(QUIZ_OUTCOMES[idx].key);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, current, submit]);

  if (done) {
    const total = queue.length;
    const pct = total > 0 ? Math.round((recalled / total) * 100) : 0;
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold"
        >
          Quiz complete
        </motion.h1>
        <p className="mt-2 text-muted-foreground">
          You recalled <span className="font-semibold text-foreground">{recalled}</span> of {total}{' '}
          ({pct}%).
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {srsMode
            ? srsWrites > 0
              ? `${srsWrites} card${srsWrites === 1 ? '' : 's'} updated in your study schedule.`
              : 'Nothing was saved — none of these items were in your study queue.'
            : 'Practice mode — your study schedule was not changed.'}
        </p>
        <div className="mt-5 grid grid-cols-4 gap-2 text-sm">
          {QUIZ_OUTCOMES.map((o) => (
            <div key={o.key} className={`rounded-md border py-2 ${o.className}`}>
              <div className="font-semibold">{o.label}</div>
              <div className="tabular-nums">{tally[o.key]}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/quiz" className={buttonVariants({})}>
            New quiz
          </Link>
          <Link href="/" className={buttonVariants({ variant: 'outline' })}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const percent = Math.round((index / queue.length) * 100);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground">
          {srsMode ? 'Counts toward schedule' : 'Practice'}
        </span>
        <Progress value={percent} className="flex-1" aria-label="Quiz progress" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="min-w-12 text-right text-sm tabular-nums text-muted-foreground"
          >
            {index} / {queue.length}
          </motion.span>
        </AnimatePresence>
      </div>

      <Flashcard
        item={{
          key: current.key,
          itemType: current.itemType,
          hanzi: current.hanzi,
          pinyin: current.pinyin,
          meaning: current.meaning,
          label: current.itemType === 'word' ? 'Word' : 'Sentence',
          ...(typing ? { typeMeaning: { accepted: current.accepted } } : {}),
        }}
        flipped={flipped}
        onFlip={() => setFlipped(true)}
        onRate={submit}
        ratings={QUIZ_OUTCOMES}
        disabled={pending}
        dict={dict}
        showPinyinOnFront={showPinyinOnFront}
        gradeToRating={typing ? VERDICT_TO_OUTCOME : undefined}
      />
      <p className="mt-3 text-center text-xs text-muted-foreground pointer-coarse:hidden">
        {flipped
          ? `${typing ? 'Enter accepts the suggestion · ' : ''}1 Missed · 2 Hard · 3 Got it · 4 Easy · P to hear it`
          : typing
            ? 'Type the meaning, then Enter to check'
            : 'Space to reveal the answer'}
      </p>
    </div>
  );
}
