import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { listScenarios } from '@/lib/queries/scenarios';

export const metadata = { title: 'Scenarios' };

export default async function ScenariosPage() {
  const scenarios = await listScenarios();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Scenarios</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Real-life situation packs. Learn phrases in the context you&apos;ll actually use them.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {scenarios.map((s) => {
          const pct = s.sentenceCount ? Math.round((s.inQueueCount / s.sentenceCount) * 100) : 0;
          return (
            <li key={s.slug}>
              <Link
                href={`/scenarios/${s.slug}`}
                className="block h-full rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary/60"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">{s.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {s.inQueueCount === 0
                      ? `${s.sentenceCount} phrases`
                      : `${s.inQueueCount} / ${s.sentenceCount} in queue`}
                  </span>
                </div>
                {s.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p>
                )}
                {s.inQueueCount > 0 && (
                  <Progress
                    value={pct}
                    className="mt-2"
                    aria-label={`${pct}% of ${s.name} in your queue`}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
