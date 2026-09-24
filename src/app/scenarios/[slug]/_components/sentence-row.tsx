import { AudioButton } from '@/components/audio-button';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import type { Dictionary } from '@/lib/queries/dictionary';

type SentenceRowProps = {
  sentence: {
    id: number;
    hanzi: string;
    pinyin: string;
    meaning: string;
    difficulty: number | null;
    inQueue: boolean;
  };
  dict: Dictionary;
};

export function SentenceRow({ sentence, dict }: SentenceRowProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div lang="zh-Hans" className="text-xl leading-relaxed">
          <TokenizedHanzi hanzi={sentence.hanzi} dict={dict} />
        </div>
        <div className="mt-0.5 text-sm text-muted-foreground">{sentence.pinyin}</div>
        <div className="mt-0.5 text-sm">{sentence.meaning}</div>
        <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {sentence.difficulty != null && (
            <span title="Approximate difficulty on the HSK scale">
              ≈ HSK {sentence.difficulty}
            </span>
          )}
          {sentence.inQueue && (
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              In your queue
            </span>
          )}
        </div>
      </div>
      <AudioButton text={sentence.hanzi} />
    </div>
  );
}
