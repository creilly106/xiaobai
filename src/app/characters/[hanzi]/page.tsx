import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { AudioButton } from '@/components/audio-button';
import { HanziStrokes } from '@/components/hanzi-strokes';
import { isCjk } from '@/lib/text';
import { getCharacterInfo, type CharacterInfo, type PartInfo } from '@/lib/queries/characters';

const MAX_LEN = 12;

/** Decode and sanity-check the route param; null means "not a real entry". */
function parseParam(raw: string): string | null {
  let hanzi: string;
  try {
    hanzi = decodeURIComponent(raw).trim();
  } catch {
    return null;
  }
  const chars = Array.from(hanzi);
  if (chars.length === 0 || chars.length > MAX_LEN) return null;
  if (!chars.every((c) => isCjk(c))) return null;
  return hanzi;
}

export async function generateMetadata({
  params,
}: PageProps<'/characters/[hanzi]'>): Promise<Metadata> {
  const hanzi = parseParam((await params).hanzi);
  return { title: hanzi ?? 'Not found' };
}

const pill =
  'inline-flex items-center rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground';

export default async function CharacterPage({ params }: PageProps<'/characters/[hanzi]'>) {
  const hanzi = parseParam((await params).hanzi);
  if (!hanzi) notFound();
  const info = await getCharacterInfo(hanzi);
  if (!info.gloss && info.containingWords.length === 0 && info.components.length === 0) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted-foreground">
        <Link href="/library" className="hover:text-foreground hover:underline">
          Library
        </Link>
        <span className="px-1.5" aria-hidden>
          /
        </span>
        <span className="text-foreground" lang="zh-Hans">
          {hanzi}
        </span>
      </nav>

      <Hero info={info} />

      {info.isSingle ? (
        <>
          {info.asRadical && <RadicalCard info={info} />}
          {/* A component form's own strokes (忄 = 八 + 丨) aren't worth studying. */}
          {!info.asRadical?.form && <BuildCard info={info} />}
          {info.usedIn.length > 0 && (
            <Card className="mt-6">
              <CardHeader className="pb-1">
                <CardTitle className="text-base">
                  Characters built with <span lang="zh-Hans">{info.hanzi}</span>
                  {info.asRadical && !info.asRadical.form && info.asRadical.radical.forms && (
                    <span className="text-xs font-normal text-muted-foreground">
                      {' '}
                      (including its{' '}
                      <span lang="zh-Hans">
                        {info.asRadical.radical.forms.map((f) => f.char).join(' ')}
                      </span>{' '}
                      form)
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
          )}
        </>
      ) : (
        <WordCharacters parts={info.characters} />
      )}

      <ContainingWords info={info} />

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/library" className={buttonVariants({ variant: 'outline' })}>
          Back to library
        </Link>
        <Link href="/radicals" className={buttonVariants({ variant: 'ghost' })}>
          Browse radicals
        </Link>
      </div>

      {info.isSingle && (
        <p className="mt-8 text-xs text-muted-foreground">
          Decompositions and origin notes from{' '}
          <a
            href="https://github.com/skishore/makemeahanzi"
            className="underline hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            Make Me a Hanzi
          </a>
          . Origin notes are memory aids, not always strict etymology.
        </p>
      )}
    </div>
  );
}

function Hero({ info }: { info: CharacterInfo }) {
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
              <AudioButton text={hanzi} label={`Play ${hanzi}`} />
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

function PartLink({ part }: { part: PartInfo }) {
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
      {part.gloss?.pinyin && <AudioButton text={part.hanzi} className="mr-2 shrink-0" />}
    </div>
  );
}

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

function BuildCard({ info }: { info: CharacterInfo }) {
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

function RadicalCard({ info }: { info: CharacterInfo }) {
  const { radical, form } = info.asRadical!;
  return (
    <Card className="mt-6 border-primary/30">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">{form ? 'Radical form' : 'Radical'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {form ? (
          <p>
            <span lang="zh-Hans" className="text-lg font-medium">
              {form.char}
            </span>{' '}
            is how{' '}
            <Link href="/radicals" className="underline hover:text-primary">
              radical #{radical.number} <span lang="zh-Hans">{radical.hanzi}</span> (
              {radical.meaning})
            </Link>{' '}
            is written inside other characters — {form.position}.
          </p>
        ) : (
          <p>
            <span lang="zh-Hans" className="text-lg font-medium">
              {info.hanzi}
            </span>{' '}
            is{' '}
            <Link href="/radicals" className="underline hover:text-primary">
              Kangxi radical #{radical.number}
            </Link>{' '}
            — {radical.meaning} ({radical.pinyin}). It&apos;s one of the building blocks other
            characters are made from.
          </p>
        )}
        {!form && radical.forms && radical.forms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {radical.forms.map((f) => (
              <div
                key={f.char}
                className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
              >
                <span lang="zh-Hans" className="text-3xl leading-none text-primary">
                  {f.char}
                </span>
                <span className="text-xs text-muted-foreground">
                  Form inside characters
                  <span className="block text-foreground">{f.position}</span>
                </span>
              </div>
            ))}
          </div>
        )}
        {radical.kangxi && radical.kangxi !== info.hanzi && (
          <p className="text-xs text-muted-foreground">
            Traditional form: <span lang="zh-Hant">{radical.kangxi}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function WordCharacters({ parts }: { parts: PartInfo[] }) {
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

function ContainingWords({ info }: { info: CharacterInfo }) {
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
                  <AudioButton text={w.hanzi} label={`Play ${w.hanzi}`} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
