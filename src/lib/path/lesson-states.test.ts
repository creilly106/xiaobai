import { describe, expect, it } from 'vitest';
import { lessonStates } from './lesson-states';

const lessons = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, words: [id.toUpperCase()] }));

describe('lessonStates', () => {
  it('opens the first unfinished lesson and locks the rest', () => {
    const saved = new Map([['a', 'done' as const]]);
    expect(lessonStates(lessons, saved, new Set())).toEqual([
      'done',
      'current',
      'locked',
      'locked',
      'locked',
    ]);
  });

  it('counts lessons whose words are all studied as known', () => {
    expect(lessonStates(lessons, new Map(), new Set(['A']))).toEqual([
      'known',
      'current',
      'locked',
      'locked',
      'locked',
    ]);
  });

  it("doesn't pull you back to a lesson added behind your progress", () => {
    // You'd done a, b and d; then c was added to the path.
    const saved = new Map([
      ['a', 'done' as const],
      ['b', 'done' as const],
      ['d', 'done' as const],
    ]);
    expect(lessonStates(lessons, saved, new Set())).toEqual([
      'done',
      'done',
      'new',
      'done',
      'current',
    ]);
  });

  it("isn't moved on by words known from elsewhere far ahead", () => {
    const saved = new Map([['a', 'done' as const]]);
    expect(lessonStates(lessons, saved, new Set(['E']))).toEqual([
      'done',
      'current',
      'locked',
      'locked',
      'known',
    ]);
  });

  it('counts lessons you tested out of as how far you got', () => {
    const saved = new Map([
      ['a', 'done' as const],
      ['d', 'tested' as const],
    ]);
    // b and c stay open as "new" rather than pulling you back to b.
    expect(lessonStates(lessons, saved, new Set())).toEqual([
      'done',
      'new',
      'new',
      'tested',
      'current',
    ]);
  });

  it("doesn't jump back when a lesson is added before your tested-out units", () => {
    const saved = new Map([
      ['b', 'tested' as const],
      ['c', 'tested' as const],
    ]);
    // a is new (added later); you carry on after c.
    expect(lessonStates(lessons, saved, new Set())).toEqual([
      'new',
      'tested',
      'tested',
      'current',
      'locked',
    ]);
  });
});
