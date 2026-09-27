import { beforeAll, describe, expect, it } from 'vitest';
import { loadMedians } from '../../scripts/build-handwriting';
import {
  decodeStrokeData,
  encodeStrokeData,
  recognize,
  resample,
  type Point,
  type RefChar,
} from './handwriting';
import { seededRandom } from './path/lesson-builder';

// Common characters of different shapes and stroke counts.
const SAMPLE = [...'一人口大小中我你他好是不了的在有看水火木山日月学生吃喝去来说家书'];

let refs: RefChar[];
let medians: Map<string, Point[][]>;

beforeAll(() => {
  const all = loadMedians();
  medians = new Map(all.map((c) => [c.char, c.medians]));
  refs = decodeStrokeData(encodeStrokeData(all));
});

/** Draw a character as a person might: wobbly, off-centre, a different size. */
function scribble(char: string, rand: () => number): Point[][] {
  const scale = 0.3 + rand() * 0.4;
  const [dx, dy] = [rand() * 200, rand() * 200];
  return medians
    .get(char)!
    .map((stroke) =>
      resample(stroke, 12).map(([x, y]) => [
        x * scale + dx + (rand() - 0.5) * 30 * scale,
        (900 - y) * scale + dy + (rand() - 0.5) * 30 * scale,
      ]),
    );
}

describe('handwriting', () => {
  it('packs every character', () => expect(refs.length).toBeGreaterThan(9000));

  it('recognises common characters drawn by hand', () => {
    const rand = seededRandom(3);
    let first = 0;
    const misses: string[] = [];
    for (const char of SAMPLE) {
      const top = recognize(scribble(char, rand), refs, { limit: 5 }).map((r) => r.char);
      if (top[0] === char) first++;
      if (!top.includes(char)) misses.push(`${char} → ${top.join('')}`);
    }
    expect(misses).toEqual([]);
    expect(first / SAMPLE.length).toBeGreaterThan(0.8);
  });

  it('still finds a character drawn in the wrong stroke order', () => {
    const rand = seededRandom(5);
    for (const char of ['我', '好', '学', '说']) {
      const strokes = scribble(char, rand);
      // Swap the first two strokes and draw the last one backwards.
      [strokes[0], strokes[1]] = [strokes[1], strokes[0]];
      strokes[strokes.length - 1].reverse();
      const top = recognize(strokes, refs, { limit: 5 }).map((r) => r.char);
      expect(top, char).toContain(char);
    }
  });

  it('copes with a stroke missing', () => {
    const rand = seededRandom(9);
    for (const char of ['我', '看', '家']) {
      const strokes = scribble(char, rand).slice(0, -1);
      const top = recognize(strokes, refs, { limit: 8 }).map((r) => r.char);
      expect(top, char).toContain(char);
    }
  });
});
