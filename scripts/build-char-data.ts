/**
 * Generates src/lib/generated/char-data.json from Make Me a Hanzi's
 * dictionary.txt (https://github.com/skishore/makemeahanzi, Arphic PL / LGPL).
 *
 * Keeps only characters the app can show — every hanzi in words, sentences,
 * glosses, radicals and grammar examples — plus, recursively, every component
 * of their decompositions.
 *
 *   npm run data:chars
 */
import 'dotenv/config';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/db/schema';
import { radicalChars, radicals } from '../src/lib/radicals-data';
import { grammarPoints } from '../src/lib/grammar-data';
import { charGlosses } from '../src/lib/char-glosses';
import { markTone, type Tone } from '../src/lib/pinyin';

const SOURCE_URL = 'https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt';
const CACHE = path.join('scripts', '.cache', 'makemeahanzi-dictionary.txt');
const OUT = path.join('src', 'lib', 'generated', 'char-data.json');

const CJK = /[⺀-⿟㐀-䶿一-鿿豈-﫿]/u;
const IDC = /[⿰-⿻]/u;

type Source = {
  character: string;
  definition?: string;
  pinyin: string[];
  decomposition: string;
  radical: string;
  etymology?: {
    type: 'ideographic' | 'pictographic' | 'pictophonetic';
    hint?: string;
    semantic?: string;
    phonetic?: string;
  };
};

export type CharDatum = {
  /** Ideographic Description Sequence; '？' marks an unencoded component. */
  ids: string;
  radical: string;
  pinyin?: string;
  /** Every reading, only present when there is more than one. */
  readings?: string[];
  definition?: string;
  etymology?: Source['etymology'];
};

async function loadSource(): Promise<string> {
  if (existsSync(CACHE)) return readFileSync(CACHE, 'utf8');
  console.log(`Downloading ${SOURCE_URL} …`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const text = await res.text();
  mkdirSync(path.dirname(CACHE), { recursive: true });
  writeFileSync(CACHE, text);
  return text;
}

const CEDICT_URL = 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz';
const CEDICT_CACHE = path.join('scripts', '.cache', 'cedict.txt.gz');

/**
 * Every everyday reading of each single character, from CC-CEDICT
 * (https://cc-cedict.org, CC BY-SA 4.0). Make Me a Hanzi usually lists only
 * one reading, which hides polyphones like 还 hái/huán. Proper-noun readings
 * (capitalised) and "variant of" entries are skipped.
 */
async function loadCedictReadings(): Promise<Map<string, Set<string>>> {
  if (!existsSync(CEDICT_CACHE)) {
    console.log(`Downloading ${CEDICT_URL} …`);
    const res = await fetch(CEDICT_URL);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    mkdirSync(path.dirname(CEDICT_CACHE), { recursive: true });
    writeFileSync(CEDICT_CACHE, Buffer.from(await res.arrayBuffer()));
  }
  const text = gunzipSync(readFileSync(CEDICT_CACHE)).toString('utf8');
  const line = /^\S+ (\S+) \[([^\]]+)\] \/(.*)\/$/;
  const out = new Map<string, Set<string>>();
  for (const raw of text.split('\n')) {
    const m = line.exec(raw.trim());
    if (!m) continue;
    const [, simplified, numbered, defs] = m;
    if (Array.from(simplified).length !== 1 || /^[A-Z]/.test(numbered)) continue;
    if (/^(old |archaic )?variant of|^see /i.test(defs)) continue;
    const tm = /^([a-z:]+)([1-5])$/.exec(numbered.toLowerCase());
    if (!tm) continue;
    const reading = markTone(tm[1].replace(/u:/g, 'v'), Number(tm[2]) as Tone);
    const set = out.get(simplified) ?? new Set<string>();
    set.add(reading.normalize('NFC'));
    out.set(simplified, set);
  }
  return out;
}

async function main() {
  const cedict = await loadCedictReadings();
  const source = new Map<string, Source>();
  for (const line of (await loadSource()).split('\n')) {
    if (!line.trim()) continue;
    const row = JSON.parse(line) as Source;
    source.set(row.character, row);
  }

  const client = createClient({ url: process.env.DATABASE_URL ?? 'file:./data/app.db' });
  const db = drizzle(client, { schema });
  const words = await db.select({ hanzi: schema.words.hanzi }).from(schema.words);
  const sentences = await db.select({ hanzi: schema.sentences.hanzi }).from(schema.sentences);
  client.close();

  const wanted = new Set<string>();
  const add = (s: string) => {
    for (const c of Array.from(s)) if (CJK.test(c)) wanted.add(c);
  };
  words.forEach((w) => add(w.hanzi));
  sentences.forEach((s) => add(s.hanzi));
  Object.keys(charGlosses).forEach(add);
  radicals.forEach((r) => {
    radicalChars(r).forEach(add);
    r.examples?.forEach(add);
  });
  grammarPoints.forEach((g) => g.examples.forEach((e) => add(e.hanzi)));

  const out: Record<string, CharDatum> = {};
  const queue = [...wanted];
  const missing: string[] = [];
  while (queue.length > 0) {
    const c = queue.pop()!;
    if (out[c]) continue;
    const row = source.get(c);
    if (!row) {
      missing.push(c);
      continue;
    }
    // Polyphones (了 le/liǎo) — callers that need an unambiguous sound check this.
    const readings = [
      ...new Set([
        ...row.pinyin.map((p) => p.normalize('NFC').toLowerCase()),
        ...(cedict.get(c) ?? []),
      ]),
    ];
    out[c] = {
      ids: row.decomposition,
      radical: row.radical,
      ...(row.pinyin[0] ? { pinyin: row.pinyin[0] } : {}),
      ...(readings.length > 1 ? { readings } : {}),
      ...(row.definition ? { definition: row.definition } : {}),
      ...(row.etymology ? { etymology: row.etymology } : {}),
    };
    for (const part of Array.from(row.decomposition)) {
      if (part !== c && !IDC.test(part) && CJK.test(part) && !out[part]) queue.push(part);
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(out).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(sorted)}\n`);
  console.log(
    `Wrote ${Object.keys(sorted).length} characters to ${OUT}` +
      (missing.length ? ` (not in source: ${missing.join('')})` : ''),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
