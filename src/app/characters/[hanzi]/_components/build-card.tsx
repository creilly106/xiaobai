import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CharacterInfo } from '@/lib/queries/characters';
import { PartLink } from './part-link';

function EtymologyNote({ info }: { info: CharacterInfo }) {
  const ety = info.etymology;
  if (!ety) return null;
  if (ety.type === 'pictophonetic') {
    const meaning = info.components.find((c) => c.role === 'meaning');
    const sound = info.components.find((c) => c.role === 'sound');
    return (
      <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm">
        <div className="font-medium">Sound + meaning compound</div>
        <p className="mt-1 text-muted-foreground">
          {meaning ? (
            <>
              <span lang="zh-Hans" className="text-foreground">
                {meaning.hanzi}
              </span>{' '}
              hints at the meaning{ety.hint ? ` (${ety.hint})` : ''}
            </>
          ) : (
            'One part hints at the meaning'
          )}
          {sound ? (
            <>
              ;{' '}
              <span lang="zh-Hans" className="text-foreground">
                {sound.hanzi}
              </span>{' '}
              hints at the sound
              {sound.gloss?.pinyin ? ` (${sound.gloss.pinyin})` : ''}.
            </>
          ) : (
            '.'
          )}{' '}
          Most characters are built this way.
        </p>
      </div>
    );
  }
  if (!ety.hint) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm">
      <div className="font-medium">
        {ety.type === 'pictographic' ? 'Picture of the thing' : 'Combined idea'}
      </div>
      <p className="mt-1 text-muted-foreground">{ety.hint}</p>
    </div>
  );
}

/** Components, layout, origin note and dictionary radical of one character. */
export function BuildCard({ info }: { info: CharacterInfo }) {
  const atomic = info.components.length === 0;
  if (atomic && info.asRadical) return null; // RadicalCard already explains it
  return (
    <Card className="mt-6">
      <CardHeader className="pb-1">
        <CardTitle className="flex flex-wrap items-baseline gap-x-2 text-base">
          How it&apos;s built
          {info.layout && (
            <span className="text-xs font-normal text-muted-foreground">Layout: {info.layout}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {atomic ? (
          <p className="text-sm text-muted-foreground">
            <span lang="zh-Hans" className="text-foreground">
              {info.hanzi}
            </span>{' '}
            is a basic form — it doesn&apos;t split into smaller components.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {info.components.map((c, i) => (
              <PartLink key={`${c.hanzi}-${i}`} part={c} />
            ))}
          </div>
        )}
        <EtymologyNote info={info} />
        {info.indexRadical && !info.asRadical && (
          <p className="text-xs text-muted-foreground">
            Filed in dictionaries under radical{' '}
            <Link href="/radicals" className="underline hover:text-foreground">
              #{info.indexRadical.number} <span lang="zh-Hans">{info.indexRadical.hanzi}</span> (
              {info.indexRadical.meaning})
            </Link>
            .
          </p>
        )}
      </CardContent>
    </Card>
  );
}
