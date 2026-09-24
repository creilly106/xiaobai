'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Undo2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  MoreHorizontal,
  MoonStar,
  PauseCircle,
  TriangleAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Button, buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { TeachCard } from './teach-card';

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
      phase: card.state === 'new' && !card.listening ? 'teach' : 'test',
    })),
  );
  const [flipped, setFlipped] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    const recalled = tally.hard + tally.good + tally.easy;
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold"
        >
          Session complete
        </motion.h1>
        <p className="mt-2 text-muted-foreground">
          {learned > 0 && `${learned} new card${learned === 1 ? '' : 's'} learned · `}
          {rated} review{rated === 1 ? '' : 's'}
          {rated > 0 && ` · recalled ${Math.round((recalled / rated) * 100)}%`}
        </p>
        {rated > 0 && (
          <div className="mt-5 grid grid-cols-4 gap-2 text-sm">
            {STUDY_RATINGS.map((r) => (
              <div key={r.key} className={`rounded-md border py-2 ${r.className}`}>
                <div className="font-semibold">{r.label}</div>
                <div className="tabular-nums">{tally[r.key]}</div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({})}>
            Back to home
          </Link>
          <Link href="/study" className={buttonVariants({ variant: 'outline' })}>
            Check for more
          </Link>
          <Button variant="ghost" onClick={doUndo} disabled={pending || rated === 0}>
            <Undo2 /> Undo last
          </Button>
        </div>
      </div>
    );
  }

  const remaining = queue.length;
  const percent = Math.round((done / Math.max(done + remaining, 1)) * 100);
  const card = current.card;
  const counts = {
    new: queue.filter((e) => e.phase === 'teach').length,
    // Taught-but-untested new cards count as learning too.
    learning: queue.filter((e) => e.phase === 'test' && e.card.state !== 'review').length,
    review: queue.filter((e) => e.phase === 'test' && e.card.state === 'review').length,
  };
  const isLeech = current.phase === 'test' && card.fails >= LEECH_FAILS;

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col px-4 py-5">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Undo last rating"
          aria-keyshortcuts="Control+Z"
          disabled={rated === 0 || pending}
          onClick={doUndo}
          title="Undo last rating (Ctrl+Z)"
        >
          <Undo2 />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Always show pinyin before revealing the answer"
          aria-pressed={pinyinAlways}
          onClick={() => setPinyinPref(pinyinAlways ? '0' : '1')}
          title={
            pinyinAlways
              ? 'Pinyin always shown — click to hide'
              : 'Pinyin hidden until flip — click to always show'
          }
        >
          {pinyinAlways ? <Eye /> : <EyeOff />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Play audio automatically when the answer is shown"
          aria-pressed={autoplay}
          onClick={() => setAutoplayPref(autoplay ? '0' : '1')}
          title={
            autoplay
              ? 'Audio plays on reveal — click to turn off (P replays)'
              : 'Audio off on reveal — click to turn on (P still plays)'
          }
        >
          {autoplay ? <Volume2 /> : <VolumeX />}
        </Button>
        <Progress value={percent} className="flex-1" aria-label="Session progress" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={done}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="min-w-12 text-right text-sm tabular-nums text-muted-foreground"
          >
            {done} / {done + remaining}
          </motion.span>
        </AnimatePresence>
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Card options"
                title="Card options"
                disabled={pending}
              />
            }
          >
            <MoreHorizontal />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 gap-1 p-1.5">
            <CardOption
              icon={<MoonStar />}
              label="Skip until tomorrow"
              desc="Hide this card for today. No rating is recorded."
              onClick={() => {
                setMenuOpen(false);
                setAside('bury');
              }}
            />
            <CardOption
              icon={<PauseCircle />}
              label="Suspend card"
              desc="Stop showing it until you unsuspend it in Settings."
              onClick={() => {
                setMenuOpen(false);
                setAside('suspend');
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div
        className="mb-4 mt-2 flex justify-center gap-3 text-xs text-muted-foreground"
        aria-label="Cards left"
      >
        <span>
          <span className="font-medium text-primary tabular-nums">{counts.new}</span> new
        </span>
        <span>
          <span className="font-medium text-foreground tabular-nums">{counts.learning}</span>{' '}
          learning
        </span>
        <span>
          <span className="font-medium text-foreground tabular-nums">{counts.review}</span> review
        </span>
      </div>

      {isLeech && (
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          <TriangleAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="min-w-0 flex-1">
            This one keeps slipping ({card.fails} misses). Try the hint, or give it a rest.
          </span>
          <span className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setAside('bury')} disabled={pending}>
              Skip today
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setAside('suspend')}
              disabled={pending}
            >
              Suspend
            </Button>
          </span>
        </div>
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
              ? `Listening · ${card.state === 'new' ? 'new' : (STATE_LABEL[card.state] ?? card.state)}`
              : card.state === 'new'
                ? 'New · recall it'
                : (STATE_LABEL[card.state] ?? card.state),
            listening: card.listening,
          }}
          flipped={flipped}
          onFlip={() => setFlipped(true)}
          onRate={submit}
          ratings={STUDY_RATINGS}
          disabled={pending}
          dict={dict}
          // "Always show pinyin" would give listening cards away; only the hint does.
          showPinyinOnFront={card.listening ? hinted : pinyinAlways || hinted}
          onHint={() => setHinted(true)}
        />
      )}
      <p className="mt-3 text-center text-xs text-muted-foreground pointer-coarse:hidden">
        {current.phase === 'teach'
          ? 'Space to continue'
          : flipped
            ? 'Rate how well you remembered: 1 Again · 2 Hard · 3 Good · 4 Easy'
            : 'Space to reveal · H for a hint · Ctrl+Z to undo'}
      </p>
    </div>
  );
}

function CardOption({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
    >
      {icon}
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}
