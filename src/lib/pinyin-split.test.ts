import { describe, expect, it } from 'vitest';
import { splitPinyinText, splitPinyinWord } from './pinyin-split';

describe('splitPinyinWord', () => {
  it.each([
    ['xīnqíng', ['xīn', 'qíng']],
    ['Běijīng', ['Běi', 'jīng']],
    ['miàntiáo', ['miàn', 'tiáo']],
    ['bàba', ['bà', 'ba']],
    ['nǚér', ['nǚ', 'ér']],
    ['zhuāngzhòng', ['zhuāng', 'zhòng']],
    ['nǐ', ['nǐ']],
  ])('%s → %j', (word, expected) => {
    expect(splitPinyinWord(word)).toEqual(expected);
  });

  it('uses tone marks to settle ambiguous splits', () => {
    // "fangan" could be fang+an or fan+gan; one mark per syllable decides.
    expect(splitPinyinWord('fāngàn')).toEqual(['fāng', 'àn']);
    expect(splitPinyinWord('xīān')).toEqual(['xī', 'ān']);
  });

  it('returns null for non-pinyin', () => {
    expect(splitPinyinWord('hello')).toBeNull();
  });
});

describe('splitPinyinText', () => {
  it('keeps punctuation and spaces, tagging syllables with tones', () => {
    expect(splitPinyinText('wǒ hē chá.')).toEqual([
      { text: 'wǒ', tone: 3 },
      { text: ' ', tone: null },
      { text: 'hē', tone: 1 },
      { text: ' ', tone: null },
      { text: 'chá', tone: 2 },
      { text: '.', tone: null },
    ]);
  });
  it('splits apostrophes and keeps them', () => {
    expect(splitPinyinText("Xī'ān").map((s) => s.text)).toEqual(['Xī', "'", 'ān']);
  });
});
