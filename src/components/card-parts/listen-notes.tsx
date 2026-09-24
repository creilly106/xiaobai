'use client';

import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { audioFor } from '@/lib/audio-text';
import { speak } from '@/lib/tts';
import type { ListeningInfo } from '@/lib/queries/study';

/** Front of a listening card: a big replay button and how the audio is phrased. */
export function ListenPrompt({ listening }: { listening: ListeningInfo }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="size-24 rounded-full"
        aria-label="Play the audio again"
        onClick={(e) => {
          e.stopPropagation();
          speak(listening.audio);
        }}
      >
        <Volume2 className="size-10" />
      </Button>
      <span className="text-xs text-muted-foreground">
        Click or press <kbd className="font-mono">P</kbd> to replay
      </span>
      {listening.inWord && (
        <p className="max-w-sm text-sm text-muted-foreground">
          This character has more than one reading, so you&apos;ll hear it inside a short word.
          Listen for it there.
        </p>
      )}
      {listening.viaWord && (
        <p className="max-w-sm text-sm text-muted-foreground">
          This sound has several words, so it&apos;s said the way people name a character:{' '}
          <span className="text-foreground">“[a longer word] 的 [the word]”</span>. The word is the
          last one you hear.
        </p>
      )}
    </div>
  );
}

/** Back of a listening card: how it was played and what else sounds the same. */
export function ListenNotes({
  hanzi,
  pinyin,
  listening,
}: {
  hanzi: string;
  pinyin: string;
  listening: ListeningInfo;
}) {
  const { viaWord, inWord, soundAlikes } = listening;
  if (!viaWord && !inWord && soundAlikes.length === 0) return null;
  return (
    <div className="max-w-md rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-left text-xs">
      {inWord && (
        <p>
          Played inside{' '}
          <span lang="zh-Hans" className="text-sm text-foreground">
            {inWord}
          </span>{' '}
          so you hear the {pinyin} reading.
        </p>
      )}
      {viaWord && (
        <p>
          Played as{' '}
          <span lang="zh-Hans" className="text-sm text-foreground">
            {viaWord}的{hanzi}
          </span>{' '}
          — “the {hanzi} in {viaWord}”.
        </p>
      )}
      {soundAlikes.length > 0 && (
        <p className={viaWord || inWord ? 'mt-1' : ''}>
          Sounds exactly the same:{' '}
          {soundAlikes.map((w, i) => (
            <span key={w.hanzi}>
              {i > 0 && ' · '}
              <span lang="zh-Hans" className="text-sm text-foreground">
                {w.hanzi}
              </span>{' '}
              {w.meaning.split(/[;,]/)[0]}
            </span>
          ))}
          {!viaWord && '. If you thought of one of these, you heard it right.'}
        </p>
      )}
    </div>
  );
}

/** Explains why a single character's audio is a longer word (干 → 干什么). */
export function ReadingNote({ hanzi, pinyin }: { hanzi: string; pinyin: string }) {
  const { via } = audioFor(hanzi, pinyin);
  if (!via) return null;
  return (
    <p className="max-w-sm text-xs text-muted-foreground">
      {hanzi} has more than one reading, so the audio plays{' '}
      <span lang="zh-Hans" className="text-sm text-foreground">
        {via}
      </span>{' '}
      to make sure you hear <span className="text-foreground">{pinyin}</span>.
    </p>
  );
}
