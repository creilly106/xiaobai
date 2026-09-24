import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { listScenarios } from '@/lib/queries/scenarios';

export const metadata = { title: 'Scenarios' };

export default async function ScenariosPage() {
  const scenarios = await listScenarios();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Scenarios</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Real-life situation packs. Learn phrases in the context you&apos;ll
        actually use them.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {scenarios.map((s) => {
          const pct = s.sentenceCount
            ? Math.round((s.inQueueCount / s.sentenceCount) * 100)
            : 0;
          return (
            <Link key={s.slug} href={`/scenarios/${s.slug}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{s.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {s.description && (
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  )}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {s.sentenceCount} sentence{s.sentenceCount === 1 ? '' : 's'}
                      </span>
                      <span>
                        {s.inQueueCount === 0
                          ? 'Not started'
                          : `${s.inQueueCount} in queue`}
                      </span>
                    </div>
                    <Progress value={pct} aria-label={`${pct}% of ${s.name} in your queue`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
