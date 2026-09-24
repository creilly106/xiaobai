import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { digitsToChinese } from '@/lib/numbers';
import { Converter, Drill, Example, SpeakTile } from './_components/number-tools';

export const metadata: Metadata = { title: 'Numbers' };

function Rule({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="gap-2">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">{children}</CardContent>
    </Card>
  );
}

export default function NumbersPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Numbers <span lang="zh-Hans">数字</span>{' '}
        <span className="text-base font-normal text-muted-foreground">shùzì</span>
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Eleven words, four big units (百 千 万 亿) and a handful of rules take
        you past a billion. Click any number to hear it.
      </p>

      <section aria-labelledby="basics" className="mt-8">
        <h2 id="basics" className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          The basics: 0–10
        </h2>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
          {Array.from({ length: 11 }, (_, n) => (
            <SpeakTile key={n} n={n} />
          ))}
        </div>
      </section>

      <section aria-labelledby="rules" className="mt-10">
        <h2 id="rules" className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Building bigger numbers
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Rule title="11–99: say it like maths">
            <p className="text-muted-foreground">
              Tens are &ldquo;digit × ten&rdquo;, then add the units. Teens skip the
              leading 一.
            </p>
            <ul className="divide-y divide-border/50">
              <Example n={11} note="ten-one" />
              <Example n={20} note="two-ten" />
              <Example n={37} note="three-ten-seven" />
              <Example n={99} />
            </ul>
          </Rule>
          <Rule title="百 hundreds and 千 thousands">
            <p className="text-muted-foreground">
              Same pattern with bigger units. Inside a larger number, 10 is
              said in full as 一十.
            </p>
            <ul className="divide-y divide-border/50">
              <Example n={100} />
              <Example n={115} note="一十 in the middle" />
              <Example n={3480} />
              <Example n={9999} />
            </ul>
          </Rule>
          <Rule title="零 fills gaps">
            <p className="text-muted-foreground">
              When a place in the middle is empty, say 零 once — however many
              zeros there are. Zeros at the end are silent.
            </p>
            <ul className="divide-y divide-border/50">
              <Example n={105} />
              <Example n={1005} note="two zeros, one 零" />
              <Example n={1050} />
              <Example n={1500} note="no 零 at the end" />
            </ul>
          </Rule>
          <Rule title="两 vs 二 (both mean two)">
            <p className="text-muted-foreground">
              Count with 二 (一、二、三) and in 十-numbers (二十, 十二). Before 百, 千,
              万 and 亿 — and before measure words (两个人) — people say 两.
              二百 and 二千 aren&apos;t wrong, just more formal.
            </p>
            <ul className="divide-y divide-border/50">
              <Example n={2} />
              <Example n={22} />
              <Example n={200} />
              <Example n={2222} />
            </ul>
          </Rule>
          <Rule title="万: groups of four, not three">
            <p className="text-muted-foreground">
              English groups digits in threes (thousand, million). Chinese uses
              万 = 10,000 and 亿 = 100,000,000. A million is &ldquo;one hundred
              ten-thousands&rdquo;.
            </p>
            <ul className="divide-y divide-border/50">
              <Example n={10_000} />
              <Example n={100_000} note="ten 万" />
              <Example n={1_000_000} note="a million" />
              <Example n={100_000_000} note="one 亿" />
            </ul>
            <p className="text-xs text-muted-foreground">
              Tip: put the commas every 4 digits (1,0000,0000) and read each
              group, adding 万 or 亿.
            </p>
          </Rule>
          <Rule title="Digit by digit: years, phones, rooms">
            <p className="text-muted-foreground">
              Years and codes are read one digit at a time, with 年 (year) after a year. On the
              phone, 一 becomes 幺 (yāo) so it isn&apos;t confused with 七.
            </p>
            <ul className="space-y-1.5 py-1">
              <li className="flex flex-wrap items-baseline gap-x-3">
                <span className="w-20 text-right font-mono text-sm text-muted-foreground">2026</span>
                <span lang="zh-Hans" className="text-lg">
                  {digitsToChinese('2026')}年
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-x-3">
                <span className="w-20 text-right font-mono text-sm text-muted-foreground">room 501</span>
                <span lang="zh-Hans" className="text-lg">
                  {digitsToChinese('501', { phone: true })}
                </span>
              </li>
              <li className="flex flex-wrap items-baseline gap-x-3">
                <span className="w-20 text-right font-mono text-sm text-muted-foreground">110</span>
                <span lang="zh-Hans" className="text-lg">
                  {digitsToChinese('110', { phone: true })}
                </span>
                <span className="text-xs text-muted-foreground">police</span>
              </li>
            </ul>
          </Rule>
        </div>
      </section>

      <section aria-labelledby="practice" className="mt-10">
        <h2 id="practice" className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Practice
        </h2>
        <Drill />
      </section>

      <section aria-labelledby="convert" className="mt-10">
        <h2 id="convert" className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Converter
        </h2>
        <Card>
          <CardContent>
            <Converter />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
