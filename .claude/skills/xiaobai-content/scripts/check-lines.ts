// Check draft Chinese lines the way the content tests do, before they go in.
//
//   npx tsx .claude/skills/xiaobai-content/scripts/check-lines.ts <point> <drafts.json> [extra words…]
//
// <point> is a lesson id (h3-u4-l4) or hsk:N. <drafts.json> is an array of
// { "hanzi": "…", "pinyin": "…" } (more fields are ignored). Extra words are
// glossed names or compounds allowed on top (a story's `extras`).
//
// For each line it reports characters the segmenter couldn't cover with taught
// words (✗), and pinyin whose syllable count doesn't match the characters.
import { readFileSync } from 'node:fs';
import { LESSONS, lessonById, wordsThrough } from '../../../../src/lib/curriculum';
import { pinyinSyllableCount } from '../../../../src/lib/pinyin-split';
import { segmentSpans } from '../../../../src/lib/segment';

const HAN = /[㐀-鿿]/u;
const HAN_ALL = /[㐀-鿿]/gu;

const [point, file, ...extras] = process.argv.slice(2);
if (!point || !file) {
  console.log('Usage: check-lines.ts <lesson id | hsk:N> <drafts.json> [extra words…]');
  process.exit(1);
}
const level = /^hsk:(\d)$/.exec(point);
const index = level
  ? LESSONS.filter((l) => l.unit.hskLevel === Number(level[1])).at(-1)!.index
  : lessonById(point)?.index;
if (index == null) throw new Error(`Unknown point ${point}`);

const reached = new Set([...wordsThrough(index), ...extras]);
const lines = JSON.parse(readFileSync(file, 'utf8')) as { hanzi: string; pinyin?: string }[];
let problems = 0;
for (const line of lines) {
  const covered = new Set(
    segmentSpans(line.hanzi, reached).flatMap((sp) =>
      Array.from({ length: sp.end - sp.start }, (_, i) => sp.start + i),
    ),
  );
  const runs: string[] = [];
  let run = '';
  Array.from(line.hanzi).forEach((c, i) => {
    if (HAN.test(c) && !covered.has(i)) run += c;
    else if (run) {
      runs.push(run);
      run = '';
    }
  });
  if (run) runs.push(run);
  if (runs.length) {
    problems++;
    console.log(`✗ ${line.hanzi}   not taught yet: ${runs.join(' ')}`);
  }
  if (line.pinyin != null && !/[a-z]/i.test(line.hanzi)) {
    const chars = line.hanzi.match(HAN_ALL) ?? [];
    const erhua = chars.filter((c, i) => c === '儿' && i > 0).length;
    const n = pinyinSyllableCount(line.pinyin);
    if (n !== chars.length && n !== chars.length - erhua) {
      problems++;
      console.log(
        `✗ ${line.hanzi}   pinyin has ${n} syllables for ${chars.length} characters: ${line.pinyin}`,
      );
    }
  }
}
console.log(
  problems ? `${problems} problem(s) in ${lines.length} lines` : `all ${lines.length} lines clean`,
);
process.exit(problems ? 1 : 0);
