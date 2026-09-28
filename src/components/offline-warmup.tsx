'use client';

import { useEffect } from 'react';
import { clipUrlsFor } from '@/lib/tts';

/**
 * Asks the service worker to fetch pages and audio ahead of time, so they
 * work offline (the next lesson, today's reviews). Runs once the page is idle,
 * only when online, and not on a data-saving connection.
 */
/** The same things aren't fetched again within this long (each is a full page render). */
const FRESH_MS = 30 * 60_000;
const WARMED_KEY = 'xiaobai:warmed';

function readWarmed(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(WARMED_KEY) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function recentlyWarmed(key: string): boolean {
  return Date.now() - (readWarmed()[key] ?? 0) < FRESH_MS;
}

function markWarmed(key: string) {
  const now = Date.now();
  const fresh = Object.fromEntries(
    Object.entries(readWarmed()).filter(([, at]) => now - at < FRESH_MS),
  );
  try {
    localStorage.setItem(WARMED_KEY, JSON.stringify({ ...fresh, [key]: now }));
  } catch {
    // Storage unavailable: we'll just fetch again next time.
  }
}

export function OfflineWarmup({ pages = [], texts = [] }: { pages?: string[]; texts?: string[] }) {
  const key = JSON.stringify([pages, texts]);
  useEffect(() => {
    const [p, t] = JSON.parse(key) as [string[], string[]];
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (!('serviceWorker' in navigator) || !navigator.onLine || saveData) return;
    if (recentlyWarmed(key)) return;
    const timer = setTimeout(async () => {
      markWarmed(key);
      const reg = await navigator.serviceWorker.ready;
      const audio = t.length ? await clipUrlsFor(t) : [];
      reg.active?.postMessage({ type: 'warm', urls: [...p, ...audio] });
    }, 3000);
    return () => clearTimeout(timer);
  }, [key]);
  return null;
}
