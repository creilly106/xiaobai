'use client';

import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { audioFor } from '@/lib/audio-text';
import { speak } from '@/lib/tts';
import { useTtsSupported } from '@/lib/use-client';

/**
 * Speaker button that reads `text` aloud. Pass `reading` (pinyin) for single
 * characters so ones with several readings are spoken in a word that makes
 * the right one clear. Renders a same-size spacer when TTS is unavailable.
 */
export function AudioButton({
  text,
  reading,
  label,
  className,
}: {
  text: string;
  reading?: string | null;
  label?: string;
  className?: string;
}) {
  const supported = useTtsSupported();
  if (!supported) return <span className="inline-block size-7" aria-hidden />;
  const audio = audioFor(text, reading);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={label ?? `Play pronunciation of ${text}`}
      title={audio.via ? `Plays ${audio.via} so you hear this reading` : 'Play pronunciation'}
      onClick={(e) => {
        e.stopPropagation();
        speak(audio.text);
      }}
    >
      <Volume2 />
    </Button>
  );
}
