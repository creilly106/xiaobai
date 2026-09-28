import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildExam } from '@/lib/queries/level-items';
import { getLevelState } from '@/lib/queries/level';
import { AssessmentPlayer } from '../_components/assessment-player';

export const metadata: Metadata = { title: 'Promotion exam' };

export default async function ExamPage({ searchParams }: PageProps<'/level/exam'>) {
  const { level: raw } = await searchParams;
  const level = Number(Array.isArray(raw) ? raw[0] : raw);
  const state = await getLevelState();
  // Only the exam that's open, and not during the wait after a fail.
  if (!Number.isInteger(level) || state.examLevel !== level || state.examRetryAt) {
    redirect('/level');
  }
  const exam = await buildExam(level);
  if (!exam) redirect('/level');
  return <AssessmentPlayer mode="exam" level={level} items={exam.items} />;
}
