import { eq } from 'drizzle-orm';
import { db, schema } from '@/db/client';

/** Download one of the weekly snapshots (the same format as a Settings backup). */
export async function GET(_request: Request, ctx: RouteContext<'/api/backup/snapshot/[id]'>) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return new Response('Not found', { status: 404 });
  const [row] = await db.select().from(schema.dbSnapshots).where(eq(schema.dbSnapshots.id, id));
  if (!row) return new Response('Not found', { status: 404 });
  const date = row.createdAt.toISOString().slice(0, 10);
  return new Response(row.data, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="xiaobai-snapshot-${date}.json"`,
    },
  });
}
