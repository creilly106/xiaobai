import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { LESSONS, lessonById } from '@/lib/curriculum';
import { getLessonSession, getPath } from '@/lib/queries/path';
import { LessonPlayer } from '../_components/lesson-player';

export async function generateMetadata({ params }: PageProps<'/learn/[lessonId]'>) {
  const lesson = lessonById((await params).lessonId);
  return { title: lesson ? lesson.title : 'Lesson' };
}

export default async function LessonPage({ params }: PageProps<'/learn/[lessonId]'>) {
  const { lessonId } = await params;
  const lesson = lessonById(lessonId);
  if (!lesson) notFound();

  const path = await getPath();
  const state = path.units.flatMap((u) => u.lessons).find((l) => l.id === lessonId)?.state;
  if (state === 'locked') {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Not unlocked yet</h1>
        <p className="mt-2 text-muted-foreground">
          Finish the lessons before “{lesson.title}” first — or, if you already know this material,
          test out of the unit.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/learn" className={buttonVariants({})}>
            Back to the path
          </Link>
          <Link
            href={`/learn/checkpoint/${lesson.unit.id}`}
            className={buttonVariants({ variant: 'outline' })}
          >
            Test out of {lesson.unit.title}
          </Link>
        </div>
      </div>
    );
  }

  const session = await getLessonSession(lessonId);
  if (!session) notFound();
  if (session.steps.length === 0) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">
          This lesson&apos;s words aren&apos;t in your library
        </h1>
        <p className="mt-2 text-muted-foreground">
          Add HSK {lesson.unit.hskLevel} from the Library first.
        </p>
      </div>
    );
  }
  const next = LESSONS[lesson.index + 1];
  return (
    <LessonPlayer
      session={session}
      nextHref={next ? `/learn/${next.id}` : '/learn'}
      nextTitle={next?.title ?? null}
    />
  );
}
