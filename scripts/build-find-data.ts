/**
 * Generates public/find-data/chars.json for "Find a character":
 *  - chars: every character that can be a result, most common first (HSK
 *    level, then how many CC-CEDICT words use it; traditional-only forms last);
 *  - parts: each character's components, nested ones included (河 → 氵可丁口);
 *  - picker: the components worth offering in the parts picker, with their
 *    stroke counts.
 *
 * Sources (cached by other scripts): Make Me a Hanzi's dictionary.txt
 * (npm run data:chars), CC-CEDICT (npm run data:cedict), hanzi-writer-data.
 *
 *   npm run data:find
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { parseCedictLine } from '../src/lib/cedict';
import { hsk1 } from './data/hsk1';
import { hsk2 } from './data/hsk2';
import { hsk3 } from './data/hsk3';
import { hsk4 } from './data/hsk4';
import { loadMedians } from './build-handwriting';

const OUT = path.join('public', 'find-data', 'chars.json');
const MMAH = path.join('scripts', '.cache', 'makemeahanzi-dictionary.txt');
const CEDICT = path.join('scripts', '.cache', 'cedict.txt.gz');
/** A component must appear in this many characters to be offered in the picker. */
const PICKER_MIN_USES = 15;

const IDC = /[⿰-⿻]/u;
const RESULT = /^[㐀-䶿一-鿿]$/u;

export type FindData = {
  chars: string;
  parts: Record<string, string>;
  picker: Record<string, number>;
};

// Components straight from the decomposition, then theirs, and so on.
const decomposition = new Map<string, { parts: string[]; radical: string }>();
for (const line of readFileSync(MMAH, 'utf8').split('\n')) {
  if (!line.trim()) continue;
  const d = JSON.parse(line) as { character: string; decomposition: string; radical: string };
  const parts = Array.from(d.decomposition).filter((c) => !IDC.test(c) && c !== '？');
  decomposition.set(d.character, { parts, radical: d.radical });
}
function allParts(char: string, seen = new Set<string>()): Set<string> {
  const d = decomposition.get(char);
  if (!d) return seen;
  for (const p of [...d.parts, d.radical]) {
    if (p === char || seen.has(p)) continue;
    seen.add(p);
    allParts(p, seen);
  }
  return seen;
}

// Commonness: HSK level, then CC-CEDICT words (simplified) containing it.
const level = new Map<string, number>();
[hsk1, hsk2, hsk3, hsk4].forEach((list, i) => {
  for (const w of list) for (const c of w.hanzi) if (!level.has(c)) level.set(c, i + 1);
});
const uses = new Map<string, number>();
for (const line of gunzipSync(readFileSync(CEDICT)).toString('utf8').split('\n')) {
  const entry = parseCedictLine(line);
  if (!entry) continue;
  for (const c of new Set(entry.simplified)) uses.set(c, (uses.get(c) ?? 0) + 1);
}

const strokeCount = new Map(loadMedians().map((c) => [c.char, c.medians.length]));
const results = [...strokeCount.keys()].filter((c) => RESULT.test(c));
results.sort(
  (a, b) =>
    (level.get(a) ?? 9) - (level.get(b) ?? 9) ||
    (uses.get(b) ?? 0) - (uses.get(a) ?? 0) ||
    (strokeCount.get(a) ?? 0) - (strokeCount.get(b) ?? 0),
);

const parts: Record<string, string> = {};
const partUses = new Map<string, number>();
for (const c of results) {
  const ps = [...allParts(c)].filter((p) => strokeCount.has(p));
  if (ps.length === 0) continue;
  parts[c] = ps.join('');
  for (const p of ps) partUses.set(p, (partUses.get(p) ?? 0) + 1);
}
const picker: Record<string, number> = {};
for (const [p, n] of [...partUses].sort((a, b) => b[1] - a[1])) {
  // Single strokes (一 丨 丿) are in nearly everything, so they don't narrow much.
  if (n >= PICKER_MIN_USES && strokeCount.get(p)! > 1) picker[p] = strokeCount.get(p)!;
}

const data: FindData = { chars: results.join(''), parts, picker };
mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(data));
console.log(
  `${results.length} characters, ${Object.keys(parts).length} with parts, ${Object.keys(picker).length} parts in the picker`,
);
