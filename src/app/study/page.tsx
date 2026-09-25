import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { getStudyQueue } from '@/lib/queries/study';
import { getAvailability, getSettings } from '@/lib/queries/settings';
import { getReviewsToday } from '@/lib/queries/progress';
import { getDictionaryFor } from '@/lib/queries/dictionary';
import { formatRelativeFuture } from '@/lib/dates';
import { Session } from './_components/session';

export const metadata: Metadata = { title: 'Study' };

const EXTRA_STEP = 5;

export default async function StudyPage({ searchParams }: PageProps<'/study'>) {
  const { extra } = await searchParams;
  const extraNew = Math.min(50, Math.max(0, Number.parseInt(String(extra ?? '0'), 10) || 0));
  const queue = await getStudyQueue({ sessionSize: 30, extraNew });

  if (queue.length === 0) {
    const avail = await getAvailability();
    const newLimitHit = avail.newRemainingToday === 0 && avail.newInPool > 0;
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <div lang="zh-Hans" className="text-4xl" aria-hidden>
          做完了
        </div>
        <h1 className="mt-3 text-2xl font-semibold">You&apos;re all caught up</h1>
        <p className="mt-2 text-muted-foreground">
          {avail.nextDueInMs != null
            ? `Your next review is due in ${formatRelativeFuture(avail.nextDueInMs)}.`
            : 'Nothing else is scheduled right now.'}
          {avail.reviewLimitHit &&
            " More reviews are waiting, but you've hit today's review limit."}
        </p>
        {avail.pathWords > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            New words come from Learn — take the next lesson to add more to your reviews.
          </p>
        )}
        {avail.lockedSentences > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {avail.lockedSentences} scenario sentence
            {avail.lockedSentences === 1 ? ' is' : 's are'} waiting until you know more of
            {avail.lockedSentences === 1 ? ' its' : ' their'} words.
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {newLimitHit ? (
            <Link href={`/study?extra=${extraNew + EXTRA_STEP}`} className={buttonVariants({})}>
              Learn {Math.min(EXTRA_STEP, avail.newInPool)} more new card
              {Math.min(EXTRA_STEP, avail.newInPool) === 1 ? '' : 's'}
            </Link>
          ) : avail.pathWords > 0 ? (
            <Link href="/learn" className={buttonVariants({})}>
              Continue learning
            </Link>
          ) : (
            <Link href="/scenarios" className={buttonVariants({})}>
              Add a scenario
            </Link>
          )}
          <Link href="/quiz" className={buttonVariants({ variant: 'outline' })}>
            Practice with a quiz
          </Link>
          <Link href="/numbers" className={buttonVariants({ variant: 'ghost' })}>
            Numbers drill
          </Link>
        </div>
        {newLimitHit && (
          <p className="mt-4 text-xs text-muted-foreground">
            You&apos;ve introduced today&apos;s quota of new cards. Change the daily limit in{' '}
            <Link href="/settings" className="underline hover:text-foreground">
              Settings
            </Link>
            .
          </p>
        )}
      </div>
    );
  }

  const dict = await getDictionaryFor(
    queue.flatMap((c) => (c.example ? [c.hanzi, c.example.zh] : [c.hanzi])),
  );
  // Keyed so "learn more" (a new ?extra=) starts a fresh session.
  const [settings, reviewsToday] = await Promise.all([getSettings(), getReviewsToday()]);
  return (
    <Session
      key={extraNew}
      initialQueue={queue}
      dict={dict}
      goal={{ target: settings.dailyGoal, doneBefore: reviewsToday }}
    />
  );
}
