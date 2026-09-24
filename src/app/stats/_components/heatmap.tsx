import type { HeatmapDay } from '@/lib/queries/stats';

const CELL = 12;
const GAP = 3;

function levelFor(count: number, max: number): number {
  if (count === 0) return 0;
  if (max <= 1) return 4;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

const LEVEL_FILL = [
  'fill-muted',
  'fill-emerald-200 dark:fill-emerald-900/70',
  'fill-emerald-300 dark:fill-emerald-800',
  'fill-emerald-400 dark:fill-emerald-600',
  'fill-emerald-600 dark:fill-emerald-400',
];

export function Heatmap({ days }: { days: HeatmapDay[] }) {
  // Arrange days into columns of 7 (weeks). First column may start mid-week.
  const first = new Date(days[0]!.date + 'T00:00:00');
  const startDow = first.getDay(); // 0=Sun..6=Sat
  const total = days.length;
  const weekCount = Math.ceil((total + startDow) / 7);

  const max = days.reduce((m, d) => (d.count > m ? d.count : m), 0);
  const width = weekCount * (CELL + GAP) + 40;
  const height = 7 * (CELL + GAP) + 20;

  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  days.forEach((d, i) => {
    const dt = new Date(d.date + 'T00:00:00');
    const cellIndex = i + startDow;
    const week = Math.floor(cellIndex / 7);
    if (dt.getMonth() !== lastMonth) {
      lastMonth = dt.getMonth();
      monthLabels.push({
        x: 30 + week * (CELL + GAP),
        label: dt.toLocaleDateString(undefined, { month: 'short' }),
      });
    }
  });

  const dayLabels = ['Mon', 'Wed', 'Fri'];

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="text-muted-foreground">
        {monthLabels.map((m, i) => (
          <text
            key={i}
            x={m.x}
            y={10}
            fontSize={10}
            fill="currentColor"
            className="fill-muted-foreground"
          >
            {m.label}
          </text>
        ))}
        {dayLabels.map((label, i) => {
          const dow = i * 2 + 1;
          return (
            <text
              key={label}
              x={0}
              y={20 + dow * (CELL + GAP) + CELL - 3}
              fontSize={10}
              fill="currentColor"
              className="fill-muted-foreground"
            >
              {label}
            </text>
          );
        })}
        {days.map((d, i) => {
          const cellIndex = i + startDow;
          const week = Math.floor(cellIndex / 7);
          const dow = cellIndex % 7;
          const x = 30 + week * (CELL + GAP);
          const y = 20 + dow * (CELL + GAP);
          const lvl = levelFor(d.count, max);
          return (
            <rect
              key={d.date}
              x={x}
              y={y}
              width={CELL}
              height={CELL}
              rx={2}
              className={LEVEL_FILL[lvl]}
            >
              <title>{`${d.date}: ${d.count} review${d.count === 1 ? '' : 's'}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <svg key={lvl} width={CELL} height={CELL}>
            <rect width={CELL} height={CELL} rx={2} className={LEVEL_FILL[lvl]} />
          </svg>
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
