import { describe, expect, it } from 'vitest';
import { toneAccuracy } from './practice-stats';

describe('toneAccuracy', () => {
  it('tallies each syllable and finds the most common mix-up', () => {
    const { tones, worst } = toneAccuracy([
      JSON.stringify({ heard: [2], answered: [3] }),
      JSON.stringify({ heard: [2], answered: [3] }),
      JSON.stringify({ heard: [2, 3], answered: [2, 3] }),
      JSON.stringify({ heard: [4], answered: [1] }),
    ]);
    expect(tones).toEqual([
      { tone: 2, right: 1, total: 3 },
      { tone: 3, right: 1, total: 1 },
      { tone: 4, right: 0, total: 1 },
    ]);
    expect(worst).toEqual({ heard: 2, answered: 3, count: 2 });
  });

  it('ignores rows it cannot read', () => {
    expect(toneAccuracy([null, 'not json', '{"heard":"x"}'])).toEqual({ tones: [], worst: null });
  });
});
