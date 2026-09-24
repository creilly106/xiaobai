import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioButton } from '@/components/audio-button';
import type { CharacterInfo, PartInfo } from '@/lib/queries/characters';
import { PartLink } from './part-link';

/** Each character of a multi-character word. */
export function WordCharacters({ parts }: { parts: PartInfo[] }) {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">Character by character</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {parts.map((p, i) => (
            <PartLink key={`${p.hanzi}-${i}`} part={p} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** For radicals and component forms: everyday characters that use them. */
export function UsedIn({ info }: { info: CharacterInfo }) {
  if (info.usedIn.length === 0) return null;
  const forms = info.asRadical && !info.asRadical.form ? info.asRadical.radical.forms : undefined;
  return (
    <Card className="mt-6">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">
          Characters built with <span lang="zh-Hans">{info.hanzi}</span>
          {forms && (
            <span className="text-xs font-normal text-muted-foreground">
              {' '}
              (including its <span lang="zh-Hans">{forms.map((f) => f.char).join(' ')}</span> form)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {info.usedIn.map((p) => (
            <PartLink key={p.hanzi} part={p} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** Vocabulary containing the character or word, grouped by HSK level. */
export function ContainingWords({ info }: { info: CharacterInfo }) {
  if (info.containingWords.length === 0) return null;
  const groups = new Map<number | 'none', CharacterInfo['containingWords']>();
  for (const w of info.containingWords) {
    const key = w.hskLevel ?? 'none';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(w);
  }
  const keys = Array.from(groups.keys()).sort((a, b) =>
    a === 'none' ? 1 : b === 'none' ? -1 : a - b,
  );
  return (
    <Card className="mt-6">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">
          Words containing <span lang="zh-Hans">{info.hanzi}</span>{' '}
          <span className="text-xs font-normal text-muted-foreground">
            ({info.containingWords.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {keys.map((key) => (
          <div key={String(key)}>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {key === 'none' ? 'Other' : `HSK ${key}`}
            </div>
            <ul className="divide-y divide-border/60 rounded-lg border border-border/60 bg-card">
              {groups.get(key)!.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center pr-2 transition-colors hover:bg-muted/50"
                >
                  <Link
                    href={`/characters/${encodeURIComponent(w.hanzi)}`}
                    className="grid min-w-0 flex-1 grid-cols-[minmax(4.5rem,auto)_1fr] items-baseline gap-x-4 gap-y-0.5 px-4 py-2.5 sm:grid-cols-[7rem_10rem_1fr]"
                  >
                    <span lang="zh-Hans" className="truncate text-lg">
                      {w.hanzi}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">{w.pinyin}</span>
                    <span className="col-span-2 text-sm sm:col-span-1">{w.meaning}</span>
                  </Link>
                  <AudioButton text={w.hanzi} reading={w.pinyin} label={`Play ${w.hanzi}`} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
