import Link from 'next/link';
import { connection } from 'next/server';
import { asc, eq, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { HskLevelChip } from '@/app/_components/hsk-level-chip';
import { getDictionaryFor } from '@/lib/queries/dictionary';
import { isCjk, plainPinyin } from '@/lib/text';
import { WordRow } from './_components/word-row';
import { LibrarySearch } from './_components/library-search';

export const metadata = { title: 'Library' };

const PAGE_LIMIT = 200;

export default async function LibraryPage({ searchParams }: PageProps<'/library'>) {
  await connection();
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim().slice(0, 50) ?? '';
  const levelParam = Array.isArray(sp.level) ? sp.level[0] : sp.level;

  const words = await db
    .select({
      id: schema.words.id,
      hanzi: schema.words.hanzi,
      pinyin: schema.words.pinyin,
      meaning: schema.words.meaning,
      hskLevel: schema.words.hskLevel,
      cardCount: sql<number>`count(${schema.cards.id})`,
    })
    .from(schema.words)
    .leftJoin(schema.cards, eq(schema.cards.wordId, schema.words.id))
    .groupBy(schema.words.id)
    .orderBy(asc(schema.words.hskLevel), asc(schema.words.id));

  const levelStats = new Map<number, { total: number; inQueue: number }>();
  for (const w of words) {
    if (w.hskLevel == null) continue;
    const s = levelStats.get(w.hskLevel) ?? { total: 0, inQueue: 0 };
    s.total += 1;
    if (Number(w.cardCount) > 0) s.inQueue += 1;
    levelStats.set(w.hskLevel, s);
  }
  const levels = [...levelStats.keys()].sort((a, b) => a - b);
  const level = levelParam && levels.includes(Number(levelParam)) ? levelParam : 'all';

  const needle = q.toLowerCase();
  const needlePinyin = plainPinyin(q);
  const matches = words.filter((w) => {
    if (level !== 'all' && w.hskLevel !== Number(level)) return false;
    if (!q) return true;
    if (isCjk(q)) return w.hanzi.includes(q);
    return (
      (needlePinyin.length > 0 && plainPinyin(w.pinyin).includes(needlePinyin)) ||
      w.meaning.toLowerCase().includes(needle)
    );
  });
  const shown = matches.slice(0, PAGE_LIMIT);
  const dict = await getDictionaryFor(shown.map((w) => w.hanzi));

  const tabHref = (l: string) => {
    const p = new URLSearchParams();
    if (l !== 'all') p.set('level', l);
    if (q) p.set('q', q);
    const s = p.toString();
    return s ? `/library?${s}` : '/library';
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Library</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {words.length.toLocaleString()} words across HSK {levels[0]}–{levels[levels.length - 1]}.
        Click a word to open its character page.
      </p>

      <section aria-labelledby="levels-heading" className="mt-6">
        <h2
          id="levels-heading"
          className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Study queue by level
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {levels.map((l) => {
            const s = levelStats.get(l)!;
            return (
              <div
                key={l}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card px-3 py-2.5"
              >
                <div>
                  <div className="text-sm font-medium">HSK {l}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.inQueue === 0 ? `${s.total} words` : `${s.inQueue}/${s.total} in queue`}
                  </div>
                </div>
                <HskLevelChip level={l} inQueue={s.inQueue > 0} />
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 space-y-3">
        <LibrarySearch key={level} initialQuery={q} level={level} />
        <nav aria-label="Filter by level" className="flex flex-wrap gap-1.5">
          {['all', ...levels.map(String)].map((l) => {
            const active = l === level;
            return (
              <Link
                key={l}
                href={tabHref(l)}
                scroll={false}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  active
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {l === 'all' ? 'All levels' : `HSK ${l}`}
              </Link>
            );
          })}
        </nav>
      </div>

      <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
        {matches.length === 0
          ? 'No words match.'
          : matches.length > PAGE_LIMIT
            ? `Showing the first ${PAGE_LIMIT} of ${matches.length} — pick a level or search to narrow it down.`
            : `${matches.length} word${matches.length === 1 ? '' : 's'}`}
      </p>

      {shown.length > 0 && (
        <ul className="mt-2 divide-y divide-border/60 rounded-lg border border-border/60 bg-card">
          {shown.map((w) => (
            <WordRow key={w.id} word={{ ...w, inQueue: Number(w.cardCount) > 0 }} dict={dict} />
          ))}
        </ul>
      )}
    </div>
  );
}
