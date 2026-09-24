import { sql } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

/**
 * Give every graduated (review-state) recognition card its follow-up cards:
 * a listening card for words and sentences, and a production card
 * (English → Chinese) for words. Idempotent — the unique (item, mode) indexes
 * skip ones that already exist. Takes the db as a parameter so scripts can
 * call it too.
 */
export async function backfillFollowUpCards(
  db: LibSQLDatabase<Record<string, unknown>>,
  { listening, production }: { listening: boolean; production: boolean },
): Promise<number> {
  let created = 0;
  if (listening) {
    const r = await db.run(sql`
      INSERT INTO cards (word_id, sentence_id, mode)
      SELECT c.word_id, c.sentence_id,
             CASE c.mode WHEN 'recognition' THEN 'listening' ELSE 'sentence-listening' END
      FROM cards c
      WHERE c.mode IN ('recognition', 'sentence-recognition') AND c.state = 'review'
      ON CONFLICT DO NOTHING
    `);
    created += r.rowsAffected;
  }
  if (production) {
    const r = await db.run(sql`
      INSERT INTO cards (word_id, mode)
      SELECT c.word_id, 'production'
      FROM cards c
      WHERE c.mode = 'recognition' AND c.state = 'review' AND c.word_id IS NOT NULL
      ON CONFLICT DO NOTHING
    `);
    created += r.rowsAffected;
  }
  return created;
}
