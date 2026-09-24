'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, Volume2, X, CircleAlert } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AudioButton } from '@/components/audio-button';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { PinyinKeyboard } from '@/components/pinyin-keyboard';
import { EMPTY_DRAFT, draftIsEmpty, gradeDraft, type PinyinDraft } from '@/lib/pinyin-draft';
import { speak } from '@/lib/tts';
import { celebrate } from '@/lib/celebrate';
import { trackPractice } from '@/lib/track-practice';
import type { PinyinGrade } from '@/lib/pinyin';
import type { ClozeItem } from '@/lib/queries/cloze';
import type { Dictionary } from '@/lib/queries/dictionary';

export type AnswerMode = 'choose' | 'type';

type Result = { grade: PinyinGrade; given: string };

export function ClozeSession({
  items,
  mode,
  dict,
}: {
  items: ClozeItem[];
  mode: AnswerMode;
  dict: Dictionary;
}) {
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<PinyinDraft>(EMPTY_DRAFT);
  const [result, setResult] = useState<Result | null>(null);
  const [log, setLog] = useState<{ item: ClozeItem; grade: PinyinGrade }[]>([]);
  const nextRef = useRef<HTMLButtonElement>(null);

  const item = items[index];
  const finished = index >= items.length;

  const finish = useCallback(
    (grade: PinyinGrade, given: string) => {
      if (!item || result) return;
      setResult({ grade, given });
      setLog((l) => [...l, { item, grade }]);
      trackPractice({
        kind: 'cloze',
        item: item.word.hanzi,
        correct: grade === 'correct',
        detail: { grade, answerMode: mode, word: item.word.hanzi },
      });
      speak(item.hanzi);
    },
    [item, result, mode],
  );

  const submitTyped = useCallback(() => {
    if (!item || result || draftIsEmpty(draft)) return;
    const { grade, given } = gradeDraft(draft, item.syllables, item.word.pinyin);
    finish(grade, given);
  }, [item, result, draft, finish]);

  const next = useCallback(() => {
    setIndex((i) => i + 1);
    setDraft(EMPTY_DRAFT);
    setResult(null);
  }, []);

  useEffect(() => {
    if (result) nextRef.current?.focus();
  }, [result]);

  // Choose mode: 1–4 pick; any mode: Enter moves on after an answer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (result) {
        if (e.key === 'Enter') {
          e.preventDefault();
          next();
        } else if (e.key.toLowerCase() === 'p') {
          speak(item.hanzi);
        }
        return;
      }
      if (mode === 'choose' && item) {
        const opt = item.options[Number(e.key) - 1];
        if (opt) finish(opt === item.word.hanzi ? 'correct' : 'wrong', opt);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result, mode, item, next, finish]);

  const right = log.filter((l) => l.grade === 'correct').length;
  useEffect(() => {
    if (finished && log.length > 0) {
      celebrate(right / log.length >= 0.8 ? 'big' : 'small');
    }
  }, [finished, log.length, right]);

  if (finished) {
    const missed = log.filter((l) => l.grade !== 'correct');
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-12">
        <h1 className="text-center text-2xl font-semibold">Done!</h1>
        <p className="mt-2 text-center text-muted-foreground">
          {right} of {log.length} correct ({Math.round((right / Math.max(log.length, 1)) * 100)}%)
        </p>
        {missed.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Worth another look
            </h2>
            <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
              {missed.map(({ item: m, grade }) => (
                <li key={m.key} className="flex items-center gap-3 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <div lang="zh-Hans" className="text-lg">
                      {m.before}
                      <span className="font-semibold text-primary">{m.word.hanzi}</span>
                      {m.after}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {m.word.hanzi} {m.word.pinyin} — {m.word.meaning}
                      {grade === 'tones' && ' · tones'}
                    </div>
                  </div>
                  <AudioButton text={m.hanzi} />
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/quiz" className={buttonVariants({})}>
            New quiz
          </Link>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Same settings again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <Progress
          value={(index / items.length) * 100}
          className="flex-1"
          aria-label="Quiz progress"
        />
        <span className="text-sm tabular-nums text-muted-foreground">
          {index} / {items.length}
        </span>
      </div>

      <div className="rounded-xl border-2 border-border/70 bg-card px-5 py-8 text-center sm:px-8">
        <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {item.source}
        </div>
        <div lang="zh-Hans" className="mt-4 text-3xl font-medium leading-relaxed sm:text-4xl">
          {result ? (
            <TokenizedHanzi hanzi={item.hanzi} dict={dict} linkable={false} />
          ) : (
            <>
              {item.before}
              <span
                className="mx-1 inline-block min-w-[2.5em] border-b-4 border-primary/70 align-baseline"
                aria-label="blank"
              >
                {'　'.repeat(Array.from(item.word.hanzi).length)}
              </span>
              {item.after}
            </>
          )}
        </div>
        <p className="mt-4 text-lg">{item.meaning}</p>
        {mode === 'type' && !result && (
          <p className="mt-1 text-sm text-muted-foreground">
            Type the pinyin for the missing word.
          </p>
        )}
        {result && (
          <div className="mt-3 flex items-center justify-center gap-1 text-muted-foreground">
            {item.pinyin && <span>{item.pinyin}</span>}
            <AudioButton text={item.hanzi} />
          </div>
        )}
      </div>

      <div className="mt-4">
        {mode === 'choose' ? (
          <div className="grid grid-cols-2 gap-2">
            {item.options.map((opt, i) => {
              const isAnswer = result && opt === item.word.hanzi;
              const isWrong = result && opt === result.given && opt !== item.word.hanzi;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!!result}
                  onClick={() => finish(opt === item.word.hanzi ? 'correct' : 'wrong', opt)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-4 text-2xl transition-colors disabled:cursor-default ${
                    isAnswer
                      ? 'border-emerald-500/70 bg-emerald-500/15'
                      : isWrong
                        ? 'border-red-500/70 bg-red-500/15'
                        : 'border-border/70 hover:border-primary/60 hover:bg-muted/40'
                  }`}
                >
                  <span className="font-mono text-xs text-muted-foreground pointer-coarse:hidden">
                    {i + 1}
                  </span>
                  <span lang="zh-Hans">{opt}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <PinyinKeyboard
            value={draft}
            onChange={setDraft}
            onSubmit={submitTyped}
            disabled={!!result}
          />
        )}
      </div>

      {result && (
        <div
          role="status"
          className={`mt-4 rounded-lg border px-4 py-3 ${
            result.grade === 'correct'
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : result.grade === 'tones'
                ? 'border-amber-500/40 bg-amber-500/10'
                : 'border-red-500/40 bg-red-500/10'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {result.grade === 'correct' ? (
              <Check className="size-4" />
            ) : result.grade === 'tones' ? (
              <CircleAlert className="size-4" />
            ) : (
              <X className="size-4" />
            )}
            {result.grade === 'correct'
              ? 'Correct!'
              : result.grade === 'tones'
                ? 'Right sounds — check the tones'
                : 'Not quite'}
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
            <span lang="zh-Hans" className="text-lg">
              {item.word.hanzi}
            </span>
            <span className="font-medium">{item.word.pinyin}</span>
            <span className="text-muted-foreground">{item.word.meaning}</span>
            {mode === 'type' && result.grade !== 'correct' && (
              <span className="w-full text-xs text-muted-foreground">You typed {result.given}</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-2">
        {result ? (
          <>
            <Button variant="outline" onClick={() => speak(item.hanzi)}>
              <Volume2 /> Hear it again
            </Button>
            <Button ref={nextRef} onClick={next}>
              {index + 1 === items.length ? 'See results' : 'Next'}
            </Button>
          </>
        ) : (
          mode === 'type' && (
            <Button variant="ghost" size="sm" onClick={() => finish('wrong', '(skipped)')}>
              I don&apos;t know
            </Button>
          )
        )}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground pointer-coarse:hidden">
        {result
          ? 'Enter for next · P to hear it again'
          : mode === 'choose'
            ? 'Press 1–4 to choose'
            : 'Letters, then 1–4 for the tone (5 or Space = neutral) · v types ü · Enter to check'}
      </p>
    </div>
  );
}
