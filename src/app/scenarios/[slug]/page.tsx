import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getScenarioBySlug } from '@/lib/queries/scenarios';
import { getDictionaryFor } from '@/lib/queries/dictionary';
import { SentenceRow } from './_components/sentence-row';
import { AddScenarioButton } from './_components/add-scenario-button';

export async function generateMetadata({
  params,
}: PageProps<'/scenarios/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);
  return { title: scenario ? scenario.name : 'Scenario not found' };
}

export default async function ScenarioDetailPage({
  params,
}: PageProps<'/scenarios/[slug]'>) {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);
  if (!scenario) notFound();
  const dict = await getDictionaryFor(scenario.sentences.map((s) => s.hanzi));
  const total = scenario.sentences.length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-muted-foreground">
        <Link href="/scenarios" className="hover:underline">
          Scenarios
        </Link>
        <span className="px-1">/</span>
        <span className="text-foreground">{scenario.name}</span>
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{scenario.name}</h1>
          {scenario.description && (
            <p className="mt-1 text-sm text-muted-foreground">{scenario.description}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {scenario.inQueueCount === 0
              ? `${total} sentences · not in your study queue yet`
              : scenario.inQueueCount === total
                ? `All ${total} sentences are in your study queue`
                : `${scenario.inQueueCount} of ${total} sentences in your study queue`}
          </p>
        </div>
        <AddScenarioButton
          slug={scenario.slug}
          remaining={total - scenario.inQueueCount}
        />
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Hover any word for its meaning; click to open its character page.
      </p>
      <div className="mt-2 divide-y divide-border/60 rounded-md border border-border/60 bg-card">
        {scenario.sentences.map((s) => (
          <SentenceRow key={s.id} sentence={s} dict={dict} />
        ))}
      </div>
    </div>
  );
}
