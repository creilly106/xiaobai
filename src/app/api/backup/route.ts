import { revalidatePath } from 'next/cache';
import { assertBackup, createBackup, restoreBackup, writeBackupFile } from '@/lib/backup';
import { localDateKey } from '@/lib/dates';

/** Download everything as one JSON file. */
export async function GET() {
  const backup = await createBackup();
  const filename = `xiaobai-backup-${localDateKey(new Date())}.json`;
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

  // Best effort: hosts with a read-only disk (Vercel) can't keep a file copy.
  // The restore itself is one transaction, so a failure changes nothing.
  const safetyCopy = await writeBackupFile('pre-restore').catch(() => null);
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
