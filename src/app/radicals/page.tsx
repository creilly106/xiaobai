import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { AudioButton } from '@/components/audio-button';
import { radicals, type Radical } from '@/lib/radicals-data';
import { decompose } from '@/lib/ids-data';
import { getDictionaryFor, type Dictionary } from '@/lib/queries/dictionary';

export const metadata: Metadata = { title: 'Radicals' };

function shortMeaning(m: string): string {
  const head = m.split(/[;,(]/)[0].trim();
  if (head) return head;
  // e.g. "(completed action marker)" — use the parenthetical itself
  return m.replace(/[()]/g, '').split(/[;,]/)[0].trim();
}

/** Which of the radical's shapes appears in `example` (the form or the standalone). */
function shapeUsedIn(example: string, r: Radical): string | null {
  const parts = new Set(decompose(example));
  for (const f of r.forms ?? []) if (parts.has(f.char)) return f.char;
  if (parts.has(r.hanzi)) return r.hanzi;
  return null;
}

export default async function RadicalsPage() {
  const dict = await getDictionaryFor(radicals.flatMap((r) => r.examples ?? []));
  const byStrokes = new Map<number, Radical[]>();
  for (const r of radicals) {
    if (!byStrokes.has(r.strokes)) byStrokes.set(r.strokes, []);
    byStrokes.get(r.strokes)!.push(r);
  }
  const strokeCounts = Array.from(byStrokes.keys()).sort((a, b) => a - b);
  const withForms = radicals.filter((r) => r.forms && r.forms.length > 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Radicals</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Radicals are the building blocks of Chinese characters. Most characters combine a radical
        that hints at the <em>meaning</em> with another part that hints at the <em>sound</em> —
        learn the common ones and new characters start to look familiar.
      </p>

      <section aria-labelledby="forms-heading" className="mt-8">
        <h2 id="forms-heading" className="text-base font-semibold">
          Radicals that change shape
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Inside a character, many radicals are squeezed into a narrower form. These are worth
          memorising first — 氵, 亻, 扌 and 讠 alone appear in hundreds of everyday characters.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {withForms.map((r) => (
            <a
              key={r.number}
              href={`#radical-${r.number}`}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-2 transition-colors hover:border-primary/60 hover:bg-muted/40"
            >
              <span lang="zh-Hans" className="text-2xl leading-none">
                {r.hanzi}
              </span>
              <span className="text-muted-foreground" aria-label="becomes">
                →
              </span>
              <span lang="zh-Hans" className="text-2xl font-medium leading-none text-primary">
                {r.forms!.map((f) => f.char).join(' ')}
              </span>
              <span className="ml-auto truncate text-xs text-muted-foreground">
                {shortMeaning(r.meaning)}
              </span>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-10 space-y-10">
        {strokeCounts.map((s) => (
          <section key={s} aria-labelledby={`strokes-${s}`}>
            <h2
              id={`strokes-${s}`}
              className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              {s} stroke{s === 1 ? '' : 's'}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {byStrokes.get(s)!.map((r) => (
                <RadicalCard key={r.number} radical={r} dict={dict} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        {radicals.length} of the 214 Kangxi radicals — the ones that matter most for everyday
        simplified Chinese. Numbers follow the Kangxi dictionary order.
      </p>
    </div>
  );
}

function RadicalCard({ radical: r, dict }: { radical: Radical; dict: Dictionary }) {
  return (
    <Card id={`radical-${r.number}`} className="scroll-mt-20 gap-0 py-0">
      <CardContent className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <Link
            href={`/characters/${encodeURIComponent(r.hanzi)}`}
            className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-4xl leading-none transition-colors hover:border-primary/60 hover:text-primary"
            title={`Standalone form: ${r.hanzi}`}
            lang="zh-Hans"
          >
            {r.hanzi}
          </Link>
          {r.forms?.map((f) => (
            <Link
              key={f.char}
              href={`/characters/${encodeURIComponent(f.char)}`}
              className="flex size-16 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-primary/50 bg-primary/10 text-primary transition-colors hover:bg-primary/15"
              title={`Form inside characters: ${f.char} (${f.position})`}
              lang="zh-Hans"
            >
              <span className="text-4xl leading-none">{f.char}</span>
            </Link>
          ))}
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">
              <span className="font-mono">#{r.number}</span>
              {r.kangxi && (
                <span>
                  {' '}
                  · traditional <span lang="zh-Hant">{r.kangxi}</span>
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1 font-medium">
              {r.pinyin}
              <AudioButton text={r.hanzi} label={`Play ${r.hanzi}`} className="-my-1" />
            </div>
            <div className="text-sm">{r.meaning}</div>
          </div>
        </div>

        {r.forms && r.forms.length > 0 && (
          <div className="rounded-md bg-primary/5 px-3 py-2 text-xs">
            {r.forms.map((f) => (
              <div key={f.char}>
                <span className="font-medium text-foreground">
                  Inside characters it&apos;s written{' '}
                </span>
                <span lang="zh-Hans" className="text-sm font-semibold text-primary">
                  {f.char}
                </span>
                <span className="text-muted-foreground"> — {f.position}</span>
              </div>
            ))}
          </div>
        )}

        {r.examples && r.examples.length > 0 && (
          <div className="mt-auto">
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Example characters containing it
            </div>
            <div className="flex flex-wrap gap-1.5">
              {r.examples.map((ex) => {
                const entry = dict[ex];
                const shape = shapeUsedIn(ex, r);
                const usesForm = shape != null && shape !== r.hanzi;
                return (
                  <div key={ex} className="group/ex relative">
                    <Link
                      href={`/characters/${encodeURIComponent(ex)}`}
                      className="flex min-w-14 flex-col items-center rounded-md border border-border/60 px-2 py-1 transition-colors hover:border-primary/60 hover:bg-muted/40"
                      title={entry ? `${entry.pinyin} — ${entry.meaning}` : undefined}
                    >
                      <span lang="zh-Hans" className="text-xl leading-tight">
                        {ex}
                      </span>
                      <span className="max-w-20 truncate text-[11px] text-muted-foreground">
                        {entry ? shortMeaning(entry.meaning) : ''}
                      </span>
                      {usesForm && (
                        <span className="text-[10px] font-medium text-primary">
                          uses <span lang="zh-Hans">{shape}</span>
                        </span>
                      )}
                    </Link>
                    {/* Revealed on hover (always shown on touch screens). */}
                    <AudioButton
                      text={ex}
                      label={`Play ${ex}`}
                      className="absolute -right-2 -top-2 rounded-full bg-background opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover/ex:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
