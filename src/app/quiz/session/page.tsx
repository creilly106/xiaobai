import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { CARD_STATES, getQuizQueue, type QuizItemType } from '@/lib/queries/quiz';
import { getDictionaryFor } from '@/lib/queries/dictionary';
import type { CardState } from '@/db/schema';
import { QuizSession } from './_components/quiz-session';

export const metadata = { title: 'Quiz' };

type Params = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function intList(v: string | undefined): number[] {
  if (!v) return [];
  return v
    .split(',')
    .map((x) => Number.parseInt(x, 10))
    .filter((x) => Number.isInteger(x) && x > 0 && x < 10);
}

function slugList(v: string | undefined): string[] {
  if (!v) return [];
  return v.split(',').filter((s) => /^[a-z0-9-]{1,64}$/.test(s));
}

export default async function QuizSessionPage({ searchParams }: PageProps<'/quiz/session'>) {
  const params: Params = await searchParams;
  const typeParam = one(params.type);
  const itemType: QuizItemType =
    typeParam === 'word' || typeParam === 'sentence' ? typeParam : 'both';
  const count = Math.max(1, Math.min(Number.parseInt(one(params.count) ?? '10', 10) || 10, 100));
  const cardStates = (one(params.states) ?? '')
    .split(',')
    .filter((s): s is CardState => (CARD_STATES as readonly string[]).includes(s));
  const olderThan = Number.parseInt(one(params.olderThanDays) ?? '', 10);

  const queue = await getQuizQueue({
    itemType,
    hskLevels: intList(one(params.hsk)),
    scenarioSlugs: slugList(one(params.scenarios)),
    cardStates: cardStates.length > 0 ? cardStates : undefined,
    lastReviewOlderThanDays: Number.isInteger(olderThan) && olderThan >= 0 ? olderThan : undefined,
    count,
  });

  if (queue.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Nothing matches those filters.</h1>
        <p className="mt-2 text-muted-foreground">
          {cardStates.length > 0
            ? 'Card-state filters only include items already in your study queue — try removing the state filter, or add more to your queue first.'
            : 'Try loosening the filters.'}
        </p>
        <Link href="/quiz" className={`mt-6 inline-flex ${buttonVariants({})}`}>
          Back to quiz setup
        </Link>
      </div>
    );
  }

  const dict = await getDictionaryFor(queue.map((q) => q.hanzi));
  return (
    <QuizSession
      initialQueue={queue}
      srsMode={one(params.srs) === '1'}
      dict={dict}
      showPinyinOnFront={one(params.pinyinFront) === '1'}
    />
  );
}
