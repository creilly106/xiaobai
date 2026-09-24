import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioButton } from '@/components/audio-button';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { tatoebaUrl, type Example } from '@/lib/examples';
import type { Dictionary } from '@/lib/queries/dictionary';

/** Real sentences using the word, with audio and hover glosses. */
export function ExamplesCard({
  hanzi,
  examples,
  dict,
}: {
  hanzi: string;
  examples: Example[];
  dict: Dictionary;
}) {
  if (examples.length === 0) return null;
  return (
    <Card className="mt-6">
      <CardHeader className="pb-1">
        <CardTitle className="text-base">
          <span lang="zh-Hans">{hanzi}</span> in a sentence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border/60">
          {examples.map((ex) => (
            <li key={ex.zh} className="flex items-start gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <div lang="zh-Hans" className="text-xl">
                  <TokenizedHanzi hanzi={ex.zh} dict={dict} />
                </div>
                <div className="text-sm text-muted-foreground">{ex.en}</div>
              </div>
              <AudioButton text={ex.zh} label={`Play ${ex.zh}`} />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Sentences from{' '}
          <a
            href={tatoebaUrl(examples[0]) ?? 'https://tatoeba.org'}
            className="underline hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            Tatoeba
          </a>{' '}
          (CC BY 2.0 FR). Hover a word for its meaning.
        </p>
      </CardContent>
    </Card>
  );
}
