import 'server-only';
import { connection } from 'next/server';
import { and, asc, desc, eq, gte, inArray, lt, or, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { WordSource } from '@/db/schema';
import { pinyinQueryKeys } from '@/lib/cedict';
import {
  englishScore,
  ftsQueries,
  type PinyinKeys,
  rankEnglish,
  rankHanzi,
  rankPinyin,
  senses,
} from '@/lib/dictionary-search';
import { isCjk } from '@/lib/text';

export type LookupEntry = {
  id: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  senses: string[];
  proper: boolean;
  /** The matching library word, if this word is already in your library. */
  library: { wordId: number; source: WordSource; hskLevel: number | null } | null;
  inStudy: boolean;
};

export type LookupResults = {
  /** Matches on characters, or on pinyin for Latin input. */
  primary: LookupEntry[];
  primaryKind: 'hanzi' | 'pinyin' | null;
  /** English-meaning matches (Latin input only). */
  english: LookupEntry[];
  /** False until `npm run data:dictionary` has been run. */
  available: boolean;
};

const LIMIT = 30;
const CANDIDATES = 400;

type Row = typeof schema.dictionary.$inferSelect;

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);
const byFrequency = desc(schema.dictionary.frequency);
type PinyinColumn = typeof schema.dictionary.pinyinPlain | typeof schema.dictionary.pinyinTones;

async function withLibrary(rows: Row[]): Promise<LookupEntry[]> {
  const hanzi = [...new Set(rows.map((r) => r.simplified))];
  const words = hanzi.length
    ? await db
        .select({
          id: schema.words.id,
          hanzi: schema.words.hanzi,
          source: schema.words.source,
          hskLevel: schema.words.hskLevel,
          cards: sql<number>`(select count(*) from cards c where c.word_id = ${schema.words.id} and c.mode = 'recognition')`,
        })
        .from(schema.words)
        .where(inArray(schema.words.hanzi, hanzi))
    : [];
  const byHanzi = new Map(words.map((w) => [w.hanzi, w]));
  return rows.map((r) => {
    const w = byHanzi.get(r.simplified);
    return {
      id: r.id,
      simplified: r.simplified,
      traditional: r.traditional,
      pinyin: r.pinyin,
      senses: senses(r.definitions),
      proper: r.proper,
      library: w ? { wordId: w.id, source: w.source, hskLevel: w.hskLevel } : null,
      inStudy: Number(w?.cards ?? 0) > 0,
    };
  });
}

export async function dictionaryAvailable(): Promise<boolean> {
  const [row] = await db.select({ id: schema.dictionary.id }).from(schema.dictionary).limit(1);
  return row !== undefined;
}

/**
 * Entries whose reading starts with `key`, common first. A range rather than
 * LIKE so SQLite can use the pinyin index (readings are only a–z and 1–5,
 * all of which sort below "{").
 */
function pinyinCandidates(column: PinyinColumn, key: string): Promise<Row[]> {
  return db
    .select()
    .from(schema.dictionary)
    .where(and(gte(column, key), lt(column, `${key}{`)))
    .orderBy(byFrequency)
    .limit(CANDIDATES);
}

/**
 * English candidates from the full-text index (migration 0011): entries
 * containing every word, then entries where the last word is a prefix. Each
 * set is ordered by commonness so everyday words like 吃 survive the cut
 * before rankEnglish sorts them. Falls back to a scan if there's no index.
 */
async function englishCandidates(query: string): Promise<Row[]> {
  const fts = ftsQueries(query);
  if (!fts) return [];
  const common = eq(schema.dictionary.proper, false);
  const matching = (match: string) =>
    db
      .select()
      .from(schema.dictionary)
      .where(
        and(
          sql`${schema.dictionary.id} IN (SELECT rowid FROM dictionary_fts WHERE dictionary_fts MATCH ${match})`,
          common,
        ),
      )
      .orderBy(byFrequency)
      .limit(CANDIDATES);
  try {
    const [exact, prefix] = await Promise.all([matching(fts.exact), matching(fts.prefix)]);
    const seen = new Set<number>();
    return [...exact, ...prefix].filter((r) => !seen.has(r.id) && seen.add(r.id));
  } catch {
    return englishCandidatesByScan(query);
  }
}

/** The slow path: scan every definition (used before the index exists). */
async function englishCandidatesByScan(query: string): Promise<Row[]> {
  // SQLite's LIKE ignores ASCII case, so no lower() — it would double the scan time.
  const q = escapeLike(query);
  const like = (pattern: string) =>
    sql`${schema.dictionary.definitions} LIKE ${pattern} ESCAPE '\\'`;
  const strong = or(
    ...[q, ...['to', 'a', 'an', 'the'].map((w) => `${w} ${q}`)].flatMap((sense) => [
      like(sense),
      like(`${sense} %`),
      like(`% / ${sense}`),
      like(`% / ${sense} %`),
    ]),
  );
  const common = eq(schema.dictionary.proper, false);
  const [first, rest] = await Promise.all([
    db
      .select()
      .from(schema.dictionary)
      .where(and(strong, common))
      .orderBy(byFrequency)
      .limit(CANDIDATES),
    db
      .select()
      .from(schema.dictionary)
      .where(and(like(`%${q}%`), common))
      .orderBy(byFrequency)
      .limit(CANDIDATES),
  ]);
  const seen = new Set<number>();
  return [...first, ...rest].filter((r) => !seen.has(r.id) && seen.add(r.id));
}

/**
 * Search the full dictionary. Characters match exact → prefix → contains.
 * Latin input is tried both as pinyin (tones optional) and as English.
 */
export async function searchDictionary(raw: string): Promise<LookupResults> {
  await connection();
  const query = raw.trim().slice(0, 40);
  const available = await dictionaryAvailable();
  const empty: LookupResults = { primary: [], primaryKind: null, english: [], available };
  if (!query || !available) return empty;

  if (isCjk(query)) {
    const rows = await db
      .select()
      .from(schema.dictionary)
      .where(
        or(
          sql`instr(${schema.dictionary.simplified}, ${query}) > 0`,
          sql`instr(${schema.dictionary.traditional}, ${query}) > 0`,
        ),
      )
      .orderBy(byFrequency)
      .limit(CANDIDATES);
    return {
      ...empty,
      primary: await withLibrary(rankHanzi(query, rows).slice(0, LIMIT)),
      primaryKind: 'hanzi',
    };
  }

  const keys = pinyinQueryKeys(query);
  let pinyinRows: Row[] = [];
  if (keys && keys.plain.length > 0) {
    // Prefer matches that end on a syllable boundary ("shu" is 书, not 率 shuài);
    // fall back to any prefix for half-typed input ("zho" → 中).
    const rank = (k: PinyinKeys, rows: Row[]) => {
      const strict = rankPinyin(k, rows, true);
      return strict.length ? strict : rankPinyin(k, rows, false);
    };
    if (keys.tones) {
      pinyinRows = rank(keys, await pinyinCandidates(schema.dictionary.pinyinTones, keys.tones));
    }
    if (pinyinRows.length === 0) {
      const plainKeys = { plain: keys.plain, tones: null };
      pinyinRows = rank(
        plainKeys,
        await pinyinCandidates(schema.dictionary.pinyinPlain, keys.plain),
      );
    }
    pinyinRows = pinyinRows.slice(0, LIMIT);
  }

  const englishRows =
    query.length >= 2 && /[a-z]/i.test(query) ? await englishCandidates(query) : [];
  let english = rankEnglish(query, englishRows);
  // Pinyin like "jiu" only turns up English by accident (inside names and
  // longer words); show English only when it matches a whole sense.
  const best = english.length ? englishScore(query, english[0].definitions) : null;
  if (pinyinRows.length > 0 && best !== null && best >= 2) english = [];

  return {
    available,
    primary: await withLibrary(pinyinRows),
    primaryKind: pinyinRows.length ? 'pinyin' : null,
    english: await withLibrary(english.slice(0, LIMIT)),
  };
}

/** The best dictionary entry for exact characters (common readings first). */
export async function lookupExact(hanzi: string): Promise<LookupEntry | null> {
  const rows = await db
    .select()
    .from(schema.dictionary)
    .where(eq(schema.dictionary.simplified, hanzi))
    .orderBy(asc(schema.dictionary.proper), byFrequency, asc(schema.dictionary.id))
    .limit(1);
  return rows.length ? (await withLibrary(rows))[0] : null;
}
