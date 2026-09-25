'use client';

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

export function speak(text: string, rate = 0.85): void {
  if (!isTtsSupported()) return;
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  utter.rate = rate;
  const voice = pickVoice();
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  }
  try {
    synth.cancel();
    synth.speak(utter);
  } catch {
    // ignore — some browsers throw on rapid cancel/speak
  }
}

/** Ask the browser to load its voice list early (it arrives asynchronously). */
export function primeVoices(): void {
  if (!isTtsSupported()) return;
  window.speechSynthesis.getVoices();
}
