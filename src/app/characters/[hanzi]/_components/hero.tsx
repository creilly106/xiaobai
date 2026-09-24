import { Card } from '@/components/ui/card';
import { AudioButton } from '@/components/audio-button';
import { HanziStrokes } from '@/components/hanzi-strokes';
import type { CharacterInfo } from '@/lib/queries/characters';

const pill =
  'inline-flex items-center rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground';

export function Hero({ info }: { info: CharacterInfo }) {
  const { hanzi, gloss } = info;
  const charCount = Array.from(hanzi).length;
  return (
    <Card className="overflow-hidden py-0">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(220px,auto)_1fr]">
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-6">
          <div
            lang="zh-Hans"
            className={`leading-none tracking-tight ${charCount > 3 ? 'text-6xl' : 'text-8xl'}`}
          >
            {hanzi}
          </div>
          {info.isSingle && <HanziStrokes hanzi={hanzi} />}
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {gloss?.pinyin && (
                <div className="text-3xl font-medium tracking-tight text-muted-foreground">
                  {gloss.pinyin}
                </div>
              )}
              <AudioButton text={hanzi} reading={gloss?.pinyin} label={`Play ${hanzi}`} />
            </div>
            <div className="text-xl">
              {gloss?.meaning ?? (
                <span className="text-muted-foreground">
                  No dictionary meaning yet — see the words below.
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {gloss?.hskLevel != null ? (
              <span className={pill}>HSK {gloss.hskLevel} word</span>
            ) : gloss ? (
              <span className={pill} title="Not an HSK 1–4 vocabulary item on its own">
                Character
              </span>
            ) : null}
            <span className={pill}>
              {charCount} character{charCount === 1 ? '' : 's'}
            </span>
            {info.containingWords.length > 0 && (
              <span className={pill}>
                in {info.containingWords.length}
                {info.containingWords.length >= 60 ? '+' : ''} word
                {info.containingWords.length === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
