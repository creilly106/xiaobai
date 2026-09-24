'use client';

import { useEffect } from 'react';
import { audioFor } from '@/lib/audio-text';
import { AUTOPLAY_AUDIO_KEY } from '@/lib/prefs';
import { speak } from '@/lib/tts';
import { useStoredPref } from '@/lib/use-client';

/**
 * Card audio behaviour shared by study and quiz:
 *  - listening cards play their prompt as soon as they appear,
 *  - the answer plays on reveal (if autoplay is on),
 *  - P replays whichever side is showing.
 */
export function useCardAudio({
  cardKey,
  hanzi,
  pinyin,
  flipped,
  listenAudio,
}: {
  cardKey: string | number;
  hanzi: string;
  pinyin: string;
  flipped: boolean;
  listenAudio?: string;
}) {
  const [autoplay] = useStoredPref(AUTOPLAY_AUDIO_KEY, '1');

  useEffect(() => {
    if (flipped && autoplay === '1') speak(audioFor(hanzi, pinyin).text);
  }, [flipped, autoplay, hanzi, pinyin, cardKey]);

  useEffect(() => {
    if (listenAudio && !flipped) speak(listenAudio);
  }, [listenAudio, flipped, cardKey]);

  useEffect(() => {
    if (!flipped && !listenAudio) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return;
      if (e.key.toLowerCase() !== 'p') return;
      speak(flipped ? audioFor(hanzi, pinyin).text : listenAudio!);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, hanzi, pinyin, listenAudio]);
}
