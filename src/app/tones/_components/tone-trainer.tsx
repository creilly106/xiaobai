'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Snail, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speak } from '@/lib/tts';
import { useStoredPref, useTtsSupported } from '@/lib/use-client';
import { trackPractice } from '@/lib/track-practice';
import { TONE_BORDER, TONE_TEXT, type Tone } from '@/lib/pinyin';
import type { ToneDrillData, ToneSingle } from '@/lib/queries/tones';
import { ToneContour } from './tone-contour';

import { ApartOptions, Reveal, ToneStats } from './tone-parts';
import {
  MODES,
  TONES_1_4,
  TONES_ALL,
  audioText,
  makeQuestion,
  type ConfusionStats,
  type Feedback,
  type Mode,
  type Question,
} from '@/lib/tone-drill';

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
    if (question) {
      const heard =
        question.kind === 'pairs'
          ? question.item.heard
          : question.kind === 'single'
            ? [question.item.tone]
            : [question.target.tone];
      trackPractice({
        kind: 'tone',
        item: question.kind === 'apart' ? question.target.hanzi : question.item.hanzi,
        correct,
        detail: { mode: question.kind, heard, answered: answer },
      });
    }
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
      if (e.target instanceof HTMLInputElement || e.repeat || e.ctrlKey || e.metaKey || e.altKey)
        return;
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
        The tone trainer needs your browser&apos;s text-to-speech with a Chinese voice. Chrome and
        Edge include one; on Windows you can also add &ldquo;Chinese (Simplified)&rdquo; under
        Settings → Time &amp; language → Speech.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div
          role="radiogroup"
          aria-label="Drill type"
          className="grid grid-cols-3 gap-1.5 sm:max-w-xl sm:flex-1"
        >
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
            {MODES.find((m) => m.key === mode)!.desc}. Use headphones if you can — the difference
            between 2nd and 3rd tone is subtle at first.
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
              Streak <span className="font-medium text-foreground">{score.streak}</span> · best{' '}
              {best}
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
                      <div
                        className={`mb-1.5 text-xs ${active ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                      >
                        {slot === 0 ? '1st syllable' : '2nd syllable'}
                      </div>
                    )}
                    <div
                      className={`grid gap-2 ${tones.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}`}
                    >
                      {tones.map((t) => {
                        const isChosen = chosen === t;
                        const isAnswer = feedback && t === correctTone;
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={
                              !!feedback || (question.kind === 'pairs' && picks.length !== slot)
                            }
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
                            <span className="text-sm font-medium">
                              {t === 5 ? 'Neutral' : `Tone ${t}`}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground pointer-coarse:hidden">
                              {t}
                            </span>
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
