import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BarChart3, BookOpen, Flame, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getCardsByState,
  getHeatmap,
  getRatingDistribution,
  getStatsSummary,
} from '@/lib/queries/stats';
import { Heatmap } from './_components/heatmap';
import { ResetReviewsButton } from './_components/reset-button';
import { PracticeCard } from './_components/practice-card';
import { getPracticeSummary } from '@/lib/queries/practice';

export const metadata: Metadata = { title: 'Stats' };

export default async function StatsPage() {
  const [summary, heatmap, ratings, cardsByState, practice] = await Promise.all([
    getStatsSummary(),
    getHeatmap(84),
    getRatingDistribution(30),
    getCardsByState(),
    getPracticeSummary(30),
  ]);

  const totalRatings = ratings.reduce((a, r) => a + r.count, 0);
  const retentionPct = summary.retention30d == null ? null : Math.round(summary.retention30d * 100);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Stats</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The numbers that predict fluency progress, not vanity metrics.
          </p>
        </div>
        <ResetReviewsButton />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BarChart3 className="size-4" />}
          label="Total reviews"
          value={summary.totalReviews}
          hint="All-time reviews recorded."
        />
        <StatCard
          icon={<BookOpen className="size-4" />}
          label="Active cards"
          value={summary.activeCards}
          hint="Words and sentences you've started learning."
        />
        <StatCard
          icon={<Target className="size-4" />}
          label="30-day retention"
          value={retentionPct == null ? '—' : `${retentionPct}%`}
          hint="Share of reviews you recalled — Hard / Good / Easy count, Again does not."
          accent={
            retentionPct != null
              ? retentionPct >= 85
                ? 'good'
                : retentionPct >= 70
                  ? 'okay'
                  : 'bad'
              : undefined
          }
        />
        <StatCard
          icon={<Flame className="size-4" />}
          label="Streak"
          value={`${summary.streakDays}d`}
          hint={
            summary.streakDays === 0
              ? 'Start today to begin a streak.'
              : summary.streakDays === 1
                ? 'Come back tomorrow to grow it.'
                : `${summary.streakDays} day streak going. Keep it up.`
          }
          accent={summary.streakDays >= 1 ? 'streak' : undefined}
        />
      </div>

      <Card className="mt-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity — last 12 weeks</CardTitle>
        </CardHeader>
        <CardContent>
          <Heatmap days={heatmap} />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rating mix — last 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            {totalRatings === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reviews yet. Rate a card in study or grade one in a quiz.
              </p>
            ) : (
              <div className="space-y-3">
                {ratings.map((r) => {
                  const pct = totalRatings ? Math.round((r.count / totalRatings) * 100) : 0;
                  const labels = {
                    1: 'Again',
                    2: 'Hard',
                    3: 'Good',
                    4: 'Easy',
                  } as const;
                  const colors = {
                    1: 'bg-red-500/60',
                    2: 'bg-amber-500/60',
                    3: 'bg-emerald-500/60',
                    4: 'bg-sky-500/60',
                  } as const;
                  return (
                    <div key={r.rating}>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{labels[r.rating]}</span>
                        <span className="tabular-nums">
                          {r.count} · {pct}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded bg-muted">
                        <div
                          className={`h-full rounded ${colors[r.rating]} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="pt-2 text-xs text-muted-foreground">
                  Retention = anything but Again, over total reviews.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cards by state</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <StateRow label="New" value={cardsByState.new} hint="Not seen yet" />
              <StateRow
                label="Learning"
                value={cardsByState.learning}
                hint="In initial short-interval steps"
              />
              <StateRow
                label="Review"
                value={cardsByState.review}
                hint="Graduated, scheduled long-term"
              />
              <StateRow
                label="Relearning"
                value={cardsByState.relearning}
                hint="Failed a review, being re-taught"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <PracticeCard summary={practice} />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  hint: string;
  accent?: 'good' | 'okay' | 'bad' | 'streak';
}) {
  const accentClass =
    accent === 'good'
      ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
      : accent === 'okay'
        ? 'border-amber-500/40 ring-1 ring-amber-500/20'
        : accent === 'bad'
          ? 'border-red-500/40 ring-1 ring-red-500/20'
          : accent === 'streak'
            ? 'border-amber-500/40 ring-1 ring-amber-500/20'
            : '';
  return (
    <Card className={accentClass}>
      <CardHeader className="pb-1.5">
        <CardTitle className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex text-foreground/70">{icon}</span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function StateRow({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-md border border-border/60 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}</span>
      </div>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p>
    </div>
  );
}
