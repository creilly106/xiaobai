'use client';

import { ToggleSwitch } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { AUTOPLAY_AUDIO_KEY } from '@/lib/prefs';
import { speak } from '@/lib/tts';
import { useStoredPref, useTtsSupported } from '@/lib/use-client';

export function AudioPrefs() {
  const tts = useTtsSupported();
  const [autoplay, setAutoplay] = useStoredPref(AUTOPLAY_AUDIO_KEY, '1');
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
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Button variant="outline" size="sm" onClick={() => speak('你好，欢迎学习中文。')} disabled={!tts}>
          Test voice
        </Button>
        <span className="text-xs text-muted-foreground">
          {tts
            ? 'Audio uses your browser’s built-in Chinese voice. Edge has the most natural ones.'
            : 'This browser has no text-to-speech, so audio is unavailable.'}
        </span>
      </div>
    </div>
  );
}
