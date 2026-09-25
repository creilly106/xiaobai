'use client';

import { useState, useTransition } from 'react';
import { Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AudioButton } from '@/components/audio-button';
import { Pinyin } from '@/components/pinyin';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { Button } from '@/components/ui/button';
import { addScenarioSentence } from '@/lib/actions/scenario';
import type { Dictionary } from '@/lib/queries/dictionary';

export type PhraseVersion = {
  label: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  /** In the database (so it can be studied). */
  studyable: boolean;
  inQueue: boolean;
};

/** A scenario phrase; when it has time variants, chips switch between them. */
export function PhraseRow({
  slug,
  versions,
  difficulty,
  dict,
}: {
  slug: string;
  versions: PhraseVersion[];
  difficulty: number | null;
  dict: Dictionary;
}) {
  const [selected, setSelected] = useState(0);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const v = versions[selected];
  const inQueue = v.inQueue || added.has(v.hanzi);

  function add() {
    startTransition(async () => {
      try {
        const { created } = await addScenarioSentence(slug, v.hanzi);
        setAdded(new Set(added).add(v.hanzi));
        toast.success(
          created > 0 ? `Added “${v.hanzi}” to your study queue.` : 'Already in your queue.',
        );
      } catch {
        toast.error("Couldn't add that sentence.");
      }
    });
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        {versions.length > 1 && (
          <div role="tablist" aria-label="Time" className="mb-1.5 flex flex-wrap gap-1">
            {versions.map((ver, i) => (
              <button
                key={ver.hanzi}
                type="button"
                role="tab"
                aria-selected={i === selected}
                onClick={() => setSelected(i)}
                className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                  i === selected
                    ? 'border-primary bg-primary/10 font-medium text-foreground'
                    : 'border-border text-muted-foreground hover:bg-muted/60'
                }`}
              >
                {ver.label}
              </button>
            ))}
          </div>
        )}
        <div lang="zh-Hans" className="text-xl leading-relaxed">
          <TokenizedHanzi hanzi={v.hanzi} dict={dict} />
        </div>
        <Pinyin text={v.pinyin} className="mt-0.5 block text-sm text-muted-foreground" />
        <div className="mt-0.5 text-sm">{v.meaning}</div>
        <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {difficulty != null && (
            <span title="Approximate difficulty on the HSK scale">≈ HSK {difficulty}</span>
          )}
          {inQueue && (
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              In your queue
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <AudioButton text={v.hanzi} />
        {v.studyable && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={add}
            disabled={pending || inQueue}
            aria-label={inQueue ? 'In your study queue' : `Add “${v.hanzi}” to study`}
            title={inQueue ? 'In your study queue' : 'Add to study'}
          >
            {inQueue ? <Check /> : <Plus />}
          </Button>
        )}
      </div>
    </div>
  );
}
