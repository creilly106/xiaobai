import { notFound } from 'next/navigation';
import { LESSONS, unitById } from '@/lib/curriculum';
import { getCheckpointSession } from '@/lib/queries/path';
import { LessonPlayer } from '../../_components/lesson-player';

export async function generateMetadata({ params }: PageProps<'/learn/checkpoint/[unitId]'>) {
  const unit = unitById((await params).unitId);
  return { title: unit ? `${unit.title} checkpoint` : 'Checkpoint' };
}

export default async function CheckpointPage({ params }: PageProps<'/learn/checkpoint/[unitId]'>) {
  const { unitId } = await params;
  const session = await getCheckpointSession(unitId);
  if (!session) notFound();
  // After testing out, carry on from the first lesson of the next unit.
  const last = LESSONS.filter((l) => l.unit.id === unitId).at(-1);
  const next = last ? LESSONS[last.index + 1] : undefined;
  return (
    <LessonPlayer
      session={session}
      nextHref={next ? `/learn/${next.id}` : '/learn'}
      nextTitle={next?.title ?? null}
    />
  );
}
