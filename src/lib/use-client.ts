'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/** false during SSR and hydration, true afterwards — without a setState-in-effect. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Whether the browser can speak (Web Speech API). Always false on the server. */
export function useTtsSupported(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => 'speechSynthesis' in window,
    () => false,
  );
}

const PREF_EVENT = 'xiaobai:pref';

function readPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * A string preference persisted in localStorage, synced across components and
 * tabs. Returns `fallback` during SSR so markup always hydrates cleanly.
 */
export function useStoredPref(
  key: string,
  fallback: string,
): [string, (next: string) => void] {
  const value = useSyncExternalStore(
    (onChange) => {
      const handler = (e: Event) => {
        if (e instanceof StorageEvent && e.key !== key) return;
        onChange();
      };
      window.addEventListener('storage', handler);
      window.addEventListener(PREF_EVENT, handler);
      return () => {
        window.removeEventListener('storage', handler);
        window.removeEventListener(PREF_EVENT, handler);
      };
    },
    () => readPref(key) ?? fallback,
    () => fallback,
  );
  const set = (next: string) => {
    try {
      localStorage.setItem(key, next);
    } catch {
      /* private mode etc. — preference just won't persist */
    }
    window.dispatchEvent(new Event(PREF_EVENT));
  };
  return [value, set];
}
