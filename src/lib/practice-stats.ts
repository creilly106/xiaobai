// Pure summaries of practice_log rows (see queries/practice.ts).

export type ToneTally = { tone: number; right: number; total: number };

/**
 * Per-tone accuracy from tone-trainer answers. Each row's detail holds the
 * tones heard and answered, syllable by syllable ({"heard":[2,3],"answered":[3,3]}).
 */
export function toneAccuracy(details: (string | null)[]): {
  tones: ToneTally[];
  worst: { heard: number; answered: number; count: number } | null;
} {
  const tally = new Map<number, ToneTally>();
  const confusions = new Map<string, number>();
  for (const raw of details) {
    if (!raw) continue;
    let d: { heard?: unknown; answered?: unknown };
    try {
      d = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!Array.isArray(d.heard) || !Array.isArray(d.answered)) continue;
    d.heard.forEach((heard, i) => {
      const answered = (d.answered as unknown[])[i];
      if (typeof heard !== 'number' || typeof answered !== 'number') return;
      const t = tally.get(heard) ?? { tone: heard, right: 0, total: 0 };
      t.total += 1;
      if (heard === answered) t.right += 1;
      else
        confusions.set(`${heard}>${answered}`, (confusions.get(`${heard}>${answered}`) ?? 0) + 1);
      tally.set(heard, t);
    });
  }
  let worst: { heard: number; answered: number; count: number } | null = null;
  for (const [key, count] of confusions) {
    if (!worst || count > worst.count) {
      const [heard, answered] = key.split('>').map(Number);
      worst = { heard, answered, count };
    }
  }
  return { tones: [...tally.values()].sort((a, b) => a.tone - b.tone), worst };
}
