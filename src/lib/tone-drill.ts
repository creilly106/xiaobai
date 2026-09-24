// Question picking and scoring for the tone trainer. Pure, so it can be tested.
import type { Tone } from '@/lib/pinyin';
import type { ToneDrillData, ToneGroup, TonePair, ToneSingle } from '@/lib/queries/tones';

export type Mode = 'single' | 'pairs' | 'apart';

export const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'single', label: 'Single tones', desc: 'Hear one syllable, name its tone' },
  { key: 'pairs', label: 'Tone pairs', desc: 'Hear a two-syllable word, name both tones' },
  { key: 'apart', label: 'Tell apart', desc: 'Same sound, different tones — which word was it?' },
];

export type Question =
  | { kind: 'single'; item: ToneSingle }
  | { kind: 'pairs'; item: TonePair }
  | { kind: 'apart'; group: ToneGroup; target: ToneSingle };

export type Feedback = { correct: boolean; picks: Tone[]; note?: string };

/** "heard>answered" → count */
export type ConfusionStats = Record<string, number>;

export const TONES_1_4: Tone[] = [1, 2, 3, 4];
export const TONES_ALL: Tone[] = [1, 2, 3, 4, 5];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

/** Prefer vocabulary you're likely to meet (HSK words) three to one. */
export function pickWeighted<T extends { hskLevel: number | null }>(list: T[]): T {
  const hsk = list.filter((i) => i.hskLevel != null);
  return hsk.length > 0 && Math.random() < 0.75 ? pick(hsk) : pick(list);
}

export function toneAccuracy(stats: ConfusionStats, tone: Tone): { right: number; total: number } {
  let right = 0;
  let total = 0;
  for (const [key, n] of Object.entries(stats)) {
    const [heard, answered] = key.split('>').map(Number);
    if (heard !== tone) continue;
    total += n;
    if (answered === heard) right += n;
  }
  return { right, total };
}

export function makeQuestion(mode: Mode, data: ToneDrillData, stats: ConfusionStats): Question {
  if (mode === 'pairs') return { kind: 'pairs', item: pickWeighted(data.pairs) };
  if (mode === 'apart') {
    const group = pick(data.groups);
    return { kind: 'apart', group, target: pick(group.items) };
  }
  // Practise weak tones more: weight each tone by how often you miss it.
  const weights = TONES_1_4.map((t) => {
    const { right, total } = toneAccuracy(stats, t);
    const miss = total === 0 ? 0.5 : 1 - right / total;
    return 1 + 3 * miss;
  });
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  let tone: Tone = 1;
  for (let i = 0; i < 4; i++) {
    r -= weights[i];
    if (r <= 0) {
      tone = TONES_1_4[i];
      break;
    }
  }
  const pool = data.singles.filter((s) => s.tone === tone);
  return { kind: 'single', item: pickWeighted(pool.length > 0 ? pool : data.singles) };
}

export function audioText(q: Question): string {
  return q.kind === 'apart' ? q.target.hanzi : q.item.hanzi;
}
