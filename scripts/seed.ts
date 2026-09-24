import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, sql } from 'drizzle-orm';
import * as schema from '../src/db/schema';
import { hsk1 } from './data/hsk1';
import { hsk2 } from './data/hsk2';
import { hsk3 } from './data/hsk3';
import { hsk4 } from './data/hsk4';

async function main() {
  const url = process.env.DATABASE_URL ?? 'file:./data/app.db';
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  const client = createClient({ url, authToken });
  const db = drizzle(client, { schema });

  console.log(
    `Seeding ${hsk1.length} HSK 1 + ${hsk2.length} HSK 2 + ${hsk3.length} HSK 3 + ${hsk4.length} HSK 4 words...`,
  );

  const batches: { words: typeof hsk1; level: number }[] = [
    { words: hsk1, level: 1 },
    { words: hsk2, level: 2 },
    { words: hsk3, level: 3 },
    { words: hsk4, level: 4 },
  ];
  for (const b of batches) {
    await db
      .insert(schema.words)
      .values(
        b.words.map((w) => ({
          hanzi: w.hanzi,
          pinyin: w.pinyin,
          meaning: w.meaning,
          hskLevel: b.level,
        })),
      )
      .onConflictDoNothing({ target: schema.words.hanzi });
  }

  const inserted = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.words);
  console.log(`Words table now has ${inserted[0].count} rows.`);

  for (const level of [1, 2, 3, 4] as const) {
    const existing = await db
      .select()
      .from(schema.decks)
      .where(eq(schema.decks.name, `HSK ${level}`))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(schema.decks).values({
        name: `HSK ${level}`,
        description: `HSK ${level} core vocabulary (2012 standard).`,
      });
      console.log(`Created HSK ${level} deck.`);
    }
  }

  const settingsRow = await db.select().from(schema.settings).limit(1);
  if (settingsRow.length === 0) {
    await db.insert(schema.settings).values({ id: 1 });
    console.log('Initialized settings row.');
  }

  client.close();
  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
