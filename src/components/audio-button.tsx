'use client';

import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speak } from '@/lib/tts';
import { useTtsSupported } from '@/lib/use-client';

/** Speaker button that reads `text` aloud. Renders a same-size spacer when TTS is unavailable. */
export function AudioButton({
  text,
  label,
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const supported = useTtsSupported();
  if (!supported) return <span className="inline-block size-7" aria-hidden />;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={label ?? `Play pronunciation of ${text}`}
      title="Play pronunciation"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
    >
      <Volume2 />
    </Button>
  );
}
