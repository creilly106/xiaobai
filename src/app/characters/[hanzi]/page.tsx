import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { isCjk } from '@/lib/text';
import { getCharacterInfo } from '@/lib/queries/characters';
import { BuildCard } from './_components/build-card';
import { Hero } from './_components/hero';
import { RadicalCard } from './_components/radical-card';
import { ContainingWords, UsedIn, WordCharacters } from './_components/word-lists';
import { ExamplesCard } from './_components/examples-card';
import { getDictionaryFor } from '@/lib/queries/dictionary';

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

export default async function CharacterPage({ params }: PageProps<'/characters/[hanzi]'>) {
  const hanzi = parseParam((await params).hanzi);
  if (!hanzi) notFound();
  const info = await getCharacterInfo(hanzi);
  if (!info.gloss && info.containingWords.length === 0 && info.components.length === 0) {
    notFound();
  }
  const exampleDict = await getDictionaryFor(info.examples.map((e) => e.zh));

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
          <UsedIn info={info} />
        </>
      ) : (
        <WordCharacters parts={info.characters} />
      )}

      <ExamplesCard hanzi={info.hanzi} examples={info.examples} dict={exampleDict} />

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
          ; alternate readings from{' '}
          <a
            href="https://cc-cedict.org"
            className="underline hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            CC-CEDICT
          </a>
          . Origin notes are memory aids, not always strict etymology.
        </p>
      )}
    </div>
  );
}
