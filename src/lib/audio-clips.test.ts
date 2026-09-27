import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { clipHash, clipKey, readingKey, type AudioIndex } from './audio-clips';
import { contextReadings } from './audio-text';

describe('clipKey', () => {
  it('ignores spaces and punctuation, so variants share a clip', () => {
    expect(clipKey('你好！')).toBe('你好');
    expect(clipKey(' 我很好，你呢？ ')).toBe('我很好你呢');
    expect(clipKey('喂，你好!')).toBe(clipKey('喂 你好'));
  });
});

describe('clipHash', () => {
  it('is stable and differs between sentences', () => {
    expect(clipHash('我喝茶')).toBe(clipHash('我喝茶'));
    expect(clipHash('我喝茶')).not.toBe(clipHash('我喝水'));
    expect(clipHash('我喝茶')).toMatch(/^[0-9a-z]+$/);
  });
});

describe('reading clips', () => {
  it('has a recording for every character with several readings', () => {
    const index = JSON.parse(readFileSync('public/audio/index.json', 'utf8')) as AudioIndex;
    const missing = contextReadings()
      .map(({ hanzi, pinyin }) => readingKey(hanzi, pinyin))
      .filter((key) => !index.clips[key] || !existsSync(`public/audio/${index.clips[key]}`));
    // Run `npm run data:tts` after adding a reading to audio-text.ts.
    expect(missing).toEqual([]);
  });
});
