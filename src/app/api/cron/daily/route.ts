import { timingSafeEqual } from 'node:crypto';
import { sendReminders, weeklySnapshot } from '@/lib/reminders';

/**
 * Called once a day by Vercel Cron (vercel.json): sends study reminders and
 * takes the weekly data snapshot. Vercel authenticates with CRON_SECRET; the
 * password gate lets this path through for that reason.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return new Response('Unauthorized', { status: 401 });
  }
  // One failing mustn't stop the other (a reminder error used to skip the snapshot).
  const [reminders, snapshot] = await Promise.allSettled([sendReminders(), weeklySnapshot()]);
  const value = (r: PromiseSettledResult<unknown>) =>
    r.status === 'fulfilled' ? r.value : { error: String(r.reason) };
  const failed = reminders.status === 'rejected' || snapshot.status === 'rejected';
  return Response.json(
    { reminders: value(reminders), snapshot: value(snapshot) },
    { status: failed ? 500 : 200 },
  );
}
