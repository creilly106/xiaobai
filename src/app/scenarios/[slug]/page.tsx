import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getScenarioBySlug } from '@/lib/queries/scenarios';
import { getDictionaryFor } from '@/lib/queries/dictionary';
import { scenarioBySlug } from '@/lib/scenario-data';
import { AddScenarioButton } from './_components/add-scenario-button';
import { DialogueCard } from './_components/dialogue-card';
import { PhraseRow, type PhraseVersion } from './_components/phrase-row';

export async function generateMetadata({
  params,
}: PageProps<'/scenarios/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);
  return { title: scenario ? scenario.name : 'Scenario not found' };
}

export default async function ScenarioDetailPage({
  params,
  searchParams,
}: PageProps<'/scenarios/[slug]'>) {
  const { slug } = await params;
  const view = (await searchParams).view === 'dialogues' ? 'dialogues' : 'phrases';
  const scenario = await getScenarioBySlug(slug);
  if (!scenario) notFound();
  const content = scenarioBySlug(slug);

  // Study state comes from the database; structure (variants, dialogues) from the content file.
  const saved = new Map(scenario.sentences.map((s) => [s.hanzi, s]));
  const phrases = content
    ? [...content.sentences]
        .sort((a, b) => (a.difficulty ?? 9) - (b.difficulty ?? 9))
        .map((s) => ({
          key: s.hanzi,
          difficulty: s.difficulty ?? null,
          versions: [{ ...s, label: s.label ?? 'Now' }, ...(s.variants ?? [])].map(
            (v): PhraseVersion => ({
              label: v.label,
              hanzi: v.hanzi,
              pinyin: v.pinyin,
              meaning: v.meaning,
              studyable: saved.has(v.hanzi),
              inQueue: saved.get(v.hanzi)?.inQueue ?? false,
            }),
          ),
        }))
    : scenario.sentences
        .filter((s) => s.role === 'phrase')
        .map((s) => ({
          key: s.hanzi,
          difficulty: s.difficulty,
          versions: [{ ...s, label: 'Now', studyable: true }],
        }));
  const dialogues = content?.dialogues ?? [];
  const total = phrases.length;

  const dict = await getDictionaryFor([
    ...phrases.flatMap((p) => p.versions.map((v) => v.hanzi)),
    ...dialogues.flatMap((d) => d.lines.map((l) => l.hanzi)),
  ]);

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
              ? `${total} phrases · not in your study queue yet`
              : scenario.inQueueCount === total
                ? `All ${total} phrases are in your study queue`
                : `${scenario.inQueueCount} of ${total} phrases in your study queue`}
          </p>
        </div>
        <AddScenarioButton slug={scenario.slug} remaining={total - scenario.inQueueCount} />
      </div>

      {dialogues.length > 0 && (
        <div role="tablist" className="mt-6 inline-flex rounded-lg border p-1 text-sm">
          {(
            [
              ['phrases', `Phrases (${total})`],
              ['dialogues', `Dialogues (${dialogues.length})`],
            ] as const
          ).map(([key, label]) => (
            <Link
              key={key}
              role="tab"
              aria-selected={view === key}
              href={key === 'phrases' ? `/scenarios/${slug}` : `/scenarios/${slug}?view=dialogues`}
              scroll={false}
              className={`rounded-md px-3 py-1 transition-colors ${
                view === key
                  ? 'bg-muted font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {view === 'phrases' || dialogues.length === 0 ? (
        <>
          <p className="mt-4 text-xs text-muted-foreground">
            Hover any word for its meaning. Where a phrase has{' '}
            <span className="rounded-full border px-1.5">Past</span> or{' '}
            <span className="rounded-full border px-1.5">Future</span> chips, tap them to see how
            Chinese shows the time.{' '}
            <Link href="/grammar/time" className="underline hover:text-foreground">
              How time works
            </Link>
          </p>
          <div className="mt-2 divide-y divide-border/60 rounded-md border border-border/60 bg-card">
            {phrases.map((p) => (
              <PhraseRow
                key={p.key}
                slug={slug}
                versions={p.versions}
                difficulty={p.difficulty}
                dict={dict}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 space-y-4">
          {dialogues.map((d, i) => (
            <DialogueCard
              key={d.title}
              slug={slug}
              index={i}
              title={d.title}
              lines={d.lines}
              inQueue={d.lines.every((l) => saved.get(l.hanzi)?.inQueue)}
              dict={dict}
            />
          ))}
        </div>
      )}
    </div>
  );
}
