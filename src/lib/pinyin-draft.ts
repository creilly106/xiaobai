// What the on-screen pinyin keyboard has typed so far. Pure, so it can be tested.
import {
  gradePinyin,
  markTone,
  toneless,
  type PinyinGrade,
  type Syllable,
  type Tone,
} from '@/lib/pinyin';

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

/** Everything typed so far as syllables; an untoned last syllable is neutral. */
export function draftSyllables(d: PinyinDraft): Syllable[] {
  return d.current ? [...d.done, { letters: d.current, tone: 5 }] : d.done;
}

export function draftIsEmpty(d: PinyinDraft): boolean {
  return d.done.length === 0 && d.current === '';
}

export function typeLetter(d: PinyinDraft, ch: string): PinyinDraft {
  if (d.current.length >= 6) return d;
  return { ...d, current: d.current + ch };
}

/** A tone ends the syllable being typed; with nothing typed it retones the last one. */
export function typeTone(d: PinyinDraft, tone: Tone): PinyinDraft {
  if (d.current) return { done: [...d.done, { letters: d.current, tone }], current: '' };
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
