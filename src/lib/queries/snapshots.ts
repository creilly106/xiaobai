import 'server-only';
import { desc, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';

/** The weekly snapshots, newest first (without their data). */
export async function listSnapshots() {
  return db
    .select({
      id: schema.dbSnapshots.id,
      createdAt: schema.dbSnapshots.createdAt,
      bytes: sql<number>`length(${schema.dbSnapshots.data})`,
    })
    .from(schema.dbSnapshots)
    .orderBy(desc(schema.dbSnapshots.createdAt));
}
