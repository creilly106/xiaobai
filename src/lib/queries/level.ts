import 'server-only';
import { connection } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import { stories } from '@/lib/story-data';
import {
  ALL_SKILLS,
  FIRST_SPREAD,
  aged,
  overallLevel,
  ratingForLevel,
  type Estimate,
  type Skill,
} from '@/lib/level/rating';
import {
  CHECK_EVERY_MS,
  MILESTONES,
  RETRY_AFTER_MS,
  examOpen,
  towardNext,
} from '@/lib/level/ranks';
import { getPath, isFinished } from './path';
import { getWordsKnown } from './progress';
import { readStories } from './reading';
import { getSettings } from './settings';

const WEEK_MS = 7 * 86_400_000;

export type SkillView = Estimate & { answers: number };

export type HistoryPoint = {
  at: number;
  kind: 'check' | 'exam';
  /** HSK level per skill after it (tones as a rating). */
  levels: Partial<Record<Skill, number>>;
};

export type LevelState = {
  /** Current estimates; null before the first Level check. */
  skills: Record<Skill, SkillView> | null;
  overall: number | null;
  /** HSK level of the rank you hold (0 = 小白). */
  rank: number;
  /** When each rank was earned, by level. */
  rankEarnedAt: Record<number, number>;
  /** HSK level of the exam you can take now, if any. */
  examLevel: number | null;
  /** When that exam can be retried, if you failed it recently. */
  examRetryAt: number | null;
  towardNext: number;
  lastCheckAt: number | null;
  checkDue: boolean;
  history: HistoryPoint[];
  milestones: { key: string; achievedAt: number }[];
};

/**
 * A first guess before any Level check: the HSK level you've mostly finished
 * on the Learn path. The check corrects it quickly.
 */
async function pathLevel(): Promise<number> {
  const path = await getPath();
  let level = 0;
  for (const n of [1, 2, 3, 4, 5]) {
    const lessons = path.units.filter((u) => u.hskLevel === n).flatMap((u) => u.lessons);
    const done = lessons.filter((l) => isFinished(l.state)).length;
    if (lessons.length && done / lessons.length >= 0.5) level = n;
  }
  return level;
}

/** What each skill's estimate is before a new check or exam: last time's, loosened by time. */
export async function currentPriors(now = Date.now()): Promise<Record<Skill, SkillView>> {
  const rows = await db.select().from(schema.skillRatings);
  const bySkill = new Map(rows.map((r) => [r.skill, r]));
  const start = rows.length === ALL_SKILLS.length ? 0 : await pathLevel();
  const out = {} as Record<Skill, SkillView>;
  for (const skill of ALL_SKILLS) {
    const row = bySkill.get(skill);
    out[skill] = row
      ? {
          ...aged(
            { rating: row.rating, spread: row.spread },
            (now - row.updatedAt.getTime()) / WEEK_MS,
          ),
          answers: row.answers,
        }
      : {
          rating: ratingForLevel(skill === 'tones' ? 2 : Math.max(0.5, start)),
          spread: FIRST_SPREAD,
          answers: 0,
        };
  }
  return out;
}

type Detail = { after?: Partial<Record<Skill, number>> };

export async function getLevelState(): Promise<LevelState> {
  await connection();
  const [rows, history, done] = await Promise.all([
    db.select().from(schema.skillRatings),
    db.select().from(schema.assessments).orderBy(schema.assessments.takenAt),
    db.select().from(schema.milestones),
  ]);
  const skills =
    rows.length > 0
      ? (Object.fromEntries(
          ALL_SKILLS.map((skill) => {
            const r = rows.find((x) => x.skill === skill);
            return [
              skill,
              r
                ? { rating: r.rating, spread: r.spread, answers: r.answers }
                : { rating: ratingForLevel(0), spread: FIRST_SPREAD, answers: 0 },
            ];
          }),
        ) as Record<Skill, SkillView>)
      : null;
  const overall = skills ? overallLevel(skills) : null;

  const passed = history.filter((h) => h.kind === 'exam' && h.passed && h.level != null);
  const rank = Math.max(0, ...passed.map((h) => h.level!));
  const rankEarnedAt: Record<number, number> = {};
  for (const h of passed) rankEarnedAt[h.level!] ??= h.takenAt.getTime();

  const examLevel = examOpen(rank, overall);
  const lastFail = [...history]
    .reverse()
    .find((h) => h.kind === 'exam' && h.level === examLevel && h.passed === false);
  const retryAt = lastFail ? lastFail.takenAt.getTime() + RETRY_AFTER_MS : null;

  const checks = history.filter((h) => h.kind === 'check');
  const lastCheckAt = checks.at(-1)?.takenAt.getTime() ?? null;
  return {
    skills,
    overall,
    rank,
    rankEarnedAt,
    examLevel,
    examRetryAt: retryAt && retryAt > Date.now() ? retryAt : null,
    towardNext: towardNext(rank, overall),
    lastCheckAt,
    checkDue: lastCheckAt == null || Date.now() - lastCheckAt >= CHECK_EVERY_MS,
    history: history.map((h) => ({
      at: h.takenAt.getTime(),
      kind: h.kind,
      levels: (JSON.parse(h.detail) as Detail).after ?? {},
    })),
    milestones: done.map((m) => ({ key: m.key, achievedAt: m.achievedAt.getTime() })),
  };
}

/** The most recent failed attempt at a given exam, if within the retry wait. */
export async function examCoolingDown(level: number): Promise<boolean> {
  const [last] = await db
    .select()
    .from(schema.assessments)
    .where(and(eq(schema.assessments.kind, 'exam'), eq(schema.assessments.level, level)))
    .orderBy(desc(schema.assessments.takenAt))
    .limit(1);
  return !!last && last.passed === false && Date.now() - last.takenAt.getTime() < RETRY_AFTER_MS;
}

/**
 * Record any milestones newly reached (words known, path levels, stories,
 * streak). Returns the keys added. Exam and check milestones are recorded
 * when those finish.
 */
export async function checkMilestones(): Promise<string[]> {
  const [words, path, read, settings, have] = await Promise.all([
    getWordsKnown(),
    getPath(),
    readStories(),
    getSettings(),
    db.select({ key: schema.milestones.key }).from(schema.milestones),
  ]);
  const owned = new Set(have.map((m) => m.key));
  const reached: string[] = [];
  for (const n of [100, 500, 1000, 2500]) if (words.known >= n) reached.push(`words-${n}`);
  for (const n of [1, 2, 3, 4, 5]) {
    const lessons = path.units.filter((u) => u.hskLevel === n).flatMap((u) => u.lessons);
    if (lessons.length && lessons.every((l) => isFinished(l.state))) reached.push(`path-hsk${n}`);
    const level = stories.filter((s) => s.hskLevel === n);
    if (level.length && level.every((s) => read.has(s.id))) reached.push(`stories-hsk${n}`);
  }
  if (settings.streakDays >= 30) reached.push('streak-30');
  return addMilestones(reached.filter((k) => !owned.has(k)));
}

export async function addMilestones(keys: string[]): Promise<string[]> {
  const known = new Set(MILESTONES.map((m) => m.key));
  const fresh = keys.filter((k) => known.has(k));
  if (fresh.length === 0) return [];
  const added = await db
    .insert(schema.milestones)
    .values(fresh.map((key) => ({ key })))
    .onConflictDoNothing()
    .returning({ key: schema.milestones.key });
  return added.map((a) => a.key);
}
