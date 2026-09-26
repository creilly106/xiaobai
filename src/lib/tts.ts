'use client';

import { AUDIO_INDEX_PATH, clipKey, type AudioIndex } from '@/lib/audio-clips';
import { VOICE_KEY } from '@/lib/prefs';

export type ChineseVoice = {
  uri: string;
  name: string;
  lang: string;
  /** Higher sounds better; see voiceScore. */
  score: number;
};

/** Mandarin voices only: zh-HK is Cantonese. */
const isMandarin = (v: SpeechSynthesisVoice) => {
  const lang = v.lang.toLowerCase().replace('_', '-');
  return lang.startsWith('zh') || lang.startsWith('cmn') ? !/hk|yue/.test(lang) : false;
};

/**
 * Rough quality ranking. Apple marks downloadable voices "premium"/"enhanced"
 * in their id; Edge's cloud voices say "Natural"/"Online"; mainland Mandarin
 * beats Taiwan's for learners following HSK pinyin.
 */
export function voiceScore(v: Pick<SpeechSynthesisVoice, 'name' | 'voiceURI' | 'lang'>): number {
  const id = `${v.name} ${v.voiceURI}`.toLowerCase();
  const quality = /premium/.test(id)
    ? 3
    : /enhanced|natural|neural|online|wavenet/.test(id)
      ? 2
      : /compact/.test(id)
        ? 0
        : 1;
  const mainland = /cn|cmn/i.test(v.lang) ? 1 : 0;
  return quality * 2 + mainland;
}

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Every Mandarin voice this device offers, best first. */
export function chineseVoices(): ChineseVoice[] {
  if (!isTtsSupported()) return [];
  return window.speechSynthesis
    .getVoices()
    .filter(isMandarin)
    .map((v) => ({ uri: v.voiceURI, name: v.name, lang: v.lang, score: voiceScore(v) }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function chosenUri(): string | null {
  try {
    return localStorage.getItem(VOICE_KEY);
  } catch {
    return null;
  }
}

/** The voice picked in Settings if it's still installed, else the best available. */
function pickVoice(): SpeechSynthesisVoice | null {
  if (!isTtsSupported()) return null;
  const voices = window.speechSynthesis.getVoices().filter(isMandarin);
  if (voices.length === 0) return null;
  const chosen = chosenUri();
  return (
    (chosen && voices.find((v) => v.voiceURI === chosen)) ||
    [...voices].sort((a, b) => voiceScore(b) - voiceScore(a))[0]
  );
}

/* ─── Recorded clips (public/audio) ─────────────────────────────────── */

const NORMAL_RATE = 0.85;
let clips: Record<string, string> | null = null;
let loadingClips: Promise<void> | null = null;
let player: HTMLAudioElement | null = null;

function loadClips(): Promise<void> {
  loadingClips ??= fetch(AUDIO_INDEX_PATH)
    .then((r) => (r.ok ? (r.json() as Promise<AudioIndex>) : null))
    .then((index) => {
      clips = index?.clips ?? {};
    })
    .catch(() => {
      clips = {};
    });
  return loadingClips;
}

/** A one-sample silent WAV, played on the first tap so iOS allows audio later. */
function silentWav(): string {
  const bytes = [...'RIFF'].map((c) => c.charCodeAt(0));
  const u32 = (n: number) => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255];
  const u16 = (n: number) => [n & 255, (n >> 8) & 255];
  const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
  bytes.push(
    ...u32(37),
    ...ascii('WAVEfmt '),
    ...u32(16),
    ...u16(1),
    ...u16(1),
    ...u32(8000),
    ...u32(8000),
    ...u16(1),
    ...u16(8),
    ...ascii('data'),
    ...u32(1),
    128,
  );
  return `data:audio/wav;base64,${btoa(String.fromCharCode(...bytes))}`;
}

function getPlayer(): HTMLAudioElement {
  player ??= new Audio();
  return player;
}

if (typeof window !== 'undefined') {
  void loadClips();
  const unlock = () => {
    const a = getPlayer();
    a.src = silentWav();
    a.play().catch(() => {});
    for (const e of ['pointerdown', 'keydown'] as const) window.removeEventListener(e, unlock);
  };
  for (const e of ['pointerdown', 'keydown'] as const) {
    window.addEventListener(e, unlock, { once: true, passive: true });
  }
}

const clipUrl = (file: string) => `/audio/${file.split('/').map(encodeURIComponent).join('/')}`;

/** Play a recording of `text` if there is one; false if not. */
function playClip(text: string, rate: number, fallback: () => void): boolean {
  const file = clips?.[clipKey(text)];
  if (!file) return false;
  const a = getPlayer();
  let fellBack = false;
  const fail = () => {
    if (fellBack) return;
    fellBack = true;
    fallback();
  };
  a.onerror = fail;
  a.onended = null;
  a.src = clipUrl(file);
  a.playbackRate = Math.min(2, Math.max(0.5, rate / NORMAL_RATE));
  a.preservesPitch = true;
  a.play().catch(fail);
  return true;
}

/** Resolves whatever speakAndWait() is waiting on (playback ended or was cut off). */
let finishCurrent: (() => void) | null = null;

function stopAll() {
  finishCurrent?.();
  if (player && !player.paused) player.pause();
  if (isTtsSupported()) window.speechSynthesis.cancel();
}

/** Stop whatever is playing. */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined') stopAll();
}

/**
 * Like speak(), but resolves once the line has finished playing — or has been
 * interrupted by other audio. Used to play a dialogue line by line.
 */
export async function speakAndWait(text: string, rate = NORMAL_RATE): Promise<void> {
  if (typeof window === 'undefined') return;
  await loadClips();
  stopAll();
  return new Promise<void>((resolve) => {
    // Some browsers (iOS especially) occasionally never fire an end event.
    const guard = setTimeout(done, 4000 + [...text].length * 500);
    function done() {
      clearTimeout(guard);
      if (finishCurrent === done) finishCurrent = null;
      resolve();
    }
    finishCurrent = done;
    const voice = () => speakWithVoice(text, rate, done);
    if (playClip(text, rate, voice)) getPlayer().onended = done;
    else voice();
  });
}

/**
 * Say `text` in Chinese: a native recording when one exists (see
 * scripts/fetch-word-audio.ts), otherwise the device's best voice.
 */
export function speak(text: string, rate = NORMAL_RATE): void {
  if (typeof window === 'undefined') return;
  stopAll();
  if (playClip(text, rate, () => speakWithVoice(text, rate))) return;
  speakWithVoice(text, rate);
}

function speakWithVoice(text: string, rate: number, onEnd?: () => void): void {
  if (!isTtsSupported()) return onEnd?.();
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  utter.rate = rate;
  if (onEnd) utter.onend = utter.onerror = () => onEnd();
  const voice = pickVoice();
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  }
  try {
    synth.speak(utter);
  } catch {
    // ignore — some browsers throw on rapid cancel/speak
  }
}

/** Load the voice list and clip index early (both arrive asynchronously). */
export function primeVoices(): void {
  if (typeof window === 'undefined') return;
  void loadClips();
  if (isTtsSupported()) window.speechSynthesis.getVoices();
}
