'use client';

import { useEffect } from 'react';

/** Registers public/sw.js, which receives reminder notifications. */
export function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Not fatal: only reminders need it.
    });
  }, []);
  return null;
}
