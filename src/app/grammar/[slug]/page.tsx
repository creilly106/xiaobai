import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { grammarPoints } from '@/lib/grammar-data';
import { getDictionaryFor } from '@/lib/queries/dictionary';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { AudioButton } from '@/components/audio-button';
import { Pinyin } from '@/components/pinyin';
import { Card, CardContent } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: PageProps<'/grammar/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const point = grammarPoints.find((p) => p.slug === slug);
  return { title: point ? `${point.name} · Grammar` : 'Grammar' };
}

export default async function GrammarDetail({ params }: PageProps<'/grammar/[slug]'>) {
  const { slug } = await params;
  const point = grammarPoints.find((p) => p.slug === slug);
  if (!point) notFound();

  const dict = await getDictionaryFor(point.examples.map((e) => e.hanzi));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href="/grammar" className="hover:underline">
          Grammar
        </Link>{' '}
        / HSK {point.hskLevel}
      </div>
      <h1 className="text-2xl font-semibold">{point.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{point.englishTitle}</p>
      {point.time && (
        <Link
          href="/grammar/time"
          className="mt-2 inline-block text-xs text-primary underline-offset-4 hover:underline"
        >
          Part of: Talking about time →
        </Link>
      )}

      {point.formula && (
        <div className="mt-4 rounded-md border border-border/60 bg-muted/40 px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Formula</div>
          <div className="mt-1 font-mono text-sm">{point.formula}</div>
        </div>
      )}

      <p className="mt-6 text-base leading-relaxed">{point.description}</p>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Examples
        </h2>
        <Card>
          <CardContent className="divide-y divide-border/60 p-0">
            {point.examples.map((ex, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div lang="zh-Hans" className="text-xl">
                    <TokenizedHanzi hanzi={ex.hanzi} dict={dict} />
                  </div>
                  <Pinyin text={ex.pinyin} className="mt-1 block text-sm text-muted-foreground" />
                  <div className="mt-0.5 text-sm">{ex.meaning}</div>
                </div>
                <AudioButton text={ex.hanzi} label={`Play ${ex.hanzi}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {point.notes && (
        <div className="mt-6 rounded-md border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm">
          <span className="font-medium">Note: </span>
          {point.notes}
        </div>
      )}
    </div>
  );
}
