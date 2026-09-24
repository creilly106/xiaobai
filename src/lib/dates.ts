export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysBetweenKeys(aKey: string, bKey: string): number {
  const a = new Date(aKey + 'T00:00:00');
  const b = new Date(bKey + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function startOfLocalDay(now = new Date()): Date {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** A streak is only "live" if you studied today or yesterday. */
export function effectiveStreak(
  streakDays: number,
  lastStudyDate: string | null,
  now = new Date(),
): number {
  if (!lastStudyDate || streakDays <= 0) return 0;
  const gap = daysBetweenKeys(lastStudyDate, localDateKey(now));
  return gap <= 1 ? streakDays : 0;
}

export function formatRelativeFuture(ms: number): string {
  const mins = Math.round(ms / 60_000);
  if (mins < 1) return 'less than a minute';
  if (mins < 60) return `${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}
