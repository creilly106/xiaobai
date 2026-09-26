'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Trophy, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pinyin } from '@/components/pinyin';
import { FlagButton } from '@/components/flag-button';
import { celebrate } from '@/lib/celebrate';
import { completeCheckpoint, completeLesson, type WordResult } from '@/lib/actions/path';
import { isQuestion, MAX_RETRIES, stepTargets, type LessonStep } from '@/lib/path/lesson-builder';
import type { LessonSession } from '@/lib/queries/path';
import { primeVoices } from '@/lib/tts';
import { isTypingLocked } from '@/lib/typing-lock';
import {
  ArrangeStep,
  ChooseStep,
  FillStep,
  GrammarStep,
  MatchStep,
  TeachStep,
  TranslateStep,
  TypeMeaningStep,
  TypePinyinStep,
  play,
  solutionOf,
  type Answer,
} from './steps';

type Entry = { id: number; step: LessonStep; tries: number };

export function LessonPlayer({
  session,
  nextHref,
  nextTitle,
}: {
  session: LessonSession;
  /** Where "Continue" goes after the lesson. */
  nextHref: string;
  nextTitle: string | null;
}) {
  const [queue, setQueue] = useState<Entry[]>(() =>
    session.steps.map((step, id) => ({ id, step, tries: 0 })),
  );
  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [firstTry, setFirstTry] = useState({ right: 0, total: 0 });
  const mistakes = useRef(new Map<string, number>());
  const nextId = useRef(session.steps.length);
  const [finished, setFinished] = useState<{ score: number; passed: boolean } | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [saving, startSaving] = useTransition();

  useEffect(() => primeVoices(), []);

  const entry = queue[pos];
  const question = entry ? isQuestion(entry.step) : false;

  const onAnswer = useCallback(
    (a: Answer) => {
      if (!entry || answer) return;
      setAnswer(a);
      if (entry.tries === 0) {
        setFirstTry((f) => ({ right: f.right + (a.correct ? 1 : 0), total: f.total + 1 }));
      }
      if (!a.correct) {
        for (const h of a.missed ?? stepTargets(entry.step)) {
          mistakes.current.set(h, (mistakes.current.get(h) ?? 0) + 1);
        }
        // Missed questions come back at the end (a match only counts once).
        if (entry.tries < MAX_RETRIES && entry.step.kind !== 'match') {
          setQueue((q) => [
            ...q,
            { id: nextId.current++, step: entry.step, tries: entry.tries + 1 },
          ]);
        }
      }
      const solution = solutionOf(entry.step);
      if (solution && entry.step.kind !== 'choose') play(solution.hanzi, solution.pinyin);
    },
    [entry, answer],
  );

  const finish = useCallback(() => {
    const score = firstTry.total ? Math.round((firstTry.right / firstTry.total) * 100) : 100;
    const results: WordResult[] = session.words.map((hanzi) => ({
      hanzi,
      mistakes: mistakes.current.get(hanzi) ?? 0,
    }));
    startSaving(async () => {
      try {
        const passed =
          session.kind === 'lesson'
            ? (await completeLesson(session.id, results, score), true)
            : (await completeCheckpoint(session.id, results, score)).passed;
        setFinished({ score, passed });
        celebrate(passed ? (score >= 90 ? 'big' : 'medium') : 'small');
      } catch {
        toast.error("Couldn't save your progress. Try again.");
      }
    });
  }, [firstTry, session]);

  const advance = useCallback(() => {
    if (question && !answer) return;
    setAnswer(null);
    if (pos + 1 >= queue.length) finish();
    else setPos(pos + 1);
  }, [question, answer, pos, queue.length, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat || isTypingLocked()) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, button')) return;
      if (question && !answer) return;
      e.preventDefault();
      advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, question, answer]);

  const percent = useMemo(
    () => Math.round(((pos + (answer || !question ? 1 : 0)) / Math.max(queue.length, 1)) * 100),
    [pos, answer, question, queue.length],
  );

  if (finished) {
    return (
      <Finished
        session={session}
        score={finished.score}
        passed={finished.passed}
        nextHref={nextHref}
        nextTitle={nextTitle}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col px-4 pt-5 pb-40">
      <div className="mb-6 flex items-center gap-3">
        {firstTry.total === 0 ? (
          <Link
            href="/learn"
            aria-label="Leave lesson"
            className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
          >
            <X />
          </Link>
        ) : (
          // Once you've answered something, a stray tap shouldn't throw the lesson away.
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Leave lesson"
            onClick={() => setConfirmLeave(true)}
          >
            <X />
          </Button>
        )}
        <Progress value={percent} className="flex-1" aria-label="Lesson progress" />
        <span className="hidden text-xs text-muted-foreground sm:inline">{session.title}</span>
      </div>
      {confirmLeave && (
        <div
          role="alertdialog"
          aria-label="Leave this lesson?"
          className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
        >
          <span className="flex-1">Leave this lesson? Your answers so far won’t be saved.</span>
          <Button type="button" size="sm" onClick={() => setConfirmLeave(false)} autoFocus>
            Keep going
          </Button>
          <Link href="/learn" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Leave
          </Link>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={entry?.id ?? 'saving'}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.2 }}
          data-step={entry?.step.kind}
          className="flex flex-1 flex-col justify-center"
        >
          {entry && <StepView entry={entry} answered={answer !== null} onAnswer={onAnswer} />}
          {!entry && saving && (
            <p className="text-center text-muted-foreground">Saving your progress…</p>
          )}
        </motion.div>
      </AnimatePresence>

      {entry && (!question || answer) && (
        <FeedbackBar step={entry.step} answer={answer} onContinue={advance} busy={saving} />
      )}
    </div>
  );
}

function StepView({
  entry,
  answered,
  onAnswer,
}: {
  entry: Entry;
  answered: boolean;
  onAnswer: (a: Answer) => void;
}) {
  const props = { answered, onAnswer };
  const { step } = entry;
  switch (step.kind) {
    case 'teach':
      return <TeachStep key={entry.id} step={step} />;
    case 'grammar':
      return <GrammarStep key={entry.id} step={step} />;
    case 'choose':
      return <ChooseStep key={entry.id} {...props} step={step} />;
    case 'match':
      return <MatchStep key={entry.id} {...props} step={step} />;
    case 'type-meaning':
      return <TypeMeaningStep key={entry.id} {...props} step={step} />;
    case 'type-pinyin':
      return <TypePinyinStep key={entry.id} {...props} step={step} />;
    case 'arrange':
      return <ArrangeStep key={entry.id} {...props} step={step} />;
    case 'translate':
      return <TranslateStep key={entry.id} {...props} step={step} />;
    case 'fill':
      return <FillStep key={entry.id} {...props} step={step} />;
  }
}

function FeedbackBar({
  step,
  answer,
  onContinue,
  busy,
}: {
  step: LessonStep;
  answer: Answer | null;
  onContinue: () => void;
  busy: boolean;
}) {
  const solution = answer ? solutionOf(step) : null;
  const tone = !answer
    ? 'border-border bg-background'
    : answer.correct
      ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60'
      : 'border-red-500/40 bg-red-50 dark:bg-red-950/60';
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed inset-x-0 bottom-0 z-20 border-t-2 ${tone}`}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center gap-4 px-4 py-4">
        {answer && (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-semibold">
              {answer.correct ? (
                <>
                  <Check className="size-5 text-emerald-600" /> Correct!
                </>
              ) : (
                <>
                  <X className="size-5 text-red-600" /> Not quite
                  {step.kind !== 'match' && (
                    <span className="text-xs font-normal text-muted-foreground">
                      — it&apos;ll come up again
                    </span>
                  )}
                </>
              )}
            </div>
            {answer.note && <p className="text-sm">{answer.note}</p>}
            {solution && (!answer.correct || step.kind !== 'choose') && (
              <div className="mt-1 text-sm">
                <span lang="zh-Hans" className="text-base font-medium">
                  {solution.hanzi}
                </span>{' '}
                <Pinyin text={solution.pinyin} className="text-muted-foreground" /> —{' '}
                {solution.meaning}
                <FlagButton
                  subject={solution.hanzi}
                  detail={`${solution.pinyin} · ${solution.meaning}`}
                  className="ml-1 align-middle"
                />
              </div>
            )}
          </div>
        )}
        <Button
          autoFocus
          size="lg"
          onClick={onContinue}
          disabled={busy}
          className={answer ? '' : 'ml-auto'}
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

function Finished({
  session,
  score,
  passed,
  nextHref,
  nextTitle,
}: {
  session: LessonSession;
  score: number;
  passed: boolean;
  nextHref: string;
  nextTitle: string | null;
}) {
  const checkpoint = session.kind === 'checkpoint';
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
      <Trophy className="mx-auto size-12 text-amber-500" />
      <h1 className="mt-3 text-2xl font-semibold">
        {checkpoint
          ? passed
            ? `You tested out of ${session.unitTitle}!`
            : 'Not quite there yet'
          : 'Lesson complete'}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {score}% right first time.{' '}
        {checkpoint && !passed
          ? 'You need 80% to test out — work through the lessons instead, or try again.'
          : `${session.words.length} words are now in your reviews.`}
      </p>
      {!checkpoint && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {session.words.map((w) => (
            <span key={w} lang="zh-Hans" className="rounded-md border px-2 py-1 text-lg">
              {w}
            </span>
          ))}
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {passed && (
          <Link href={nextHref} className={buttonVariants({ size: 'lg' })} autoFocus>
            {nextTitle ? `Next: ${nextTitle}` : 'Back to the path'}
          </Link>
        )}
        {!passed && (
          // A full load, so the retry gets fresh questions.
          <a href={`/learn/checkpoint/${session.unitId}`} className={buttonVariants({})}>
            Try again
          </a>
        )}
        <Link href="/learn" className={buttonVariants({ variant: 'outline' })}>
          Path
        </Link>
      </div>
    </div>
  );
}
