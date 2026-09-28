import type { Metadata } from 'next';
import { CHECK_PLAN, FIRST_CHECK_PLAN } from '@/lib/level/picker';
import type { Skill } from '@/lib/level/rating';
import { buildLevelBank } from '@/lib/queries/level-items';
import { currentPriors, getLevelState } from '@/lib/queries/level';
import { AssessmentPlayer } from '../_components/assessment-player';

export const metadata: Metadata = { title: 'Level check' };

const count = (plan: Skill[], skill: Skill) => plan.filter((s) => s === skill).length;

export default async function LevelCheckPage() {
  const state = await getLevelState();
  const plan = state.skills ? CHECK_PLAN : FIRST_CHECK_PLAN;
  const [priors, bank] = await Promise.all([
    currentPriors(),
    // Enough at every level for a whole check to stay at one level if it needs to.
    buildLevelBank({
      reading: count(plan, 'reading'),
      listening: count(plan, 'listening'),
      writing: count(plan, 'writing'),
      tones: count(plan, 'tones'),
    }),
  ]);
  const estimates = Object.fromEntries(
    Object.entries(priors).map(([skill, p]) => [skill, { rating: p.rating, spread: p.spread }]),
  ) as Record<Skill, { rating: number; spread: number }>;
  return <AssessmentPlayer mode="check" bank={bank} plan={plan} priors={estimates} />;
}
