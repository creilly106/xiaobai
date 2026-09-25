/**
 * Generates neural-voice audio (Microsoft Azure Speech) for everything the
 * app says that has no native recording: HSK words without one (with their
 * exact pinyin forced, so 了 is "le" and 长 is "cháng"), lesson sentences,
 * grammar examples, scenario phrases/variants/dialogues and the Tatoeba
 * example sentences. Clips go in public/audio and public/audio/index.json.
 *
 * Needs .env.audio with AZURE_SPEECH_KEY and AZURE_SPEECH_REGION (free F0
 * tier: 500k characters a month; this uses ~30k, once). Safe to re-run: it
 * skips anything that already has a clip.
 *
 *   npm run data:tts                 (everything missing)
 *   npm run data:tts -- --dry-run    (count what would be generated)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import { createClient } from '@libsql/client';
import { dbCredentials } from '../src/db/config';
import { clipHash, clipKey } from '../src/lib/audio-clips';
import { LESSONS } from '../src/lib/curriculum';
import { grammarPoints } from '../src/lib/grammar-data';
import { toneless } from '../src/lib/pinyin';
import { splitPinyinText } from '../src/lib/pinyin-split';
import { scenarios } from '../src/lib/scenario-data';
import { readIndex, writeIndex } from './audio-index';

config({ path: '.env', quiet: true });
config({ path: '.env.audio', quiet: true });

const KEY = process.env.AZURE_SPEECH_KEY?.trim();
const REGION = process.env.AZURE_SPEECH_REGION?.trim();
const VOICE = 'zh-CN-XiaoxiaoNeural';
/** The other side of a dialogue, so conversations sound like two people. */
const OTHER_VOICE = 'zh-CN-YunxiNeural';
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3';
/** A touch slower than natural speech, for learners. */
const RATE = '-10%';
const MONTHLY_FREE_CHARS = 500_000;
const PARALLEL = 3;
const AUDIO_DIR = path.join('public', 'audio');

type Item = { text: string; voice: string; pinyin?: string; kind: string };

const escapeXml = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!,
  );

/** "cháng" → "chang 2", "xǐhuan" → "xi 3 huan 5" (Microsoft's SAPI pinyin). */
function sapiPhones(pinyin: string): string | null {
  const syllables = splitPinyinText(pinyin).filter((s) => /\p{L}/u.test(s.text));
  if (syllables.length === 0) return null;
  const parts = syllables.map((s) => {
    const letters = toneless(s.text);
    return letters ? `${letters} ${s.tone ?? 5}` : null;
  });
  return parts.every(Boolean) ? parts.join(' ') : null;
}

function ssml(item: Item): string {
  const phones = item.pinyin ? sapiPhones(item.pinyin) : null;
  const body = phones
    ? `<phoneme alphabet="sapi" ph="${phones}">${escapeXml(item.text)}</phoneme>`
    : escapeXml(item.text);
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN"><voice name="${item.voice}"><prosody rate="${RATE}">${body}</prosody></voice></speak>`;
}

async function synthesise(item: Item): Promise<Buffer> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': KEY!,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': FORMAT,
        'User-Agent': 'xiaobai',
      },
      body: ssml(item),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    // Azure rejects some forced readings (erhua like "nǎr"); those words aren't
    // ambiguous, so let the voice read the characters as it would anyway.
    if (res.status === 400 && item.pinyin) return synthesise({ ...item, pinyin: undefined });
    // Throttled (the free tier allows only a few requests at once): wait and retry.
    if ((res.status === 429 || res.status >= 500) && attempt < 8) {
      const wait = Number(res.headers.get('retry-after') ?? 0) * 1000 || 2000 * (attempt + 1);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    throw new Error(`Azure ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

async function collect(): Promise<Item[]> {
  const items: Item[] = [];
  // 1. HSK words that have no native recording, with their pinyin forced.
  const client = createClient(dbCredentials());
  const words = (
    await client.execute('SELECT hanzi, pinyin FROM words WHERE hsk_level IS NOT NULL')
  ).rows.map((r) => ({ hanzi: String(r.hanzi), pinyin: String(r.pinyin) }));
  client.close();
  for (const w of words)
    items.push({ text: w.hanzi, pinyin: w.pinyin, voice: VOICE, kind: 'word' });
  // 2. Lesson sentences and grammar examples.
  for (const l of LESSONS)
    for (const s of l.sentences ?? []) items.push({ text: s.hanzi, voice: VOICE, kind: 'lesson' });
  for (const g of grammarPoints)
    for (const ex of g.examples) items.push({ text: ex.hanzi, voice: VOICE, kind: 'grammar' });
  // 3. Scenarios: phrases, time variants, then dialogues (two voices).
  for (const sc of scenarios) {
    for (const p of sc.sentences) {
      items.push({ text: p.hanzi, voice: VOICE, kind: 'scenario' });
      for (const v of p.variants ?? [])
        items.push({ text: v.hanzi, voice: VOICE, kind: 'scenario' });
    }
    for (const d of sc.dialogues ?? []) {
      for (const line of d.lines) {
        items.push({
          text: line.hanzi,
          voice: line.speaker === 'them' ? OTHER_VOICE : VOICE,
          kind: 'dialogue',
        });
      }
    }
  }
  // 4. Tatoeba example sentences (shown on character pages and used in lessons).
  const examples = JSON.parse(readFileSync('src/lib/generated/examples.json', 'utf8')) as {
    sentences: { zh: string }[];
  };
  for (const e of examples.sentences) items.push({ text: e.zh, voice: VOICE, kind: 'example' });

  // Each text once (the first mention wins, so a phrase keeps the main voice).
  const seen = new Set<string>();
  return items.filter((i) => {
    const key = clipKey(i.text);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  if (!dryRun && (!KEY || !REGION)) {
    throw new Error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.audio first.');
  }
  const index = readIndex();
  const todo = (await collect()).filter((i) => !index.clips[clipKey(i.text)]);
  const chars = todo.reduce((n, i) => n + Array.from(i.text).length, 0);
  const byKind = todo.reduce<Record<string, number>>(
    (m, i) => ((m[i.kind] = (m[i.kind] ?? 0) + 1), m),
    {},
  );
  console.log(`${todo.length} clips to generate (${chars.toLocaleString()} characters):`, byKind);
  if (chars > MONTHLY_FREE_CHARS * 0.9)
    throw new Error('That would use most of the free monthly allowance — stopping.');
  if (dryRun || todo.length === 0) return;

  mkdirSync(path.join(AUDIO_DIR, 's'), { recursive: true });
  let done = 0;
  let failed = 0;
  const queue = [...todo];
  async function worker() {
    for (let item = queue.shift(); item; item = queue.shift()) {
      const key = clipKey(item.text);
      // Words keep the readable name used by the native recordings.
      const file = item.kind === 'word' ? `w/${item.text}.mp3` : `s/${clipHash(key)}.mp3`;
      try {
        const audio = await synthesise(item);
        writeFileSync(path.join(AUDIO_DIR, file), audio);
        index.clips[key] = file;
        done++;
      } catch (err) {
        failed++;
        console.error(`\n${item.text}: ${(err as Error).message}`);
      }
      if ((done + failed) % 25 === 0) {
        writeIndex(index); // save progress, so a stopped run resumes
        process.stdout.write(`\r${done + failed} / ${todo.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, worker));
  writeIndex(index);
  console.log(
    `\nGenerated ${done}, failed ${failed}. Index has ${Object.keys(index.clips).length} clips.`,
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
