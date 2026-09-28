import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { canKeepBackupFiles, writeBackupFile } from '@/lib/backup';
import { daysBetweenKeys, localDateKey } from '@/lib/dates';
import { userTimeZone } from '@/lib/timezone';

/**
 * Count a day of study toward the streak: any review, lesson or practice
 * answer does. The first study of a day also keeps a local backup.
 */
export async function markStudied(at: Date = new Date()): Promise<void> {
  const [settings] = await db.select().from(schema.settings).limit(1);
  if (!settings) return;
  const todayKey = localDateKey(at, await userTimeZone());
  // Keys are YYYY-MM-DD, so they compare as dates; something sent late from
  // an earlier day mustn't wind the streak back.
  if (settings.lastStudyDate != null && todayKey <= settings.lastStudyDate) return;
  if (canKeepBackupFiles()) {
    try {
      await writeBackupFile('auto');
    } catch (err) {
      console.error('Automatic backup failed', err);
    }
  }
  const continues =
    settings.lastStudyDate != null && daysBetweenKeys(settings.lastStudyDate, todayKey) === 1;
  await db
    .update(schema.settings)
    .set({
      streakDays: continues ? settings.streakDays + 1 : 1,
      lastStudyDate: todayKey,
      updatedAt: at,
    })
    .where(eq(schema.settings.id, settings.id));
}
