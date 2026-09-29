import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { ArrowRight, CircleCheck, Clock } from 'lucide-react';
import { db, schema } from '@/db/client';
import { LESSONS } from '@/lib/curriculum';
import { grammarPoints } from '@/lib/grammar-data';

export const metadata: Metadata = { title: 'Grammar' };

/** The time guide is listed with HSK 2, where most of the time patterns are. */
const TIME_GUIDE_LEVEL = 2;

/** Grammar point → the lesson that teaches it. */
const lessonFor = new Map(LESSONS.flatMap((l) => (l.grammar ? [[l.grammar, l.id] as const] : [])));

export default async function GrammarPage() {
  await connection();
  const finished = new Set(
    (await db.select({ id: schema.lessonProgress.lessonId }).from(schema.lessonProgress)).map(
      (r) => r.id,
    ),
  );
  const learned = (slug: string) => finished.has(lessonFor.get(slug) ?? '');
  const byLevel = new Map<number, typeof grammarPoints>();
  for (const p of grammarPoints) {
    if (!byLevel.has(p.hskLevel)) byLevel.set(p.hskLevel, []);
    byLevel.get(p.hskLevel)!.push(p);
  }
  const levels = Array.from(byLevel.keys()).sort();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Grammar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Core patterns for building Chinese sentences, sorted by rough HSK level.
      </p>

      <nav
        aria-label="Jump to level"
        className="sticky top-14 z-10 -mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur"
      >
        {levels.map((lvl) => (
          <a
            key={lvl}
            href={`#hsk-${lvl}`}
            className="shrink-0 rounded-md px-2.5 py-1 text-sm transition-colors hover:bg-muted"
          >
            HSK {lvl}
          </a>
        ))}
      </nav>

      <div className="mt-6 space-y-8">
        {levels.map((lvl) => {
          const points = byLevel.get(lvl)!;
          const done = points.filter((p) => learned(p.slug)).length;
          return (
            <section key={lvl} aria-labelledby={`hsk-${lvl}`}>
              <h2
                id={`hsk-${lvl}`}
                className="mb-2 flex scroll-mt-32 items-baseline justify-between text-sm font-medium uppercase tracking-wider text-muted-foreground"
              >
                HSK {lvl}
                <span className="text-xs normal-case tracking-normal tabular-nums">
                  {done} / {points.length} learned
                </span>
              </h2>
              <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border bg-card">
                {lvl === TIME_GUIDE_LEVEL && (
                  // The time guide sits where most of its patterns (了, 过, 在, 要) are met.
                  <li>
                    <Link
                      href="/grammar/time"
                      className="flex items-center gap-3 bg-primary/5 px-4 py-3 transition-colors hover:bg-primary/10"
                    >
                      <Clock className="size-5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">Guide: talking about time</div>
                        <div className="text-sm text-muted-foreground">
                          Chinese has no tenses. How the time points below fit together.
                        </div>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                )}
                {points.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/grammar/${p.slug}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          {p.name}
                          {p.time && (
                            <span className="rounded-full border px-1.5 text-[10px] font-normal uppercase tracking-wide text-muted-foreground">
                              time
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{p.englishTitle}</div>
                        {p.formula && (
                          <div className="mt-0.5 truncate font-mono text-xs text-foreground/70">
                            {p.formula}
                          </div>
                        )}
                      </div>
                      {learned(p.slug) && (
                        <CircleCheck
                          className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-label="Learned in a lesson"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
