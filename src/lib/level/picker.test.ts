import { describe, expect, it } from 'vitest';
import type { LevelBank, LevelItem } from './items';
import { pickNext } from './picker';
import { difficultyFor, ratingForLevel, type Skill } from './rating';

const q = (id: string, skill: Skill, level: number): LevelItem => ({
  id,
  skill,
  level,
  difficulty: difficultyFor(level),
  guess: 0.25,
  step: {
    kind: 'type-pinyin',
    word: { hanzi: '好', pinyin: 'hǎo', meaning: 'good', accepted: ['good'], syllables: null },
  },
});

const bank: LevelBank = {
  reading: {
    1: [q('r1', 'reading', 1)],
    2: [q('r2', 'reading', 2)],
    3: [q('r3a', 'reading', 3), q('r3b', 'reading', 3)],
  },
  listening: {},
  writing: {},
  tones: { 0: [q('t1', 'tones', 0)] },
};

describe('pickNext', () => {
  it('asks a little above your current level', () => {
    const at = (level: number) => ({ rating: ratingForLevel(level), spread: 100 });
    expect(pickNext(bank, new Set(), 'reading', at(2.4))?.id).toBe('r3a');
    expect(pickNext(bank, new Set(), 'reading', at(1))?.id).toBe('r1');
  });

  it('moves to the nearest level once one is used up, higher first', () => {
    const at = { rating: ratingForLevel(2), spread: 100 };
    expect(pickNext(bank, new Set(['r2']), 'reading', at)?.id).toBe('r3a');
    expect(pickNext(bank, new Set(['r1', 'r2', 'r3a', 'r3b']), 'reading', at)).toBeNull();
  });

  it('handles skills with no levels and tones', () => {
    const at = { rating: ratingForLevel(2), spread: 100 };
    expect(pickNext(bank, new Set(), 'listening', at)).toBeNull();
    expect(pickNext(bank, new Set(), 'tones', at)?.id).toBe('t1');
  });
});
