import 'server-only';
import { desc, eq, sql } from 'drizzle-orm';
import webpush from 'web-push';
import { db, schema } from '@/db/client';
import { createBackup } from '@/lib/backup';
import { VAPID_PUBLIC_KEY } from '@/lib/push-config';
import { getPath } from '@/lib/queries/path';
import { getAvailability } from '@/lib/queries/settings';
import { getGoalProgress, type GoalProgress } from '@/lib/queries/goal';
import { pointsToGo } from '@/lib/goal';

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

/**
 * "18 points to today's goal · 12 cards to review · Next lesson: Seven to
 * ten", or null if there's nothing to do.
 */
async function reminderMessage(goal: GoalProgress): Promise<Message | null> {
  const [availability, path] = await Promise.all([getAvailability(), getPath()]);
  const parts: string[] = [];
  const left = pointsToGo(goal.goal, goal.today.points);
  if (goal.goal > 0 && left > 0) {
    parts.push(`${left} point${left === 1 ? '' : 's'} to today's goal`);
  }
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

/** Nothing to nag about: the goal is met, or (with no goal) you've studied today. */
function doneForToday(goal: GoalProgress): boolean {
  return goal.goal > 0 ? goal.today.points >= goal.goal : goal.today.points > 0;
}

/**
 * Send today's reminder to every subscribed device — skipping anyone who has
 * met today's goal (or, with no goal, studied at all), unless `force` ("send a
 * test"). Devices that have unsubscribed are removed.
 */
export async function sendReminders({ force = false } = {}) {
  if (!pushConfigured())
    return { sent: 0, skipped: 0, removed: 0, error: 'VAPID_PRIVATE_KEY is not set' };
  const subs = await db.select().from(schema.pushSubscriptions);
  let sent = 0;
  let skipped = 0;
  let removed = 0;
  for (const sub of subs) {
    // Each device's own day: the goal resets at its local midnight.
    const goal = await getGoalProgress(new Date(), sub.timeZone ?? undefined);
    const payload =
      (await reminderMessage(goal)) ??
      (force ? { title: '小白 Xiaobai', body: 'Reminders are working.', url: '/' } : null);
    if (!payload || (!force && doneForToday(goal))) {
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
