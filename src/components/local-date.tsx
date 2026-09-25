'use client';

import { useHydrated } from '@/lib/use-client';

/**
 * A date in the viewer's own timezone and locale. Rendered only in the
 * browser: the server's (UTC) formatting would differ and break hydration.
 */
export function LocalDate({
  value,
  withTime = false,
}: {
  value: Date | number;
  withTime?: boolean;
}) {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const d = new Date(value);
  return <>{withTime ? d.toLocaleString() : d.toLocaleDateString()}</>;
}
