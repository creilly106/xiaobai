import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  BookOpenText,
  Dices,
  Hash,
  Languages,
  MessagesSquare,
  Puzzle,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getDashboardStats } from '@/lib/queries/dashboard';
import { NextDue } from '@/components/next-due';
import { getPath } from '@/lib/queries/path';
import { userTimeZone } from '@/lib/timezone';
import { StatTile, QueueTile } from './_components/stat-tiles';

const EXPLORE = [
  {
    href: '/scenarios',
    label: 'Scenarios',
    desc: 'Real-life phrase packs',
    icon: MessagesSquare,
  },
  { href: '/quiz', label: 'Quiz', desc: 'Custom practice drills', icon: Dices },
  { href: '/tones', label: 'Tones', desc: 'Train your ear', icon: AudioLines },
  { href: '/numbers', label: 'Numbers', desc: 'Count, read and hear them', icon: Hash },
  {
    href: '/grammar',
    label: 'Grammar',
    desc: 'How sentences are built',
    icon: Languages,
  },
  {
    href: '/radicals',
    label: 'Radicals',
    desc: 'Building blocks of hanzi',
    icon: Puzzle,
  },
  {
    href: '/library',
    label: 'Library',
    desc: 'Every word, searchable',
    icon: BookOpenText,
  },
] as const;

export default async function Home() {
  const [stats, path] = await Promise.all([getDashboardStats(), getPath()]);
  const a = stats.availability;
  const hasCards = stats.totalCards > 0;
  const weekday = new Date().toLocaleDateString('en', {
    weekday: 'long',
    timeZone: await userTimeZone(),
  });
  const newUsedToday = stats.dailyNewLimit - a.newRemainingToday;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          <span lang="zh-Hans">你好</span>
          <span className="text-muted-foreground"> · {weekday}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          {!hasCards
            ? 'Start with your first lesson.'
            : a.totalDue > 0
              ? 'Reviews are ready — and your next lesson is waiting.'
              : 'Reviews are done for now. Time for a lesson?'}
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card className="border-2 border-primary/40 bg-primary/5">
          <CardContent className="flex h-full flex-col gap-4 p-6">
            <div className="flex-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Learn · {path.finished} / {path.total} lessons
              </div>
              {path.current ? (
                <>
                  <div className="mt-1 text-2xl font-semibold">{path.current.title}</div>
                  <div className="text-sm text-muted-foreground">{path.current.unitTitle}</div>
                </>
              ) : (
                <div className="mt-1 text-2xl font-semibold">Path complete for now</div>
              )}
            </div>
            <Link
              href={path.current ? `/learn/${path.current.id}` : '/learn'}
              className={buttonVariants({ size: 'lg', className: 'self-start px-6' })}
            >
              {path.finished === 0 ? 'Start learning' : path.current ? 'Continue' : 'View path'}
              <ArrowRight />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardContent className="flex h-full flex-col gap-4 p-6">
            <div className="flex-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Review
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tabular-nums">{a.totalDue}</span>
                <span className="text-muted-foreground">
                  card{a.totalDue === 1 ? '' : 's'} ready
                </span>
              </div>
              {hasCards ? (
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Pill>{a.learningDue} learning</Pill>
                  <Pill>{a.reviewDue} review</Pill>
                  {a.newAvailable > 0 && (
                    <Pill>
                      {a.newAvailable} new · {newUsedToday}/{stats.dailyNewLimit} introduced today
                    </Pill>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Words from your lessons come back here to review.
                </p>
              )}
              {stats.dailyGoal > 0 && hasCards && (
                <GoalBar done={stats.reviewsToday} goal={stats.dailyGoal} />
              )}
            </div>
            {a.totalDue > 0 ? (
              <Link
                href="/study"
                className={buttonVariants({
                  size: 'lg',
                  variant: 'outline',
                  className: 'self-start px-6',
                })}
              >
                Start review
              </Link>
            ) : (
              hasCards && (
                <div className="text-sm text-muted-foreground">
                  {a.reviewLimitHit ? (
                    "Today's review limit is reached."
                  ) : a.nextDueInMs != null ? (
                    <NextDue inMs={a.nextDueInMs} count={a.nextDueCount} />
                  ) : (
                    'Nothing scheduled.'
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile
          label="Streak"
          value={`${stats.streakDays} day${stats.streakDays === 1 ? '' : 's'}`}
          streak={stats.streakDays >= 1}
          delay={0}
        />
        <StatTile label="Reviews today" value={stats.reviewsToday} delay={0.05} />
        <StatTile label="Cards in queue" value={stats.totalCards} delay={0.1} />
        <StatTile label="Words in library" value={stats.totalWords} delay={0.15} />
      </div>

      {hasCards && (
        <>
          <h2 className="mb-3 mt-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your queue
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <QueueTile label="Not started" value={stats.newCards} delay={0.2} />
            <QueueTile label="Learning" value={stats.learningCards} delay={0.25} />
            <QueueTile label="Long-term review" value={stats.reviewCards} delay={0.3} />
          </div>
        </>
      )}

      <h2 className="mb-3 mt-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Explore
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {EXPLORE.map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardContent className="flex flex-col gap-2 p-4">
                <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                <div className="font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Progress toward today's review goal (set in Settings). */
function GoalBar({ done, goal }: { done: number; goal: number }) {
  const pct = Math.min(100, Math.round((done / goal) * 100));
  const met = done >= goal;
  return (
    <div className="mt-4 max-w-sm">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{met ? "Today's goal met" : "Today's goal"}</span>
        <span className="tabular-nums">
          {done} / {goal} reviews
        </span>
      </div>
      <div
        className="mt-1 h-2 w-full overflow-hidden rounded bg-muted"
        role="progressbar"
        aria-valuenow={done}
        aria-valuemax={goal}
        aria-label="Daily goal"
      >
        <div
          className={`h-full rounded transition-all ${met ? 'bg-emerald-500' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-muted-foreground">
      {children}
    </span>
  );
}
