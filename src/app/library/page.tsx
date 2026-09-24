import Link from 'next/link';
import { connection } from 'next/server';
import { DictionaryTab } from './_components/dictionary-tab';
import { HskTab } from './_components/hsk-tab';
import { MyWordsTab } from './_components/my-words-tab';

export const metadata = { title: 'Library' };

const TABS = [
  { key: 'hsk', label: 'HSK words' },
  { key: 'mine', label: 'My words' },
  { key: 'dictionary', label: 'Dictionary' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function LibraryPage({ searchParams }: PageProps<'/library'>) {
  await connection();
  const sp = await searchParams;
  const q = one(sp.q)?.trim().slice(0, 50) ?? '';
  const tabParam = one(sp.tab);
  const tab: TabKey = TABS.some((t) => t.key === tabParam) ? (tabParam as TabKey) : 'hsk';

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Library</h1>

      <nav aria-label="Library sections" className="mt-4 flex gap-1 border-b border-border/60">
        {TABS.map((t) => {
          const active = t.key === tab;
          const params = new URLSearchParams();
          if (t.key !== 'hsk') params.set('tab', t.key);
          // Carry a search across to the dictionary so "not in HSK" is one click away.
          if (q && t.key !== 'mine') params.set('q', q);
          const qs = params.toString();
          return (
            <Link
              key={t.key}
              href={qs ? `/library?${qs}` : '/library'}
              aria-current={active ? 'page' : undefined}
              className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
                active
                  ? 'border-primary font-medium text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5">
        {tab === 'hsk' && <HskTab q={q} levelParam={one(sp.level)} />}
        {tab === 'mine' && <MyWordsTab />}
        {tab === 'dictionary' && <DictionaryTab q={q} />}
      </div>
    </div>
  );
}
