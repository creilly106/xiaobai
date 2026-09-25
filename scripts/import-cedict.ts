/**
 * Loads CC-CEDICT (https://cc-cedict.org, CC BY-SA 4.0) into the `dictionary`
 * table so any word can be looked up and added to study. Safe to re-run: the
 * table is replaced wholesale. Your words, cards and notes are untouched.
 *
 *   npm run data:dictionary             (replace the table)
 *   npm run data:dictionary -- --if-empty (only fill an empty table; used on deploy)
 */
import 'dotenv/config';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { createClient, type InStatement } from '@libsql/client';
import { parseCedictLine } from '../src/lib/cedict';
import { dbCredentials, isRemoteDb } from '../src/db/config';
import { ensureTatoeba } from './tatoeba-source';

const URL = 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz';
const CACHE = path.join('scripts', '.cache', 'cedict.txt.gz');
const CHUNK = 200;
const HSK_BOOST = 10_000;
const MAX_NGRAM = 4;

/**
 * How often each 1–4 character string appears in the sentence corpus — a
 * rough stand-in for word frequency, used only to rank search results.
 */
function corpusCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  let corpus: string;
  try {
    corpus = ensureTatoeba();
  } catch (err) {
    console.warn('Could not get the Tatoeba corpus — ranking without frequency.', err);
    return counts;
  }
  for (const line of readFileSync(corpus, 'utf8').split('\n')) {
    const zh = Array.from(line.split('\t')[1] ?? '');
    for (let i = 0; i < zh.length; i++) {
      for (let n = 1; n <= MAX_NGRAM && i + n <= zh.length; n++) {
        const g = zh.slice(i, i + n).join('');
        counts.set(g, (counts.get(g) ?? 0) + 1);
      }
    }
  }
  return counts;
}

async function loadSource(): Promise<string> {
  if (!existsSync(CACHE)) {
    console.log(`Downloading ${URL} …`);
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    mkdirSync(path.dirname(CACHE), { recursive: true });
    writeFileSync(CACHE, Buffer.from(await res.arrayBuffer()));
  }
  return gunzipSync(readFileSync(CACHE)).toString('utf8');
}

async function main() {
  const entries = (await loadSource())
    .split('\n')
    .map(parseCedictLine)
    .filter((e) => e !== null);

  const client = createClient(dbCredentials());
  if (process.argv.includes('--if-empty')) {
    // Refresh the English search index (created by migration 0011).
    try {
      await client.execute("INSERT INTO dictionary_fts(dictionary_fts) VALUES('rebuild')");
    } catch {
      console.warn('No dictionary_fts index yet — run npm run db:migrate.');
    }
    const { rows } = await client.execute('SELECT count(*) AS n FROM dictionary');
    if (Number(rows[0].n) > 0) {
      console.log(`Dictionary already has ${rows[0].n} entries — skipping import.`);
      client.close();
      return;
    }
  }
  const hsk = new Set(
    (await client.execute('SELECT hanzi FROM words WHERE hsk_level IS NOT NULL')).rows.map((r) =>
      String(r.hanzi),
    ),
  );
  const counts = corpusCounts();
  const frequency = (simplified: string, traditional: string) =>
    (counts.get(simplified) ?? 0) +
    (traditional !== simplified ? (counts.get(traditional) ?? 0) : 0) +
    (hsk.has(simplified) ? HSK_BOOST : 0);

  const statements: InStatement[] = ['DELETE FROM dictionary'];
  for (let i = 0; i < entries.length; i += CHUNK) {
    const chunk = entries.slice(i, i + CHUNK);
    statements.push({
      sql:
        'INSERT INTO dictionary (simplified, traditional, pinyin, pinyin_plain, pinyin_tones, definitions, proper, frequency) VALUES ' +
        chunk.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', '),
      args: chunk.flatMap((e) => [
        e.simplified,
        e.traditional,
        e.pinyin,
        e.pinyinPlain,
        e.pinyinTones,
        e.definitions.join(' / '),
        e.proper ? 1 : 0,
        e.proper ? 0 : frequency(e.simplified, e.traditional),
      ]),
    });
  }
  if (!isRemoteDb()) {
    // One transaction: the table is never left half-filled.
    await client.batch(statements, 'write');
  } else {
    // A remote database won't take ~20 MB in one request; send it in parts.
    // (If this stops midway, just run it again — it starts by clearing the table.)
    const PER_REQUEST = 20;
    for (let i = 0; i < statements.length; i += PER_REQUEST) {
      await client.batch(statements.slice(i, i + PER_REQUEST), 'write');
      process.stdout.write(
        `\r${Math.min(i + PER_REQUEST, statements.length)} / ${statements.length} batches`,
      );
    }
    process.stdout.write('\n');
  }
  const { rows } = await client.execute('SELECT count(*) AS n FROM dictionary');
  client.close();
  console.log(`Imported ${rows[0].n} CC-CEDICT entries.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
