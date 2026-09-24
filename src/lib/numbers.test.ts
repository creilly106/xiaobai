import { describe, expect, it } from 'vitest';
import { MAX_NUMBER, digitsToChinese, numberPinyin, sameChineseNumber, toChinese } from './numbers';

describe('toChinese', () => {
  it.each([
    [0, '零'],
    [7, '七'],
    [10, '十'],
    [11, '十一'],
    [20, '二十'],
    [22, '二十二'],
    [100, '一百'],
    [101, '一百零一'],
    [110, '一百一十'],
    [115, '一百一十五'],
    [200, '两百'],
    [222, '两百二十二'],
    [1001, '一千零一'],
    [1010, '一千零一十'],
    [2022, '两千零二十二'],
    [10_005, '一万零五'],
    [10_500, '一万零五百'],
    [12_000, '一万两千'],
    [20_000, '两万'],
    [100_000, '十万'],
    [100_500, '十万零五百'],
    [1_000_000, '一百万'],
    [1_002_000, '一百万两千'],
    [1_000_020, '一百万零二十'],
    [1_234_567, '一百二十三万四千五百六十七'],
    [100_000_001, '一亿零一'],
    [120_000_000, '一亿两千万'],
    [100_010_000, '一亿零一万'],
  ])('%i → %s', (n, expected) => {
    expect(toChinese(n)).toBe(expected);
  });

  it('can use 二 instead of 两', () => {
    expect(toChinese(200, { liang: false })).toBe('二百');
    expect(toChinese(20_000, { liang: false })).toBe('二万');
  });

  it('rejects numbers it cannot say', () => {
    expect(() => toChinese(-1)).toThrow(RangeError);
    expect(() => toChinese(1.5)).toThrow(RangeError);
    expect(() => toChinese(MAX_NUMBER + 1)).toThrow(RangeError);
  });
});

describe('digitsToChinese', () => {
  it('reads years digit by digit', () => {
    expect(digitsToChinese('2026')).toBe('二〇二六');
  });
  it('uses 幺 for 1 on the phone', () => {
    expect(digitsToChinese('110', { phone: true })).toBe('幺幺〇');
  });
});

describe('numberPinyin and sameChineseNumber', () => {
  it('spells each syllable', () => {
    expect(numberPinyin('一万两千')).toBe('yī wàn liǎng qiān');
  });
  it('treats 两/二 and 〇/零 as equal', () => {
    expect(sameChineseNumber('两百', '二百')).toBe(true);
    expect(sameChineseNumber('一百零五', '一百〇五')).toBe(true);
    expect(sameChineseNumber('一百零五', '一百五')).toBe(false);
  });
});
