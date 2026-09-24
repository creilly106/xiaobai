// Grading typed English meanings. Pure, so it can be tested. English answers
// vary a lot, so this is deliberately forgiving: it ignores "to"/"a"/"the",
// punctuation and notes in brackets, tolerates small typos and word endings,
// and lets a sentence pass when most of its key words are there. The quiz
// always shows the reference and lets you overrule it.

export type Verdict = 'right' | 'close' | 'wrong';

export type Grade = {
  verdict: Verdict;
  /** The accepted meaning the answer matched best, when there was one. */
  matched: string | null;
};

const CONTRACTIONS: [RegExp, string][] = [
  [/\bi'm\b/g, 'i am'],
  [/\bi'd like\b/g, 'i want'],
  [/\bwould like\b/g, 'want'],
  [/\bcan't\b/g, 'cannot'],
  [/\bwon't\b/g, 'will not'],
  [/\b(\w+)n't\b/g, '$1 not'],
  [/\b(\w+)'re\b/g, '$1 are'],
  [/\b(\w+)'ve\b/g, '$1 have'],
  [/\b(\w+)'ll\b/g, '$1 will'],
  [/\b(\w+)'d\b/g, '$1 would'],
  [/\b(it|that|what|there|here|who|where|how|he|she)'s\b/g, '$1 is'],
  [/\blet's\b/g, 'let us'],
];

/** Everyday equivalents, applied to both sides so either wording matches. */
const EQUIVALENTS: [RegExp, string][] = [
  [/\bthank you\b/g, 'thanks'],
  [/\b(hi|hey)\b/g, 'hello'],
  [/\b(bye|see you)\b/g, 'goodbye'],
  [/\b(okay|ok|alright|all right)\b/g, 'fine'],
  [/\bcannot\b/g, 'can not'],
  [/\b(mum|mom|mommy|mummy)\b/g, 'mother'],
  [/\b(dad|daddy)\b/g, 'father'],
  [/\bwhat is your name\b/g, 'what are you called'],
];

/** Words that carry little meaning on their own; ignored when comparing sentences. */
const FILLER = new Set(
  'a an the to of is am are was were be been being do does did it that this so very really just please'.split(
    ' ',
  ),
);

export function normalise(text: string): string {
  let s = text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\([^)]*\)|\[[^\]]*\]/g, ' ');
  for (const [re, out] of CONTRACTIONS) s = s.replace(re, out);
  s = s.replace(/[^a-z0-9' ]+/g, ' ').replace(/'/g, '');
  for (const [re, out] of EQUIVALENTS) s = s.replace(re, out);
  return s.replace(/\s+/g, ' ').trim();
}

/** A rough stem, enough to match eat/eats/eating and city/cities. */
export function stem(word: string): string {
  let w = word;
  if (w.length > 4 && w.endsWith('ies')) w = `${w.slice(0, -3)}y`;
  else if (w.length > 4 && /(ches|shes|sses|xes|zes)$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  // "running" → "runn" → "run"
  if (/([b-df-hj-np-tv-z])\1$/.test(w) && !/(ll|ss|ff|zz)$/.test(w)) w = w.slice(0, -1);
  return w.replace(/e$/, '');
}

export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = above;
    }
  }
  return prev[b.length];
}

/** Typos allowed for a word of this length. */
const allowance = (length: number) => (length <= 3 ? 0 : length <= 7 ? 1 : 2);

function sameWord(a: string, b: string): boolean {
  if (a === b || stem(a) === stem(b)) return true;
  return editDistance(a, b) <= allowance(Math.min(a.length, b.length));
}

const words = (s: string) => s.split(' ').filter(Boolean);
const keyWords = (s: string) => {
  const kept = words(s).filter((w) => !FILLER.has(w));
  return kept.length > 0 ? kept : words(s);
};

/** How much of `reference` the answer covers (0–1), and how much of the answer is extra. */
function overlap(answer: string, reference: string): { recall: number; extra: number } {
  const want = keyWords(reference);
  const have = keyWords(answer);
  const used = new Set<number>();
  let hit = 0;
  for (const w of want) {
    const i = have.findIndex((h, k) => !used.has(k) && sameWord(h, w));
    if (i >= 0) {
      used.add(i);
      hit++;
    }
  }
  return {
    recall: want.length ? hit / want.length : 0,
    extra: have.length ? (have.length - used.size) / have.length : 0,
  };
}

/** Split a stored meaning into the separate senses it lists. */
export function sensesOf(meaning: string): string[] {
  return meaning
    .split(/\s*(?:;|\/|,(?![^(]*\)))\s*/)
    .map((s) => s.trim())
    .filter((s) => s && !/^CL:/.test(s));
}

/**
 * Grade a word: right if the answer is one of its senses (allowing typos and
 * word endings), close if it gets most of a longer sense.
 */
export function gradeWord(answer: string, accepted: string[]): Grade {
  const a = stripLead(normalise(answer));
  if (!a) return { verdict: 'wrong', matched: null };
  let close: string | null = null;
  for (const sense of accepted) {
    const s = stripLead(normalise(sense));
    if (!s) continue;
    const aw = words(a);
    const sw = words(s);
    const exact =
      a === s ||
      (aw.length === sw.length && aw.every((w, i) => sameWord(w, sw[i]))) ||
      editDistance(a, s) <= allowance(s.length);
    if (exact) return { verdict: 'right', matched: sense };
    if (close === null) {
      const { recall, extra } = overlap(a, s);
      if ((recall >= 0.5 && extra <= 0.5) || (sw.length > 1 && recall >= 0.5)) close = sense;
    }
  }
  return close ? { verdict: 'close', matched: close } : { verdict: 'wrong', matched: null };
}

/**
 * Grade a sentence translation by its key words: right when nearly all are
 * there without much padding, close when over half are.
 */
export function gradeSentence(answer: string, reference: string): Grade {
  const a = normalise(answer);
  if (!a) return { verdict: 'wrong', matched: null };
  const { recall, extra } = overlap(a, normalise(reference));
  if (recall >= 0.8 && extra <= 0.4) return { verdict: 'right', matched: null };
  if (recall >= 0.5) return { verdict: 'close', matched: null };
  return { verdict: 'wrong', matched: null };
}

function stripLead(s: string): string {
  return s.replace(/^(to|a|an|the|be) /, '');
}
