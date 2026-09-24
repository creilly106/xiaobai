import 'server-only';
import { connection } from 'next/server';
import { eq, inArray, ne } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { grammarPoints } from '@/lib/grammar-data';
import { segmentSpans } from '@/lib/segment';
import type { Syllable } from '@/lib/pinyin';
import { getDictionary } from './dictionary';
import { wordSyllables } from './tones';

export type ClozeFilters = {
  /** Empty = every scenario. */
  scenarioSlugs: string[];
  /** Include the example sentences from the grammar pages. */
  includeGrammar: boolean;
  /** Only blank out words you've already studied. */
  knownOnly: boolean;
  count: number;
};

export type ClozeItem = {
  key: string;
  source: string;
  before: string;
  after: string;
  /** The full sentence, for audio and the answer reveal. */
  hanzi: string;
  pinyin: string;
  meaning: string;
  word: { hanzi: string; pinyin: string; meaning: string };
  /** Expected syllables for typed answers (null = check letters only). */
  syllables: Syllable[] | null;
  /** The answer plus three distractors, shuffled. */
  options: string[];
};

type Sentence = { key: string; source: string; hanzi: string; pinyin: string; meaning: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadSentences(filters: ClozeFilters): Promise<Sentence[]> {
  const out: Sentence[] = [];
  const wantScenarios = filters.scenarioSlugs.length > 0 || !filters.includeGrammar;
  if (wantScenarios) {
    const rows = await db
      .selectDistinct({
        id: schema.sentences.id,
        hanzi: schema.sentences.hanzi,
        pinyin: schema.sentences.pinyin,
        meaning: schema.sentences.meaning,
        scenario: schema.tags.name,
      })
      .from(schema.sentences)
      .innerJoin(schema.sentenceTags, eq(schema.sentenceTags.sentenceId, schema.sentences.id))
      .innerJoin(schema.tags, eq(schema.tags.id, schema.sentenceTags.tagId))
      .where(
        filters.scenarioSlugs.length > 0
          ? inArray(schema.tags.slug, filters.scenarioSlugs)
          : eq(schema.tags.type, 'scenario'),
      );
    const seen = new Set<number>();
    for (const r of rows) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      out.push({
        key: `s${r.id}`,
        source: r.scenario,
        hanzi: r.hanzi,
        pinyin: r.pinyin,
        meaning: r.meaning,
      });
    }
  }
  if (filters.includeGrammar) {
    for (const g of grammarPoints) {
      g.examples.forEach((e, i) =>
        out.push({
          key: `g-${g.slug}-${i}`,
          source: g.name,
          hanzi: e.hanzi,
          pinyin: e.pinyin,
          meaning: e.meaning,
        }),
      );
    }
  }
  return out;
}

/**
 * Fill-in-the-blank items. Each sentence gets one vocabulary word blanked —
 * preferably one you've studied — and the English translation is shown so
 * only one option fits.
 */
export async function getClozeItems(filters: ClozeFilters): Promise<ClozeItem[]> {
  await connection();
  const count = Math.max(1, Math.min(filters.count, 50));

  const [sentences, vocab, studied, dict] = await Promise.all([
    loadSentences(filters),
    db
      .select({
        hanzi: schema.words.hanzi,
        pinyin: schema.words.pinyin,
        meaning: schema.words.meaning,
        hskLevel: schema.words.hskLevel,
      })
      .from(schema.words),
    db
      .select({ hanzi: schema.words.hanzi })
      .from(schema.cards)
      .innerJoin(schema.words, eq(schema.cards.wordId, schema.words.id))
      .where(ne(schema.cards.state, 'new')),
    getDictionary(),
  ]);

  const byHanzi = new Map(vocab.map((w) => [w.hanzi, w]));
  const vocabSet = new Set(byHanzi.keys());
  const known = new Set(studied.map((w) => w.hanzi));
  const byLength = new Map<number, typeof vocab>();
  for (const w of vocab) {
    const n = Array.from(w.hanzi).length;
    byLength.set(n, [...(byLength.get(n) ?? []), w]);
  }

  const items: ClozeItem[] = [];
  for (const s of shuffle(sentences)) {
    if (items.length >= count) break;
    const spans = segmentSpans(s.hanzi, vocabSet);
    const candidates = filters.knownOnly ? spans.filter((sp) => known.has(sp.word)) : spans;
    if (candidates.length === 0) continue;
    // Studied words are three times as likely to be picked.
    const weighted = candidates.flatMap((sp) => (known.has(sp.word) ? [sp, sp, sp] : [sp]));
    const span = weighted[Math.floor(Math.random() * weighted.length)];
    const word = byHanzi.get(span.word)!;

    const chars = Array.from(s.hanzi);
    const pool = (byLength.get(span.end - span.start) ?? []).filter(
      (w) =>
        w.hanzi !== word.hanzi &&
        !s.hanzi.includes(w.hanzi) &&
        Math.abs((w.hskLevel ?? 3) - (word.hskLevel ?? 3)) <= 1,
    );
    const distractors = shuffle(pool)
      .sort((a, b) => Number(known.has(b.hanzi)) - Number(known.has(a.hanzi)))
      .slice(0, 3)
      .map((w) => w.hanzi);
    if (distractors.length < 3) continue;

    items.push({
      key: s.key,
      source: s.source,
      before: chars.slice(0, span.start).join(''),
      after: chars.slice(span.end).join(''),
      hanzi: s.hanzi,
      pinyin: s.pinyin,
      meaning: s.meaning,
      word: { hanzi: word.hanzi, pinyin: word.pinyin, meaning: word.meaning },
      syllables: wordSyllables(word.hanzi, word.pinyin, dict),
      options: shuffle([word.hanzi, ...distractors]),
    });
  }
  return items;
}
