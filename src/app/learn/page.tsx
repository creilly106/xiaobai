import Link from 'next/link';
import { ArrowRight, CircleCheck, CirclePlay, FastForward, Lock, BookCheck } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { grammarPoints } from '@/lib/grammar-data';
import { getPath, type LessonState, type PathUnitView } from '@/lib/queries/path';

export const metadata = { title: 'Learn' };

const STATE: Record<LessonState, { icon: typeof Lock; label: string; className: string }> = {
  done: { icon: CircleCheck, label: 'Done', className: 'text-emerald-600 dark:text-emerald-400' },
  tested: { icon: FastForward, label: 'Tested out', className: 'text-sky-600 dark:text-sky-400' },
  known: { icon: BookCheck, label: 'Already known', className: 'text-sky-600 dark:text-sky-400' },
  current: { icon: CirclePlay, label: 'Up next', className: 'text-primary' },
  locked: { icon: Lock, label: 'Locked', className: 'text-muted-foreground/60' },
};

const grammarName = (slug: string | null) =>
  slug ? grammarPoints.find((g) => g.slug === slug)?.englishTitle : undefined;

export default async function LearnPage() {
  const path = await getPath();
  const currentUnit = path.units.find((u) => u.lessons.some((l) => l.state === 'current'));
  const currentLesson = currentUnit?.lessons.find((l) => l.state === 'current');

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Learn</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Short lessons in HSK order. Each teaches a few words and a grammar point, then puts them
        into your reviews.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <Progress
          value={(path.finished / path.total) * 100}
          className="flex-1"
          aria-label="Path progress"
        />
        <span className="text-sm tabular-nums text-muted-foreground">
          {path.finished} / {path.total} lessons
        </span>
      </div>

      {currentLesson && currentUnit ? (
        <Card className="mt-6 border-2 border-primary/40 bg-primary/5">
          <CardContent className="flex flex-wrap items-center gap-4 py-5">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Up next · {currentUnit.title}
              </div>
              <div className="mt-0.5 text-xl font-semibold">{currentLesson.title}</div>
              <div lang="zh-Hans" className="mt-1 text-lg text-muted-foreground">
                {currentLesson.words.join(' · ')}
              </div>
              {currentLesson.grammar && (
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Grammar: {grammarName(currentLesson.grammar)}
                </div>
              )}
            </div>
            <Link href={`/learn/${currentLesson.id}`} className={buttonVariants({ size: 'lg' })}>
              {currentUnit.lessons[0].id === currentLesson.id && currentUnit.finished === 0
                ? 'Start'
                : 'Continue'}
              <ArrowRight />
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardContent className="py-5 text-center">
            <div className="text-lg font-semibold">You&apos;ve finished the path so far 🎉</div>
            <p className="text-sm text-muted-foreground">More units are on the way.</p>
          </CardContent>
        </Card>
      )}

      <ol className="mt-8 space-y-4">
        {path.units.map((unit, i) => (
          <UnitCard key={unit.id} unit={unit} number={i + 1} />
        ))}
      </ol>
    </div>
  );
}

function UnitCard({ unit, number }: { unit: PathUnitView; number: number }) {
  const complete = unit.finished === unit.lessons.length;
  const active = unit.lessons.some((l) => l.state === 'current');
  return (
    <li>
      <Card className={active ? 'border-primary/40' : ''}>
        <details open={!complete} className="group">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Unit {number} · HSK {unit.hskLevel}
              </div>
              <div className="text-lg font-semibold">{unit.title}</div>
              <div className="text-sm text-muted-foreground">{unit.description}</div>
            </div>
            <div className="text-right">
              <div
                className={`text-sm tabular-nums ${complete ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
              >
                {complete ? '✓ ' : ''}
                {unit.finished} / {unit.lessons.length}
              </div>
            </div>
          </summary>
          <div className="border-t px-2 py-2">
            <ul>
              {unit.lessons.map((lesson) => {
                const s = STATE[lesson.state];
                const Icon = s.icon;
                const body = (
                  <>
                    <Icon className={`size-5 shrink-0 ${s.className}`} aria-label={s.label} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{lesson.title}</div>
                      <div lang="zh-Hans" className="truncate text-sm text-muted-foreground">
                        {lesson.words.join(' ')}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {lesson.state === 'done' && lesson.bestScore != null
                        ? `${lesson.bestScore}%`
                        : lesson.state === 'locked'
                          ? ''
                          : s.label}
                    </span>
                  </>
                );
                return (
                  <li key={lesson.id}>
                    {lesson.state === 'locked' ? (
                      <div className="flex items-center gap-3 rounded-md px-3 py-2 opacity-70">
                        {body}
                      </div>
                    ) : (
                      <Link
                        href={`/learn/${lesson.id}`}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/60 ${lesson.state === 'current' ? 'bg-primary/5' : ''}`}
                      >
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
              {!complete && (
                <Link
                  href={`/learn/checkpoint/${unit.id}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  <FastForward /> Already know this? Test out
                </Link>
              )}
              {unit.scenario && (
                <Link
                  href={`/scenarios/${unit.scenario}?view=dialogues`}
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  Practise the dialogue <ArrowRight />
                </Link>
              )}
            </div>
          </div>
        </details>
      </Card>
    </li>
  );
}
