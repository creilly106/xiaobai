import 'server-only';
import { desc, isNull } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { Flag } from '@/db/schema';

/** Open flags, newest first. */
export async function getOpenFlags(): Promise<Flag[]> {
  return db
    .select()
    .from(schema.flags)
    .where(isNull(schema.flags.resolvedAt))
    .orderBy(desc(schema.flags.createdAt));
}
