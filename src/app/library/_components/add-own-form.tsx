'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { addCustomItem, suggestFor } from '@/lib/actions/custom';

/**
 * Add your own word or sentence. Typing a word's characters fills in pinyin
 * and meaning from the dictionary when it knows the word; you can edit both.
 */
export function AddOwnForm() {
  const [kind, setKind] = useState<'word' | 'sentence'>('word');
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaning, setMeaning] = useState('');
  const [note, setNote] = useState('');
  const [pending, startTransition] = useTransition();

  function autofill() {
    if (kind !== 'word' || !hanzi.trim() || (pinyin && meaning)) return;
    startTransition(async () => {
      const s = await suggestFor(hanzi);
      if (!s) return;
      setPinyin((p) => p || s.pinyin);
      setMeaning((m) => m || s.meaning);
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await addCustomItem({ kind, hanzi, pinyin, meaning, note });
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      setHanzi('');
      setPinyin('');
      setMeaning('');
      setNote('');
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-border/60 bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Add your own</h2>
        <div className="flex gap-1.5" role="radiogroup" aria-label="What are you adding?">
          <Chip selected={kind === 'word'} onClick={() => setKind('word')}>
            Word
          </Chip>
          <Chip selected={kind === 'sentence'} onClick={() => setKind('sentence')}>
            Sentence
          </Chip>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-xs text-muted-foreground">
          Chinese
          <Input
            lang="zh-Hans"
            value={hanzi}
            onChange={(e) => setHanzi(e.target.value)}
            onBlur={autofill}
            placeholder={kind === 'word' ? '酒店' : '我住在这个酒店。'}
            className="text-base text-foreground"
            required
          />
        </label>
        <label className="space-y-1 text-xs text-muted-foreground">
          Pinyin <span className="opacity-70">(tone numbers are fine: jiu3 dian4)</span>
          <Input
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            placeholder={kind === 'word' ? 'jiǔdiàn' : 'wǒ zhù zài zhège jiǔdiàn.'}
            className="text-foreground"
            required
          />
        </label>
        <label className="space-y-1 text-xs text-muted-foreground sm:col-span-2">
          Meaning
          <Input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder={kind === 'word' ? 'hotel' : "I'm staying at this hotel."}
            className="text-foreground"
            required
          />
        </label>
        <label className="space-y-1 text-xs text-muted-foreground sm:col-span-2">
          Note <span className="opacity-70">(optional — shown with the answer when you study)</span>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. heard this at the hotel front desk"
            className="text-foreground"
          />
        </label>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {kind === 'word'
            ? 'Pinyin and meaning fill in from the dictionary when you leave the Chinese box.'
            : 'Words in the sentence that are in your library get queued first, like scenarios.'}
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? 'Adding…' : 'Add to study'}
        </Button>
      </div>
    </form>
  );
}
