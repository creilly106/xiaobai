const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A time until the next review, short enough for a rating button: 10m, 5h, 3d, 2mo, 1.5y. */
export function formatInterval(ms: number): string {
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / MINUTE))}m`;
  if (ms < DAY) return `${Math.round(ms / HOUR)}h`;
  const days = Math.round(ms / DAY);
  if (days < 31) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30.4)}mo`;
  const years = Math.round((days / 365) * 10) / 10;
  return `${years}y`;
}
