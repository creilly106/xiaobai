import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { grammarPoints } from '@/lib/grammar-data';
import { getPath, type PathUnitView } from '@/lib/queries/path';
import { storiesForUnit } from '@/lib/queries/reading';
import { UnitCard } from './_components/unit-card';

export const metadata = { title: 'Learn' };

const grammarName = (slug: string | null) =>
  slug ? grammarPoints.find((g) => g.slug === slug)?.englishTitle : undefined;

export default async function LearnPage() {
  const path = await getPath();
  const currentUnit = path.units.find((u) => u.lessons.some((l) => l.state === 'current'));
  const currentLesson = currentUnit?.lessons.find((l) => l.state === 'current');
  const levels: { level: number; units: NumberedUnit[] }[] = [];
  path.units.forEach((unit, i) => {
    const last = levels[levels.length - 1];
    if (last?.level === unit.hskLevel) last.units.push({ unit, number: i + 1 });
    else levels.push({ level: unit.hskLevel, units: [{ unit, number: i + 1 }] });
  });

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
      {path.added > 0 && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            {path.added === 1 ? 'One earlier lesson isn’t' : `${path.added} earlier lessons aren’t`}{' '}
            done yet — usually because they were added after you&apos;d passed that point.
            They&apos;re marked New: do them whenever you like; they won&apos;t hold you back.
          </span>
        </p>
      )}

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

      <div className="mt-8 space-y-6">
        {levels.map(({ level, units }) => (
          <LevelSection key={level} level={level} units={units} />
        ))}
      </div>
    </div>
  );
}

type NumberedUnit = { unit: PathUnitView; number: number };

/**
 * One HSK level's units. A level you've finished folds away into one line, so
 * the path stays short however far you get.
 */
function LevelSection({ level, units }: { level: number; units: NumberedUnit[] }) {
  const lessons = units.reduce((n, { unit }) => n + unit.lessons.length, 0);
  const finished = units.reduce((n, { unit }) => n + unit.finished, 0);
  const list = (
    <ol className="space-y-4">
      {units.map(({ unit, number }) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          number={number}
          stories={storiesForUnit(unit.id).map((s) => ({ id: s.id, title: s.title.meaning }))}
        />
      ))}
    </ol>
  );
  const heading = (
    <>
      <span className="font-semibold">HSK {level}</span>
      <span className="text-sm tabular-nums text-muted-foreground">
        {finished === lessons ? '✓ ' : ''}
        {finished} / {lessons} lessons · {units.length} units
      </span>
    </>
  );
  if (finished < lessons) {
    return (
      <section aria-label={`HSK ${level}`}>
        <h2 className="mb-2 flex items-baseline justify-between gap-3 px-1">{heading}</h2>
        {list}
      </section>
    );
  }
  return (
    <details className="group">
      <summary className="mb-2 flex cursor-pointer list-none items-baseline gap-3 rounded-lg border px-4 py-3 hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
        {heading}
        <span className="ml-auto text-xs text-muted-foreground group-open:hidden">Show</span>
        <span className="ml-auto hidden text-xs text-muted-foreground group-open:inline">Hide</span>
      </summary>
      {list}
    </details>
  );
}
