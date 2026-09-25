'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { ToggleSwitch } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { AUTOPLAY_AUDIO_KEY, VOICE_KEY } from '@/lib/prefs';
import { chineseVoices, speak, type ChineseVoice } from '@/lib/tts';
import { useStoredPref, useTtsSupported } from '@/lib/use-client';

/** The device's Mandarin voices; the list arrives asynchronously in most browsers. */
function useChineseVoices(): ChineseVoice[] {
  const json = useSyncExternalStore(
    (onChange) => {
      if (!('speechSynthesis' in window)) return () => {};
      window.speechSynthesis.addEventListener('voiceschanged', onChange);
      return () => window.speechSynthesis.removeEventListener('voiceschanged', onChange);
    },
    // A string snapshot, so it only changes when the list does.
    () => JSON.stringify(chineseVoices()),
    () => '[]',
  );
  return useMemo(() => JSON.parse(json) as ChineseVoice[], [json]);
}

const qualityLabel = (v: ChineseVoice) =>
  v.score >= 6 ? ' — premium' : v.score >= 4 ? ' — enhanced' : v.score <= 1 ? ' — basic' : '';

export function AudioPrefs() {
  const tts = useTtsSupported();
  const [autoplay, setAutoplay] = useStoredPref(AUTOPLAY_AUDIO_KEY, '1');
  const [voice, setVoice] = useStoredPref(VOICE_KEY, '');
  const voices = useChineseVoices();
  const best = voices[0];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3">
        <div>
          <div className="text-sm font-medium">Play audio when an answer is revealed</div>
          <p className="text-xs text-muted-foreground">
            In Study and Quiz. Press P to replay, or click any word to hear just that word.
          </p>
        </div>
        <ToggleSwitch
          value={autoplay === '1'}
          onChange={(v) => setAutoplay(v ? '1' : '0')}
          label="Play audio when an answer is revealed"
        />
      </div>
      {voices.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3">
          <div className="min-w-0 flex-1">
            <label htmlFor="voice" className="text-sm font-medium">
              Voice
            </label>
            <p className="text-xs text-muted-foreground">
              The Chinese voices on this device. Better ones can often be downloaded: on iPhone,
              Settings → Accessibility → Spoken Content → Voices → Chinese.
            </p>
          </div>
          <select
            id="voice"
            value={voices.some((v) => v.uri === voice) ? voice : ''}
            onChange={(e) => {
              setVoice(e.target.value);
              // Let the choice save before speaking with it.
              setTimeout(() => speak('你好，欢迎学习中文。'), 0);
            }}
            className="h-9 max-w-full rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="">Best available{best ? ` (${best.name})` : ''}</option>
            {voices.map((v) => (
              <option key={v.uri} value={v.uri}>
                {v.name} · {v.lang}
                {qualityLabel(v)}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={() => speak('你好，欢迎学习中文。')}
          disabled={!tts}
        >
          Test voice
        </Button>
        <span className="text-xs text-muted-foreground">
          {tts
            ? 'Most words play a native speaker’s recording; everything else uses your device’s Chinese voice.'
            : 'This browser has no text-to-speech, so audio is unavailable.'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Word recordings: Yue Tan (Shtooka project), via{' '}
        <a
          href="https://github.com/hugolpz/audio-cmn"
          className="underline hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          audio-cmn
        </a>
        , CC BY-SA 3.0.
      </p>
    </div>
  );
}
