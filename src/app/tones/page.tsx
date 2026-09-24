import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { getToneDrillData } from '@/lib/queries/tones';
import { ToneReference } from './_components/tone-reference';
import { ToneTrainer } from './_components/tone-trainer';

export const metadata: Metadata = { title: 'Tones' };

export default async function TonesPage() {
  const data = await getToneDrillData();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Tones <span lang="zh-Hans">声调</span>{' '}
        <span className="text-base font-normal text-muted-foreground">shēngdiào</span>
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        The same syllable in a different tone is a different word — mǎi (买, buy) and mài (卖, sell)
        are opposites. Training your ear early pays off in every other skill.
      </p>

      <section aria-labelledby="the-tones" className="mt-8">
        <h2
          id="the-tones"
          className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          The four tones (+ neutral) — click to hear
        </h2>
        <ToneReference />
      </section>

      <section aria-labelledby="changes" className="mt-6">
        <Card>
          <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <h3 id="changes" className="font-medium">
                Two 3rd tones in a row
              </h3>
              <p className="mt-1 text-muted-foreground">
                The first one rises instead: 你好 is written nǐ hǎo but said{' '}
                <span className="text-orange-600 dark:text-orange-400">ní</span> hǎo.
              </p>
            </div>
            <div>
              <h3 className="font-medium">不 bù before a 4th tone</h3>
              <p className="mt-1 text-muted-foreground">
                Becomes 2nd tone: 不是{' '}
                <span className="text-orange-600 dark:text-orange-400">bú</span> shì, 不客气{' '}
                <span className="text-orange-600 dark:text-orange-400">bú</span> kèqi.
              </p>
            </div>
            <div>
              <h3 className="font-medium">一 yī changes too</h3>
              <p className="mt-1 text-muted-foreground">
                2nd tone before a 4th (一个 yí ge), 4th tone before others (一起 yì qǐ). Counting
                and dates keep yī.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="train" className="mt-10">
        <h2
          id="train"
          className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Train your ear
        </h2>
        <ToneTrainer data={data} />
        <p className="mt-4 text-xs text-muted-foreground">
          {data.singles.length} single syllables, {data.pairs.length} two-syllable words and{' '}
          {data.groups.length} same-sound groups from your library. Characters with more than one
          pronunciation are left out so the audio always matches the answer. Keys: 1–5 answer · R
          replay · Backspace clears a pair.
        </p>
      </section>
    </div>
  );
}
