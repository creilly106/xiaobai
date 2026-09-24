'use client';

import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TONE_TEXT, type Tone } from '@/lib/pinyin';
import type { ToneSingle } from '@/lib/queries/tones';
import {
  TONES_ALL,
  toneAccuracy,
  type ConfusionStats,
  type Feedback,
  type Question,
} from '@/lib/tone-drill';
import { ToneContour } from './tone-contour';

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

export function ApartOptions({
  question,
  feedback,
  onChoose,
}: {
  question: Extract<Question, { kind: 'apart' }>;
  feedback: Feedback | null;
  onChoose: (item: ToneSingle) => void;
}) {
  return (
    <div
      className={`mt-6 grid gap-2 ${question.group.items.length > 2 ? 'sm:grid-cols-2' : 'grid-cols-2'}`}
    >
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
            <span className="font-mono text-xs text-muted-foreground pointer-coarse:hidden">
              {i + 1}
            </span>
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

export function Reveal({ question, feedback }: { question: Question; feedback: Feedback }) {
  const item = question.kind === 'apart' ? question.target : question.item;
  return (
    <div
      role="status"
      className={`mt-5 rounded-lg border px-4 py-3 ${
        feedback.correct
          ? 'border-emerald-500/40 bg-emerald-500/10'
          : 'border-red-500/40 bg-red-500/10'
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
          <ColoredPinyin
            syllables={[item.pinyin]}
            tones={[question.kind === 'apart' ? question.target.tone : question.item.tone]}
          />
        )}
        <span className="text-sm text-muted-foreground">{item.meaning}</span>
      </div>
      {feedback.note && <p className="mt-2 text-sm">{feedback.note}</p>}
    </div>
  );
}

export function ToneStats({ stats, onReset }: { stats: ConfusionStats; onReset: () => void }) {
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
              <div
                className={`flex items-center justify-between text-xs font-medium ${TONE_TEXT[r.tone]}`}
              >
                {r.tone === 5 ? 'Neutral' : `Tone ${r.tone}`}
                <ToneContour tone={r.tone} className="h-4 w-6" />
              </div>
              <div className="mt-1 text-xl font-semibold tabular-nums">
                {pct == null ? '—' : `${pct}%`}
              </div>
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
