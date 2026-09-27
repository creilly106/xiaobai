'use client';

import { useEffect } from 'react';
import { clipUrlsFor } from '@/lib/tts';

/**
 * Asks the service worker to fetch pages and audio ahead of time, so they
 * work offline (the next lesson, today's reviews). Runs once the page is idle,
 * only when online, and not on a data-saving connection.
 */
export function OfflineWarmup({ pages = [], texts = [] }: { pages?: string[]; texts?: string[] }) {
  const key = JSON.stringify([pages, texts]);
  useEffect(() => {
    const [p, t] = JSON.parse(key) as [string[], string[]];
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (!('serviceWorker' in navigator) || !navigator.onLine || saveData) return;
    const timer = setTimeout(async () => {
      const reg = await navigator.serviceWorker.ready;
      const audio = t.length ? await clipUrlsFor(t) : [];
      reg.active?.postMessage({ type: 'warm', urls: [...p, ...audio] });
    }, 3000);
    return () => clearTimeout(timer);
  }, [key]);
  return null;
}
