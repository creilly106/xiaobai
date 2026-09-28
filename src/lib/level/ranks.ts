// The rank ladder, from 小白 (the app's name: "a complete beginner") to 大师.
// A rank is earned by passing its promotion exam, which opens once your
// Level check puts you at that HSK level. Pure, so it can be tested.

export type Rank = {
  /** The HSK level the rank stands for (0 = before HSK 1). */
  level: number;
  hanzi: string;
  pinyin: string;
  name: string;
};

export const RANKS: Rank[] = [
  { level: 0, hanzi: '小白', pinyin: 'xiǎobái', name: 'Beginner' },
  { level: 1, hanzi: '入门', pinyin: 'rùmén', name: 'Through the door' },
  { level: 2, hanzi: '学徒', pinyin: 'xuétú', name: 'Apprentice' },
  { level: 3, hanzi: '熟手', pinyin: 'shúshǒu', name: 'Practised hand' },
  { level: 4, hanzi: '老手', pinyin: 'lǎoshǒu', name: 'Old hand' },
  { level: 5, hanzi: '高手', pinyin: 'gāoshǒu', name: 'Expert' },
  { level: 6, hanzi: '大师', pinyin: 'dàshī', name: 'Master' },
];

/** The highest HSK level with enough content to examine. */
export const TOP_EXAM_LEVEL = 5;

export const rankAt = (level: number): Rank => RANKS.find((r) => r.level === level) ?? RANKS[0];

/** Promotion exams: 80% overall and at least 60% in every skill. */
export const PASS_OVERALL = 0.8;
export const PASS_EACH = 0.6;
/** After failing an exam, wait this long to try it again. */
export const RETRY_AFTER_MS = 3 * 86_400_000;
/** A Level check is due again after a week. */
export const CHECK_EVERY_MS = 7 * 86_400_000;

export type SectionScore = { right: number; total: number };

/** Whether an exam was passed, and the weakest skill if not. */
export function examResult(sections: Record<string, SectionScore>): {
  passed: boolean;
  score: number;
  weakest: string | null;
} {
  const all = Object.values(sections);
  const right = all.reduce((n, s) => n + s.right, 0);
  const total = all.reduce((n, s) => n + s.total, 0);
  const score = total ? right / total : 0;
  const ratios = Object.entries(sections)
    .filter(([, s]) => s.total > 0)
    .map(([skill, s]) => [skill, s.right / s.total] as const)
    .sort((a, b) => a[1] - b[1]);
  const passed = score >= PASS_OVERALL && ratios.every(([, r]) => r >= PASS_EACH);
  return { passed, score, weakest: passed ? null : (ratios[0]?.[0] ?? null) };
}

/**
 * The exam you can take next: the highest rank above yours that your overall
 * level has reached (you can skip ranks), if any content exists for it.
 */
export function examOpen(currentRank: number, overall: number | null): number | null {
  if (overall == null) return null;
  const reached = Math.min(Math.floor(overall + 1e-9), TOP_EXAM_LEVEL);
  return reached > currentRank ? reached : null;
}

/** Progress from your rank toward the next, 0–1, from your overall level. */
export function towardNext(currentRank: number, overall: number | null): number {
  if (overall == null) return 0;
  return Math.max(0, Math.min(1, overall - currentRank));
}

export type Milestone = { key: string; title: string; detail: string };

/** Everything that can be reached, in the order it's shown. */
export const MILESTONES: Milestone[] = [
  ...[100, 500, 1000, 2500].map((n) => ({
    key: `words-${n}`,
    title: `${n.toLocaleString('en')} words`,
    detail: `Know ${n.toLocaleString('en')} words (in long-term review)`,
  })),
  ...[1, 2, 3, 4, 5].map((n) => ({
    key: `path-hsk${n}`,
    title: `HSK ${n} path`,
    detail: `Finish every HSK ${n} lesson on the Learn path`,
  })),
  ...[1, 2, 3, 4, 5].map((n) => ({
    key: `stories-hsk${n}`,
    title: `HSK ${n} reader`,
    detail: `Read every HSK ${n} story`,
  })),
  { key: 'streak-30', title: '30-day streak', detail: 'Study 30 days in a row' },
  { key: 'check-perfect', title: 'Clean sweep', detail: 'Get everything right in a Level check' },
  ...[1, 2, 3, 4, 5].map((n) => ({
    key: `rank-${n}`,
    title: rankAt(n).hanzi,
    detail: `Pass the ${rankAt(n).hanzi} (${rankAt(n).name}) exam`,
  })),
];
