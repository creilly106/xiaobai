import Link from 'next/link';
import { AudioButton } from '@/components/audio-button';
import type { PartInfo } from '@/lib/queries/characters';

/** One character or component: links to its page, with audio and its role. */
export function PartLink({ part }: { part: PartInfo }) {
  const roleLabel =
    part.role === 'meaning' ? 'Meaning part' : part.role === 'sound' ? 'Sound part' : null;
  return (
    <div className="flex items-center rounded-lg border border-border/60 bg-card transition-colors hover:border-primary/60 hover:bg-muted/40">
      <Link
        href={`/characters/${encodeURIComponent(part.hanzi)}`}
        className="group flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5"
      >
        <span lang="zh-Hans" className="text-3xl leading-none">
          {part.hanzi}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {part.gloss?.meaning ?? part.radical?.meaning ?? 'component'}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {[
              part.gloss?.pinyin || part.radical?.pinyin,
              part.radical ? `radical #${part.radical.number}` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </span>
        {roleLabel && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              part.role === 'meaning'
                ? 'bg-primary/10 text-primary'
                : 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
            }`}
          >
            {roleLabel}
          </span>
        )}
      </Link>
      {/* Only characters with a real reading get audio; bare components like ⺮ don't. */}
      {part.gloss?.pinyin && (
        <AudioButton text={part.hanzi} reading={part.gloss.pinyin} className="mr-2 shrink-0" />
      )}
    </div>
  );
}
