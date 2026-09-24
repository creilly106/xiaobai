import { TONE_CONTOUR, type Tone } from '@/lib/pinyin';

/** Pitch shape on the 5-level Chao scale; neutral is a short dot. */
export function ToneContour({ tone, className = 'h-5 w-8' }: { tone: Tone; className?: string }) {
  const pts = TONE_CONTOUR[tone];
  const W = 32;
  const H = 20;
  const y = (level: number) => H - 2 - ((level - 1) / 4) * (H - 4);
  if (pts.length === 1) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
        <circle cx={W / 2} cy={y(pts[0])} r={2.5} fill="currentColor" />
      </svg>
    );
  }
  const step = (W - 6) / (pts.length - 1);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${3 + i * step},${y(p)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
