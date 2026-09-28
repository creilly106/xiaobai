'use server';

import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';
import { db, schema } from '@/db/client';
import type { ScoredAnswer } from '@/lib/level/items';
import {
  ALL_SKILLS,
  LEVEL_SKILLS,
  estimateAll,
  hskLevelOf,
  overallLevel,
  type Estimate,
  type Skill,
} from '@/lib/level/rating';
import { PASS_EACH, PASS_OVERALL, examOpen } from '@/lib/level/ranks';
import {
  addMilestones,
  checkMilestones,
  currentPriors,
  examCoolingDown,
  getLevelState,
} from '@/lib/queries/level';

export type Section = { right: number; total: number };

export type AssessmentResult = {
  /** HSK level per skill before and after (tones as a rating on the same scale). */
  before: Record<Skill, number>;
  after: Record<Skill, number>;
  overall: number | null;
  sections: Partial<Record<Skill, Section>>;
  /** Percent right. */
  score: number;
  newMilestones: string[];
  /** Exams only. */
  passed?: boolean;
  weakest?: Skill | null;
  /** The exam you can take next, after this. */
  examLevel: number | null;
};

const MAX_ANSWERS = 40;

function clean(answers: unknown): ScoredAnswer[] {
  if (!Array.isArray(answers) || answers.length === 0 || answers.length > MAX_ANSWERS) {
    throw new Error('Invalid answers.');
  }
  return answers.map((a) => {
    const x = a as ScoredAnswer;
    const ok =
      (ALL_SKILLS as readonly string[]).includes(x?.skill) &&
      Number.isFinite(x.difficulty) &&
      x.difficulty >= 400 &&
      x.difficulty <= 2800 &&
      Number.isFinite(x.guess) &&
      x.guess >= 0 &&
      x.guess <= 0.5 &&
      Number.isFinite(x.score) &&
      x.score >= 0 &&
      x.score <= 1 &&
      Number.isInteger(x.level) &&
      x.level >= 0 &&
      x.level <= 6;
    if (!ok) throw new Error('Invalid answer.');
    return { ...x, itemId: String(x.itemId ?? '').slice(0, 20) };
  });
}

const levelsOf = (e: Record<Skill, Estimate>) =>
  Object.fromEntries(ALL_SKILLS.map((s) => [s, hskLevelOf(e[s].rating)])) as Record<Skill, number>;

function sectionsOf(answers: ScoredAnswer[]): Partial<Record<Skill, Section>> {
  const out: Partial<Record<Skill, Section>> = {};
  for (const a of answers) {
    const s = (out[a.skill] ??= { right: 0, total: 0 });
    s.right += a.score;
    s.total += 1;
  }
  return out;
}

/** Work out the new estimates and save them, with a record of the attempt. */
async function record(
  kind: 'check' | 'exam',
  answers: ScoredAnswer[],
  exam?: { level: number; passed: boolean },
) {
  const priors = await currentPriors();
  const after = estimateAll(priors, answers);
  const now = new Date();
  for (const skill of ALL_SKILLS) {
    const n = answers.filter((a) => a.skill === skill).length;
    if (n === 0) continue;
    const values = {
      skill,
      rating: after[skill].rating,
      spread: after[skill].spread,
      answers: priors[skill].answers + n,
      updatedAt: now,
    };
    await db
      .insert(schema.skillRatings)
      .values(values)
      .onConflictDoUpdate({
        target: schema.skillRatings.skill,
        set: {
          rating: values.rating,
          spread: values.spread,
          answers: sql`${schema.skillRatings.answers} + ${n}`,
          updatedAt: now,
        },
      });
  }
  const sections = sectionsOf(answers);
  const score = Math.round((answers.reduce((n, a) => n + a.score, 0) / answers.length) * 100);
  await db.insert(schema.assessments).values({
    kind,
    level: exam?.level ?? null,
    score,
    passed: exam ? exam.passed : null,
    detail: JSON.stringify({ sections, before: levelsOf(priors), after: levelsOf(after) }),
    takenAt: now,
  });
  return { priors, after, sections, score };
}

async function finish(
  base: Awaited<ReturnType<typeof record>>,
  milestones: string[],
  extra: Partial<AssessmentResult> = {},
): Promise<AssessmentResult> {
  const newMilestones = [...(await addMilestones(milestones)), ...(await checkMilestones())];
  const state = await getLevelState();
  revalidatePath('/level');
  revalidatePath('/');
  return {
    before: levelsOf(base.priors),
    after: levelsOf(base.after),
    overall: overallLevel(base.after),
    sections: base.sections,
    score: base.score,
    newMilestones,
    examLevel: state.examRetryAt ? null : state.examLevel,
    ...extra,
  };
}

/** Save a finished Level check. */
export async function submitCheck(raw: ScoredAnswer[]): Promise<AssessmentResult> {
  const answers = clean(raw);
  const base = await record('check', answers);
  const perfect = answers.length >= 10 && answers.every((a) => a.score === 1);
  return finish(base, perfect ? ['check-perfect'] : []);
}

/**
 * Save a promotion exam. Passing takes 80% overall and at least 60% in
 * reading, listening and writing (tones count toward the overall score).
 */
export async function submitExam(level: number, raw: ScoredAnswer[]): Promise<AssessmentResult> {
  const answers = clean(raw);
  const state = await getLevelState();
  const open = examOpen(state.rank, state.overall);
  if (!Number.isInteger(level) || open == null || level > open || level <= state.rank) {
    throw new Error('That exam is not open.');
  }
  if (await examCoolingDown(level)) throw new Error('Too soon to retry that exam.');

  const sections = sectionsOf(answers);
  const overall = answers.reduce((n, a) => n + a.score, 0) / answers.length;
  const ratios = LEVEL_SKILLS.map((s) => {
    const sec = sections[s];
    return [s, sec && sec.total ? sec.right / sec.total : 0] as const;
  }).sort((a, b) => a[1] - b[1]);
  const passed = overall >= PASS_OVERALL && ratios.every(([, r]) => r >= PASS_EACH);
  // Sorted weakest first: the skill that held you back.
  const weakest = passed ? null : ratios[0][0];

  const base = await record('exam', answers, { level, passed });
  return finish(base, passed ? [`rank-${level}`] : [], { passed, weakest });
}
