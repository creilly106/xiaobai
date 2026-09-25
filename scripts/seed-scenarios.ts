/**
 * Syncs scripts/data/scenarios.ts into the database. Safe to re-run:
 * - creates/updates scenario tags and sentences,
 * - unlinks sentences that were removed from a scenario,
 * - deletes unlinked sentences unless you have a study card for them
 *   (those are kept so review history isn't lost).
 */
import 'dotenv/config';
import { createClient } from '@libsql/client';
import { dbCredentials } from '../src/db/config';
import { drizzle } from 'drizzle-orm/libsql';
import { and, eq, inArray, notInArray } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import { scenarios } from './data/scenarios';

async function main() {
  const client = createClient(dbCredentials());
  const db = drizzle(client, { schema });

  let sentencesAdded = 0;
  let sentencesUpdated = 0;
  let scenariosAdded = 0;
  let linksRemoved = 0;

  for (const s of scenarios) {
    const [existing] = await db
      .select({ id: schema.tags.id })
      .from(schema.tags)
      .where(eq(schema.tags.slug, s.slug))
      .limit(1);
    let tagId: number;
    if (existing) {
      tagId = existing.id;
      await db
        .update(schema.tags)
        .set({ name: s.name, description: s.description, type: 'scenario' })
        .where(eq(schema.tags.id, tagId));
    } else {
      const [{ id }] = await db
        .insert(schema.tags)
        .values({ slug: s.slug, name: s.name, type: 'scenario', description: s.description })
        .returning({ id: schema.tags.id });
      tagId = id;
      scenariosAdded += 1;
    }

    const keep: number[] = [];
    for (const sent of s.sentences) {
      const [row] = await db
        .select()
        .from(schema.sentences)
        .where(eq(schema.sentences.hanzi, sent.hanzi))
        .limit(1);
      let sentenceId: number;
      if (row) {
        sentenceId = row.id;
        const difficulty = sent.difficulty ?? null;
        if (
          row.pinyin !== sent.pinyin ||
          row.meaning !== sent.meaning ||
          row.difficulty !== difficulty
        ) {
          await db
            .update(schema.sentences)
            .set({ pinyin: sent.pinyin, meaning: sent.meaning, difficulty })
            .where(eq(schema.sentences.id, sentenceId));
          sentencesUpdated += 1;
        }
      } else {
        const [{ id }] = await db
          .insert(schema.sentences)
          .values({
            hanzi: sent.hanzi,
            pinyin: sent.pinyin,
            meaning: sent.meaning,
            difficulty: sent.difficulty ?? null,
          })
          .returning({ id: schema.sentences.id });
        sentenceId = id;
        sentencesAdded += 1;
      }
      keep.push(sentenceId);

      const [link] = await db
        .select({ tagId: schema.sentenceTags.tagId })
        .from(schema.sentenceTags)
        .where(
          and(eq(schema.sentenceTags.sentenceId, sentenceId), eq(schema.sentenceTags.tagId, tagId)),
        )
        .limit(1);
      if (!link) await db.insert(schema.sentenceTags).values({ sentenceId, tagId });
    }

    const stale = await db
      .delete(schema.sentenceTags)
      .where(
        and(
          eq(schema.sentenceTags.tagId, tagId),
          keep.length > 0 ? notInArray(schema.sentenceTags.sentenceId, keep) : undefined,
        ),
      )
      .returning({ id: schema.sentenceTags.sentenceId });
    linksRemoved += stale.length;
  }

  // Sentences with no scenario left: delete unless they carry study progress.
  const linked = db.select({ id: schema.sentenceTags.sentenceId }).from(schema.sentenceTags);
  const withCards = db
    .select({ id: schema.cards.sentenceId })
    .from(schema.cards)
    .where(
      inArray(
        schema.cards.sentenceId,
        db.select({ id: schema.sentences.id }).from(schema.sentences),
      ),
    );
  const removed = await db
    .delete(schema.sentences)
    .where(and(notInArray(schema.sentences.id, linked), notInArray(schema.sentences.id, withCards)))
    .returning({ hanzi: schema.sentences.hanzi });
  const keptOrphans = await db
    .select({ hanzi: schema.sentences.hanzi })
    .from(schema.sentences)
    .where(notInArray(schema.sentences.id, linked));

  console.log(
    `Scenarios: +${scenariosAdded}. Sentences: +${sentencesAdded}, ~${sentencesUpdated} updated, ` +
      `${linksRemoved} unlinked, ${removed.length} deleted.`,
  );
  if (keptOrphans.length > 0) {
    console.log(
      `Kept ${keptOrphans.length} sentence(s) no longer in any scenario because they have study cards: ` +
        keptOrphans.map((r) => r.hanzi).join(' '),
    );
  }
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
