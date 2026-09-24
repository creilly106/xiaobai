'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, RotateCcw, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AudioButton } from '@/components/audio-button';
import { speak } from '@/lib/tts';
import {
  MAX_NUMBER,
  digitsToChinese,
  numberPinyin,
  sameChineseNumber,
  toChinese,
} from '@/lib/numbers';
import { useStoredPref } from '@/lib/use-client';

/** A digit tile that speaks itself when clicked. */
export function SpeakTile({ n }: { n: number }) {
  const zh = toChinese(n);
  return (
    <button
      type="button"
      onClick={() => speak(zh)}
      className="flex flex-col items-center gap-0.5 rounded-lg border border-border/60 bg-card px-2 py-3 transition-colors hover:border-primary/60 hover:bg-muted/40"
      title={`Play ${zh}`}
    >
      <span className="text-xs tabular-nums text-muted-foreground">{n}</span>
      <span lang="zh-Hans" className="text-3xl leading-tight">
        {zh}
      </span>
      <span className="text-xs text-muted-foreground">{numberPinyin(zh)}</span>
    </button>
  );
}

/** Inline example: "10005 → 一万零五" with audio. */
export function Example({ n, note }: { n: number; note?: string }) {
  const zh = toChinese(n);
  return (
    <li className="grid grid-cols-[5rem_1fr_auto] items-center gap-x-3 py-1.5">
      <span className="text-right font-mono text-sm tabular-nums text-muted-foreground">
        {n.toLocaleString('en-US')}
      </span>
      <span className="min-w-0">
        <span lang="zh-Hans" className="block text-lg leading-snug">
          {zh}
        </span>
        <span className="block text-xs text-muted-foreground">
          {numberPinyin(zh)}
          {note && <span className="text-foreground/70"> · {note}</span>}
        </span>
      </span>
      <AudioButton text={zh} />
    </li>
  );
}

export function Converter() {
  const [raw, setRaw] = useState('2026');
  const cleaned = raw.replace(/[,\s_]/g, '');
  const n = /^\d{1,12}$/.test(cleaned) ? Number(cleaned) : null;
  const valid = n != null && n <= MAX_NUMBER;
  const zh = valid ? toChinese(n) : null;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium" htmlFor="num-convert">
        Type any number
      </label>
      <Input
        id="num-convert"
        inputMode="numeric"
        autoComplete="off"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="max-w-xs font-mono text-lg"
        placeholder="e.g. 10005"
      />
      {raw.trim() === '' ? null : zh ? (
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span lang="zh-Hans" className="text-3xl">
              {zh}
            </span>
            <AudioButton text={zh} />
          </div>
          <div className="text-sm text-muted-foreground">{numberPinyin(zh)}</div>
          {cleaned.length >= 3 && (
            <div className="border-t border-border/60 pt-3 text-sm">
              <span className="text-muted-foreground">Read digit by digit (years, phone and room numbers): </span>
              <span lang="zh-Hans" className="text-base">
                {digitsToChinese(cleaned)}
              </span>
              <span className="text-muted-foreground"> · on the phone: </span>
              <span lang="zh-Hans" className="text-base">
                {digitsToChinese(cleaned, { phone: true })}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Enter a whole number from 0 to {MAX_NUMBER.toLocaleString('en-US')}.
        </p>
      )}
    </div>
  );
}

type Mode = 'read' | 'listen' | 'say';
const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'read', label: 'Read', desc: 'See Chinese, type the number' },
  { key: 'listen', label: 'Listen', desc: 'Hear it, type the number' },
  { key: 'say', label: 'Say', desc: 'See the number, pick the Chinese' },
];

const RANGES = [
  { key: '10', label: '0–10', minDigits: 1, maxDigits: 1, max: 10 },
  { key: '99', label: '0–99', minDigits: 1, maxDigits: 2, max: 99 },
  { key: '999', label: '0–999', minDigits: 2, maxDigits: 3, max: 999 },
  { key: '9999', label: '0–9,999', minDigits: 3, maxDigits: 4, max: 9_999 },
  { key: 'wan', label: '万 and up', minDigits: 5, maxDigits: 8, max: 99_999_999 },
] as const;

type RangeKey = (typeof RANGES)[number]['key'];

function randomNumber(range: (typeof RANGES)[number]): number {
  if (range.key === '10') return Math.floor(Math.random() * 11);
  const digits =
    range.minDigits + Math.floor(Math.random() * (range.maxDigits - range.minDigits + 1));
  let s = String(1 + Math.floor(Math.random() * 9));
  for (let i = 1; i < digits; i++) {
    // Extra zeros so the 零 rules get practised.
    s += Math.random() < 0.3 ? '0' : String(Math.floor(Math.random() * 10));
  }
  return Math.min(Number(s), range.max);
}

/** Plausible wrong answers: a digit changed, a zero moved, a place slipped. */
function distractors(n: number, max: number): string[] {
  const correct = toChinese(n);
  const out = new Set<string>();
  const s = String(n);
  const tries: number[] = [n * 10, Math.floor(n / 10), n + 1, n - 1, n + 10, n - 10];
  for (let i = 0; i < s.length; i++) {
    // Nudge one digit.
    const d = Number(s[i]);
    tries.push(Number(s.slice(0, i) + ((d + 1) % 10) + s.slice(i + 1)));
    // Swap neighbours — moves zeros around, e.g. 1005 ↔ 1050.
    if (i > 0) tries.push(Number(s.slice(0, i - 1) + s[i] + s[i - 1] + s.slice(i + 1)));
  }
  // The classic mistake: dropping the 零.
  const noZero = correct.replace(/零/g, '');
  if (noZero !== correct && noZero) out.add(noZero);
  for (const t of tries.sort(() => Math.random() - 0.5)) {
    if (out.size >= 3) break;
    if (!Number.isInteger(t) || t < 0 || t > max || t === n) continue;
    const zh = toChinese(t);
    if (!sameChineseNumber(zh, correct)) out.add(zh);
  }
  return [...out].slice(0, 3);
}

type Question = { n: number; zh: string; options: string[] };
type Feedback = { correct: boolean; given: string } | null;

function makeQuestion(range: (typeof RANGES)[number], mode: Mode): Question {
  const n = randomNumber(range);
  const zh = toChinese(n);
  const options =
    mode === 'say'
      ? [zh, ...distractors(n, range.max)].sort(() => Math.random() - 0.5)
      : [];
  return { n, zh, options };
}

export function Drill() {
  const [mode, setMode] = useState<Mode>('read');
  const [rangeKey, setRangeKey] = useState<RangeKey>('99');
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [score, setScore] = useState({ right: 0, total: 0, streak: 0 });
  const [best, setBest] = useStoredPref('numbers-best-streak', '0');
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const range = RANGES.find((r) => r.key === rangeKey)!;

  const next = (m: Mode = mode, r = range) => {
    const q = makeQuestion(r, m);
    setQuestion(q);
    setAnswer('');
    setFeedback(null);
    if (m === 'listen') speak(q.zh);
  };

  useEffect(() => {
    if (!question) return;
    if (feedback) nextRef.current?.focus();
    else inputRef.current?.focus();
  }, [question, feedback]);

  const check = (given: string) => {
    if (!question || feedback) return;
    const correct =
      mode === 'say'
        ? sameChineseNumber(given, question.zh)
        : Number(given.replace(/[,\s]/g, '')) === question.n && given.trim() !== '';
    setFeedback({ correct, given });
    const streak = correct ? score.streak + 1 : 0;
    setScore({ right: score.right + (correct ? 1 : 0), total: score.total + 1, streak });
    if (streak > Number(best)) setBest(String(streak));
    if (mode !== 'listen' || !correct) speak(question.zh);
  };

  const restart = () => {
    setScore({ right: 0, total: 0, streak: 0 });
    next();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div role="radiogroup" aria-label="Practice mode" className="grid grid-cols-3 gap-1.5 sm:w-96">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              role="radio"
              aria-checked={mode === m.key}
              onClick={() => {
                setMode(m.key);
                if (question) next(m.key);
              }}
              className={`rounded-md border px-2 py-2 text-left transition-colors ${
                mode === m.key
                  ? 'border-primary bg-primary/10'
                  : 'border-border/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="block text-sm font-medium text-foreground">{m.label}</span>
              <span className="block text-[11px] leading-tight">{m.desc}</span>
            </button>
          ))}
        </div>
        <div role="radiogroup" aria-label="Number range" className="flex flex-wrap gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              role="radio"
              aria-checked={rangeKey === r.key}
              onClick={() => {
                setRangeKey(r.key);
                if (question) next(mode, r);
              }}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                rangeKey === r.key
                  ? 'border-primary bg-primary/10 font-medium'
                  : 'border-border/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {!question ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">
            {MODES.find((m) => m.key === mode)!.desc}. Ten in a row is a good target.
          </p>
          <Button size="lg" onClick={() => next()}>
            Start practice
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-border/70 bg-card p-6 text-center">
          <div className="mb-4 flex justify-between text-xs text-muted-foreground">
            <span>
              {score.right}/{score.total} correct
            </span>
            <span>
              Streak <span className="font-medium text-foreground">{score.streak}</span> · best {best}
            </span>
          </div>

          <div className="flex min-h-24 items-center justify-center">
            {mode === 'read' && (
              <span lang="zh-Hans" className="text-4xl font-medium sm:text-5xl">
                {question.zh}
              </span>
            )}
            {mode === 'listen' && (
              <Button variant="outline" size="lg" onClick={() => speak(question.zh)}>
                <Volume2 /> Play again
              </Button>
            )}
            {mode === 'say' && (
              <span className="font-mono text-5xl font-semibold tabular-nums">
                {question.n.toLocaleString('en-US')}
              </span>
            )}
          </div>

          {mode === 'say' ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {question.options.map((opt, i) => {
                const isAnswer = feedback && sameChineseNumber(opt, question.zh);
                const isWrongPick = feedback && !feedback.correct && opt === feedback.given;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={!!feedback}
                    onClick={() => check(opt)}
                    lang="zh-Hans"
                    className={`rounded-lg border px-3 py-3 text-xl transition-colors disabled:cursor-default ${
                      isAnswer
                        ? 'border-emerald-500/60 bg-emerald-500/10'
                        : isWrongPick
                          ? 'border-red-500/60 bg-red-500/10'
                          : 'border-border/70 hover:border-primary/60 hover:bg-muted/40'
                    }`}
                  >
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{i + 1}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <form
              className="mx-auto mt-5 flex max-w-sm gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                check(answer);
              }}
            >
              <Input
                ref={inputRef}
                inputMode="numeric"
                autoComplete="off"
                aria-label="Your answer in digits"
                placeholder="Type the number"
                value={answer}
                disabled={!!feedback}
                onChange={(e) => setAnswer(e.target.value)}
                className="h-11 font-mono text-lg"
              />
              <Button type="submit" className="h-11" disabled={!!feedback || answer.trim() === ''}>
                Check
              </Button>
            </form>
          )}

          {feedback && (
            <div
              role="status"
              className={`mt-5 rounded-lg border px-4 py-3 text-left ${
                feedback.correct
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-red-500/40 bg-red-500/10'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {feedback.correct ? <Check className="size-4" /> : <X className="size-4" />}
                {feedback.correct ? 'Correct!' : 'Not quite'}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
                <span className="font-mono tabular-nums">{question.n.toLocaleString('en-US')}</span>=
                <span lang="zh-Hans" className="text-lg">
                  {question.zh}
                </span>
                <span className="text-muted-foreground">{numberPinyin(question.zh)}</span>
                <AudioButton text={question.zh} />
              </div>
              {!feedback.correct && mode !== 'say' && feedback.given.trim() && (
                <div className="mt-1 text-xs text-muted-foreground">You answered {feedback.given}.</div>
              )}
            </div>
          )}

          <div className="mt-5 flex justify-center gap-2">
            {feedback && (
              <Button ref={nextRef} onClick={() => next()}>
                Next number
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={restart}>
              <RotateCcw /> Restart
            </Button>
          </div>
        </div>
      )}
      <SayShortcuts active={!!question && mode === 'say' && !feedback} onPick={(i) => question && check(question.options[i] ?? '')} />
    </div>
  );
}

/** 1–4 picks an option in "Say" mode. */
function SayShortcuts({ active, onPick }: { active: boolean; onPick: (i: number) => void }) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.repeat) return;
      const i = Number(e.key) - 1;
      if (i >= 0 && i < 4) onPick(i);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onPick]);
  return null;
}
