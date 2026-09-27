/**
 * Packs the stroke centre lines from hanzi-writer-data into
 * public/find-data/strokes.bin for the "Find a character" handwriting pad (format
 * in src/lib/handwriting.ts). Runs before `npm run dev` and `npm run build`;
 * the output is generated, so it's git-ignored.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { encodeStrokeData, type Point } from '../src/lib/handwriting';

const OUT = path.join('public', 'find-data', 'strokes.bin');

export function loadMedians(): { char: string; medians: Point[][] }[] {
  const require = createRequire(import.meta.url);
  const source = path.dirname(require.resolve('hanzi-writer-data/package.json'));
  return readdirSync(source)
    .filter((f) => f.endsWith('.json') && f !== 'package.json')
    .map((f) => {
      const data = JSON.parse(readFileSync(path.join(source, f), 'utf8')) as { medians: Point[][] };
      return { char: f.slice(0, -'.json'.length), medians: data.medians };
    })
    .filter((c) => Array.from(c.char).length === 1);
}

if (process.argv[1]?.endsWith('build-handwriting.ts')) {
  if (existsSync(OUT) && !process.argv.includes('--force')) process.exit(0);
  const chars = loadMedians();
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, encodeStrokeData(chars));
  console.log(`Packed ${chars.length} characters into ${OUT}`);
}
