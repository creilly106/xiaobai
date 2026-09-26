import type { DialogueLine } from '@/lib/curriculum/types';
import { shuffle } from '@/lib/path/lesson-builder';

/**
 * Listening questions for a scenario dialogue, asked after hearing it through:
 *  - meaning: hear a line, pick what it means;
 *  - reply:   hear their line, pick what you said back (in Chinese).
 */
export type ListeningQuestion = {
  kind: 'meaning' | 'reply';
  /** What gets played. */
  hanzi: string;
  options: string[];
  answer: string;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

/** `count` wrong options from `candidates`, none reading the same as `answer` or each other. */
function distractors(answer: string, candidates: string[], count: number): string[] {
  const seen = new Set([norm(answer)]);
  const out: string[] = [];
  for (const c of candidates) {
    const key = norm(c);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
    if (out.length === count) break;
  }
  return out;
}

export function buildListeningQuiz(
  lines: DialogueLine[],
  /** Lines from the scenario's other dialogues and phrases, for extra wrong options. */
  pool: { hanzi: string; meaning: string }[],
  rand: () => number,
  max = 4,
): ListeningQuestion[] {
  const questions: ListeningQuestion[] = [];
  const meanings = (exclude: string) => [
    ...shuffle(
      lines.filter((l) => l.hanzi !== exclude).map((l) => l.meaning),
      rand,
    ),
    ...shuffle(
      pool.map((p) => p.meaning),
      rand,
    ),
  ];

  // Replies: a line of theirs followed by one of yours.
  const yours = lines.filter((l) => l.speaker === 'you').map((l) => l.hanzi);
  const replies = lines
    .map((line, i) => ({ line, next: lines[i + 1] }))
    .filter(({ line, next }) => line.speaker === 'them' && next?.speaker === 'you');
  for (const { line, next } of shuffle(replies, rand).slice(0, Math.floor(max / 2))) {
    const wrong = distractors(
      next.hanzi,
      [
        ...shuffle(yours, rand),
        ...shuffle(
          pool.map((p) => p.hanzi),
          rand,
        ),
      ],
      3,
    );
    if (wrong.length < 2) continue;
    questions.push({
      kind: 'reply',
      hanzi: line.hanzi,
      answer: next.hanzi,
      options: shuffle([next.hanzi, ...wrong], rand),
    });
  }

  // Meanings: their lines first (that's what you'd need to understand), then yours.
  const asked = new Set(questions.map((q) => q.hanzi));
  const rest = [
    ...shuffle(
      lines.filter((l) => l.speaker === 'them'),
      rand,
    ),
    ...shuffle(
      lines.filter((l) => l.speaker === 'you'),
      rand,
    ),
  ].filter((l) => !asked.has(l.hanzi));
  for (const line of rest) {
    if (questions.length >= max) break;
    const wrong = distractors(line.meaning, meanings(line.hanzi), 3);
    if (wrong.length < 2) continue;
    questions.push({
      kind: 'meaning',
      hanzi: line.hanzi,
      answer: line.meaning,
      options: shuffle([line.meaning, ...wrong], rand),
    });
  }

  // Follow the conversation's order, so it plays back like a recap.
  const order = new Map(lines.map((l, i) => [l.hanzi, i]));
  return questions.sort((a, b) => order.get(a.hanzi)! - order.get(b.hanzi)!);
}
