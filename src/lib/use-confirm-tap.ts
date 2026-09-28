'use client';

import { useEffect, useState } from 'react';

/**
 * Two-tap confirmation for small destructive buttons: the first tap arms it
 * (show "Remove?"), a second tap within a few seconds does it. `key` says
 * which item is armed when one hook serves several.
 */
export function useConfirmTap(ms = 3000) {
  const [armed, setArmed] = useState<string | null>(null);
  useEffect(() => {
    if (armed === null) return;
    const timer = setTimeout(() => setArmed(null), ms);
    return () => clearTimeout(timer);
  }, [armed, ms]);
  return {
    isArmed: (key = '') => armed === key,
    arm: (key = '') => setArmed(key),
    disarm: () => setArmed(null),
  };
}
