// Question generation for the numbers drill. Pure, so it can be tested.
import { sameChineseNumber, toChinese } from '@/lib/numbers';

export type Mode = 'read' | 'listen' | 'say';
export const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'read', label: 'Read', desc: 'See Chinese, type the number' },
  { key: 'listen', label: 'Listen', desc: 'Hear it, type the number' },
  { key: 'say', label: 'Say', desc: 'See the number, pick the Chinese' },
];

export const RANGES = [
  { key: '10', label: '0–10', minDigits: 1, maxDigits: 1, max: 10 },
  { key: '99', label: '0–99', minDigits: 1, maxDigits: 2, max: 99 },
  { key: '999', label: '0–999', minDigits: 2, maxDigits: 3, max: 999 },
  { key: '9999', label: '0–9,999', minDigits: 3, maxDigits: 4, max: 9_999 },
  { key: 'wan', label: '万 and up', minDigits: 5, maxDigits: 8, max: 99_999_999 },
] as const;

export type RangeKey = (typeof RANGES)[number]['key'];

export function randomNumber(range: (typeof RANGES)[number]): number {
  if (range.key === '10') return Math.floor(Math.random() * 11);
  const digits =
    range.minDigits + Math.floor(Math.random() * (range.maxDigits - range.minDigits + 1));
  let s = String(1 + Math.floor(Math.random() * 9));
  for (let i = 1; i < digits; i++) {
    // Extra zeros so the 零 rules get practised.
    s += Math.random() < 0.3 ? '0' : String(Math.floor(Math.random() * 10));
  }
  return Math.min(Number(s), range.max);
}

/** Plausible wrong answers: a digit changed, a zero moved, a place slipped. */
export function distractors(n: number, max: number): string[] {
  const correct = toChinese(n);
  const out = new Set<string>();
  const s = String(n);
  const tries: number[] = [n * 10, Math.floor(n / 10), n + 1, n - 1, n + 10, n - 10];
  for (let i = 0; i < s.length; i++) {
    // Nudge one digit.
    const d = Number(s[i]);
    tries.push(Number(s.slice(0, i) + ((d + 1) % 10) + s.slice(i + 1)));
    // Swap neighbours — moves zeros around, e.g. 1005 ↔ 1050.
    if (i > 0) tries.push(Number(s.slice(0, i - 1) + s[i] + s[i - 1] + s.slice(i + 1)));
  }
  // The classic mistake: dropping the 零.
  const noZero = correct.replace(/零/g, '');
  if (noZero !== correct && noZero) out.add(noZero);
  for (const t of tries.sort(() => Math.random() - 0.5)) {
    if (out.size >= 3) break;
    if (!Number.isInteger(t) || t < 0 || t > max || t === n) continue;
    const zh = toChinese(t);
    if (!sameChineseNumber(zh, correct)) out.add(zh);
  }
  return [...out].slice(0, 3);
}

export type Question = { n: number; zh: string; options: string[] };
export type Feedback = { correct: boolean; given: string } | null;

export function makeQuestion(range: (typeof RANGES)[number], mode: Mode): Question {
  const n = randomNumber(range);
  const zh = toChinese(n);
  const options =
    mode === 'say' ? [zh, ...distractors(n, range.max)].sort(() => Math.random() - 0.5) : [];
  return { n, zh, options };
}
