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
  const shown = draftSyllables(d);
  const given = shown
    .map((s) => markTone(s.letters, s.tone))
    .join('')
    .replace(/'/g, '’');
  // Apostrophes only separate syllables (nǚ’ér); they aren't graded.
  const typed = shown
    .map((s) => ({ ...s, letters: s.letters.replace(/'/g, '') }))
    .filter((s) => s.letters);
  const grade = expected
    ? gradePinyin(typed, expected)
    : sameSound(typed.map((s) => s.letters).join('')) === sameSound(toneless(pinyin))
      ? 'correct'
      : 'wrong';
  return { grade, given };
}

/** After j, q, x and y, u is always ü: "ju" and "jü" are the same syllable. */
export function sameSound(letters: string): string {
  return letters.replace(/([jqxy])v/g, '$1u');
}

/**
 * Finished syllables plus the one being typed (tone not chosen yet). Letters
 * are bare (ü as v); an apostrophe at the start of a syllable marks a break
 * (nǚ’ér is "nv" + "'er").
 */
export type PinyinDraft = { done: Syllable[]; current: string };

export const EMPTY_DRAFT: PinyinDraft = { done: [], current: '' };

/**
 * Untoned letters as syllables: "nihao" → ni, hao. Letters that don't split
 * yet (mid-syllable, or a typo) stay together.
 */
export function syllablesOf(letters: string): string[] {
  const out: string[] = [];
  for (const piece of letters.split(/(?=')/)) {
    const body = piece.replace(/^'/, '');
    const parts = body ? (splitPinyinWord(body) ?? [body]) : [];
    if (piece.startsWith("'") && parts.length) parts[0] = `'${parts[0]}`;
    out.push(...parts);
  }
  return out;
}

/** Everything typed so far as syllables; untoned ones are neutral. */
export function draftSyllables(d: PinyinDraft): Syllable[] {
  if (!d.current) return d.done;
  const letters = d.current.replace(/'$/, '');
  return [...d.done, ...syllablesOf(letters).map((l) => ({ letters: l, tone: 5 as Tone }))];
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
  // A trailing apostrophe belongs to the next syllable: keep it waiting.
  const trailing = d.current.endsWith("'") ? "'" : '';
  const letters = d.current.slice(0, d.current.length - trailing.length);
  if (letters) {
    const parts = syllablesOf(letters);
    const last = parts.pop()!;
    return {
      done: [
        ...d.done,
        ...parts.map((l) => ({ letters: l, tone: 5 as Tone })),
        { letters: last, tone },
      ],
      current: trailing,
    };
  }
  if (d.done.length === 0) return d;
  const last = d.done[d.done.length - 1];
  return { ...d, done: [...d.done.slice(0, -1), { ...last, tone }] };
}

/** A syllable break (nǚ’ér). Only after a syllable, and never twice in a row. */
export function typeApostrophe(d: PinyinDraft): PinyinDraft {
  if (d.current.endsWith("'")) return d;
  if (!d.current && d.done.length === 0) return d;
  return typeLetter(d, "'");
}

export function backspace(d: PinyinDraft): PinyinDraft {
  if (d.current) return { ...d, current: d.current.slice(0, -1) };
  const last = d.done[d.done.length - 1];
  if (!last) return d;
  // Reopen the previous syllable without its tone.
  return { done: d.done.slice(0, -1), current: last.letters };
}
