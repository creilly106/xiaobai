import 'server-only';
import { connection } from 'next/server';
import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { PracticeKind } from '@/db/schema';
import { toneAccuracy, type ToneTally } from '@/lib/practice-stats';

export type PracticeSummary = {
  days: number;
  byKind: Record<PracticeKind, { right: number; total: number }>;
  tones: ToneTally[];
  worstTone: { heard: number; answered: number; count: number } | null;
  /** Words missed in fill-in-the-blank or quiz practice, most-missed first. */
  toRevisit: { hanzi: string; pinyin: string; meaning: string; misses: number }[];
};

export async function getPracticeSummary(days = 30): Promise<PracticeSummary> {
  await connection();
  const since = new Date(Date.now() - days * 86_400_000);

  const [counts, toneRows, missed] = await Promise.all([
    db
      .select({
        kind: schema.practiceLog.kind,
        total: sql<number>`count(*)`,
        right: sql<number>`sum(case when ${schema.practiceLog.correct} then 1 else 0 end)`,
      })
      .from(schema.practiceLog)
      .where(gte(schema.practiceLog.createdAt, since))
      .groupBy(schema.practiceLog.kind),
    db
      .select({ detail: schema.practiceLog.detail })
      .from(schema.practiceLog)
      .where(and(eq(schema.practiceLog.kind, 'tone'), gte(schema.practiceLog.createdAt, since))),
    db
      .select({ item: schema.practiceLog.item, misses: sql<number>`count(*)` })
      .from(schema.practiceLog)
      .where(
        and(
          inArray(schema.practiceLog.kind, ['cloze', 'quiz']),
          eq(schema.practiceLog.correct, false),
          gte(schema.practiceLog.createdAt, new Date(Date.now() - 14 * 86_400_000)),
        ),
      )
      .groupBy(schema.practiceLog.item)
      .orderBy(desc(sql`count(*)`))
      .limit(12),
  ]);

  const byKind: PracticeSummary['byKind'] = {
    tone: { right: 0, total: 0 },
    number: { right: 0, total: 0 },
    cloze: { right: 0, total: 0 },
    quiz: { right: 0, total: 0 },
    listening: { right: 0, total: 0 },
  };
  for (const c of counts) {
    byKind[c.kind] = { right: Number(c.right ?? 0), total: Number(c.total) };
  }

  const words =
    missed.length > 0
      ? await db
          .select({
            hanzi: schema.words.hanzi,
            pinyin: schema.words.pinyin,
            meaning: schema.words.meaning,
          })
          .from(schema.words)
          .where(
            inArray(
              schema.words.hanzi,
              missed.map((m) => m.item),
            ),
          )
      : [];
  const byHanzi = new Map(words.map((w) => [w.hanzi, w]));
  const toRevisit = missed.flatMap((m) => {
    const w = byHanzi.get(m.item);
    return w ? [{ ...w, misses: Number(m.misses) }] : [];
  });

  const { tones, worst } = toneAccuracy(toneRows.map((r) => r.detail));
  return { days, byKind, tones, worstTone: worst, toRevisit };
}
