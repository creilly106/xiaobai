'use client';

import { useState, useTransition } from 'react';
import { Check, Eye, EyeOff, Headphones, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AudioButton } from '@/components/audio-button';
import { Pinyin } from '@/components/pinyin';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addScenarioDialogue, removeScenarioDialogue } from '@/lib/actions/scenario';
import { speak } from '@/lib/tts';
import { useConfirmTap } from '@/lib/use-confirm-tap';
import type { DialogueLine } from '@/lib/curriculum';
import type { Dictionary } from '@/lib/queries/dictionary';
import { DialogueListen, type PoolLine } from './dialogue-listen';

/**
 * A scenario conversation as chat bubbles. "Your turn" hides your lines so
 * you can say them first, then tap to check; "Listen" plays it through with
 * the text hidden, then asks what you understood.
 */
export function DialogueCard({
  slug,
  index,
  title,
  lines,
  pool,
  inQueue,
  dict,
}: {
  slug: string;
  index: number;
  title: string;
  lines: DialogueLine[];
  /** Other lines from the scenario, for wrong options in listening questions. */
  pool: PoolLine[];
  inQueue: boolean;
  dict: Dictionary;
}) {
  const [mode, setMode] = useState<'read' | 'turn' | 'listen'>('read');
  const practice = mode === 'turn';
  const [shown, setShown] = useState<Set<number>>(new Set());
  const [english, setEnglish] = useState(true);
  const [added, setAdded] = useState(inQueue);
  const [pending, startTransition] = useTransition();

  const confirm = useConfirmTap();

  function remove() {
    confirm.disarm();
    startTransition(async () => {
      try {
        const { removed } = await removeScenarioDialogue(slug, index);
        setAdded(false);
        toast.success(`Removed ${removed} line${removed === 1 ? '' : 's'} from your study queue.`);
      } catch {
        toast.error("Couldn't remove this dialogue.");
      }
    });
  }

  function add() {
    startTransition(async () => {
      try {
        const { created } = await addScenarioDialogue(slug, index);
        setAdded(true);
        toast.success(
          created > 0
            ? `Added ${created} line${created === 1 ? '' : 's'} to your study queue.`
            : 'Already in your queue.',
        );
      } catch {
        toast.error("Couldn't add this dialogue.");
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={mode === 'listen' ? 'default' : 'outline'}
            onClick={() => setMode(mode === 'listen' ? 'read' : 'listen')}
            aria-pressed={mode === 'listen'}
          >
            <Headphones /> Listen
          </Button>
          <Button
            type="button"
            size="sm"
            variant={practice ? 'default' : 'outline'}
            onClick={() => {
              setMode(practice ? 'read' : 'turn');
              setShown(new Set());
            }}
            aria-pressed={practice}
          >
            Your turn
          </Button>
          {mode !== 'listen' && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEnglish(!english)}
              aria-pressed={english}
            >
              {english ? <EyeOff /> : <Eye />} {english ? 'Hide' : 'Show'} English
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {mode === 'listen' ? (
          <DialogueListen
            slug={slug}
            lines={lines}
            pool={pool}
            dict={dict}
            onExit={() => setMode('read')}
          />
        ) : (
          <>
            {practice && (
              <p className="text-xs text-muted-foreground">
                Say your lines out loud first, then tap to check and hear them.
              </p>
            )}
            {lines.map((line, i) => {
              const you = line.speaker === 'you';
              const hidden = practice && you && !shown.has(i);
              return (
                <div key={i} className={`flex ${you ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${
                      you ? 'rounded-br-sm bg-primary/10' : 'rounded-bl-sm bg-muted'
                    }`}
                  >
                    <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {you ? 'You' : 'Them'}
                    </div>
                    {hidden ? (
                      <button
                        type="button"
                        onClick={() => {
                          setShown(new Set(shown).add(i));
                          // Hear it said right after saying it yourself.
                          speak(line.hanzi);
                        }}
                        className="py-1 text-left text-sm text-primary underline-offset-4 hover:underline"
                      >
                        {english ? `“${line.meaning}” — tap to check` : 'Your line — tap to check'}
                      </button>
                    ) : (
                      <div className="flex items-start gap-1">
                        <div className="min-w-0">
                          <div lang="zh-Hans" className="text-lg leading-snug">
                            <TokenizedHanzi hanzi={line.hanzi} dict={dict} />
                          </div>
                          <Pinyin
                            text={line.pinyin}
                            className="block text-xs text-muted-foreground"
                          />
                          {english && <div className="text-sm">{line.meaning}</div>}
                        </div>
                        <AudioButton text={line.hanzi} label={`Play ${line.hanzi}`} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div className="flex justify-end pt-1">
          {added && confirm.isArmed() ? (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={remove}
              disabled={pending}
            >
              Remove from study? (clears its review history)
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={added ? () => confirm.arm() : add}
              disabled={pending}
              title={added ? 'Tap to take this dialogue out of study' : undefined}
            >
              {added ? <Check /> : <Plus />}
              {added ? 'In your queue' : 'Add dialogue to study'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
