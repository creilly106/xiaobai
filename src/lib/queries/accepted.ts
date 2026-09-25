import 'server-only';
import { and, eq, inArray } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { senses } from '@/lib/dictionary-search';
import { sensesOf } from '@/lib/meaning-grade';

/** Senses that point elsewhere rather than give a meaning. */
const CROSS_REF = /^(old |archaic |erhua )?variant of|^see |^used in |^abbr\. for|^surname /i;

/**
 * Every sense a typed English answer may match for each word: its library
 * meaning plus all its CC-CEDICT senses (not names or cross-references).
 */
export async function acceptedMeanings(
  words: { hanzi: string; meaning: string }[],
): Promise<Map<string, string[]>> {
  const hanzi = [...new Set(words.map((w) => w.hanzi))];
  const rows = hanzi.length
    ? await db
        .select({
          simplified: schema.dictionary.simplified,
          definitions: schema.dictionary.definitions,
        })
        .from(schema.dictionary)
        .where(
          and(inArray(schema.dictionary.simplified, hanzi), eq(schema.dictionary.proper, false)),
        )
    : [];
  const extra = new Map<string, string[]>();
  for (const r of rows) {
    const found = senses(r.definitions)
      .flatMap(sensesOf)
      .filter((m) => !CROSS_REF.test(m));
    extra.set(r.simplified, [...(extra.get(r.simplified) ?? []), ...found]);
  }
  return new Map(
    words.map((w) => [
      w.hanzi,
      [...new Set([...sensesOf(w.meaning), ...(extra.get(w.hanzi) ?? [])])],
    ]),
  );
}
