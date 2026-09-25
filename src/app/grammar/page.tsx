import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { grammarPoints } from '@/lib/grammar-data';

export const metadata: Metadata = { title: 'Grammar' };

export default function GrammarPage() {
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

      <Link href="/grammar/time" className="group mt-6 block">
        <Card className="border-2 border-primary/40 bg-primary/5 transition-colors group-hover:border-primary/70">
          <CardContent className="flex items-center gap-4 py-4">
            <div lang="zh-Hans" className="text-3xl" aria-hidden>
              了
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">Talking about time</div>
              <p className="text-sm text-muted-foreground">
                Past, present and future without tenses — one verb in every time frame, and the
                patterns behind it.
              </p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <div className="mt-8 space-y-8">
        {levels.map((lvl) => (
          <section key={lvl}>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              HSK {lvl}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {byLevel.get(lvl)!.map((p) => (
                <Link key={p.slug} href={`/grammar/${p.slug}`} className="group">
                  <Card className="h-full transition-colors group-hover:border-primary/60">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{p.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{p.englishTitle}</p>
                      {p.formula && (
                        <p className="mt-2 text-xs text-foreground/80">
                          <span className="font-mono">{p.formula}</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
