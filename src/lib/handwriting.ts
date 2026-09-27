// Handwriting lookup: match strokes drawn on screen against the stroke centre
// lines ("medians") of ~9,500 characters from hanzi-writer-data. Everything
// runs on the device; scripts/build-handwriting.ts packs the reference data.
//
// Each stroke is resampled to a few evenly spaced points and every character
// is scaled to fit a unit square, so size and position on the pad don't
// matter. Strokes are paired greedily by shape rather than by order, so a
// wrong stroke order still finds the character; stroke direction, order and a
// stroke too many or too few each cost a little.

export type Point = [x: number, y: number];

/** Points per stroke, in the packed data and when comparing. */
export const POINTS = 6;

export type RefChar = {
  char: string;
  /** Normalised strokes, each POINTS (x, y) pairs in a unit square. */
  strokes: Float32Array[];
};

/** Resample a polyline to `n` points spaced evenly along its length. */
export function resample(points: Point[], n = POINTS): Point[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array.from({ length: n }, () => [...points[0]] as Point);
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1];
    const [bx, by] = points[i];
    lengths.push(lengths[i - 1] + Math.hypot(bx - ax, by - ay));
  }
  const total = lengths[lengths.length - 1];
  if (total === 0) return Array.from({ length: n }, () => [...points[0]] as Point);
  const out: Point[] = [];
  let seg = 1;
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    while (seg < points.length - 1 && lengths[seg] < target) seg++;
    const span = lengths[seg] - lengths[seg - 1] || 1;
    const t = Math.min(1, Math.max(0, (target - lengths[seg - 1]) / span));
    const [ax, ay] = points[seg - 1];
    const [bx, by] = points[seg];
    out.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
  }
  return out;
}

/**
 * Resample every stroke and scale the whole character into a unit square,
 * keeping its proportions and centring it (y grows downwards).
 */
export function normalize(strokes: Point[][]): Float32Array[] {
  const sampled = strokes.filter((s) => s.length > 0).map((s) => resample(s));
  const all = sampled.flat();
  if (all.length === 0) return [];
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys),
  ];
  const size = Math.max(maxX - minX, maxY - minY) || 1;
  const offX = (1 - (maxX - minX) / size) / 2;
  const offY = (1 - (maxY - minY) / size) / 2;
  return sampled.map((s) => {
    const out = new Float32Array(POINTS * 2);
    s.forEach(([x, y], i) => {
      out[i * 2] = (x - minX) / size + offX;
      out[i * 2 + 1] = (y - minY) / size + offY;
    });
    return out;
  });
}

/** Mean distance between two strokes' points; drawn backwards costs a little. */
function strokeDistance(a: Float32Array, b: Float32Array): number {
  let forward = 0;
  let backward = 0;
  for (let i = 0; i < POINTS; i++) {
    const j = POINTS - 1 - i;
    let dx = a[i * 2] - b[i * 2];
    let dy = a[i * 2 + 1] - b[i * 2 + 1];
    forward += Math.sqrt(dx * dx + dy * dy);
    dx = a[i * 2] - b[j * 2];
    dy = a[i * 2 + 1] - b[j * 2 + 1];
    backward += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.min(forward, backward + REVERSED * POINTS) / POINTS;
}

const REVERSED = 0.08;
/** Per stroke drawn out of its usual place in the order (scaled 0–1). */
const ORDER = 0.06;
/** A stroke with no partner: missing, or one too many. */
const UNMATCHED = 0.3;
/** How far the stroke count may be off. */
const COUNT_SLACK = 2;

// Reused between calls: this runs thousands of times per lookup.
let costs = new Float64Array(0);

/**
 * How unlike `input` the reference is (0 = identical). Gives up early and
 * returns Infinity once it can't beat `cutoff`.
 */
export function matchCost(input: Float32Array[], ref: Float32Array[], cutoff = Infinity): number {
  const n = input.length;
  const m = ref.length;
  const size = Math.max(n, m);
  const limit = cutoff * size - UNMATCHED * Math.abs(n - m);
  if (costs.length < n * m) costs = new Float64Array(n * m * 2);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const order = Math.abs(i / Math.max(n - 1, 1) - j / Math.max(m - 1, 1));
      costs[i * m + j] = strokeDistance(input[i], ref[j]) + ORDER * order;
    }
  }
  // Greedily pair the closest strokes first. The running total only grows,
  // so a character that's already worse than the cutoff can be dropped.
  let total = 0;
  for (let k = Math.min(n, m); k > 0; k--) {
    let best = Infinity;
    let at = -1;
    for (let c = 0; c < n * m; c++) {
      if (costs[c] < best) {
        best = costs[c];
        at = c;
      }
    }
    total += best;
    if (total > limit) return Infinity;
    const i = Math.floor(at / m);
    const j = at % m;
    for (let jj = 0; jj < m; jj++) costs[i * m + jj] = Infinity;
    for (let ii = 0; ii < n; ii++) costs[ii * m + j] = Infinity;
  }
  return (total + UNMATCHED * Math.abs(n - m)) / size;
}

/**
 * The likeliest characters for what was drawn, best first. `rank` (common
 * characters low) breaks near-ties in favour of characters people meet.
 */
export function recognize(
  drawn: Point[][],
  refs: RefChar[],
  { rank, limit = 12 }: { rank?: Map<string, number>; limit?: number } = {},
): { char: string; cost: number }[] {
  const input = normalize(drawn);
  if (input.length === 0) return [];
  const best: { char: string; cost: number }[] = [];
  const rankSize = rank?.size || 1;
  for (const ref of refs) {
    if (Math.abs(ref.strokes.length - input.length) > COUNT_SLACK) continue;
    const r = rank?.get(ref.char);
    const bonus = 0.04 * (r === undefined ? 1 : r / rankSize);
    const worst = best.length < limit ? Infinity : best[best.length - 1].cost;
    const cost = matchCost(input, ref.strokes, worst - bonus) + bonus;
    if (cost >= worst) continue;
    // Keep the best `limit` sorted as we go.
    let at = best.length;
    while (at > 0 && best[at - 1].cost > cost) at--;
    best.splice(at, 0, { char: ref.char, cost });
    if (best.length > limit) best.pop();
  }
  return best;
}

/*
 * Packed reference data (public/find-data/strokes.bin): for each character, its
 * code point (3 bytes), stroke count (1 byte), then POINTS points per stroke
 * as (x, y) bytes in a 0–255 box, y downwards.
 */

/** hanzi-writer medians are in a 1024 box with y up (the glyph sits at y 900 → -124). */
export function encodeStrokeData(chars: { char: string; medians: Point[][] }[]): Uint8Array {
  const bytes: number[] = [];
  const q = (v: number) => Math.max(0, Math.min(255, Math.round((v / 1024) * 255)));
  for (const { char, medians } of chars) {
    const cp = char.codePointAt(0)!;
    if (medians.length === 0 || medians.length > 255) continue;
    bytes.push(cp >> 16, (cp >> 8) & 255, cp & 255, medians.length);
    for (const stroke of medians) {
      for (const [x, y] of resample(stroke)) bytes.push(q(x), q(900 - y));
    }
  }
  return Uint8Array.from(bytes);
}

export function decodeStrokeData(data: Uint8Array): RefChar[] {
  const refs: RefChar[] = [];
  let at = 0;
  while (at + 4 <= data.length) {
    const char = String.fromCodePoint((data[at] << 16) | (data[at + 1] << 8) | data[at + 2]);
    const count = data[at + 3];
    at += 4;
    const strokes: Point[][] = [];
    for (let s = 0; s < count; s++) {
      const stroke: Point[] = [];
      for (let p = 0; p < POINTS; p++, at += 2) stroke.push([data[at], data[at + 1]]);
      strokes.push(stroke);
    }
    refs.push({ char, strokes: normalize(strokes) });
  }
  return refs;
}
