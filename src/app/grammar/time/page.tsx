import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AudioButton } from '@/components/audio-button';
import { Pinyin } from '@/components/pinyin';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { Card, CardContent } from '@/components/ui/card';
import { grammarPoints, type TimeFrame } from '@/lib/grammar-data';
import { getDictionaryFor } from '@/lib/queries/dictionary';

export const metadata: Metadata = { title: 'Talking about time · Grammar' };

/** One verb (吃, to eat) in every time frame, each linked to its pattern. */
const ONE_VERB: { label: string; hanzi: string; pinyin: string; meaning: string; slug: string }[] =
  [
    {
      label: 'In general',
      hanzi: '我吃米饭。',
      pinyin: 'wǒ chī mǐfàn.',
      meaning: 'I eat rice.',
      slug: 'basic-svo',
    },
    {
      label: 'Right now',
      hanzi: '我在吃饭。',
      pinyin: 'wǒ zài chī fàn.',
      meaning: "I'm eating.",
      slug: 'zai-progressive',
    },
    {
      label: 'Done',
      hanzi: '我吃了一碗米饭。',
      pinyin: 'wǒ chī le yì wǎn mǐfàn.',
      meaning: 'I ate a bowl of rice.',
      slug: 'le-completion',
    },
    {
      label: 'Did you…?',
      hanzi: '你吃饭了吗？',
      pinyin: 'nǐ chī fàn le ma?',
      meaning: 'Have you eaten?',
      slug: 'le-questions',
    },
    {
      label: "Didn't",
      hanzi: '我没吃饭。',
      pinyin: 'wǒ méi chī fàn.',
      meaning: "I didn't eat. / I haven't eaten.",
      slug: 'past-negation',
    },
    {
      label: 'Already',
      hanzi: '我已经吃了。',
      pinyin: 'wǒ yǐjīng chī le.',
      meaning: "I've already eaten.",
      slug: 'yijing-le',
    },
    {
      label: 'Ever',
      hanzi: '我吃过北京烤鸭。',
      pinyin: 'wǒ chī guo Běijīng kǎoyā.',
      meaning: "I've had Peking duck (before).",
      slug: 'guo-experience',
    },
    {
      label: 'About to',
      hanzi: '我要吃饭了。',
      pinyin: 'wǒ yào chī fàn le.',
      meaning: "I'm about to eat.",
      slug: 'kuai-le',
    },
    {
      label: 'Future',
      hanzi: '我明天吃中国菜。',
      pinyin: 'wǒ míngtiān chī Zhōngguó cài.',
      meaning: "I'll have Chinese food tomorrow.",
      slug: 'future-yao-hui',
    },
    {
      label: 'Where / when it happened',
      hanzi: '我是在家吃的。',
      pinyin: 'wǒ shì zài jiā chī de.',
      meaning: 'I ate at home (that’s where).',
      slug: 'shi-de',
    },
  ];

const FRAMES: { frame: TimeFrame; title: string; blurb: string }[] = [
  { frame: 'basics', title: 'The basics', blurb: 'Time words go before the verb.' },
  { frame: 'past', title: 'The past', blurb: 'Did it happen, did it not, and asking about it.' },
  { frame: 'now', title: 'Happening now', blurb: 'Actions in progress and ongoing states.' },
  {
    frame: 'future',
    title: 'The future',
    blurb: 'Plans, predictions, and things about to happen.',
  },
  { frame: 'experience', title: 'Ever done it?', blurb: 'Experience, whenever it was.' },
  { frame: 'change', title: 'Things changing', blurb: 'A new situation compared to before.' },
];

export default async function TimeGuidePage() {
  const dict = await getDictionaryFor(ONE_VERB.map((r) => r.hanzi));
  const bySlug = new Map(grammarPoints.map((p) => [p.slug, p]));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href="/grammar" className="hover:underline">
          Grammar
        </Link>{' '}
        / Talking about time
      </div>
      <h1 className="text-2xl font-semibold">Talking about time</h1>
      <div className="mt-3 space-y-2 leading-relaxed">
        <p>
          Chinese verbs never change: <span lang="zh-Hans">吃</span> is &ldquo;eat&rdquo;,
          &ldquo;ate&rdquo;, &ldquo;eating&rdquo; and &ldquo;will eat&rdquo;. There are no tenses.
          Instead, time comes from three things:
        </p>
        <ul className="list-disc space-y-1 pl-6 text-sm">
          <li>
            <strong>Time words</strong> before the verb — <span lang="zh-Hans">昨天</span>{' '}
            yesterday, <span lang="zh-Hans">明天</span> tomorrow, <span lang="zh-Hans">现在</span>{' '}
            now.
          </li>
          <li>
            <strong>Helpers before the verb</strong> — <span lang="zh-Hans">在</span> (doing it),{' '}
            <span lang="zh-Hans">要 / 会</span> (going to), <span lang="zh-Hans">没</span>{' '}
            (didn&apos;t).
          </li>
          <li>
            <strong>Markers after it</strong> — <span lang="zh-Hans">了</span> (done, or a change),{' '}
            <span lang="zh-Hans">过</span> (ever), <span lang="zh-Hans">着</span> (ongoing state).
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Often a time word is enough on its own: <span lang="zh-Hans">我昨天去北京</span> is
          already clearly in the past.
        </p>
      </div>

      <h2 className="mt-8 mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        One verb, every time
      </h2>
      <Card>
        <CardContent className="divide-y divide-border/60 p-0">
          {ONE_VERB.map((row) => (
            <div key={row.hanzi} className="flex items-start gap-3 px-4 py-3">
              <div className="w-24 shrink-0 pt-1 text-xs font-medium text-muted-foreground sm:w-32">
                {row.label}
              </div>
              <div className="min-w-0 flex-1">
                <div lang="zh-Hans" className="text-xl">
                  <TokenizedHanzi hanzi={row.hanzi} dict={dict} />
                </div>
                <Pinyin text={row.pinyin} className="block text-sm text-muted-foreground" />
                <div className="text-sm">
                  {row.meaning}{' '}
                  {bySlug.has(row.slug) && (
                    <Link
                      href={`/grammar/${row.slug}`}
                      className="whitespace-nowrap text-xs text-primary underline-offset-4 hover:underline"
                    >
                      How it works →
                    </Link>
                  )}
                </div>
              </div>
              <AudioButton text={row.hanzi} label={`Play ${row.hanzi}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {FRAMES.map(({ frame, title, blurb }) => {
        const points = grammarPoints.filter((p) => p.time === frame);
        if (points.length === 0) return null;
        return (
          <section key={frame} className="mt-8">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{blurb}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {points.map((p) => (
                <Link key={p.slug} href={`/grammar/${p.slug}`} className="group">
                  <Card className="h-full transition-colors group-hover:border-primary/60">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div lang="zh-Hans" className="font-medium">
                          {p.name}
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm text-muted-foreground">{p.englishTitle}</div>
                      <div className="mt-1 text-sm">
                        <span lang="zh-Hans">{p.examples[0]?.hanzi}</span>{' '}
                        <span className="text-muted-foreground">— {p.examples[0]?.meaning}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
