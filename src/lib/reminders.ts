import 'server-only';
import { desc, eq, gte, sql } from 'drizzle-orm';
import webpush from 'web-push';
import { db, schema } from '@/db/client';
import { createBackup } from '@/lib/backup';
import { startOfLocalDay } from '@/lib/dates';
import { VAPID_PUBLIC_KEY } from '@/lib/push-config';
import { getPath } from '@/lib/queries/path';
import { getAvailability } from '@/lib/queries/settings';

/** Contact for the push services, as the Web Push spec asks. */
const VAPID_SUBJECT = 'https://github.com/creilly106/xiaobai';
const SNAPSHOT_EVERY_MS = 6.5 * 86_400_000;
const SNAPSHOTS_KEPT = 4;

export function pushConfigured(): boolean {
  const key = process.env.VAPID_PRIVATE_KEY;
  if (!key) return false;
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, key);
  return true;
}

type Message = { title: string; body: string; url: string };

/** "12 cards to review · Next lesson: Seven to ten", or null if there's nothing to do. */
async function reminderMessage(): Promise<Message | null> {
  const [availability, path] = await Promise.all([getAvailability(), getPath()]);
  const parts: string[] = [];
  if (availability.totalDue > 0) {
    parts.push(`${availability.totalDue} card${availability.totalDue === 1 ? '' : 's'} to review`);
  }
  if (path.current) parts.push(`Next lesson: ${path.current.title}`);
  if (parts.length === 0) return null;
  return {
    title: '小白 · Time for some Chinese',
    body: parts.join(' · '),
    url: availability.totalDue > 0 ? '/study' : `/learn/${path.current!.id}`,
  };
}

async function studiedToday(timeZone: string | null): Promise<boolean> {
  const since = startOfLocalDay(new Date(), timeZone ?? undefined);
  const [row] = await db
    .select({ n: sql<number>`count(*)` })
    .from(schema.reviews)
    .where(gte(schema.reviews.reviewedAt, since));
  return Number(row?.n ?? 0) > 0;
}

/**
 * Send today's reminder to every subscribed device — skipping anyone who has
 * already studied today (unless `force`, for "send a test"). Devices that have
 * unsubscribed are removed.
 */
export async function sendReminders({ force = false } = {}) {
  if (!pushConfigured())
    return { sent: 0, skipped: 0, removed: 0, error: 'VAPID_PRIVATE_KEY is not set' };
  const subs = await db.select().from(schema.pushSubscriptions);
  const message = await reminderMessage();
  let sent = 0;
  let skipped = 0;
  let removed = 0;
  for (const sub of subs) {
    const payload =
      message ??
      (force ? { title: '小白 Xiaobai', body: 'Reminders are working.', url: '/' } : null);
    if (!payload || (!force && (await studiedToday(sub.timeZone)))) {
      skipped++;
      continue;
    }
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload),
      );
      await db
        .update(schema.pushSubscriptions)
        .set({ lastSentAt: new Date() })
        .where(eq(schema.pushSubscriptions.id, sub.id));
      sent++;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await db.delete(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.id, sub.id));
        removed++;
      } else {
        console.error('Push failed', status, err);
      }
    }
  }
  return { sent, skipped, removed };
}

/** Keep a copy of your data in the database about once a week (the last four). */
export async function weeklySnapshot() {
  const [latest] = await db
    .select({ createdAt: schema.dbSnapshots.createdAt })
    .from(schema.dbSnapshots)
    .orderBy(desc(schema.dbSnapshots.createdAt))
    .limit(1);
  if (latest && Date.now() - latest.createdAt.getTime() < SNAPSHOT_EVERY_MS)
    return { taken: false };
  await db.insert(schema.dbSnapshots).values({ data: JSON.stringify(await createBackup()) });
  const keep = await db
    .select({ id: schema.dbSnapshots.id })
    .from(schema.dbSnapshots)
    .orderBy(desc(schema.dbSnapshots.createdAt))
    .limit(SNAPSHOTS_KEPT);
  await db.delete(schema.dbSnapshots).where(
    sql`${schema.dbSnapshots.id} NOT IN (${sql.join(
      keep.map((k) => sql`${k.id}`),
      sql`, `,
    )})`,
  );
  return { taken: true };
}
