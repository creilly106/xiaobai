import { describe, expect, it } from 'vitest';
import { interleave, isSentenceUnlocked, orderNewCards, spreadEarly } from './queue-order';

describe('isSentenceUnlocked', () => {
  const known = new Set(['我', '很', '要']);
  it('unlocks when at most one word is new', () => {
    expect(isSentenceUnlocked(['很', '好吃'], known)).toBe(true);
    expect(isSentenceUnlocked(['我', '要', '一', '杯'], known)).toBe(false);
  });
  it('unlocks when most words are known', () => {
    expect(isSentenceUnlocked(['我', '很', '要', '茶', '水'], known)).toBe(true); // 3/5 = 60%
  });
  it('keeps sentences of unknown words locked', () => {
    expect(isSentenceUnlocked(['请', '给', '菜单'], known)).toBe(false);
  });
  it('unlocks sentences with no vocabulary words', () => {
    expect(isSentenceUnlocked([], known)).toBe(true);
  });
});

describe('orderNewCards', () => {
  it('puts sentences, then needed words, then listening alternating with other words', () => {
    const order = orderNewCards({
      sentences: [30, 10],
      words: [
        { id: 1, needed: false, level: 2, rank: 5 },
        { id: 2, needed: true, level: 3, rank: 1 },
        { id: 3, needed: false, level: 1, rank: 9 },
      ],
      listening: [100, 101],
    });
    expect(order).toEqual([10, 30, 2, 100, 3, 101, 1]);
  });
});

describe('interleave', () => {
  it('spreads extras through the base list, keeping both orders', () => {
    const out = interleave<number | string>([1, 2, 3, 4, 5, 6], ['a', 'b', 'c']);
    expect(out.filter((x) => typeof x === 'number')).toEqual([1, 2, 3, 4, 5, 6]);
    expect(out.filter((x) => typeof x === 'string')).toEqual(['a', 'b', 'c']);
    const positions = ['a', 'b', 'c'].map((x) => out.indexOf(x));
    // Evenly spaced: never two extras in a row, and the first isn't pushed to the end.
    expect(positions[1] - positions[0]).toBeGreaterThan(1);
    expect(positions[2] - positions[1]).toBeGreaterThan(1);
    expect(positions[0]).toBeLessThan(3);
  });
  it('handles empty lists', () => {
    expect(interleave([], ['a'])).toEqual(['a']);
    expect(interleave([1], [])).toEqual([1]);
  });
});

describe('spreadEarly', () => {
  it('never starts with a priority card when others exist', () => {
    expect(spreadEarly(['L1', 'L2'], ['a', 'b', 'c'])).toEqual(['a', 'L1', 'b', 'L2', 'c']);
  });
  it('returns priority cards alone when nothing else is due', () => {
    expect(spreadEarly(['L1'], [])).toEqual(['L1']);
  });
});
