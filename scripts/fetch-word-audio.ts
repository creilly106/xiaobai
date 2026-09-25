/**
 * Downloads native-speaker recordings of HSK words into public/audio/w and
 * records them in public/audio/index.json. Source: audio-cmn by Hugo Lopez
 * (https://github.com/hugolpz/audio-cmn), speaker Yue Tan (Shtooka project),
 * CC BY-SA 3.0. Safe to re-run: existing files are kept.
 *
 * Characters with several readings (了, 长, 行…) are skipped — one recording
 * can't say which reading it is — and left to generated audio instead.
 *
 *   npm run data:word-audio
 */
import 'dotenv/config';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { dbCredentials } from '../src/db/config';
import { clipKey } from '../src/lib/audio-clips';
import { getCharDatum } from '../src/lib/ids-data';
import { readIndex, writeIndex } from './audio-index';

const SOURCE = 'https://raw.githubusercontent.com/hugolpz/audio-cmn/master/64k/hsk';
const LIST =
  'https://raw.githubusercontent.com/hugolpz/audio-cmn/master/lists/cmn-audios_words.txt';
const OUT_DIR = path.join('public', 'audio', 'w');
const PARALLEL = 8;

/** Single characters with two everyday readings — a recording could be either. */
const AMBIGUOUS = new Set(Array.from('了还着得长为重种分当倒干假转差场空喂啊'));

/**
 * Whether a lone character's recording might not match our reading: it's
 * genuinely ambiguous, or our reading isn't its main one (教 jiāo, 只 zhǐ).
 * Rare readings (猫 máo, 看 kān) don't count — the recording is the common one.
 */
function isPolyphonic(char: string, pinyin: string): boolean {
  if (AMBIGUOUS.has(char)) return true;
  const main = getCharDatum(char)?.readings?.[0];
  return main !== undefined && main.normalize('NFC') !== pinyin.normalize('NFC').toLowerCase();
}

async function main() {
  const client = createClient(dbCredentials());
  const words = (
    await client.execute('SELECT hanzi, pinyin FROM words WHERE hsk_level IS NOT NULL')
  ).rows.map((r) => ({ hanzi: String(r.hanzi), pinyin: String(r.pinyin) }));
  client.close();

  const available = new Set((await (await fetch(LIST)).text()).split('\n').map((l) => l.trim()));
  const wanted = words.filter(
    (w) =>
      available.has(w.hanzi) &&
      !(Array.from(w.hanzi).length === 1 && isPolyphonic(w.hanzi, w.pinyin)),
  );
  const skipped = words.filter((w) => available.has(w.hanzi) && !wanted.includes(w));
  console.log(
    `${wanted.length} of ${words.length} words have a usable recording ` +
      `(${skipped.length} multi-reading characters skipped: ${skipped.map((w) => w.hanzi).join('')}).`,
  );

  mkdirSync(OUT_DIR, { recursive: true });
  const index = readIndex();
  let downloaded = 0;
  let failed = 0;
  const queue = [...wanted];
  async function worker() {
    for (let w = queue.shift(); w; w = queue.shift()) {
      const file = path.join(OUT_DIR, `${w.hanzi}.mp3`);
      if (!existsSync(file)) {
        const res = await fetch(`${SOURCE}/cmn-${encodeURIComponent(w.hanzi)}.mp3`);
        if (!res.ok) {
          failed++;
          continue;
        }
        writeFileSync(file, Buffer.from(await res.arrayBuffer()));
        downloaded++;
      }
      index.clips[clipKey(w.hanzi)] = `w/${w.hanzi}.mp3`;
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, worker));
  writeIndex(index);
  console.log(
    `Downloaded ${downloaded} new, ${failed} failed. Index has ${Object.keys(index.clips).length} clips.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
