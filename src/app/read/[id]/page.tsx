import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionaryFor, type Dictionary } from '@/lib/queries/dictionary';
import { getStoryList } from '@/lib/queries/reading';
import { storyById, storySentences } from '@/lib/story-data';
import { StoryReader } from './_components/story-reader';

export async function generateMetadata({ params }: PageProps<'/read/[id]'>): Promise<Metadata> {
  const story = storyById((await params).id);
  return { title: story ? `${story.title.hanzi} · Read` : 'Story not found' };
}

export default async function StoryPage({ params }: PageProps<'/read/[id]'>) {
  const { id } = await params;
  const story = storyById(id);
  if (!story) notFound();

  const [list, found] = await Promise.all([
    getStoryList(),
    getDictionaryFor(storySentences(story).map((s) => s.hanzi)),
  ]);
  // The story's glossed extras (names, compounds) win over dictionary guesses.
  const dict: Dictionary = { ...found };
  for (const e of story.extras) {
    dict[e.hanzi] = {
      hanzi: e.hanzi,
      pinyin: e.pinyin,
      meaning: e.meaning,
      hskLevel: null,
      kind: 'dictionary',
    };
  }
  const index = list.findIndex((s) => s.id === id);
  const state = list[index]?.state ?? 'open';
  const next = list.slice(index + 1).find((s) => s.state !== 'locked');

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-muted-foreground">
        <Link href="/read" className="hover:underline">
          Read
        </Link>
        <span className="px-1">/</span>
        <span className="text-foreground">{story.title.meaning}</span>
      </nav>
      {state === 'locked' && (
        <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          This story uses words from lessons you haven&apos;t reached yet (it opens after “
          {list[index]?.unlockLesson}”). Tap any word you don&apos;t know.
        </p>
      )}
      <StoryReader
        story={story}
        dict={dict}
        next={next ? { id: next.id, title: next.title.meaning } : null}
      />
    </div>
  );
}
