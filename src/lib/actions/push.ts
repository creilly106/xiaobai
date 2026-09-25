'use server';

import { eq } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { sendReminders } from '@/lib/reminders';

type SubscriptionJson = { endpoint?: string; keys?: { p256dh?: string; auth?: string } };

/** Remember this device for daily reminders (updating it if it's already known). */
export async function savePushSubscription(sub: SubscriptionJson, timeZone: string | null) {
  const endpoint = sub.endpoint;
  const p256dh = sub.keys?.p256dh;
  const auth = sub.keys?.auth;
  if (!endpoint || !p256dh || !auth || !endpoint.startsWith('https://')) {
    throw new Error('Invalid push subscription.');
  }
  const tz = typeof timeZone === 'string' && timeZone.length < 64 ? timeZone : null;
  await db
    .insert(schema.pushSubscriptions)
    .values({ endpoint, p256dh, auth, timeZone: tz })
    .onConflictDoUpdate({
      target: schema.pushSubscriptions.endpoint,
      set: { p256dh, auth, timeZone: tz },
    });
}

export async function removePushSubscription(endpoint: string) {
  await db.delete(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.endpoint, endpoint));
}

/** Send a reminder right now, to check it arrives. */
export async function sendTestReminder() {
  return sendReminders({ force: true });
}
