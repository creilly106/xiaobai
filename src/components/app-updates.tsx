'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloudOff } from 'lucide-react';
import { toast } from 'sonner';
import { completeCheckpoint, completeLesson } from '@/lib/actions/path';
import { rateCard } from '@/lib/actions/study';
import {
  pendingCount,
  readPending,
  readPendingRatings,
  removePending,
  shiftPendingRating,
} from '@/lib/pending-progress';

/** Fired whenever something is queued or sent, so the banner can update. */
export const PENDING_EVENT = 'xiaobai:pending';
export const notifyPending = () => window.dispatchEvent(new Event(PENDING_EVENT));

/** The deployment this page was built by (Next sets it when deploymentId is configured). */
const pageDeployment = () =>
  typeof document === 'undefined' ? null : (document.documentElement.dataset.dplId ?? null);

/**
 * Why a save might have failed: no connection, a newer version of the app is
 * live (this page's server calls are stale), or neither.
 */
export async function connectionState(): Promise<'offline' | 'outdated' | 'ok'> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 'offline';
  try {
    const res = await fetch('/api/version', { cache: 'no-store' });
    const { id } = (await res.json()) as { id: string | null };
    const mine = pageDeployment();
    return mine && id && id !== mine ? 'outdated' : 'ok';
  } catch {
    return 'offline';
  }
}

/** True when a newer deployment is live than the one this page came from. */
export async function isAppOutdated(): Promise<boolean> {
  return (await connectionState()) === 'outdated';
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

/** Pages where a reload would throw away work in progress. */
const BUSY = /^\/(learn\/.+|study|quiz\/.+|read\/.+|tones|numbers)/;

let flushing = false;

/** Send everything saved on this device, oldest first. Returns how many went. */
async function flushPending(): Promise<{ ratings: number; lessons: number }> {
  if (flushing) return { ratings: 0, lessons: 0 };
  flushing = true;
  let ratings = 0;
  let lessons = 0;
  try {
    // Ratings in order: each one's schedule depends on the one before.
    for (const r of readPendingRatings()) {
      try {
        await rateCard(r.cardId, r.rating, r.elapsedMs, undefined, r.at);
      } catch (err) {
        // A card that no longer exists can't be rated; anything else, retry later.
        if (!(err instanceof Error && /not found/i.test(err.message))) break;
      }
      shiftPendingRating();
      ratings++;
    }
    for (const item of readPending()) {
      try {
        if (item.kind === 'lesson') await completeLesson(item.id, item.results, item.score);
        else await completeCheckpoint(item.id, item.results, item.score);
      } catch {
        break;
      }
      removePending(item.kind, item.id);
      lessons++;
    }
  } finally {
    flushing = false;
    if (ratings || lessons) notifyPending();
  }
  return { ratings, lessons };
}

/**
 * Keeps an app that stays open for days (the home-screen app) in step: sends
 * answers saved on this device while offline or during an update, shows when
 * you're offline, and reloads a stale page when you come back to it — unless
 * you're in the middle of something.
 */
export function AppUpdates() {
  const router = useRouter();
  const pathname = usePathname();
  const [offline, setOffline] = useState(false);
  const [waiting, setWaiting] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setOffline(!navigator.onLine);
      setWaiting(pendingCount());
    };
    async function sync() {
      refresh();
      if (!navigator.onLine) return;
      const { ratings, lessons } = await flushPending();
      refresh();
      if (ratings || lessons) {
        const parts = [
          lessons && `${lessons} lesson${lessons === 1 ? '' : 's'}`,
          ratings && `${ratings} review${ratings === 1 ? '' : 's'}`,
        ].filter(Boolean);
        toast.success(`Saved ${parts.join(' and ')} from this device.`);
        router.refresh();
      }
    }
    void sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', refresh);
    window.addEventListener(PENDING_EVENT, refresh);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', refresh);
      window.removeEventListener(PENDING_EVENT, refresh);
    };
  }, [router]);

  useEffect(() => {
    async function check() {
      if (document.visibilityState !== 'visible' || BUSY.test(pathname)) return;
      if (await isAppOutdated()) window.location.reload();
    }
    document.addEventListener('visibilitychange', check);
    return () => document.removeEventListener('visibilitychange', check);
  }, [pathname]);

  if (!offline && waiting === 0) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-amber-500/95 px-4 py-1 text-xs font-medium text-amber-950"
    >
      <CloudOff className="size-3.5" />
      {offline
        ? waiting > 0
          ? `Offline — ${waiting} answer${waiting === 1 ? '' : 's'} saved on this phone, sent when you're back online`
          : "Offline — you can keep studying; answers are sent when you're back online"
        : `Sending ${waiting} saved answer${waiting === 1 ? '' : 's'}…`}
    </div>
  );
}
