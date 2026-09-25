/**
 * One-off backfill: give every word used by a queued sentence its own study
 * card (the Scenarios "Add" button now does this automatically).
 *
 *   npx tsx scripts/queue-sentence-words.ts
 */
import 'dotenv/config';
import { createClient } from '@libsql/client';
import { dbCredentials } from '../src/db/config';
import { drizzle } from 'drizzle-orm/libsql';
import { and, eq, isNotNull } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import { segmentWords } from '../src/lib/segment';

async function main() {
  const client = createClient(dbCredentials());
  const db = drizzle(client, { schema });

  const vocab = await db
    .select({ id: schema.words.id, hanzi: schema.words.hanzi })
    .from(schema.words);
  const idByHanzi = new Map(vocab.map((w) => [w.hanzi, w.id]));
  const vocabSet = new Set(idByHanzi.keys());

  const sentences = await db
    .select({ hanzi: schema.sentences.hanzi })
    .from(schema.cards)
    .innerJoin(schema.sentences, eq(schema.cards.sentenceId, schema.sentences.id));
  const have = new Set(
    (
      await db
        .select({ wordId: schema.cards.wordId })
        .from(schema.cards)
        .where(and(isNotNull(schema.cards.wordId), eq(schema.cards.mode, 'recognition')))
    ).map((r) => r.wordId),
  );

  const toCreate = new Map<number, string>();
  for (const s of sentences) {
    for (const w of segmentWords(s.hanzi, vocabSet)) {
      const id = idByHanzi.get(w)!;
      if (!have.has(id)) toCreate.set(id, w);
    }
  }
  if (toCreate.size > 0) {
    await db
      .insert(schema.cards)
      .values([...toCreate.keys()].map((wordId) => ({ wordId, mode: 'recognition' as const })));
  }
  console.log(`Queued ${toCreate.size} word(s): ${[...toCreate.values()].join(' ')}`);
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
