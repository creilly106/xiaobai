import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { POINTS, pointsToGo, type DayTally } from '@/lib/goal';
import type { GoalProgress } from '@/lib/queries/goal';

/** A progress ring; `size` in px. */
function Ring({
  value,
  max,
  size,
  stroke,
  className,
  children,
}: {
  value: number;
  max: number;
  size: number;
  stroke: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const frac = max > 0 ? Math.min(1, value / max) : 0;
  const met = max > 0 && value >= max;
  return (
    <div className={`relative shrink-0 ${className ?? ''}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        {frac > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * frac} ${c}`}
            className={met ? 'stroke-emerald-500' : 'stroke-primary'}
          />
        )}
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  );
}

const weekday = (key: string) =>
  new Date(`${key}T12:00:00Z`).toLocaleDateString('en', { weekday: 'narrow', timeZone: 'UTC' });

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

/** What earned today's points ("12 reviews · 1 lesson"). */
function breakdown(day: DayTally): string {
  const parts = [
    day.lessons && plural(day.lessons, 'lesson'),
    day.reviews && plural(day.reviews, 'review'),
    day.practice && `${day.practice} practice`,
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : 'Nothing yet today';
}

/** Today's points toward the daily goal, with the last week at a glance. */
export function TodayGoal({ progress }: { progress: GoalProgress }) {
  const { goal, today, week } = progress;
  const left = pointsToGo(goal, today.points);
  const lessonsLeft = Math.ceil(left / POINTS.lesson);
  return (
    <Card className="mb-6">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Ring value={today.points} max={goal} size={80} stroke={9}>
            <div className="text-center leading-tight">
              <div className="text-xl font-semibold tabular-nums">{today.points}</div>
              <div className="text-[10px] text-muted-foreground">of {goal}</div>
            </div>
          </Ring>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Today&apos;s goal
            </div>
            <div className="mt-0.5 font-medium">
              {left === 0
                ? 'Goal met — nice work.'
                : `${left} point${left === 1 ? '' : 's'} to go — about ${plural(lessonsLeft, 'lesson')} or ${plural(left, 'review')}.`}
            </div>
            <div className="text-sm text-muted-foreground">
              {breakdown(today)} ·{' '}
              <Link href="/settings" className="underline-offset-4 hover:underline">
                change goal
              </Link>
            </div>
          </div>
        </div>
        <ol
          className="flex justify-between gap-1.5 sm:justify-start"
          aria-label="The last seven days"
        >
          {week.map((day, i) => {
            const met = day.points >= goal;
            const isToday = i === week.length - 1;
            return (
              <li
                key={day.key}
                className="flex flex-col items-center gap-0.5"
                title={`${day.key}: ${day.points} points`}
              >
                <Ring value={day.points} max={goal} size={26} stroke={4}>
                  {met && <span className="size-2 rounded-full bg-emerald-500" />}
                </Ring>
                <span
                  className={`text-[10px] ${isToday ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                >
                  {weekday(day.key)}
                </span>
                <span className="sr-only">
                  {met ? 'goal met' : `${day.points} of ${goal} points`}
                </span>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
