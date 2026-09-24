'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Flashcard } from '@/components/flashcard';
import { STATE_LABEL, STUDY_RATINGS, type StudyRating } from '@/components/rating-styles';
import { primeVoices } from '@/lib/tts';
import { celebrate } from '@/lib/celebrate';
import { useStoredPref } from '@/lib/use-client';
import { AUTOPLAY_AUDIO_KEY } from '@/lib/prefs';
import {
  buryCard,
  rateCard,
  restoreCard,
  suspendCard,
  undoLastReview,
  type ReviewRating,
} from '@/lib/actions/study';
import type { StudyCard } from '@/lib/queries/study';
import type { Dictionary } from '@/lib/queries/dictionary';
import { isTypingLocked } from '@/lib/typing-lock';
import { TeachCard } from './teach-card';
import { SessionComplete } from './session-complete';
import { LeechBanner, QueueCounts, SessionToolbar } from './session-toolbar';

type Props = {
  initialQueue: StudyCard[];
  dict?: Dictionary;
};

/** teach = first meeting (answer shown, no rating); test = recall + rating. */
type Phase = 'teach' | 'test';
type QueueEntry = { card: StudyCard; seq: number; phase: Phase };

const RATING_VALUE: Record<StudyRating, ReviewRating> = { again: 1, hard: 2, good: 3, easy: 4 };
const VALUE_TO_RATING: StudyRating[] = ['again', 'hard', 'good', 'easy'];

/** Cards due again within this window come back later in the same session. */
const REQUEUE_WINDOW_MS = 20 * 60 * 1000;
/** A taught card is tested after this many other cards (or at the end). */
const TEST_GAP = 3;
/** Failing a card this many times flags it as a "leech". */
const LEECH_FAILS = 3;

/** After a typed production answer: the rating to suggest. */
const GRADE_TO_RATING = { correct: 'good', tones: 'hard', wrong: 'again' } as const;

const EMPTY_TALLY: Record<StudyRating, number> = { again: 0, hard: 0, good: 0, easy: 0 };

function insertAt<T>(list: T[], index: number, item: T): T[] {
  const i = Math.min(index, list.length);
  return [...list.slice(0, i), item, ...list.slice(i)];
}

export function Session({ initialQueue, dict }: Props) {
  const seqRef = useRef(initialQueue.length);
  const [queue, setQueue] = useState<QueueEntry[]>(() =>
    initialQueue.map((card, i) => ({
      card,
      seq: i,
      // Follow-up cards test something you already know, so there's nothing to teach.
      phase: card.state === 'new' && !card.listening && !card.production ? 'teach' : 'test',
    })),
  );
  const [flipped, setFlipped] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [done, setDone] = useState(0);
  const [rated, setRated] = useState(0);
  const [learned, setLearned] = useState(0);
  const [tally, setTally] = useState(EMPTY_TALLY);
  const [pending, startTransition] = useTransition();
  const [pinyinPref, setPinyinPref] = useStoredPref('study-pinyin-front', '0');
  const pinyinAlways = pinyinPref === '1';
  const [autoplayPref, setAutoplayPref] = useStoredPref(AUTOPLAY_AUDIO_KEY, '1');
  const autoplay = autoplayPref === '1';

  const current = queue[0];
  const nextSeq = () => ++seqRef.current;

  useEffect(() => {
    primeVoices();
  }, []);

  const finished = !current && done > 0;
  useEffect(() => {
    if (!finished || rated === 0) return;
    const pct = (tally.hard + tally.good + tally.easy) / rated;
    celebrate(pct >= 0.9 ? 'big' : pct >= 0.6 ? 'medium' : 'small');
  }, [finished, rated, tally]);

  const advance = () => {
    setFlipped(false);
    setHinted(false);
    setStartedAt(Date.now());
  };

  const finishTeach = useCallback(() => {
    if (!current || current.phase !== 'teach') return;
    const entry = current;
    setQueue((q) =>
      insertAt(q.slice(1), TEST_GAP, { card: entry.card, seq: nextSeq(), phase: 'test' }),
    );
    setDone((d) => d + 1);
    setLearned((n) => n + 1);
    advance();
  }, [current]);

  const submit = useCallback(
    (rating: StudyRating) => {
      if (!current || current.phase !== 'test' || pending || !flipped) return;
      const elapsedMs = Date.now() - startedAt;
      const entry = current;
      startTransition(async () => {
        try {
          const result = await rateCard(entry.card.id, RATING_VALUE[rating], elapsedMs);
          const comesBack =
            (result.state === 'learning' || result.state === 'relearning') &&
            result.nextDue - Date.now() <= REQUEUE_WINDOW_MS;
          const updated: StudyCard = {
            ...entry.card,
            state: result.state,
            due: result.nextDue,
            fails: entry.card.fails + (rating === 'again' ? 1 : 0),
          };
          setQueue((q) => {
            const rest = q.slice(1);
            // Come back after a few other cards, not immediately.
            return comesBack
              ? insertAt(rest, TEST_GAP, { card: updated, seq: nextSeq(), phase: 'test' })
              : rest;
          });
          setTally((t) => ({ ...t, [rating]: t[rating] + 1 }));
          setDone((d) => d + 1);
          const nextRated = rated + 1;
          setRated(nextRated);
          if (nextRated % 10 === 0) celebrate('small');
          advance();
        } catch {
          toast.error("Couldn't save that rating. Check the dev server and try again.");
        }
      });
    },
    [current, pending, flipped, startedAt, rated],
  );

  const putBack = useCallback((card: StudyCard) => {
    setQueue((q) => [
      { card, seq: nextSeq(), phase: 'test' },
      ...q.filter((e) => e.card.id !== card.id),
    ]);
    advance();
  }, []);

  const doUndo = useCallback(() => {
    if (pending || rated === 0) return;
    startTransition(async () => {
      const result = await undoLastReview();
      if (!result.undone) {
        toast.info(result.message);
        return;
      }
      putBack(result.restored);
      const key = VALUE_TO_RATING[result.rating - 1];
      if (key) setTally((t) => ({ ...t, [key]: Math.max(0, t[key] - 1) }));
      setRated((r) => Math.max(0, r - 1));
      setDone((d) => Math.max(0, d - 1));
      toast.success('Last rating undone.');
    });
  }, [pending, rated, putBack]);

  const setAside = useCallback(
    (how: 'bury' | 'suspend') => {
      if (!current || pending) return;
      const card = current.card;
      startTransition(async () => {
        try {
          const snap = how === 'bury' ? await buryCard(card.id) : await suspendCard(card.id);
          setQueue((q) => q.filter((e) => e.card.id !== card.id));
          advance();
          toast.success(
            how === 'bury'
              ? `Skipped ${card.hanzi} until tomorrow.`
              : `Suspended ${card.hanzi}. Unsuspend it any time in Settings.`,
            {
              action: {
                label: 'Undo',
                onClick: () => {
                  startTransition(async () => {
                    const restored = await restoreCard(snap);
                    if (restored) putBack(restored);
                  });
                },
              },
            },
          );
        } catch {
          toast.error("Couldn't update that card. Try again.");
        }
      });
    },
    [current, pending, putBack],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, [role="dialog"]')) {
        return;
      }
      if (isTypingLocked()) return; // the pinyin keyboard has the keys
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        doUndo();
        return;
      }
      if (!current || pending || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (current.phase === 'teach') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          finishTeach();
        }
        return;
      }
      if (!flipped) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          setFlipped(true);
        } else if (e.key.toLowerCase() === 'h') {
          setHinted(true);
        }
        return;
      }
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < STUDY_RATINGS.length) {
        e.preventDefault();
        submit(STUDY_RATINGS[idx].key);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, current, pending, submit, doUndo, finishTeach]);

  if (!current) {
    return (
      <SessionComplete
        learned={learned}
        rated={rated}
        tally={tally}
        pending={pending}
        onUndo={doUndo}
      />
    );
  }

  const card = current.card;
  const counts = {
    new: queue.filter((e) => e.phase === 'teach').length,
    // Taught-but-untested new cards count as learning too.
    learning: queue.filter((e) => e.phase === 'test' && e.card.state !== 'review').length,
    review: queue.filter((e) => e.phase === 'test' && e.card.state === 'review').length,
  };
  const isLeech = current.phase === 'test' && card.fails >= LEECH_FAILS;
  const stateLabel = card.state === 'new' ? 'new' : (STATE_LABEL[card.state] ?? card.state);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col px-4 py-5">
      <SessionToolbar
        done={done}
        remaining={queue.length}
        pending={pending}
        canUndo={rated > 0}
        onUndo={doUndo}
        pinyinAlways={pinyinAlways}
        onTogglePinyin={() => setPinyinPref(pinyinAlways ? '0' : '1')}
        autoplay={autoplay}
        onToggleAutoplay={() => setAutoplayPref(autoplay ? '0' : '1')}
        onBury={() => setAside('bury')}
        onSuspend={() => setAside('suspend')}
      />
      <QueueCounts counts={counts} />

      {isLeech && (
        <LeechBanner
          fails={card.fails}
          pending={pending}
          onBury={() => setAside('bury')}
          onSuspend={() => setAside('suspend')}
        />
      )}

      {current.phase === 'teach' ? (
        <TeachCard
          key={`${card.id}-${current.seq}`}
          card={card}
          dict={dict}
          onContinue={finishTeach}
          disabled={pending}
        />
      ) : (
        <Flashcard
          item={{
            key: `${card.id}-${current.seq}`,
            itemType: card.itemType,
            hanzi: card.hanzi,
            pinyin: card.pinyin,
            meaning: card.meaning,
            label: card.listening
              ? `Listening · ${stateLabel}`
              : card.production
                ? `Say it in Chinese · ${stateLabel}`
                : card.state === 'new'
                  ? 'New · recall it'
                  : stateLabel,
            listening: card.listening,
            production: card.production,
          }}
          flipped={flipped}
          onFlip={() => setFlipped(true)}
          onRate={submit}
          ratings={STUDY_RATINGS}
          disabled={pending}
          dict={dict}
          // "Always show pinyin" would give listening/production cards away; only the hint does.
          showPinyinOnFront={card.listening || card.production ? hinted : pinyinAlways || hinted}
          gradeToRating={GRADE_TO_RATING}
          onHint={() => setHinted(true)}
        />
      )}
      <p className="mt-3 text-center text-xs text-muted-foreground pointer-coarse:hidden">
        {current.phase === 'teach'
          ? 'Space to continue'
          : flipped
            ? '1 Again · 2 Hard · 3 Good · 4 Easy · P to hear it · click a word to hear just that word'
            : 'Space to reveal · H for a hint · Ctrl+Z to undo'}
      </p>
    </div>
  );
}
