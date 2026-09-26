import { describe, expect, it } from 'vitest';
import { buildListeningQuiz } from './listening';
import { seededRandom } from './path/lesson-builder';
import { scenarios } from './scenario-data';

describe('buildListeningQuiz', () => {
  const all = scenarios.flatMap((s) =>
    (s.dialogues ?? []).map((d, i) => ({
      name: `${s.slug} #${i + 1}`,
      lines: d.lines,
      pool: [...(s.dialogues ?? []).filter((o) => o !== d).flatMap((o) => o.lines), ...s.sentences],
    })),
  );

  it('covers some dialogues', () => expect(all.length).toBeGreaterThan(10));

  it.each(all)('$name: gives answerable questions', ({ lines, pool }) => {
    for (const seed of [1, 2, 3]) {
      const quiz = buildListeningQuiz(lines, pool, seededRandom(seed));
      expect(quiz.length).toBeGreaterThanOrEqual(2);
      expect(quiz.length).toBeLessThanOrEqual(4);
      expect(new Set(quiz.map((q) => q.hanzi)).size).toBe(quiz.length);
      for (const q of quiz) {
        expect(q.options).toContain(q.answer);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        const keys = q.options.map((o) => o.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ''));
        expect(new Set(keys).size).toBe(q.options.length);
        if (q.kind === 'reply') {
          const i = lines.findIndex((l) => l.hanzi === q.hanzi);
          expect(lines[i + 1].hanzi).toBe(q.answer);
        }
      }
    }
  });

  it('keeps the conversation order', () => {
    const { lines, pool } = all[0];
    const quiz = buildListeningQuiz(lines, pool, seededRandom(7));
    const at = quiz.map((q) => lines.findIndex((l) => l.hanzi === q.hanzi));
    expect(at).toEqual([...at].sort((a, b) => a - b));
  });
});
