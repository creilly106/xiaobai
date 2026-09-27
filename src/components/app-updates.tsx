'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { completeCheckpoint, completeLesson } from '@/lib/actions/path';
import { readPending, removePending } from '@/lib/pending-progress';

/** The deployment this page was built by (Next sets it when deploymentId is configured). */
const pageDeployment = () =>
  typeof document === 'undefined' ? null : (document.documentElement.dataset.dplId ?? null);

/** True when a newer deployment is live than the one this page came from. */
export async function isAppOutdated(): Promise<boolean> {
  const mine = pageDeployment();
  if (!mine) return false;
  try {
    const res = await fetch('/api/version', { cache: 'no-store' });
    const { id } = (await res.json()) as { id: string | null };
    return Boolean(id && id !== mine);
  } catch {
    return false;
  }
}

/** Pages where a reload would throw away work in progress. */
const BUSY = /^\/(learn\/.+|study|quiz\/.+|read\/.+|tones|numbers)/;

let flushing = false;

/**
 * Keeps an app that stays open for days (the home-screen app) in step with
 * updates: sends any lesson results that couldn't be saved, and reloads a
 * stale page when you come back to it — unless you're in the middle of
 * something.
 */
export function AppUpdates() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function flush() {
      if (flushing) return;
      flushing = true;
      let saved = 0;
      try {
        for (const item of readPending()) {
          try {
            if (item.kind === 'lesson') await completeLesson(item.id, item.results, item.score);
            else await completeCheckpoint(item.id, item.results, item.score);
            removePending(item.kind, item.id);
            saved++;
          } catch {
            // Still can't reach the server; keep it for next time.
            break;
          }
        }
      } finally {
        flushing = false;
      }
      if (saved > 0) {
        toast.success(saved === 1 ? 'Saved your lesson.' : `Saved ${saved} lessons.`);
        router.refresh();
      }
    }
    void flush();
    window.addEventListener('online', flush);
    return () => window.removeEventListener('online', flush);
  }, [router]);

  useEffect(() => {
    async function check() {
      if (document.visibilityState !== 'visible' || BUSY.test(pathname)) return;
      if (await isAppOutdated()) window.location.reload();
    }
    document.addEventListener('visibilitychange', check);
    return () => document.removeEventListener('visibilitychange', check);
  }, [pathname]);

  return null;
}

/**
 * After a failed save: if that's because the app was updated, reload onto the
 * new version (true). Otherwise leave it to the caller to report (false).
 */
export async function reloadIfOutdated(): Promise<boolean> {
  if (!(await isAppOutdated())) return false;
  toast('Xiaobai was updated — reloading…');
  window.location.reload();
  return true;
}
