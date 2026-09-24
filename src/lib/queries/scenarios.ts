import 'server-only';
import { connection } from 'next/server';
import { asc, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';

export type ScenarioSummary = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sentenceCount: number;
  inQueueCount: number;
};

const inQueueExpr = sql<number>`count(distinct ${schema.cards.sentenceId})`;

export async function listScenarios(): Promise<ScenarioSummary[]> {
  await connection();
  const rows = await db
    .select({
      id: schema.tags.id,
      slug: schema.tags.slug,
      name: schema.tags.name,
      description: schema.tags.description,
      sentenceCount: sql<number>`count(distinct ${schema.sentenceTags.sentenceId})`,
      inQueueCount: inQueueExpr,
    })
    .from(schema.tags)
    .leftJoin(schema.sentenceTags, eq(schema.sentenceTags.tagId, schema.tags.id))
    .leftJoin(schema.cards, eq(schema.cards.sentenceId, schema.sentenceTags.sentenceId))
    .where(eq(schema.tags.type, 'scenario'))
    .groupBy(schema.tags.id)
    .orderBy(asc(schema.tags.name));
  return rows.map((r) => ({
    ...r,
    sentenceCount: Number(r.sentenceCount ?? 0),
    inQueueCount: Number(r.inQueueCount ?? 0),
  }));
}

export type ScenarioDetail = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  inQueueCount: number;
  sentences: {
    id: number;
    hanzi: string;
    pinyin: string;
    meaning: string;
    difficulty: number | null;
    inQueue: boolean;
  }[];
};

export async function getScenarioBySlug(
  slug: string,
): Promise<ScenarioDetail | null> {
  await connection();
  const [tag] = await db
    .select()
    .from(schema.tags)
    .where(eq(schema.tags.slug, slug))
    .limit(1);
  if (!tag || tag.type !== 'scenario') return null;

  const rows = await db
    .select({
      id: schema.sentences.id,
      hanzi: schema.sentences.hanzi,
      pinyin: schema.sentences.pinyin,
      meaning: schema.sentences.meaning,
      difficulty: schema.sentences.difficulty,
      cardCount: sql<number>`count(${schema.cards.id})`,
    })
    .from(schema.sentenceTags)
    .innerJoin(schema.sentences, eq(schema.sentences.id, schema.sentenceTags.sentenceId))
    .leftJoin(schema.cards, eq(schema.cards.sentenceId, schema.sentences.id))
    .where(eq(schema.sentenceTags.tagId, tag.id))
    .groupBy(schema.sentences.id)
    .orderBy(asc(schema.sentences.difficulty), asc(schema.sentences.id));

  const sentences = rows.map(({ cardCount, ...s }) => ({
    ...s,
    inQueue: Number(cardCount) > 0,
  }));

  return {
    id: tag.id,
    slug: tag.slug,
    name: tag.name,
    description: tag.description,
    inQueueCount: sentences.filter((s) => s.inQueue).length,
    sentences,
  };
}
