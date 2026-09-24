import 'server-only';
import { connection } from 'next/server';
import { desc, eq, ne, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { WordSource } from '@/db/schema';

export type MyItem = {
  kind: 'word' | 'sentence';
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  note: string | null;
  source: WordSource | 'custom';
  /** Recognition card state, or null if not in study. */
  state: string | null;
  createdAt: Date;
};

/** Words you added (from the dictionary or by hand) and your own sentences, newest first. */
export async function getMyItems(): Promise<MyItem[]> {
  await connection();
  const [words, sentences] = await Promise.all([
    db
      .select({
        id: schema.words.id,
        hanzi: schema.words.hanzi,
        pinyin: schema.words.pinyin,
        meaning: schema.words.meaning,
        note: schema.words.note,
        source: schema.words.source,
        createdAt: schema.words.createdAt,
        state: sql<
          string | null
        >`(select c.state from cards c where c.word_id = ${schema.words.id} and c.mode = 'recognition')`,
      })
      .from(schema.words)
      .where(ne(schema.words.source, 'hsk'))
      .orderBy(desc(schema.words.createdAt)),
    db
      .select({
        id: schema.sentences.id,
        hanzi: schema.sentences.hanzi,
        pinyin: schema.sentences.pinyin,
        meaning: schema.sentences.meaning,
        note: schema.sentences.note,
        createdAt: schema.sentences.createdAt,
        state: sql<
          string | null
        >`(select c.state from cards c where c.sentence_id = ${schema.sentences.id} and c.mode = 'sentence-recognition')`,
      })
      .from(schema.sentences)
      .innerJoin(schema.sentenceTags, eq(schema.sentenceTags.sentenceId, schema.sentences.id))
      .innerJoin(schema.tags, eq(schema.tags.id, schema.sentenceTags.tagId))
      .where(eq(schema.tags.slug, 'my-sentences'))
      .orderBy(desc(schema.sentences.createdAt)),
  ]);
  return [
    ...words.map((w) => ({ ...w, kind: 'word' as const })),
    ...sentences.map((s) => ({ ...s, kind: 'sentence' as const, source: 'custom' as const })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
