import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pinyin } from '@/components/pinyin';
import { TONE_TEXT, type Tone } from '@/lib/pinyin';
import type { PracticeSummary } from '@/lib/queries/practice';

const KIND_LABEL = {
  cloze: { label: 'Fill in the blank', href: '/quiz' },
  quiz: { label: 'Quiz flashcards', href: '/quiz' },
  tone: { label: 'Tone trainer', href: '/tones' },
  number: { label: 'Numbers drill', href: '/numbers' },
} as const;

function pct(right: number, total: number) {
  return total === 0 ? null : Math.round((right / total) * 100);
}

const toneName = (t: number) => (t === 5 ? 'neutral' : `tone ${t}`);

/** Results from the drills outside Study: accuracy, tone ear, words to revisit. */
export function PracticeCard({ summary }: { summary: PracticeSummary }) {
  const kinds = (Object.keys(KIND_LABEL) as (keyof typeof KIND_LABEL)[]).filter(
    (k) => summary.byKind[k].total > 0,
  );
  if (kinds.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Practice — last {summary.days} days</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nothing yet. Results from fill in the blank, quizzes, the tone trainer and the numbers
            drill show up here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Practice — last {summary.days} days</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {kinds.map((k) => {
            const { right, total } = summary.byKind[k];
            return (
              <Link
                key={k}
                href={KIND_LABEL[k].href}
                className="rounded-lg border border-border/60 px-3 py-2 transition-colors hover:border-primary/60"
              >
                <div className="text-xs text-muted-foreground">{KIND_LABEL[k].label}</div>
                <div className="text-xl font-semibold tabular-nums">{pct(right, total)}%</div>
                <div className="text-[11px] text-muted-foreground">
                  {right}/{total} correct
                </div>
              </Link>
            );
          })}
        </div>

        {summary.tones.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Your ear, by tone
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.tones.map((t) => (
                <div
                  key={t.tone}
                  className="rounded-md border border-border/60 px-3 py-1.5 text-sm"
                >
                  <span className={`font-medium ${TONE_TEXT[t.tone as Tone] ?? ''}`}>
                    {toneName(t.tone)}
                  </span>{' '}
                  <span className="tabular-nums">{pct(t.right, t.total)}%</span>{' '}
                  <span className="text-xs text-muted-foreground">({t.total})</span>
                </div>
              ))}
            </div>
            {summary.worstTone && (
              <p className="mt-2 text-xs text-muted-foreground">
                Most common mix-up: hearing {toneName(summary.worstTone.heard)} as{' '}
                {toneName(summary.worstTone.answered)} ({summary.worstTone.count}×).
              </p>
            )}
          </div>
        )}

        {summary.toRevisit.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Missed in practice — last 14 days
            </div>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {summary.toRevisit.map((w) => (
                <li key={w.hanzi}>
                  <Link
                    href={`/characters/${encodeURIComponent(w.hanzi)}`}
                    className="flex items-baseline gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted/50"
                  >
                    <span lang="zh-Hans" className="text-lg">
                      {w.hanzi}
                    </span>
                    <Pinyin text={w.pinyin} className="text-sm text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-sm">{w.meaning}</span>
                    <span className="text-xs text-muted-foreground">×{w.misses}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Words you already review long-term are brought forward to tomorrow when you miss them.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
