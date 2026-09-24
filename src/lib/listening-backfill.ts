import { sql } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

/**
 * Give every graduated (review-state) word or sentence its listening card.
 * Idempotent: the unique (item, mode) indexes skip ones that already exist.
 * Takes the db as a parameter so scripts can call it too.
 */
export async function backfillListeningCards(
  db: LibSQLDatabase<Record<string, unknown>>,
): Promise<number> {
  const result = await db.run(sql`
    INSERT INTO cards (word_id, sentence_id, mode)
    SELECT c.word_id, c.sentence_id,
           CASE c.mode WHEN 'recognition' THEN 'listening' ELSE 'sentence-listening' END
    FROM cards c
    WHERE c.mode IN ('recognition', 'sentence-recognition') AND c.state = 'review'
    ON CONFLICT DO NOTHING
  `);
  return result.rowsAffected;
}
