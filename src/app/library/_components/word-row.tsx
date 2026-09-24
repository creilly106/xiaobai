import Link from 'next/link';
import { AudioButton } from '@/components/audio-button';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import type { Dictionary } from '@/lib/queries/dictionary';

type Word = {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel: number | null;
  inQueue: boolean;
};

export function WordRow({ word, dict }: { word: Word; dict: Dictionary }) {
  const isMultiChar = Array.from(word.hanzi).length > 1;
  const href = `/characters/${encodeURIComponent(word.hanzi)}`;

  return (
    <li className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-x-4 gap-y-0.5 px-4 py-3 sm:grid-cols-[7rem_minmax(6rem,11rem)_1fr_auto_auto]">
      <span className="row-span-2 text-2xl leading-snug sm:row-span-1">
        {isMultiChar ? (
          <TokenizedHanzi hanzi={word.hanzi} dict={dict} mode="per-char" />
        ) : (
          <Link href={href} className="transition-colors hover:text-primary">
            {word.hanzi}
          </Link>
        )}
      </span>
      <span className="truncate text-sm text-muted-foreground">{word.pinyin}</span>
      <span className="col-start-2 text-sm sm:col-start-auto">
        <Link href={href} className="hover:underline">
          {word.meaning}
        </Link>
      </span>
      <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
        {word.inQueue && (
          <span
            className="size-1.5 rounded-full bg-primary"
            title="In your study queue"
            aria-label="In your study queue"
          />
        )}
        {word.hskLevel != null && <span>HSK {word.hskLevel}</span>}
      </span>
      <span className="col-start-3 row-span-2 row-start-1 sm:col-start-auto sm:row-span-1 sm:row-start-auto">
        <AudioButton text={word.hanzi} reading={word.pinyin} />
      </span>
    </li>
  );
}
