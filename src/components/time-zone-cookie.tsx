'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TZ_COOKIE } from '@/lib/dates';

/**
 * Tells the server this browser's timezone, so "today" (streaks, daily
 * limits) matches your day rather than the server's. Refreshes once when it
 * first learns it, or when you travel.
 */
export function TimeZoneCookie() {
  const router = useRouter();
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;
    const current = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${TZ_COOKIE}=`))
      ?.slice(TZ_COOKIE.length + 1);
    if (current === tz) return;
    // IANA names ("Asia/Shanghai") are valid cookie values as they are.
    document.cookie = `${TZ_COOKIE}=${tz}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }, [router]);
  return null;
}
