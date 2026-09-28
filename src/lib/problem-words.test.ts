import { describe, expect, it } from 'vitest';
import { sharesCharacter, skillOf, soundAlikes, summarise, type Rated } from './problem-words';

const day = (n: number) => new Date(Date.UTC(2026, 0, n));
const r = (rating: number, n: number, mode = 'recognition'): Rated => ({
  rating,
  at: day(n),
  mode,
});

describe('summarise', () => {
  it('counts misses and keeps the recent answers in order', () => {
    const h = summarise([r(3, 3), r(1, 1), r(1, 2), r(3, 4)]);
    expect(h.misses).toBe(2);
    expect(h.lastMiss).toEqual(day(2));
    expect(h.recent).toEqual([false, false, true, true]);
    expect(h.improving).toBe(false);
  });

  it('spots a word that has come right lately', () => {
    expect(summarise([r(1, 1), r(1, 2), r(3, 3), r(2, 4), r(4, 5)]).improving).toBe(true);
  });

  it('names the skill most misses came from, only when there is more than one', () => {
    const listening = [r(1, 1, 'listening'), r(1, 2, 'listening'), r(1, 3), r(3, 4)];
    expect(summarise(listening).weakSpot).toBe('listening');
    expect(summarise([r(1, 1), r(1, 2)]).weakSpot).toBeNull();
    expect(summarise([r(1, 1, 'production'), r(1, 2)]).weakSpot).toBeNull();
  });

  it('maps card modes to skills', () => {
    expect(skillOf('sentence-listening')).toBe('listening');
    expect(skillOf('production')).toBe('saying');
    expect(skillOf('sentence-recognition')).toBe('reading');
  });
});

describe('look-alikes', () => {
  const studied = [
    { hanzi: '他', pinyin: 'tā', meaning: 'he' },
    { hanzi: '她', pinyin: 'tā', meaning: 'she' },
    { hanzi: '生日', pinyin: 'shēngrì', meaning: 'birthday' },
    { hanzi: '学生', pinyin: 'xuésheng', meaning: 'student' },
    { hanzi: '生气', pinyin: 'shēngqì', meaning: 'angry' },
  ];

  it('finds words that sound the same without tones', () => {
    expect(
      soundAlikes({ hanzi: '它', pinyin: 'tā', meaning: 'it' }, studied).map((w) => w.hanzi),
    ).toEqual(['他', '她']);
    expect(soundAlikes({ hanzi: '塔', pinyin: 'tǎ', meaning: 'tower' }, studied)).toHaveLength(2);
  });

  it('finds words sharing a character, but not ones that contain it whole', () => {
    const got = sharesCharacter({ hanzi: '生气', pinyin: 'shēngqì', meaning: 'angry' }, studied);
    expect(got.map((w) => w.hanzi)).toEqual(['生日', '学生']);
    expect(
      sharesCharacter({ hanzi: '生', pinyin: 'shēng', meaning: 'give birth' }, studied),
    ).toEqual([]);
  });
});
