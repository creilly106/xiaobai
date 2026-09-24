import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { getClozeItems } from '@/lib/queries/cloze';
import { getDictionaryFor } from '@/lib/queries/dictionary';
import { ClozeSession, type AnswerMode } from './_components/cloze-session';

export const metadata: Metadata = { title: 'Fill in the blank' };

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ClozePage({ searchParams }: PageProps<'/quiz/cloze'>) {
  const params = await searchParams;
  const scenarioSlugs = (one(params.scenarios) ?? '')
    .split(',')
    .filter((s) => /^[a-z0-9-]{1,64}$/.test(s));
  const includeGrammar = one(params.grammar) === '1';
  const mode: AnswerMode = one(params.answer) === 'type' ? 'type' : 'choose';
  const count = Math.max(1, Math.min(Number.parseInt(one(params.count) ?? '10', 10) || 10, 50));

  const items = await getClozeItems({
    scenarioSlugs,
    includeGrammar,
    knownOnly: one(params.known) === '1',
    count,
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">No sentences to use</h1>
        <p className="mt-2 text-muted-foreground">
          {one(params.known) === '1'
            ? "None of these sentences contain words you've studied yet. Turn off “only words I've studied”, or study a few more cards first."
            : 'Try choosing more sources.'}
        </p>
        <Link href="/quiz" className={`mt-6 inline-flex ${buttonVariants({})}`}>
          Back to quiz setup
        </Link>
      </div>
    );
  }

  const dict = await getDictionaryFor(items.map((i) => i.hanzi));
  return <ClozeSession items={items} mode={mode} dict={dict} />;
}
