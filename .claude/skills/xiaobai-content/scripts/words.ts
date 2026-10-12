// What the Learn path has taught by a given point.
//
//   npx tsx .claude/skills/xiaobai-content/scripts/words.ts list h3-u4-l4      every word taught by that lesson
//   npx tsx .claude/skills/xiaobai-content/scripts/words.ts list hsk:4         every word up to the end of HSK 4
//   npx tsx .claude/skills/xiaobai-content/scripts/words.ts new h3-u4-l4 h4-u9-l5   words added between two points
//   npx tsx .claude/skills/xiaobai-content/scripts/words.ts has h3-u4-l4 可是 饭 他们   is each one taught yet, and where
import { LESSONS, lessonById, wordsThrough } from '../../../../src/lib/curriculum';

/** A lesson id, or "hsk:N" for the last lesson of HSK level N. */
function indexOf(point: string): number {
  const level = /^hsk:(\d)$/.exec(point);
  if (level) {
    const last = LESSONS.filter((l) => l.unit.hskLevel === Number(level[1])).at(-1);
    if (!last) throw new Error(`No lessons at HSK ${level[1]}`);
    return last.index;
  }
  const lesson = lessonById(point);
  if (!lesson) throw new Error(`Unknown lesson "${point}" (try an id like h3-u4-l4, or hsk:3)`);
  return lesson.index;
}

const [cmd, a, ...rest] = process.argv.slice(2);
if (cmd === 'list') {
  const words = wordsThrough(indexOf(a));
  console.log(`${words.length} words\n${words.join(' ')}`);
} else if (cmd === 'new') {
  const before = new Set(wordsThrough(indexOf(a)));
  console.log(
    wordsThrough(indexOf(rest[0]))
      .filter((w) => !before.has(w))
      .join(' '),
  );
} else if (cmd === 'has') {
  const reached = new Set(wordsThrough(indexOf(a)));
  for (const w of rest) {
    const where = LESSONS.find((l) => l.words.includes(w));
    console.log(
      `${w}: ${reached.has(w) ? 'yes' : 'no'}${where ? ` (taught in ${where.id})` : ' (never taught on its own)'}`,
    );
  }
} else {
  console.log(
    'Usage: words.ts list <point> | new <from> <to> | has <point> <word…>   (point = lesson id or hsk:N)',
  );
}
