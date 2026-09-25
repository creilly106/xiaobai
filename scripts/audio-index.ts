// Reading and writing public/audio/index.json (see src/lib/audio-clips.ts).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { AudioIndex } from '../src/lib/audio-clips';

const INDEX = path.join('public', 'audio', 'index.json');

export function readIndex(): AudioIndex {
  return existsSync(INDEX)
    ? (JSON.parse(readFileSync(INDEX, 'utf8')) as AudioIndex)
    : { version: 1, clips: {} };
}

/** Sorted, so re-runs give small diffs. */
export function writeIndex(index: AudioIndex) {
  const clips = Object.fromEntries(
    Object.entries(index.clips).sort(([a], [b]) => (a < b ? -1 : 1)),
  );
  writeFileSync(INDEX, JSON.stringify({ version: 1, clips }));
}
