import { sendReminders, weeklySnapshot } from '@/lib/reminders';

/**
 * Called once a day by Vercel Cron (vercel.json): sends study reminders and
 * takes the weekly data snapshot. Vercel authenticates with CRON_SECRET; the
 * password gate lets this path through for that reason.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const [reminders, snapshot] = await Promise.all([sendReminders(), weeklySnapshot()]);
  return Response.json({ reminders, snapshot });
}
