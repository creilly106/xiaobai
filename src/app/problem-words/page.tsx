import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Dumbbell, TrendingUp } from 'lucide-react';
import { AudioButton } from '@/components/audio-button';
import { NoteEditor } from '@/components/note-editor';
import { Pinyin } from '@/components/pinyin';
import { buttonVariants } from '@/components/ui/button';
import { daysBetweenKeys, localDateKey } from '@/lib/dates';
import { PROBLEM_MISSES, SKILL_LABEL, type Vocab } from '@/lib/problem-words';
import { getProblemItems, type ProblemItem } from '@/lib/queries/problem-words';
import { userTimeZone } from '@/lib/timezone';

export const metadata: Metadata = { title: 'Problem words' };

const DRILL = '/quiz/session?type=both&states=learning,review,relearning&tricky=1&count=10';

export default async function ProblemWordsPage() {
  const [items, timeZone] = await Promise.all([getProblemItems(), userTimeZone()]);
  const today = localDateKey(new Date(), timeZone);
  const ago = (d: Date | null) => {
    if (!d) return '';
    const days = daysBetweenKeys(localDateKey(d, timeZone), today);
    return days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`;
  };
  const struggling = items.filter((i) => !i.improving);
  const improving = items.filter((i) => i.improving);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Problem words</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The words and sentences you&apos;ve missed {PROBLEM_MISSES} or more times in your reviews,
        and what might be tripping you up. A memory hook you write here shows up with the answer
        next time.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          Nothing here yet. Anything you miss {PROBLEM_MISSES} or more times shows up here.
        </p>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href={DRILL} className={buttonVariants({})}>
              <Dumbbell /> Drill the trickiest 10
            </Link>
            <span className="text-xs text-muted-foreground">
              Practice only: your review schedule doesn&apos;t change.
            </span>
          </div>

          {struggling.length > 0 && (
            <ul className="mt-6 space-y-3">
              {struggling.map((item) => (
                <ProblemCard key={item.key} item={item} lastMissed={ago(item.lastMiss)} />
              ))}
            </ul>
          )}

          {improving.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
                Getting better
              </h2>
              <p className="mb-3 text-xs text-muted-foreground">
                Your last three answers were right. They&apos;ll drop off this list as they settle.
              </p>
              <ul className="space-y-3">
                {improving.map((item) => (
                  <ProblemCard key={item.key} item={item} lastMissed={ago(item.lastMiss)} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

/** Pinyin with the tones kept, for "sounds exactly the same". */
const sound = (pinyin: string) =>
  pinyin
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\s'’·-]/g, '');

function ProblemCard({ item, lastMissed }: { item: ProblemItem; lastMissed: string }) {
  const isWord = item.kind === 'word';
  const homophones = item.soundAlikes.filter((w) => sound(w.pinyin) === sound(item.pinyin));
  const toneOnly = item.soundAlikes.filter((w) => !homophones.includes(w));
  return (
    <li className="rounded-xl border bg-card px-4 py-3" data-problem={item.hanzi}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            {isWord ? (
              <Link
                href={`/characters/${encodeURIComponent(item.hanzi)}`}
                lang="zh-Hans"
                className="text-3xl hover:text-primary"
              >
                {item.hanzi}
              </Link>
            ) : (
              <span lang="zh-Hans" className="text-xl">
                {item.hanzi}
              </span>
            )}
            <Pinyin text={item.pinyin} className="text-muted-foreground" />
            <AudioButton text={item.hanzi} reading={isWord ? item.pinyin : undefined} />
          </div>
          <p className="text-sm">{item.meaning}</p>
        </div>
        <div className="shrink-0 text-right text-xs text-muted-foreground">
          <div className="font-medium text-foreground">
            {item.misses} miss{item.misses === 1 ? '' : 'es'}
          </div>
          {lastMissed && <div>last {lastMissed}</div>}
          {item.suspended && <div>suspended</div>}
        </div>
      </div>

      <div
        className="mt-2 flex items-center gap-1"
        role="img"
        aria-label={`Last ${item.recent.length} answers, oldest first: ${item.recent
          .map((ok) => (ok ? 'right' : 'missed'))
          .join(', ')}`}
      >
        <span className="mr-1 text-xs text-muted-foreground">Recent</span>
        {item.recent.map((ok, i) => (
          <span
            key={i}
            className={`size-2.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-red-500'}`}
          />
        ))}
      </div>

      {(item.weakSpot || item.soundAlikes.length > 0 || item.sharesCharacter.length > 0) && (
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {item.weakSpot && (
            <li>
              Most misses come from{' '}
              <span className="text-foreground">{SKILL_LABEL[item.weakSpot]}</span>.
            </li>
          )}
          {homophones.length > 0 && (
            <li>
              Sounds exactly like <WordList words={homophones} /> — the character is how you tell
              them apart.
            </li>
          )}
          {toneOnly.length > 0 && (
            <li>
              Only the tones differ from <WordList words={toneOnly} /> — listen for them.
            </li>
          )}
          {item.sharesCharacter.length > 0 && (
            <li>
              Shares a character with <WordList words={item.sharesCharacter} />.
            </li>
          )}
        </ul>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 grow flex-col">
          <NoteEditor
            target={isWord ? { wordId: item.id } : { sentenceId: item.id }}
            initial={item.note}
            addLabel="+ Add a memory hook"
          />
        </div>
        {isWord && (
          <Link
            href={`/characters/${encodeURIComponent(item.hanzi)}`}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            How it&apos;s built <ArrowRight />
          </Link>
        )}
      </div>
    </li>
  );
}

function WordList({ words }: { words: Vocab[] }) {
  return (
    <>
      {words.map((w, i) => (
        <span key={w.hanzi}>
          {i > 0 && ', '}
          <Link
            href={`/characters/${encodeURIComponent(w.hanzi)}`}
            lang="zh-Hans"
            className="text-foreground underline-offset-4 hover:underline"
          >
            {w.hanzi}
          </Link>{' '}
          <span className="text-xs">
            {w.pinyin} ({w.meaning})
          </span>
        </span>
      ))}
    </>
  );
}
