import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ForecastDay } from '@/lib/forecast';
import type { WordsKnown } from '@/lib/queries/progress';

function dayLabel(date: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tmrw';
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en', { weekday: 'short' });
}

/** Next week's workload next to how many words you actually know. */
export function ForecastCard({ forecast, words }: { forecast: ForecastDay[]; words: WordsKnown }) {
  const max = Math.max(1, ...forecast.map((d) => d.count));
  const total = forecast.reduce((a, d) => a + d.count, 0);
  const knownPct = words.library ? Math.round((words.known / words.library) * 100) : 0;
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Coming up — next 7 days</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex h-32 items-end gap-2"
            role="img"
            aria-label={`${total} reviews due this week`}
          >
            {forecast.map((d, i) => (
              <div
                key={d.date}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <span className="text-xs tabular-nums text-muted-foreground">{d.count || ''}</span>
                <div
                  className={`w-full rounded-t ${i === 0 ? 'bg-primary' : 'bg-primary/40'}`}
                  style={{ height: `${Math.max(d.count ? 6 : 2, (d.count / max) * 100)}%` }}
                />
                <span className="text-[11px] text-muted-foreground">{dayLabel(d.date, i)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {total} review{total === 1 ? '' : 's'} due this week, not counting new cards. Today
            includes anything overdue.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Words you know</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-semibold tabular-nums">{words.known}</div>
          <div className="h-2 w-full overflow-hidden rounded bg-muted">
            <div className="h-full rounded bg-primary" style={{ width: `${knownPct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">
            {knownPct}% of the {words.library} words in your library have graduated to long-term
            review. {words.mature} are mature (interval of 3+ weeks).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
