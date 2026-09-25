// Recorded audio clips, served from public/audio. Pure helpers shared by the
// scripts that fetch/generate clips and by the player in tts.ts.

/** public/audio/index.json: clip key → file path under /audio/. */
export type AudioIndex = { version: 1; clips: Record<string, string> };

export const AUDIO_INDEX_PATH = '/audio/index.json';

/**
 * What a clip is looked up by: the Chinese text without spaces or
 * punctuation, so "你好！" and "你好" share a recording.
 */
export function clipKey(text: string): string {
  return text.normalize('NFC').replace(/[\s\p{P}\p{S}]/gu, '');
}

/** Short stable file name for a sentence clip (FNV-1a, base36). */
export function clipHash(key: string): string {
  let h = 0x811c9dc5;
  for (const ch of key) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${h.toString(36)}${Array.from(key).length.toString(36)}`;
}
