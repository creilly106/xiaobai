// What the on-screen pinyin keyboard has typed so far. Pure, so it can be tested.
import {
  gradePinyin,
  markTone,
  toneless,
  type PinyinGrade,
  type Syllable,
  type Tone,
} from '@/lib/pinyin';
import { splitPinyinWord } from '@/lib/pinyin-split';

/**
 * Grade what was typed against the expected syllables. Without syllables
 * (the answer couldn't be split), only the letters are checked.
 */
export function gradeDraft(
  d: PinyinDraft,
  expected: Syllable[] | null,
  pinyin: string,
): { grade: PinyinGrade; given: string } {
  const typed = draftSyllables(d);
  const given = typed.map((s) => markTone(s.letters, s.tone)).join('');
  const grade = expected
    ? gradePinyin(typed, expected)
    : typed.map((s) => s.letters).join('') === toneless(pinyin)
      ? 'correct'
      : 'wrong';
  return { grade, given };
}

/** Finished syllables plus the one being typed (tone not chosen yet). */
export type PinyinDraft = { done: Syllable[]; current: string };

export const EMPTY_DRAFT: PinyinDraft = { done: [], current: '' };

/**
 * Untoned letters as syllables: "nihao" → ni, hao. Letters that don't split
 * yet (mid-syllable, or a typo) stay together.
 */
function syllablesOf(letters: string): string[] {
  return splitPinyinWord(letters) ?? [letters];
}

/** Everything typed so far as syllables; untoned ones are neutral. */
export function draftSyllables(d: PinyinDraft): Syllable[] {
  if (!d.current) return d.done;
  return [...d.done, ...syllablesOf(d.current).map((letters) => ({ letters, tone: 5 as Tone }))];
}

export function draftIsEmpty(d: PinyinDraft): boolean {
  return d.done.length === 0 && d.current === '';
}

export function typeLetter(d: PinyinDraft, ch: string): PinyinDraft {
  // Room for a few syllables typed without tones ("zhongguo").
  if (d.current.length >= 24) return d;
  return { ...d, current: d.current + ch };
}

/**
 * A tone goes on the last syllable typed ("nihao" + 3 → ni hǎo); any earlier
 * untoned syllables stay neutral. With nothing typed it retones the last one.
 */
export function typeTone(d: PinyinDraft, tone: Tone): PinyinDraft {
  if (d.current) {
    const parts = syllablesOf(d.current);
    const last = parts.pop()!;
    return {
      done: [
        ...d.done,
        ...parts.map((letters) => ({ letters, tone: 5 as Tone })),
        { letters: last, tone },
      ],
      current: '',
    };
  }
  if (d.done.length === 0) return d;
  const last = d.done[d.done.length - 1];
  return { ...d, done: [...d.done.slice(0, -1), { ...last, tone }] };
}

export function backspace(d: PinyinDraft): PinyinDraft {
  if (d.current) return { ...d, current: d.current.slice(0, -1) };
  const last = d.done[d.done.length - 1];
  if (!last) return d;
  // Reopen the previous syllable without its tone.
  return { done: d.done.slice(0, -1), current: last.letters };
}
