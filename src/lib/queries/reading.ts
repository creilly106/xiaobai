import 'server-only';
import { connection } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { lessonById } from '@/lib/curriculum';
import { stories, type Story } from '@/lib/story-data';
import { getPath, isFinished } from './path';

export type StoryState = 'read' | 'open' | 'locked';

export type StoryListItem = {
  id: string;
  title: Story['title'];
  hskLevel: number;
  sentences: number;
  state: StoryState;
  /** For locked stories: the lesson that opens them. */
  unlockLesson: string;
};

/** Stories whose questions have been answered, by id. */
async function readStories(): Promise<Set<string>> {
  const rows = await db
    .select({ item: schema.practiceLog.item })
    .from(schema.practiceLog)
    .where(eq(schema.practiceLog.kind, 'reading'))
    .groupBy(schema.practiceLog.item)
    .having(sql`count(*) > 0`);
  return new Set(rows.map((r) => r.item));
}

/** Finished lessons, by id. */
async function finishedLessons(): Promise<Set<string>> {
  const path = await getPath();
  return new Set(
    path.units.flatMap((u) => u.lessons.filter((l) => isFinished(l.state)).map((l) => l.id)),
  );
}

export async function getStoryList(): Promise<StoryListItem[]> {
  await connection();
  const [read, finished] = await Promise.all([readStories(), finishedLessons()]);
  return stories.map((story) => ({
    id: story.id,
    title: story.title,
    hskLevel: story.hskLevel,
    sentences: story.paragraphs.flat().length,
    state: read.has(story.id) ? 'read' : finished.has(story.after) ? 'open' : 'locked',
    unlockLesson: lessonById(story.after)?.title ?? story.after,
  }));
}

/** Stories that open up with this unit's last lesson (for the Learn page). */
export const storiesForUnit = (unitId: string) =>
  stories.filter((s) => lessonById(s.after)?.unit.id === unitId);
