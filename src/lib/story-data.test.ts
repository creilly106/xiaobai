import { describe, expect, it } from 'vitest';
import { lessonById, wordsThrough } from './curriculum';
import { pinyinSyllableCount } from './pinyin-split';
import { segmentSpans } from './segment';
import { stories, storySentences } from './story-data';

const HAN = /[㐀-鿿]/u;
const HAN_ALL = /[㐀-鿿]/gu;

describe('stories', () => {
  it('have unique ids and open after real lessons', () => {
    expect(new Set(stories.map((s) => s.id)).size).toBe(stories.length);
    for (const story of stories) {
      const lesson = lessonById(story.after);
      expect(lesson, story.after).toBeDefined();
      expect(lesson!.unit.hskLevel, story.id).toBe(story.hskLevel);
    }
  });

  it.each(stories)('$id: uses only words taught by then, plus its extras', (story) => {
    const extras = story.extras.map((e) => e.hanzi);
    const reached = new Set([...wordsThrough(lessonById(story.after)!.index), ...extras]);
    // Split with only what's been taught: anything left over hasn't been.
    const problems = storySentences(story).flatMap((sentence) => {
      const covered = new Set(
        segmentSpans(sentence.hanzi, reached).flatMap((sp) =>
          Array.from({ length: sp.end - sp.start }, (_, i) => sp.start + i),
        ),
      );
      const left = Array.from(sentence.hanzi)
        .filter((c, i) => HAN.test(c) && !covered.has(i))
        .join('');
      return left ? [`${sentence.hanzi}: not taught yet: ${left}`] : [];
    });
    expect(problems).toEqual([]);
    // Extras should be a light touch, not a second vocabulary list.
    expect(story.extras.length).toBeLessThanOrEqual(3);
  });

  it.each(stories)('$id: has one pinyin syllable per character', (story) => {
    const bad = [...storySentences(story), ...story.extras].filter((s) => {
      const chars = s.hanzi.match(HAN_ALL) ?? [];
      const erhua = chars.filter((ch, i) => ch === '儿' && i > 0).length;
      const n = pinyinSyllableCount(s.pinyin);
      return n !== chars.length && n !== chars.length - erhua;
    });
    expect(bad.map((s) => `${s.hanzi} / ${s.pinyin}`)).toEqual([]);
  });

  it.each(stories)('$id: has well-formed questions', (story) => {
    expect(story.questions.length).toBeGreaterThanOrEqual(3);
    for (const q of story.questions) {
      expect(q.options, q.question).toContain(q.answer);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  });
});
