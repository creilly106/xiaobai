import { describe, expect, it } from 'vitest';
import { voiceScore } from './tts';

const v = (name: string, voiceURI: string, lang = 'zh-CN') => ({ name, voiceURI, lang });

describe('voiceScore', () => {
  it('ranks premium, then enhanced/natural, then default, then compact voices', () => {
    const voices = [
      v('Tingting', 'com.apple.voice.compact.zh-CN.Tingting'),
      v('Microsoft Xiaoxiao Online (Natural)', 'Microsoft Xiaoxiao Online (Natural) - Chinese'),
      v('Lili (Premium)', 'com.apple.voice.premium.zh-CN.Lili'),
      v('Google 普通话（中国大陆）', 'Google 普通话（中国大陆）'),
      v('Tingting (Enhanced)', 'com.apple.voice.enhanced.zh-CN.Tingting'),
    ];
    const order = [...voices].sort((a, b) => voiceScore(b) - voiceScore(a)).map((x) => x.name);
    expect(order[0]).toBe('Lili (Premium)');
    expect(order.slice(1, 3).sort()).toEqual(
      ['Microsoft Xiaoxiao Online (Natural)', 'Tingting (Enhanced)'].sort(),
    );
    expect(order.at(-1)).toBe('Tingting');
  });

  it('prefers mainland Mandarin at equal quality', () => {
    expect(voiceScore(v('Meijia', 'meijia', 'zh-TW'))).toBeLessThan(
      voiceScore(v('Tingting', 'tingting', 'zh-CN')),
    );
  });
});
