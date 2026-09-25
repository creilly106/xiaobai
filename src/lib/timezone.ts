import 'server-only';
import { cookies } from 'next/headers';
import { TZ_COOKIE } from './dates';

/** The learner's timezone (set by the browser, see TimeZoneCookie), if valid. */
export async function userTimeZone(): Promise<string | undefined> {
  const tz = (await cookies()).get(TZ_COOKIE)?.value;
  if (!tz) return undefined;
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return tz;
  } catch {
    return undefined;
  }
}
