'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUp, Check, Trophy, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Pinyin } from '@/components/pinyin';
import {
  ChooseStep,
  FillStep,
  TranslateStep,
  TypePinyinStep,
  solutionOf,
  type Answer,
} from '@/app/learn/_components/steps';
import { submitCheck, submitExam, type AssessmentResult } from '@/lib/actions/level';
import { celebrate } from '@/lib/celebrate';
import type { LevelBank, LevelItem, LevelStep, ScoredAnswer } from '@/lib/level/items';
import { currentEstimate, pickNext } from '@/lib/level/picker';
import { MILESTONES, rankAt } from '@/lib/level/ranks';
import {
  LEVEL_SKILLS,
  SKILL_NAME,
  ratingForLevel,
  toneLabel,
  type Estimate,
  type Skill,
} from '@/lib/level/rating';
import { primeVoices, stopSpeaking } from '@/lib/tts';
import { PassageQuestion, TonePairQuestion, tonePairLabel } from './level-steps';

type Props =
  | { mode: 'check'; bank: LevelBank; plan: Skill[]; priors: Record<Skill, Estimate> }
  | { mode: 'exam'; level: number; items: LevelItem[] };

const scoreOf = (a: Answer) => (a.correct ? 1 : a.partial ? 0.5 : 0);

/** The next question: an exam's is fixed; a check's depends on your answers so far. */
function pickQuestion(props: Props, answers: ScoredAnswer[], used: Set<string>): LevelItem | null {
  const i = answers.length;
  if (props.mode === 'exam') return props.items[i] ?? null;
  const skill = props.plan[i];
  if (!skill) return null;
  const now = currentEstimate(props.priors[skill], answers, skill);
  return (
    pickNext(props.bank, used, skill, now) ??
    // That skill ran out: any skill that still has questions.
    LEVEL_SKILLS.map((s) =>
      pickNext(props.bank, used, s, currentEstimate(props.priors[s], answers, s)),
    ).find(Boolean) ??
    null
  );
}

/** Runs a Level check (adaptive) or a promotion exam (fixed), then saves it. */
export function AssessmentPlayer(props: Props) {
  const total = props.mode === 'check' ? props.plan.length : props.items.length;
  const [answers, setAnswers] = useState<ScoredAnswer[]>([]);
  const [used, setUsed] = useState<Set<string>>(new Set());
  // The question now: for a check, picked from where your answers put you.
  const [current, setCurrent] = useState<LevelItem | null>(() =>
    pickQuestion(props, [], new Set()),
  );
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [saving, startSaving] = useTransition();

  useEffect(() => primeVoices(), []);

  function save(all: ScoredAnswer[]) {
    setError(null);
    startSaving(async () => {
      try {
        const r =
          props.mode === 'check' ? await submitCheck(all) : await submitExam(props.level, all);
        setResult(r);
        if (props.mode === 'exam') celebrate(r.passed ? 'big' : 'small');
        else celebrate('medium');
      } catch {
        setError("Couldn't save your answers. Check your connection and try again.");
      }
    });
  }

  function onAnswer(a: Answer) {
    if (!current || answer) return;
    setAnswer(a);
  }

  function next() {
    if (!current || !answer) return;
    stopSpeaking();
    const all = [
      ...answers,
      {
        itemId: current.id,
        skill: current.skill,
        level: current.level,
        difficulty: current.difficulty,
        guess: current.guess,
        score: scoreOf(answer),
      },
    ];
    const nowUsed = new Set(used).add(current.id);
    const following = all.length < total ? pickQuestion(props, all, nowUsed) : null;
    setAnswers(all);
    setUsed(nowUsed);
    setAnswer(null);
    setCurrent(following);
    // At the end, or out of questions early (a thin bank): save.
    if (!following) save(all);
  }

  if (result) {
    return props.mode === 'check' ? (
      <CheckResult result={result} />
    ) : (
      <ExamResult result={result} level={props.level} />
    );
  }

  if (!current || error) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        {error ? (
          <>
            <p className="text-muted-foreground">{error}</p>
            <Button className="mt-4" onClick={() => save(answers)} disabled={saving}>
              Try again
            </Button>
          </>
        ) : answers.length === 0 ? (
          <p className="text-muted-foreground">
            There aren&apos;t enough questions to build this right now.{' '}
            <Link href="/level" className="underline">
              Back
            </Link>
          </p>
        ) : (
          <p className="text-muted-foreground">Working out your level…</p>
        )}
      </div>
    );
  }

  const percent = Math.round(((answers.length + (answer ? 1 : 0)) / total) * 100);
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col px-4 pt-5 pb-40">
      <div className="mb-6 flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Leave"
          onClick={() => (answers.length ? setConfirmLeave(true) : history.back())}
        >
          <X />
        </Button>
        <Progress value={percent} className="flex-1" aria-label="Progress" />
        <span className="text-xs tabular-nums text-muted-foreground">
          {Math.min(answers.length + 1, total)} / {total}
        </span>
      </div>
      {confirmLeave && (
        <div
          role="alertdialog"
          aria-label="Leave?"
          className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm"
        >
          <span className="flex-1">Leave? Nothing is saved until you finish.</span>
          <Button type="button" size="sm" onClick={() => setConfirmLeave(false)} autoFocus>
            Keep going
          </Button>
          <Link href="/level" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Leave
          </Link>
        </div>
      )}
      <div className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {SKILL_NAME[current.skill]}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.2 }}
          data-level-step={current.step.kind}
          className="flex flex-1 flex-col justify-center"
        >
          <QuestionView step={current.step} answered={answer !== null} onAnswer={onAnswer} />
        </motion.div>
      </AnimatePresence>
      {answer && <Feedback step={current.step} answer={answer} onContinue={next} busy={saving} />}
    </div>
  );
}

function QuestionView({
  step,
  answered,
  onAnswer,
}: {
  step: LevelStep;
  answered: boolean;
  onAnswer: (a: Answer) => void;
}) {
  const props = { answered, onAnswer };
  switch (step.kind) {
    case 'choose':
      return <ChooseStep {...props} step={step} />;
    case 'translate':
      return <TranslateStep {...props} step={step} />;
    case 'fill':
      return <FillStep {...props} step={step} />;
    case 'type-pinyin':
      return <TypePinyinStep {...props} step={step} />;
    case 'tone-pair':
      return <TonePairQuestion {...props} step={step} />;
    case 'passage':
      return <PassageQuestion {...props} step={step} />;
    default:
      return null;
  }
}

function Feedback({
  step,
  answer,
  onContinue,
  busy,
}: {
  step: LevelStep;
  answer: Answer;
  onContinue: () => void;
  busy: boolean;
}) {
  const solution =
    step.kind === 'tone-pair'
      ? { hanzi: step.word.hanzi, pinyin: step.word.pinyin, meaning: tonePairLabel(step.answer) }
      : step.kind === 'passage'
        ? null
        : solutionOf(step);
  const tone = answer.correct
    ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60'
    : answer.partial
      ? 'border-amber-500/40 bg-amber-50 dark:bg-amber-950/60'
      : 'border-red-500/40 bg-red-50 dark:bg-red-950/60';
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed inset-x-0 bottom-0 z-20 border-t-2 ${tone}`}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center gap-4 px-4 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 font-semibold">
            {answer.correct ? (
              <>
                <Check className="size-5 text-emerald-600" /> Correct
              </>
            ) : answer.partial ? (
              <>Nearly</>
            ) : (
              <>
                <X className="size-5 text-red-600" /> Not quite
              </>
            )}
          </div>
          {answer.note && <p className="text-sm">{answer.note}</p>}
          {solution && !answer.correct && (
            <div className="mt-1 text-sm">
              <span lang="zh-Hans" className="text-base font-medium">
                {solution.hanzi}
              </span>{' '}
              <Pinyin text={solution.pinyin} className="text-muted-foreground" /> —{' '}
              {solution.meaning}
            </div>
          )}
          {step.kind === 'passage' && !answer.correct && (
            <p className="mt-1 text-sm">Answer: {step.answer}</p>
          )}
        </div>
        <Button autoFocus size="lg" onClick={onContinue} disabled={busy}>
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

function Change({ before, after }: { before: number; after: number }) {
  const d = Math.round((after - before) * 10) / 10;
  if (d === 0) return <span className="text-xs text-muted-foreground">no change</span>;
  const Icon = d > 0 ? ArrowUp : ArrowDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs tabular-nums ${d > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
    >
      <Icon className="size-3" />
      {Math.abs(d).toFixed(1)}
    </span>
  );
}

function SkillRows({ result }: { result: AssessmentResult }) {
  return (
    <ul className="mt-6 divide-y rounded-xl border text-left">
      {LEVEL_SKILLS.map((skill) => (
        <li key={skill} className="flex items-center justify-between gap-3 px-4 py-3">
          <span>{SKILL_NAME[skill]}</span>
          <span className="flex items-baseline gap-2">
            <span className="font-medium tabular-nums">≈ HSK {result.after[skill].toFixed(1)}</span>
            <Change before={result.before[skill]} after={result.after[skill]} />
          </span>
        </li>
      ))}
      <li className="flex items-center justify-between gap-3 px-4 py-3">
        <span>{SKILL_NAME.tones}</span>
        <span className="font-medium">{toneLabel(ratingForLevel(result.after.tones))}</span>
      </li>
    </ul>
  );
}

function NewMilestones({ keys }: { keys: string[] }) {
  const found = MILESTONES.filter((m) => keys.includes(m.key));
  if (found.length === 0) return null;
  return (
    <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-left text-sm">
      <div className="font-medium">New milestone{found.length === 1 ? '' : 's'}</div>
      <ul className="mt-1 space-y-0.5">
        {found.map((m) => (
          <li key={m.key}>
            <span className="font-medium">{m.title}</span>{' '}
            <span className="text-muted-foreground">— {m.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckResult({ result }: { result: AssessmentResult }) {
  const exam = result.examLevel != null ? rankAt(result.examLevel) : null;
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold">Level check done</h1>
      <p className="mt-2 text-muted-foreground">
        {result.score}% right
        {result.overall != null && (
          <>
            {' · '}overall about{' '}
            <span className="font-medium text-foreground">HSK {result.overall.toFixed(1)}</span>
          </>
        )}
      </p>
      <SkillRows result={result} />
      <NewMilestones keys={result.newMilestones} />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {exam && (
          <Link href={`/level/exam?level=${exam.level}`} className={buttonVariants({ size: 'lg' })}>
            Take the <span lang="zh-Hans">{exam.hanzi}</span> exam <ArrowRight />
          </Link>
        )}
        <Link
          href="/level"
          className={buttonVariants({ variant: exam ? 'outline' : 'default', size: 'lg' })}
        >
          Back to your level
        </Link>
      </div>
    </div>
  );
}

function ExamResult({ result, level }: { result: AssessmentResult; level: number }) {
  const rank = rankAt(level);
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-12 text-center">
      {result.passed ? (
        <>
          <Trophy className="mx-auto size-12 text-amber-500" />
          <h1 className="mt-3 text-2xl font-semibold">
            You&apos;re now <span lang="zh-Hans">{rank.hanzi}</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            {rank.pinyin} · {rank.name} · {result.score}% right
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold">Not this time</h1>
          <p className="mt-2 text-muted-foreground">
            {result.score}% right. You need 80% overall and at least 60% in each skill.
            {result.weakest && (
              <>
                {' '}
                <span className="text-foreground">{SKILL_NAME[result.weakest]}</span> held you back.
              </>
            )}{' '}
            You can try again in three days.
          </p>
        </>
      )}
      <ul className="mt-6 divide-y rounded-xl border text-left">
        {(['reading', 'listening', 'writing', 'tones'] as Skill[]).map((skill) => {
          const s = result.sections[skill];
          if (!s) return null;
          const pct = Math.round((s.right / s.total) * 100);
          return (
            <li key={skill} className="flex items-center justify-between px-4 py-3">
              <span>{SKILL_NAME[skill]}</span>
              <span
                className={`tabular-nums ${skill !== 'tones' && pct < 60 ? 'text-red-600 dark:text-red-400' : ''}`}
              >
                {s.right % 1 ? s.right.toFixed(1) : s.right} / {s.total}
              </span>
            </li>
          );
        })}
      </ul>
      <NewMilestones keys={result.newMilestones} />
      <div className="mt-8">
        <Link href="/level" className={buttonVariants({ size: 'lg' })}>
          Back to your level
        </Link>
      </div>
    </div>
  );
}
