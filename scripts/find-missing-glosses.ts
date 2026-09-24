import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/db/schema';
import charData from '../src/lib/generated/char-data.json';
import { radicals } from '../src/lib/radicals-data';
import { grammarPoints } from '../src/lib/grammar-data';
import { charGlosses } from '../src/lib/char-glosses';

const CJK = /[一-鿿㐀-䶿]/;

async function main() {
  const client = createClient({ url: process.env.DATABASE_URL ?? 'file:./data/app.db' });
  const db = drizzle(client, { schema });
  const words = await db.select({ hanzi: schema.words.hanzi }).from(schema.words);
  const sentences = await db.select({ hanzi: schema.sentences.hanzi }).from(schema.sentences);

  const have = new Set(words.map((w) => w.hanzi).filter((h) => Array.from(h).length === 1));
  const seen = new Set<string>();
  const add = (s: string) => {
    for (const c of Array.from(s)) if (CJK.test(c)) seen.add(c);
  };
  words.forEach((w) => add(w.hanzi));
  sentences.forEach((s) => add(s.hanzi));
  // Components only need a gloss when the dataset has no definition for them.
  Object.entries(charData as Record<string, { definition?: string }>).forEach(([k, v]) => {
    if (!v.definition) add(k);
  });
  radicals.forEach((r) => (r.examples ?? []).forEach(add));
  grammarPoints.forEach((g) => g.examples.forEach((e) => add(e.hanzi)));

  const missing = [...seen].filter((c) => !have.has(c) && !charGlosses[c]).sort();
  console.log(`words=${have.size} glosses=${Object.keys(charGlosses).length} seen=${seen.size} uncovered=${missing.length}`);
  console.log(missing.join(''));
  client.close();
}
main();
