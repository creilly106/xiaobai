import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CharacterInfo } from '@/lib/queries/characters';

/** Shown when the character is itself a radical or one of its component forms. */
export function RadicalCard({ info }: { info: CharacterInfo }) {
  const { radical, form } = info.asRadical!;
  return (
    <Card className="mt-6 border-primary/30">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">{form ? 'Radical form' : 'Radical'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {form ? (
          <p>
            <span lang="zh-Hans" className="text-lg font-medium">
              {form.char}
            </span>{' '}
            is how{' '}
            <Link href="/radicals" className="underline hover:text-primary">
              radical #{radical.number} <span lang="zh-Hans">{radical.hanzi}</span> (
              {radical.meaning})
            </Link>{' '}
            is written inside other characters — {form.position}.
          </p>
        ) : (
          <p>
            <span lang="zh-Hans" className="text-lg font-medium">
              {info.hanzi}
            </span>{' '}
            is{' '}
            <Link href="/radicals" className="underline hover:text-primary">
              Kangxi radical #{radical.number}
            </Link>{' '}
            — {radical.meaning} ({radical.pinyin}). It&apos;s one of the building blocks other
            characters are made from.
          </p>
        )}
        {!form && radical.forms && radical.forms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {radical.forms.map((f) => (
              <div
                key={f.char}
                className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
              >
                <span lang="zh-Hans" className="text-3xl leading-none text-primary">
                  {f.char}
                </span>
                <span className="text-xs text-muted-foreground">
                  Form inside characters
                  <span className="block text-foreground">{f.position}</span>
                </span>
              </div>
            ))}
          </div>
        )}
        {radical.kangxi && radical.kangxi !== info.hanzi && (
          <p className="text-xs text-muted-foreground">
            Traditional form: <span lang="zh-Hant">{radical.kangxi}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
