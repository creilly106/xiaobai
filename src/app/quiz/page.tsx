import type { Metadata } from 'next';
import { listScenarios } from '@/lib/queries/scenarios';
import { listHskLevels } from '@/lib/queries/quiz';
import { QuizForm } from './_components/quiz-form';

export const metadata: Metadata = { title: 'Quiz' };

export default async function QuizPage() {
  const [scenarios, hskLevels] = await Promise.all([
    listScenarios(),
    listHskLevels(),
  ]);
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Quiz</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Build a custom drill from your library and scenarios. By default this
        is practice mode — no spaced-repetition scheduling changes. Turn on
        &quot;Update spaced-repetition memory&quot; to make it count.
      </p>
      <QuizForm
        scenarios={scenarios.map((s) => ({ slug: s.slug, name: s.name }))}
        hskLevels={hskLevels}
      />
    </div>
  );
}
