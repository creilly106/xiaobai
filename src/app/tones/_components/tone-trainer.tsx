'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, RotateCcw, Snail, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speak } from '@/lib/tts';
import { useStoredPref, useTtsSupported } from '@/lib/use-client';
import { TONE_BORDER, TONE_TEXT, type Tone } from '@/lib/pinyin';
import type { ToneDrillData, ToneGroup, TonePair, ToneSingle } from '@/lib/queries/tones';
import { ToneContour } from './tone-contour';

type Mode = 'single' | 'pairs' | 'apart';

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'single', label: 'Single tones', desc: 'Hear one syllable, name its tone' },
  { key: 'pairs', label: 'Tone pairs', desc: 'Hear a two-syllable word, name both tones' },
  { key: 'apart', label: 'Tell apart', desc: 'Same sound, different tones — which word was it?' },
];

type Question =
  | { kind: 'single'; item: ToneSingle }
  | { kind: 'pairs'; item: TonePair }
  | { kind: 'apart'; group: ToneGroup; target: ToneSingle };

type Feedback = { correct: boolean; picks: Tone[]; note?: string };

/** "heard>answered" → count */
type ConfusionStats = Record<string, number>;

const TONES_1_4: Tone[] = [1, 2, 3, 4];
const TONES_ALL: Tone[] = [1, 2, 3, 4, 5];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** Prefer vocabulary you're likely to meet (HSK words) three to one. */
function pickWeighted<T extends { hskLevel: number | null }>(list: T[]): T {
  const hsk = list.filter((i) => i.hskLevel != null);
  return hsk.length > 0 && Math.random() < 0.75 ? pick(hsk) : pick(list);
}

function toneAccuracy(stats: ConfusionStats, tone: Tone): { right: number; total: number } {
  let right = 0;
  let total = 0;
  for (const [key, n] of Object.entries(stats)) {
    const [heard, answered] = key.split('>').map(Number);
    if (heard !== tone) continue;
    total += n;
    if (answered === heard) right += n;
  }
  return { right, total };
}

function makeQuestion(mode: Mode, data: ToneDrillData, stats: ConfusionStats): Question {
  if (mode === 'pairs') return { kind: 'pairs', item: pickWeighted(data.pairs) };
  if (mode === 'apart') {
    const group = pick(data.groups);
    return { kind: 'apart', group, target: pick(group.items) };
  }
  // Practise weak tones more: weight each tone by how often you miss it.
  const weights = TONES_1_4.map((t) => {
    const { right, total } = toneAccuracy(stats, t);
    const miss = total === 0 ? 0.5 : 1 - right / total;
    return 1 + 3 * miss;
  });
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  let tone: Tone = 1;
  for (let i = 0; i < 4; i++) {
    r -= weights[i];
    if (r <= 0) {
      tone = TONES_1_4[i];
      break;
    }
  }
  const pool = data.singles.filter((s) => s.tone === tone);
  return { kind: 'single', item: pickWeighted(pool.length > 0 ? pool : data.singles) };
}

function audioText(q: Question): string {
  return q.kind === 'apart' ? q.target.hanzi : q.item.hanzi;
}

export function ToneTrainer({ data }: { data: ToneDrillData }) {
  const tts = useTtsSupported();
  const [mode, setMode] = useState<Mode>('single');
  const [question, setQuestion] = useState<Question | null>(null);
  const [picks, setPicks] = useState<Tone[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0, streak: 0 });
  const [best, setBest] = useStoredPref('tones-best-streak', '0');
  const [slowPref, setSlowPref] = useStoredPref('tones-slow', '0');
  const [statsRaw, setStatsRaw] = useStoredPref('tones-confusion', '{}');
  const slow = slowPref === '1';
  const nextRef = useRef<HTMLButtonElement>(null);

  const stats = useMemo<ConfusionStats>(() => {
    try {
      return JSON.parse(statsRaw) as ConfusionStats;
    } catch {
      return {};
    }
  }, [statsRaw]);

  const play = useCallback(
    (q: Question | null = question) => {
      if (q) speak(audioText(q), slow ? 0.55 : 0.85);
    },
    [question, slow],
  );

  const next = (m: Mode = mode) => {
    const q = makeQuestion(m, data, stats);
    setQuestion(q);
    setPicks([]);
    setFeedback(null);
    play(q);
  };

  const record = (pairs: [Tone, Tone][]) => {
    const updated = { ...stats };
    for (const [heard, answered] of pairs) {
      const key = `${heard}>${answered}`;
      updated[key] = (updated[key] ?? 0) + 1;
    }
    setStatsRaw(JSON.stringify(updated));
  };

  const grade = (correct: boolean, answer: Tone[], note?: string) => {
    setFeedback({ correct, picks: answer, note });
    const streak = correct ? score.streak + 1 : 0;
    setScore({ right: score.right + (correct ? 1 : 0), total: score.total + 1, streak });
    if (streak > Number(best)) setBest(String(streak));
  };

  const answer = (tone: Tone) => {
    if (!question || feedback) return;
    if (question.kind === 'single') {
      record([[question.item.tone, tone]]);
      grade(tone === question.item.tone, [tone]);
      return;
    }
    if (question.kind === 'pairs') {
      const nextPicks = [...picks, tone];
      if (nextPicks.length < 2) {
        if (tone === 5) return; // first syllable is never neutral here
        setPicks(nextPicks);
        return;
      }
      setPicks(nextPicks);
      const { heard, written } = question.item;
      record([
        [heard[0], nextPicks[0]],
        [heard[1], nextPicks[1]],
      ]);
      const matchesHeard = nextPicks[0] === heard[0] && nextPicks[1] === heard[1];
      const matchesWritten = nextPicks[0] === written[0] && nextPicks[1] === written[1];
      const sandhi = heard[0] !== written[0];
      grade(
        matchesHeard || matchesWritten,
        nextPicks,
        sandhi
          ? matchesWritten && !matchesHeard
            ? 'Right on paper — but two 3rd tones in a row are spoken as 2nd + 3rd, so what you hear is rising then dipping.'
            : 'Written as 3rd + 3rd, spoken as 2nd + 3rd: the first of two 3rd tones rises.'
          : undefined,
      );
    }
  };

  const chooseWord = (item: ToneSingle) => {
    if (!question || question.kind !== 'apart' || feedback) return;
    record([[question.target.tone, item.tone]]);
    grade(item.hanzi === question.target.hanzi, [item.tone]);
  };

  useEffect(() => {
    if (feedback) nextRef.current?.focus();
  }, [feedback]);

  // Keyboard: digits answer, R or Space replays, Backspace undoes a pair pick.
  useEffect(() => {
    if (!question) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'r' || (k === ' ' && !feedback)) {
        e.preventDefault();
        play();
        return;
      }
      if (feedback) return;
      if (k === 'backspace' && picks.length > 0) {
        setPicks([]);
        return;
      }
      const n = Number(k);
      if (!Number.isInteger(n) || n < 1) return;
      if (question.kind === 'apart') {
        const item = question.group.items[n - 1];
        if (item) chooseWord(item);
      } else if (n <= (question.kind === 'pairs' ? 5 : 4)) {
        answer(n as Tone);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!tts) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        The tone trainer needs your browser&apos;s text-to-speech with a Chinese
        voice. Chrome and Edge include one; on Windows you can also add
        &ldquo;Chinese (Simplified)&rdquo; under Settings → Time &amp; language → Speech.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div role="radiogroup" aria-label="Drill type" className="grid grid-cols-3 gap-1.5 sm:max-w-xl sm:flex-1">
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
                mode === m.key ? 'border-primary bg-primary/10' : 'border-border/70 text-muted-foreground hover:bg-muted'
              }`}
            >
              <span className="block text-sm font-medium text-foreground">{m.label}</span>
              <span className="block text-[11px] leading-tight">{m.desc}</span>
            </button>
          ))}
        </div>
        <Button
          variant={slow ? 'secondary' : 'ghost'}
          size="sm"
          aria-pressed={slow}
          onClick={() => setSlowPref(slow ? '0' : '1')}
          title="Play audio more slowly"
        >
          <Snail /> Slow audio {slow ? 'on' : 'off'}
        </Button>
      </div>

      {!question ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-10 text-center">
          <p className="max-w-md text-sm text-muted-foreground">
            {MODES.find((m) => m.key === mode)!.desc}. Use headphones if you can —
            the difference between 2nd and 3rd tone is subtle at first.
          </p>
          <Button size="lg" onClick={() => next()}>
            <Volume2 /> Start listening
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-border/70 bg-card p-5 sm:p-6">
          <div className="mb-4 flex justify-between text-xs text-muted-foreground">
            <span>
              {score.right}/{score.total} correct
            </span>
            <span>
              Streak <span className="font-medium text-foreground">{score.streak}</span> · best {best}
            </span>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="lg" onClick={() => play()} aria-keyshortcuts="R">
              <Volume2 /> Play again
              <span className="font-mono text-xs opacity-60 pointer-coarse:hidden">R</span>
            </Button>
          </div>

          {question.kind === 'apart' ? (
            <ApartOptions question={question} feedback={feedback} onChoose={chooseWord} />
          ) : (
            <div className="mt-6 space-y-3">
              {(question.kind === 'pairs' ? [0, 1] : [0]).map((slot) => {
                const tones = question.kind === 'pairs' && slot === 1 ? TONES_ALL : TONES_1_4;
                const active = !feedback && picks.length === slot;
                const chosen = feedback ? feedback.picks[slot] : picks[slot];
                const correctTone =
                  question.kind === 'pairs' ? question.item.heard[slot] : question.item.tone;
                return (
                  <div key={slot}>
                    {question.kind === 'pairs' && (
                      <div className={`mb-1.5 text-xs ${active ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {slot === 0 ? '1st syllable' : '2nd syllable'}
                      </div>
                    )}
                    <div className={`grid gap-2 ${tones.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}`}>
                      {tones.map((t) => {
                        const isChosen = chosen === t;
                        const isAnswer = feedback && t === correctTone;
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={!!feedback || (question.kind === 'pairs' && picks.length !== slot)}
                            onClick={() => answer(t)}
                            className={`flex flex-col items-center gap-0.5 rounded-lg border py-3 transition-colors disabled:cursor-default ${
                              isAnswer
                                ? 'border-emerald-500/70 bg-emerald-500/15'
                                : feedback && isChosen
                                  ? 'border-red-500/70 bg-red-500/15'
                                  : isChosen
                                    ? TONE_BORDER[t]
                                    : 'border-border/70 hover:bg-muted/50 disabled:opacity-60'
                            }`}
                          >
                            <span className={TONE_TEXT[t]}>
                              <ToneContour tone={t} className="h-6 w-10" />
                            </span>
                            <span className="text-sm font-medium">{t === 5 ? 'Neutral' : `Tone ${t}`}</span>
                            <span className="font-mono text-[11px] text-muted-foreground pointer-coarse:hidden">{t}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {feedback && <Reveal question={question} feedback={feedback} />}

          <div className="mt-5 flex justify-center gap-2">
            {feedback && (
              <Button ref={nextRef} onClick={() => next()}>
                Next
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setScore({ right: 0, total: 0, streak: 0 });
                next();
              }}
            >
              <RotateCcw /> Restart
            </Button>
          </div>
        </div>
      )}

      <ToneStats stats={stats} onReset={() => setStatsRaw('{}')} />
    </div>
  );
}

function ColoredPinyin({ syllables, tones }: { syllables: string[]; tones: Tone[] }) {
  return (
    <span className="font-medium">
      {syllables.map((s, i) => (
        <span key={i} className={TONE_TEXT[tones[i]]}>
          {s}
        </span>
      ))}
    </span>
  );
}

function ApartOptions({
  question,
  feedback,
  onChoose,
}: {
  question: Extract<Question, { kind: 'apart' }>;
  feedback: Feedback | null;
  onChoose: (item: ToneSingle) => void;
}) {
  return (
    <div className={`mt-6 grid gap-2 ${question.group.items.length > 2 ? 'sm:grid-cols-2' : 'grid-cols-2'}`}>
      {question.group.items.map((item, i) => {
        const isTarget = item.hanzi === question.target.hanzi;
        const picked = feedback && feedback.picks[0] === item.tone;
        return (
          <button
            key={item.hanzi}
            type="button"
            disabled={!!feedback}
            onClick={() => onChoose(item)}
            className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors disabled:cursor-default ${
              feedback && isTarget
                ? 'border-emerald-500/70 bg-emerald-500/15'
                : picked
                  ? 'border-red-500/70 bg-red-500/15'
                  : 'border-border/70 hover:border-primary/60 hover:bg-muted/40'
            }`}
          >
            <span className="font-mono text-xs text-muted-foreground pointer-coarse:hidden">{i + 1}</span>
            <span lang="zh-Hans" className="text-3xl">
              {item.hanzi}
            </span>
            <span className="min-w-0">
              <span className={`block font-medium ${TONE_TEXT[item.tone]}`}>{item.pinyin}</span>
              <span className="block truncate text-xs text-muted-foreground">{item.meaning}</span>
            </span>
            <span className={`ml-auto ${TONE_TEXT[item.tone]}`}>
              <ToneContour tone={item.tone} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Reveal({ question, feedback }: { question: Question; feedback: Feedback }) {
  const item = question.kind === 'apart' ? question.target : question.item;
  return (
    <div
      role="status"
      className={`mt-5 rounded-lg border px-4 py-3 ${
        feedback.correct ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-red-500/40 bg-red-500/10'
      }`}
    >
      <div className="flex items-center gap-2 font-medium">
        {feedback.correct ? <Check className="size-4" /> : <X className="size-4" />}
        {feedback.correct ? 'Correct!' : 'Not quite'}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span lang="zh-Hans" className="text-2xl">
          {item.hanzi}
        </span>
        {question.kind === 'pairs' ? (
          <ColoredPinyin syllables={question.item.syllables} tones={question.item.written} />
        ) : (
          <ColoredPinyin syllables={[item.pinyin]} tones={[question.kind === 'apart' ? question.target.tone : question.item.tone]} />
        )}
        <span className="text-sm text-muted-foreground">{item.meaning}</span>
      </div>
      {feedback.note && <p className="mt-2 text-sm">{feedback.note}</p>}
    </div>
  );
}

function ToneStats({ stats, onReset }: { stats: ConfusionStats; onReset: () => void }) {
  const rows = TONES_ALL.map((t) => ({ tone: t, ...toneAccuracy(stats, t) })).filter(
    (r) => r.tone !== 5 || r.total > 0,
  );
  const total = rows.reduce((a, r) => a + r.total, 0);
  if (total === 0) return null;

  let worst: { heard: number; answered: number; n: number } | null = null;
  for (const [key, n] of Object.entries(stats)) {
    const [heard, answered] = key.split('>').map(Number);
    if (heard !== answered && (!worst || n > worst.n)) worst = { heard, answered, n };
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">Your ears so far</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset stats
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {rows.map((r) => {
          const pct = r.total === 0 ? null : Math.round((r.right / r.total) * 100);
          return (
            <div key={r.tone} className="rounded-lg border border-border/60 px-3 py-2">
              <div className={`flex items-center justify-between text-xs font-medium ${TONE_TEXT[r.tone]}`}>
                {r.tone === 5 ? 'Neutral' : `Tone ${r.tone}`}
                <ToneContour tone={r.tone} className="h-4 w-6" />
              </div>
              <div className="mt-1 text-xl font-semibold tabular-nums">{pct == null ? '—' : `${pct}%`}</div>
              <div className="text-[11px] text-muted-foreground">
                {r.right}/{r.total} heard right
              </div>
            </div>
          );
        })}
      </div>
      {worst && (
        <p className="mt-3 text-sm text-muted-foreground">
          Most common mix-up: hearing{' '}
          <span className={`font-medium ${TONE_TEXT[worst.heard as Tone]}`}>
            {worst.heard === 5 ? 'neutral' : `tone ${worst.heard}`}
          </span>{' '}
          as{' '}
          <span className={`font-medium ${TONE_TEXT[worst.answered as Tone]}`}>
            {worst.answered === 5 ? 'neutral' : `tone ${worst.answered}`}
          </span>{' '}
          ({worst.n}×). Single tones practise your weakest tones more often.
        </p>
      )}
    </div>
  );
}
