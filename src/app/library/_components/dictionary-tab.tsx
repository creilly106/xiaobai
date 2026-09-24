import Link from 'next/link';
import { AudioButton } from '@/components/audio-button';
import { AddToStudyButton } from '@/components/add-to-study-button';
import { Pinyin } from '@/components/pinyin';
import { searchDictionary, type LookupEntry } from '@/lib/queries/lookup';
import { LibrarySearch } from './library-search';

function ResultRow({ e }: { e: LookupEntry }) {
  const href = `/characters/${encodeURIComponent(e.simplified)}`;
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <Link href={href} lang="zh-Hans" className="text-2xl hover:text-primary">
            {e.simplified}
          </Link>
          {e.traditional !== e.simplified && (
            <span lang="zh-Hant" className="text-sm text-muted-foreground" title="Traditional">
              {e.traditional}
            </span>
          )}
          <Pinyin text={e.pinyin} className="text-sm text-muted-foreground" />
          {e.library?.hskLevel != null && (
            <span className="rounded-full border border-border/60 px-2 text-[11px] text-muted-foreground">
              HSK {e.library.hskLevel}
            </span>
          )}
          {e.proper && (
            <span className="rounded-full border border-border/60 px-2 text-[11px] text-muted-foreground">
              name / place
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm">
          {e.senses.slice(0, 4).join('; ')}
          {e.senses.length > 4 && <span className="text-muted-foreground"> …</span>}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <AudioButton text={e.simplified} reading={e.pinyin} />
        <AddToStudyButton target={{ dictionaryId: e.id }} inStudy={e.inStudy} />
      </div>
    </li>
  );
}

function Section({ title, entries }: { title: string; entries: LookupEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <ul className="divide-y divide-border/60 rounded-lg border border-border/60 bg-card">
        {entries.map((e) => (
          <ResultRow key={e.id} e={e} />
        ))}
      </ul>
    </section>
  );
}

/** Search all of CC-CEDICT and add any word to study. */
export async function DictionaryTab({ q }: { q: string }) {
  const results = await searchDictionary(q);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Every word in CC-CEDICT — about 125,000 entries — not just HSK. Add anything you meet to
        your study queue.
      </p>
      <div className="mt-6">
        <LibrarySearch
          initialQuery={q}
          keep={{ tab: 'dictionary' }}
          placeholder="Look up 你好, nihao, ni3hao3, or hello…"
          autoFocus
        />
      </div>

      {!results.available ? (
        <p className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          The dictionary hasn&apos;t been imported yet. Run <code>npm run data:dictionary</code>{' '}
          once (takes a few seconds), then reload this page.
        </p>
      ) : !q ? (
        <ul className="mt-6 space-y-1 text-sm text-muted-foreground">
          <li>
            Characters: <span lang="zh-Hans">菜单</span> finds exact matches first, then words
            containing them.
          </li>
          <li>Pinyin: tones are optional — nihao, ni hao, ni3hao3 and nǐhǎo all work.</li>
          <li>English: “menu” finds the everyday word before rarer ones.</li>
        </ul>
      ) : results.primary.length === 0 && results.english.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Nothing found for “{q}”. You can still add it yourself under{' '}
          <Link href="/library?tab=mine" className="underline hover:text-foreground">
            My words
          </Link>
          .
        </p>
      ) : (
        <>
          <Section
            title={results.primaryKind === 'pinyin' ? 'Pinyin matches' : 'Matches'}
            entries={results.primary}
          />
          <Section title="English matches" entries={results.english} />
        </>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Dictionary data from{' '}
        <a
          href="https://cc-cedict.org"
          className="underline hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          CC-CEDICT
        </a>{' '}
        (CC BY-SA 4.0).
      </p>
    </>
  );
}
