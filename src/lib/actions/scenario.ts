'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import { queueWordsFor } from '@/lib/queue-words';
import { scenarioBySlug } from '@/lib/scenario-data';

export async function addScenarioToQueue(slug: string) {
  if (typeof slug !== 'string' || !/^[a-z0-9-]{1,64}$/.test(slug)) {
    return { created: 0, message: 'Scenario not found.' };
  }
  const [tag] = await db.select().from(schema.tags).where(eq(schema.tags.slug, slug)).limit(1);
  if (!tag) return { created: 0, message: 'Scenario not found.' };

  const sentenceRows = await db
    .select({ id: schema.sentences.id, hanzi: schema.sentences.hanzi })
    .from(schema.sentenceTags)
    .innerJoin(schema.sentences, eq(schema.sentences.id, schema.sentenceTags.sentenceId))
    .where(and(eq(schema.sentenceTags.tagId, tag.id), eq(schema.sentenceTags.role, 'phrase')));
  const sentenceIds = sentenceRows.map((r) => r.id);
  if (sentenceIds.length === 0) {
    return { created: 0, message: 'No sentences in this scenario.' };
  }

  const existing = await db
    .select({ sentenceId: schema.cards.sentenceId })
    .from(schema.cards)
    .where(
      and(
        inArray(schema.cards.sentenceId, sentenceIds),
        eq(schema.cards.mode, 'sentence-recognition'),
      ),
    );
  const existingSet = new Set(
    existing.map((r) => r.sentenceId).filter((n): n is number => n != null),
  );
  const toCreate = sentenceIds.filter((id) => !existingSet.has(id));

  if (toCreate.length === 0) {
    return { created: 0, message: `${tag.name} already in your queue.` };
  }

  await db.insert(schema.cards).values(
    toCreate.map((sentenceId) => ({
      sentenceId,
      mode: 'sentence-recognition' as const,
    })),
  );
  const wordsAdded = await queueWordsFor(sentenceRows.map((r) => r.hanzi));

  revalidatePath('/');
  revalidatePath('/scenarios');
  revalidatePath(`/scenarios/${slug}`);
  revalidatePath('/library');
  const s = toCreate.length;
  return {
    created: s,
    message:
      `Added ${s} sentence${s === 1 ? '' : 's'} from ${tag.name}` +
      (wordsAdded > 0
        ? ` and ${wordsAdded} word${wordsAdded === 1 ? '' : 's'} they use. You'll learn the words first.`
        : '.'),
  };
}

/** Create sentence cards for these scenario sentences (and queue their words). */
async function queueSentences(ids: number[], slug: string): Promise<number> {
  if (ids.length === 0) return 0;
  const rows = await db
    .select({ id: schema.sentences.id, hanzi: schema.sentences.hanzi })
    .from(schema.sentences)
    .where(inArray(schema.sentences.id, ids));
  const created = await db
    .insert(schema.cards)
    .values(rows.map((r) => ({ sentenceId: r.id, mode: 'sentence-recognition' as const })))
    .onConflictDoNothing()
    .returning({ id: schema.cards.id });
  await queueWordsFor(rows.map((r) => r.hanzi));
  revalidatePath('/');
  revalidatePath('/scenarios');
  revalidatePath(`/scenarios/${slug}`);
  return created.length;
}

/** Scenario sentences by their Chinese text, limited to this scenario. */
async function scenarioSentenceIds(slug: string, hanzi: string[]): Promise<number[]> {
  const [tag] = await db.select().from(schema.tags).where(eq(schema.tags.slug, slug)).limit(1);
  if (!tag || hanzi.length === 0) return [];
  const rows = await db
    .select({ id: schema.sentences.id })
    .from(schema.sentenceTags)
    .innerJoin(schema.sentences, eq(schema.sentences.id, schema.sentenceTags.sentenceId))
    .where(and(eq(schema.sentenceTags.tagId, tag.id), inArray(schema.sentences.hanzi, hanzi)));
  return rows.map((r) => r.id);
}

/** Add one phrase — or the time variant of it that's showing — to study. */
export async function addScenarioSentence(slug: string, hanzi: string) {
  if (typeof hanzi !== 'string' || hanzi.length > 200) return { created: 0 };
  const ids = await scenarioSentenceIds(slug, [hanzi]);
  return { created: await queueSentences(ids, slug) };
}

/** Add every line of a scenario dialogue to study. */
export async function addScenarioDialogue(slug: string, index: number) {
  const dialogue = scenarioBySlug(slug)?.dialogues?.[index];
  if (!dialogue) return { created: 0 };
  const ids = await scenarioSentenceIds(
    slug,
    dialogue.lines.map((l) => l.hanzi),
  );
  return { created: await queueSentences(ids, slug) };
}
