import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CircleCheck, Clock, Lock } from 'lucide-react';
import { LocalDate } from '@/components/local-date';
import { MILESTONES, RANKS, TOP_EXAM_LEVEL, rankAt } from '@/lib/level/ranks';
import { LEVEL_SKILLS, SKILL_NAME, hskLevelOf, toneLabel, type Skill } from '@/lib/level/rating';
import { checkMilestones, getLevelState, type HistoryPoint } from '@/lib/queries/level';

export const metadata: Metadata = { title: 'Level' };

const SKILL_COLOR: Record<Skill, string> = {
  reading: 'bg-sky-500',
  listening: 'bg-amber-500',
  writing: 'bg-emerald-500',
  tones: 'bg-violet-500',
};
const SKILL_STROKE: Record<Skill, string> = {
  reading: 'stroke-sky-500',
  listening: 'stroke-amber-500',
  writing: 'stroke-emerald-500',
  tones: 'stroke-violet-500',
};

export default async function LevelPage() {
  // New milestones (words known, path levels, stories, streak) are recorded on the way in.
  await checkMilestones();
  const state = await getLevelState();
  const rank = rankAt(state.rank);
  const next = RANKS.find((r) => r.level === state.rank + 1);
  const exam = state.examLevel != null ? rankAt(state.examLevel) : null;
  const daysToCheck = state.checkInDays;
  const achieved = new Map(state.milestones.map((m) => [m.key, m.achievedAt]));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="sr-only">Your level</h1>
      <section className="flex items-center gap-5 rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
        <div
          lang="zh-Hans"
          className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-3xl font-semibold text-primary-foreground"
        >
          {rank.hanzi}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your rank
          </div>
          <div className="text-xl font-semibold">
            {rank.name}{' '}
            <span className="text-base font-normal text-muted-foreground">{rank.pinyin}</span>
          </div>
          {state.overall != null ? (
            <p className="text-sm text-muted-foreground">
              Overall about{' '}
              <span className="font-medium text-foreground">HSK {state.overall.toFixed(1)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Take a Level check to find out where you are.
            </p>
          )}
          {next && next.level <= TOP_EXAM_LEVEL && state.overall != null && (
            <div className="mt-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.round(state.towardNext * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Next: <span lang="zh-Hans">{next.hanzi}</span> {next.name} at HSK {next.level}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-4 space-y-3" aria-label="What to do next">
        {exam &&
          (state.examRetryAt ? (
            <div className="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
              <Clock className="size-5 shrink-0 text-muted-foreground" />
              <span>
                You can retry the <span lang="zh-Hans">{exam.hanzi}</span> exam on{' '}
                <LocalDate value={state.examRetryAt} />.
              </span>
            </div>
          ) : (
            <Link
              href={`/level/exam?level=${exam.level}`}
              className="flex items-center gap-3 rounded-xl border-2 border-amber-500/50 bg-amber-500/10 px-4 py-3 transition-colors hover:bg-amber-500/15"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium">
                  Ready for promotion: the <span lang="zh-Hans">{exam.hanzi}</span> exam
                </div>
                <div className="text-sm text-muted-foreground">
                  About 20 questions at HSK {exam.level}. Pass with 80%, and at least 60% in each
                  skill.
                </div>
              </div>
              <ArrowRight className="size-5 shrink-0" />
            </Link>
          ))}
        {state.skills == null ? (
          <Link
            href="/level/check"
            className="flex items-center gap-3 rounded-xl border-2 border-primary/40 px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <div className="font-medium">Take your first Level check</div>
              <div className="text-sm text-muted-foreground">
                About 18 questions, 6–8 minutes. They adapt to you as you go.
              </div>
            </div>
            <ArrowRight className="size-5 shrink-0" />
          </Link>
        ) : state.checkDue ? (
          <Link
            href="/level/check"
            className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <div className="font-medium">Weekly Level check</div>
              <div className="text-sm text-muted-foreground">15 questions, about 5 minutes.</div>
            </div>
            <ArrowRight className="size-5 shrink-0" />
          </Link>
        ) : (
          <p className="px-1 text-sm text-muted-foreground">
            Next Level check in {daysToCheck} day{daysToCheck === 1 ? '' : 's'}.{' '}
            <Link href="/level/check" className="underline underline-offset-4">
              Take one now
            </Link>
          </p>
        )}
      </section>

      {state.skills && (
        <section className="mt-8" aria-labelledby="skills">
          <h2
            id="skills"
            className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground"
          >
            Skills
          </h2>
          <ul className="space-y-3">
            {LEVEL_SKILLS.map((skill) => {
              const s = state.skills![skill];
              const level = hskLevelOf(s.rating);
              const rusty = level < state.rank - 0.5;
              return (
                <li key={skill}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${SKILL_COLOR[skill]}`} aria-hidden />
                      {SKILL_NAME[skill]}
                      {rusty && (
                        <span className="rounded-full bg-amber-500/15 px-2 text-xs text-amber-700 dark:text-amber-400">
                          getting rusty
                        </span>
                      )}
                    </span>
                    <span className="font-medium tabular-nums">≈ HSK {level.toFixed(1)}</span>
                  </div>
                  <div className="relative mt-1 h-2 rounded-full bg-muted">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${SKILL_COLOR[skill]}`}
                      style={{ width: `${Math.min(100, (level / 6) * 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
            <li className="flex items-baseline justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${SKILL_COLOR.tones}`} aria-hidden />
                {SKILL_NAME.tones}
              </span>
              <span className="font-medium">{toneLabel(state.skills.tones.rating)}</span>
            </li>
          </ul>
          <HistoryChart points={state.history} />
        </section>
      )}

      <section className="mt-10" aria-labelledby="ranks">
        <h2
          id="ranks"
          className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground"
        >
          Ranks
        </h2>
        <ol className="divide-y rounded-xl border">
          {RANKS.map((r) => {
            const earned = r.level <= state.rank;
            const when = state.rankEarnedAt[r.level];
            return (
              <li
                key={r.level}
                className={`flex items-center gap-3 px-4 py-2.5 ${r.level === state.rank ? 'bg-primary/5' : ''}`}
              >
                <span
                  lang="zh-Hans"
                  className={`w-12 text-xl ${earned ? '' : 'text-muted-foreground'}`}
                >
                  {r.hanzi}
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  {r.name}
                  <span className="text-muted-foreground">
                    {' · '}
                    {r.level === 0 ? 'where everyone starts' : `HSK ${r.level}`}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {earned ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CircleCheck className="size-4" />
                      {when ? <LocalDate value={when} /> : r.level === 0 ? '' : 'earned'}
                    </span>
                  ) : r.level > TOP_EXAM_LEVEL ? (
                    'arrives with HSK 6'
                  ) : (
                    <Lock className="size-4" aria-label="Not yet" />
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="milestones">
        <h2
          id="milestones"
          className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground"
        >
          Milestones · {state.milestones.length} / {MILESTONES.length}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {MILESTONES.map((m) => {
            const at = achieved.get(m.key);
            return (
              <li
                key={m.key}
                className={`rounded-lg border px-3 py-2 text-sm ${at ? 'border-emerald-500/40 bg-emerald-500/5' : 'opacity-60'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-medium"
                    lang={m.key.startsWith('rank') ? 'zh-Hans' : undefined}
                  >
                    {m.title}
                  </span>
                  {at ? (
                    <span className="text-xs text-muted-foreground">
                      <LocalDate value={at} />
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-muted-foreground">{m.detail}</div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/** Each skill's level over time, from your checks and exams. */
function HistoryChart({ points }: { points: HistoryPoint[] }) {
  if (points.length < 2) return null;
  const W = 600;
  const H = 160;
  const pad = 24;
  const first = points[0].at;
  const span = Math.max(1, points.at(-1)!.at - first);
  const x = (at: number) => pad + ((at - first) / span) * (W - pad * 2);
  const y = (level: number) => H - pad - (Math.min(6, Math.max(0, level)) / 6) * (H - pad * 2);
  return (
    <figure className="mt-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Skill levels over time"
      >
        {[0, 1, 2, 3, 4, 5, 6].map((l) => (
          <g key={l}>
            <line
              x1={pad}
              x2={W - pad}
              y1={y(l)}
              y2={y(l)}
              className="stroke-border"
              strokeWidth={1}
            />
            <text x={4} y={y(l) + 4} className="fill-muted-foreground text-[10px]">
              {l}
            </text>
          </g>
        ))}
        {LEVEL_SKILLS.map((skill) => {
          const pts = points.filter((p) => p.levels[skill] != null);
          if (pts.length < 2) return null;
          return (
            <polyline
              key={skill}
              fill="none"
              strokeWidth={2.5}
              className={SKILL_STROKE[skill]}
              points={pts.map((p) => `${x(p.at)},${y(p.levels[skill]!)}`).join(' ')}
            />
          );
        })}
      </svg>
      <figcaption className="mt-1 text-center text-xs text-muted-foreground">
        HSK level by skill, from your Level checks and exams
      </figcaption>
    </figure>
  );
}
