import { revalidatePath } from 'next/cache';
import { db, schema } from '@/db/client';
import { assertBackup, createBackup, restoreBackup, writeBackupFile } from '@/lib/backup';
import { localDateKey } from '@/lib/dates';
import { userTimeZone } from '@/lib/timezone';

/** Download everything as one JSON file. */
export async function GET() {
  const backup = await createBackup();
  const filename = `xiaobai-backup-${localDateKey(new Date(), await userTimeZone())}.json`;
  return new Response(JSON.stringify(backup), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

/** Replace the database with an uploaded backup (a safety copy is saved first). */
export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "That file isn't valid JSON." }, { status: 400 });
  }
  try {
    assertBackup(data);
  } catch (err) {
    return Response.json({ ok: false, error: (err as Error).message }, { status: 400 });
  }

  // A safety copy first: a file where the disk allows it, otherwise (Vercel's
  // disk is read-only) a snapshot in the database, which restores don't touch —
  // it's listed under Settings → Backup. The restore itself is one
  // transaction, so a failure changes nothing.
  const safetyCopy = await writeBackupFile('pre-restore').catch(async () => {
    await db.insert(schema.dbSnapshots).values({ data: JSON.stringify(await createBackup()) });
    return 'snapshot';
  });
  try {
    const { rows } = await restoreBackup(data);
    revalidatePath('/', 'layout');
    return Response.json({ ok: true, rows, safetyCopy });
  } catch (err) {
    console.error('Restore failed', err);
    return Response.json(
      { ok: false, error: 'Restore failed — nothing was changed.', safetyCopy },
      { status: 500 },
    );
  }
}
