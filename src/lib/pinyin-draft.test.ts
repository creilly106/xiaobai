import { describe, expect, it } from 'vitest';
import {
  EMPTY_DRAFT,
  backspace,
  gradeDraft,
  typeApostrophe,
  typeLetter,
  typeTone,
  type PinyinDraft,
} from './pinyin-draft';
import { syllablesFromPinyin, type Tone } from './pinyin';

/** Type keys: letters, 1–5 for tones, ' for a syllable break. */
function typeKeys(keys: string): PinyinDraft {
  let d = EMPTY_DRAFT;
  for (const k of keys) {
    if (/[1-5]/.test(k)) d = typeTone(d, Number(k) as Tone);
    else if (k === "'") d = typeApostrophe(d);
    else d = typeLetter(d, k);
  }
  return d;
}

const nver = syllablesFromPinyin(['nǚ', '’ér']);

describe('typing nǚ’ér', () => {
  it('grades ü (v) and an apostrophe as right', () => {
    expect(gradeDraft(typeKeys("nv3'er2"), nver, 'nǚ’ér')).toEqual({
      grade: 'correct',
      given: 'nǚ’ér',
    });
    expect(gradeDraft(typeKeys('nv3er2'), nver, 'nǚ’ér').grade).toBe('correct');
  });
  it('keeps an apostrophe typed before the tone for the next syllable', () => {
    expect(gradeDraft(typeKeys("nv'3er2"), nver, 'nǚ’ér').given).toBe('nǚ’ér');
  });
  it('ignores a leading or doubled apostrophe', () => {
    expect(typeKeys("'")).toEqual(EMPTY_DRAFT);
    expect(typeKeys("nv3''").current).toBe("'");
  });
  it('backspaces through the apostrophe', () => {
    expect(backspace(typeKeys("nv3'"))).toEqual(typeKeys('nv3'));
  });
});

describe('ü after j, q, x, y', () => {
  it('accepts ü or u', () => {
    const qu = syllablesFromPinyin(['qù']);
    expect(gradeDraft(typeKeys('qu4'), qu, 'qù').grade).toBe('correct');
    expect(gradeDraft(typeKeys('qv4'), qu, 'qù').grade).toBe('correct');
  });
  it('still tells nü from nu', () => {
    expect(gradeDraft(typeKeys('nu3'), syllablesFromPinyin(['nǚ']), 'nǚ').grade).toBe('wrong');
  });
});
