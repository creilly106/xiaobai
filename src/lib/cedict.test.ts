import { describe, expect, it } from 'vitest';
import { normaliseTypedPinyin, numberedToMarked, parseCedictLine, pinyinQueryKeys } from './cedict';

describe('parseCedictLine', () => {
  it('parses a normal entry', () => {
    expect(parseCedictLine('你好 你好 [ni3 hao3] /hello; hi/')).toEqual({
      traditional: '你好',
      simplified: '你好',
      pinyin: 'nǐ hǎo',
      pinyinPlain: 'nihao',
      pinyinTones: 'ni3hao3',
      definitions: ['hello; hi'],
      proper: false,
    });
  });

  it('handles ü, neutral tones and traditional forms', () => {
    const e = parseCedictLine('綠茶 绿茶 [lu:4 cha2] /green tea/')!;
    expect(e.simplified).toBe('绿茶');
    expect(e.pinyin).toBe('lǜ chá');
    expect(e.pinyinTones).toBe('lv4cha2');
    expect(parseCedictLine('桌子 桌子 [zhuo1 zi5] /table/')!.pinyin).toBe('zhuō zi');
  });

  it('flags proper nouns and keeps their capital', () => {
    const e = parseCedictLine('北京 北京 [Bei3 jing1] /Beijing, capital of China/')!;
    expect(e.proper).toBe(true);
    expect(e.pinyin).toBe('Běi jīng');
  });

  it('skips comments and junk', () => {
    expect(parseCedictLine('# CC-CEDICT')).toBeNull();
    expect(parseCedictLine('not an entry')).toBeNull();
  });
});

describe('pinyinQueryKeys', () => {
  it('matches loosely without tones', () => {
    expect(pinyinQueryKeys('ni hao')).toEqual({ plain: 'nihao', tones: null });
    expect(pinyinQueryKeys('nihao')).toEqual({ plain: 'nihao', tones: null });
  });
  it('uses tones when every syllable has one', () => {
    expect(pinyinQueryKeys('ni3hao3')).toEqual({ plain: 'nihao', tones: 'ni3hao3' });
    expect(pinyinQueryKeys('nǐ hǎo')).toEqual({ plain: 'nihao', tones: 'ni3hao3' });
    expect(pinyinQueryKeys('nǐhao')).toEqual({ plain: 'nihao', tones: null });
  });
  it('rejects things that are not pinyin', () => {
    expect(pinyinQueryKeys('hello!')).toBeNull();
    expect(pinyinQueryKeys('你好')).toBeNull();
  });
});

describe('typed pinyin', () => {
  it('converts numbers to marks', () => {
    expect(numberedToMarked('xie4 xie5')).toBe('xiè xie');
    expect(normaliseTypedPinyin('ni3 hao3')).toBe('nǐ hǎo');
    expect(normaliseTypedPinyin('lv4')).toBe('lǜ');
    expect(normaliseTypedPinyin('  nǐ  hǎo ')).toBe('nǐ hǎo');
    expect(normaliseTypedPinyin('wo3 zhu4 zai4 jiu3dian4.')).toBe('wǒ zhù zài jiǔdiàn.');
  });
});
