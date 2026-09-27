import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import { Pinyin } from '@/components/pinyin';
import { Card, CardContent } from '@/components/ui/card';
import { getStoryList } from '@/lib/queries/reading';

export const metadata = { title: 'Read' };

export default async function ReadPage() {
  const stories = await getStoryList();
  const levels = [...new Set(stories.map((s) => s.hskLevel))];
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Read</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Short stories written with the words you&apos;ve learned. Each one opens up as you reach it
        on the Learn path. Tap any word to look it up.
      </p>
      {levels.map((level) => (
        <section key={level} className="mt-8">
          <h2 className="text-sm font-medium text-muted-foreground">HSK {level}</h2>
          <ul className="mt-2 grid gap-3 sm:grid-cols-2">
            {stories
              .filter((s) => s.hskLevel === level)
              .map((s) => (
                <li key={s.id}>
                  <Link href={`/read/${s.id}`} className="group block h-full">
                    <Card
                      className={`h-full transition-colors group-hover:border-primary/60 ${
                        s.state === 'locked' ? 'opacity-60' : ''
                      }`}
                    >
                      <CardContent className="flex items-start justify-between gap-3 py-4">
                        <div className="min-w-0">
                          <div lang="zh-Hans" className="text-xl">
                            {s.title.hanzi}
                          </div>
                          <Pinyin
                            text={s.title.pinyin}
                            className="block text-xs text-muted-foreground"
                          />
                          <div className="mt-1 text-sm">{s.title.meaning}</div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {s.state === 'locked'
                              ? `Opens after “${s.unlockLesson}”`
                              : `${s.sentences} sentences`}
                          </div>
                        </div>
                        {s.state === 'read' ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <Check className="size-4" /> Read
                          </span>
                        ) : s.state === 'locked' ? (
                          <Lock className="size-4 text-muted-foreground" aria-label="Not yet" />
                        ) : (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                            New
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
