/**
 * Generates src/lib/generated/examples.json: up to three short example
 * sentences for each vocabulary word, from Tatoeba (https://tatoeba.org,
 * CC BY 2.0 FR) via the ManyThings.org Chinese–English file.
 *
 * Only sentences written entirely with characters from your HSK vocabulary are
 * kept, which drops traditional-only characters and anything too advanced.
 *
 *   npm run data:examples
 */
import 'dotenv/config';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { dbCredentials } from '../src/db/config';
import { segmentWords } from '../src/lib/segment';
import { ensureTatoeba } from './tatoeba-source';

const OUT = path.join('src', 'lib', 'generated', 'examples.json');

const PER_WORD = 3;
const MIN_CHARS = 3;
const MAX_CHARS = 16;
/** Short enough to read at a glance, long enough to show the word in use. */
const IDEAL_CHARS = 8;
/** Keep study material pleasant: skip lines about death and violence. */
const AVOID = /[死杀枪]/u;
const HAN = /[㐀-鿿]/u;

export type ExampleData = {
  /** Sentence pairs; `src` is the Tatoeba sentence ids ("zh/en") for attribution. */
  sentences: { zh: string; en: string; src: string }[];
  /** Vocabulary word → indexes into `sentences`, best first. */
  words: Record<string, number[]>;
};

async function main() {
  const TXT = ensureTatoeba();
  const client = createClient(dbCredentials());
  const words = (await client.execute('SELECT hanzi FROM words')).rows.map((r) => String(r.hanzi));
  client.close();

  const vocab = new Set(words);
  const allowedChars = new Set(words.flatMap((w) => Array.from(w)));

  const seen = new Set<string>();
  const candidates: ExampleData['sentences'] = [];
  for (const line of readFileSync(TXT, 'utf8').split('\n')) {
    const [en, zh, attribution] = line.split('\t');
    if (!en || !zh) continue;
    const text = zh.trim();
    const han = Array.from(text).filter((c) => HAN.test(c));
    if (han.length < MIN_CHARS || han.length > MAX_CHARS) continue;
    if (/[A-Za-z0-9]/.test(text) || AVOID.test(text)) continue;
    if (!han.every((c) => allowedChars.has(c))) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    const ids = /#(\d+)[^#]*#(\d+)/.exec(attribution ?? '');
    candidates.push({ zh: text, en: en.trim(), src: ids ? `${ids[2]}/${ids[1]}` : '' });
  }

  // For each word, prefer sentences near IDEAL_CHARS — never ones that are just the word.
  const byWord = new Map<string, number[]>();
  candidates.forEach((s, i) => {
    for (const w of new Set(segmentWords(s.zh, vocab))) {
      const list = byWord.get(w) ?? [];
      list.push(i);
      byWord.set(w, list);
    }
  });

  const keep = new Map<number, number>(); // old index → new index
  const sentences: ExampleData['sentences'] = [];
  const out: ExampleData['words'] = {};
  const hanCount = (i: number) => Array.from(candidates[i].zh).filter((c) => HAN.test(c)).length;
  for (const [word, idxs] of byWord) {
    const wordLen = Array.from(word).length;
    const best = idxs
      .filter((i) => hanCount(i) >= wordLen + 2)
      .sort(
        (a, b) =>
          Math.abs(hanCount(a) - IDEAL_CHARS) - Math.abs(hanCount(b) - IDEAL_CHARS) ||
          hanCount(a) - hanCount(b) ||
          a - b,
      )
      .slice(0, PER_WORD);
    if (best.length === 0) continue;
    out[word] = best.map((i) => {
      if (!keep.has(i)) {
        keep.set(i, sentences.length);
        sentences.push(candidates[i]);
      }
      return keep.get(i)!;
    });
  }

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify({ sentences, words: out } satisfies ExampleData)}\n`);
  console.log(
    `Kept ${sentences.length} of ${candidates.length} usable sentences; ` +
      `${Object.keys(out).length} of ${words.length} words have examples → ${OUT}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
