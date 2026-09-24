import 'server-only';
import { connection } from 'next/server';
import { and, ne, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import {
  findRadical,
  radicalChars,
  radicals,
  type Radical,
  type RadicalForm,
} from '@/lib/radicals-data';
import {
  charactersUsing,
  decompose,
  etymologyOf,
  getCharDatum,
  layoutOf,
  type Etymology,
} from '@/lib/ids-data';
import { lookupEntry } from '@/lib/queries/dictionary';
import { examplesFor, type Example } from '@/lib/examples';

export type Gloss = {
  pinyin: string;
  meaning: string;
  hskLevel: number | null;
  /** word = HSK vocabulary, char = curated gloss, component = dataset definition */
  kind: 'word' | 'char' | 'component';
};

export type PartInfo = {
  hanzi: string;
  gloss: Gloss | null;
  radical: Radical | null;
  /** For sound–meaning compounds: which job this part does. */
  role?: 'meaning' | 'sound';
};

export type CharacterInfo = {
  hanzi: string;
  isSingle: boolean;
  gloss: Gloss | null;
  /** Layout of the outermost decomposition, e.g. "left + right". */
  layout: string | null;
  /** Parts of a single character (empty when it doesn't break down). */
  components: PartInfo[];
  /** Each character of a multi-character word. */
  characters: PartInfo[];
  etymology: Etymology | null;
  /** The radical dictionaries file this character under. */
  indexRadical: Radical | null;
  /** Set when the character is itself a radical or one of its forms. */
  asRadical: { radical: Radical; form: RadicalForm | null } | null;
  /** For radicals and component forms: everyday characters built with it. */
  usedIn: PartInfo[];
  /** Example sentences using this word or character (Tatoeba). */
  examples: Example[];
  containingWords: {
    id: number;
    hanzi: string;
    pinyin: string;
    meaning: string;
    hskLevel: number | null;
  }[];
};

/** Short, readable version of a dataset definition ("to believe, to wish for; …"). */
function shortDefinition(def: string): string {
  return def.split(';')[0].trim();
}

export async function glossFor(hanzi: string): Promise<Gloss | null> {
  const entry = await lookupEntry(hanzi);
  if (entry) {
    return {
      pinyin: entry.pinyin,
      meaning: entry.meaning,
      hskLevel: entry.hskLevel,
      kind: entry.kind,
    };
  }
  const datum = getCharDatum(hanzi);
  if (datum?.definition) {
    return {
      pinyin: datum.pinyin ?? '',
      meaning: shortDefinition(datum.definition),
      hskLevel: null,
      kind: 'component',
    };
  }
  const radical = findRadical(hanzi);
  if (radical) {
    return { pinyin: radical.pinyin, meaning: radical.meaning, hskLevel: null, kind: 'component' };
  }
  return null;
}

/** 阝 is two different radicals depending on which side it sits. */
function radicalForPart(part: string, parentIds: string | undefined): Radical | null {
  if (part === '阝' && parentIds) {
    const onRight = parentIds.startsWith('⿰') && parentIds.endsWith('阝');
    return radicals.find((r) => r.number === (onRight ? 163 : 170)) ?? null;
  }
  return findRadical(part);
}

async function describePart(
  hanzi: string,
  parentIds?: string,
  etymology?: Etymology | null,
): Promise<PartInfo> {
  const role =
    etymology?.type === 'pictophonetic'
      ? etymology.semantic === hanzi
        ? 'meaning'
        : etymology.phonetic === hanzi
          ? 'sound'
          : undefined
      : undefined;
  return {
    hanzi,
    gloss: await glossFor(hanzi),
    radical: radicalForPart(hanzi, parentIds),
    ...(role ? { role } : {}),
  };
}

function asRadicalOf(hanzi: string): CharacterInfo['asRadical'] {
  for (const radical of radicals) {
    if (radical.hanzi === hanzi || radical.kangxi === hanzi) return { radical, form: null };
  }
  for (const radical of radicals) {
    const form = radical.forms?.find((f) => f.char === hanzi);
    // 月 and 王 are everyday characters first; only treat them as a form when
    // they aren't also a radical in their own right (handled above).
    if (form) return { radical, form };
  }
  return null;
}

export async function getCharacterInfo(hanzi: string): Promise<CharacterInfo> {
  await connection();
  const chars = Array.from(hanzi);
  const isSingle = chars.length === 1;

  const containingWords = await db
    .select({
      id: schema.words.id,
      hanzi: schema.words.hanzi,
      pinyin: schema.words.pinyin,
      meaning: schema.words.meaning,
      hskLevel: schema.words.hskLevel,
    })
    .from(schema.words)
    .where(and(sql`instr(${schema.words.hanzi}, ${hanzi}) > 0`, ne(schema.words.hanzi, hanzi)))
    .orderBy(schema.words.hskLevel, schema.words.id)
    .limit(60);

  const datum = isSingle ? getCharDatum(hanzi) : null;
  const etymology = isSingle ? etymologyOf(hanzi) : null;
  const parts = isSingle ? decompose(hanzi) : [];

  const [gloss, components, characters] = await Promise.all([
    glossFor(hanzi),
    Promise.all(parts.map((p) => describePart(p, datum?.ids, etymology))),
    isSingle ? Promise.resolve([]) : Promise.all(chars.map((c) => describePart(c))),
  ]);

  const asRadical = isSingle ? asRadicalOf(hanzi) : null;
  let usedIn: PartInfo[] = [];
  if (asRadical) {
    const shapes = asRadical.form ? [asRadical.form.char] : radicalChars(asRadical.radical);
    const described = await Promise.all(charactersUsing(shapes).map((c) => describePart(c)));
    // Vocabulary first (by HSK level), then glossed characters; skip obscure ones.
    usedIn = described
      .filter((p) => p.gloss && p.gloss.kind !== 'component')
      .sort(
        (a, b) =>
          (a.gloss!.hskLevel ?? 99) - (b.gloss!.hskLevel ?? 99) || a.hanzi.localeCompare(b.hanzi),
      )
      .slice(0, 24);
  }

  return {
    hanzi,
    isSingle,
    gloss,
    usedIn,
    layout: isSingle ? layoutOf(hanzi) : null,
    components,
    characters,
    etymology,
    indexRadical: datum ? radicalForPart(datum.radical, datum.ids) : null,
    asRadical,
    containingWords,
    examples: examplesFor(hanzi),
  };
}
