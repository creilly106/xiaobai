'use client';

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  const zh =
    voices.find((v) => v.lang.toLowerCase() === 'zh-cn') ??
    voices.find((v) => v.lang.toLowerCase().startsWith('zh-cn')) ??
    voices.find((v) => v.lang.toLowerCase().startsWith('zh')) ??
    null;
  cachedVoice = zh;
  return zh;
}

export function isTtsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string, rate = 0.85): void {
  if (!isTtsSupported()) return;
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  utter.rate = rate;
  const voice = pickVoice();
  if (voice) utter.voice = voice;
  try {
    synth.cancel();
    synth.speak(utter);
  } catch {
    // ignore — some browsers throw on rapid cancel/speak
  }
}

export function primeVoices(): void {
  if (!isTtsSupported()) return;
  const synth = window.speechSynthesis;
  synth.getVoices();
  synth.addEventListener('voiceschanged', () => {
    cachedVoice = undefined;
    pickVoice();
  });
}
