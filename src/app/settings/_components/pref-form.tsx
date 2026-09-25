'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleSwitch } from '@/components/ui/chip';
import { updateSettings } from '@/lib/actions/settings';

type Props = {
  initial: {
    dailyNewLimit: number;
    dailyReviewLimit: number;
    retentionTarget: number;
    listeningEnabled: boolean;
    productionEnabled: boolean;
    dailyGoal: number;
    newWordsFrom: 'path' | 'queue';
  };
};

export function StudyPrefForm({ initial }: Props) {
  const [newLimit, setNewLimit] = useState(initial.dailyNewLimit);
  const [reviewLimit, setReviewLimit] = useState(initial.dailyReviewLimit);
  const [retention, setRetention] = useState(Math.round(initial.retentionTarget * 100));
  const [listening, setListening] = useState(initial.listeningEnabled);
  const [production, setProduction] = useState(initial.productionEnabled);
  const [goal, setGoal] = useState(initial.dailyGoal);
  const [fromPath, setFromPath] = useState(initial.newWordsFrom === 'path');
  const [pending, startTransition] = useTransition();

  function save(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const { saved } = await updateSettings({
          dailyNewLimit: newLimit,
          dailyReviewLimit: reviewLimit,
          retentionTarget: retention / 100,
          listeningEnabled: listening,
          productionEnabled: production,
          dailyGoal: goal,
          newWordsFrom: fromPath ? 'path' : 'queue',
        });
        // Show what was actually stored (out-of-range values are clamped).
        if (saved.dailyNewLimit != null) setNewLimit(saved.dailyNewLimit);
        if (saved.dailyGoal != null) setGoal(saved.dailyGoal);
        if (saved.dailyReviewLimit != null) setReviewLimit(saved.dailyReviewLimit);
        if (saved.retentionTarget != null) setRetention(Math.round(saved.retentionTarget * 100));
        toast.success('Settings saved.');
      } catch {
        toast.error('Could not save settings. Try again.');
      }
    });
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <PrefRow
        id="pref-goal"
        label="Daily goal"
        desc="How many cards you aim to review each day (0 turns the goal off). Shown on the home page."
      >
        <Input
          type="number"
          min={0}
          max={500}
          id="pref-goal"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value) || 0)}
          className="w-24"
        />
      </PrefRow>
      <PrefRow
        id="pref-new"
        label="Daily new cards"
        desc="How many brand-new cards to introduce per day."
      >
        <Input
          type="number"
          min={0}
          max={200}
          id="pref-new"
          value={newLimit}
          onChange={(e) => setNewLimit(Number(e.target.value) || 0)}
          className="w-24"
        />
      </PrefRow>
      <PrefRow
        id="pref-review"
        label="Daily review cap"
        desc="Maximum review cards per day (learning cards ignore this)."
      >
        <Input
          type="number"
          min={0}
          max={2000}
          id="pref-review"
          value={reviewLimit}
          onChange={(e) => setReviewLimit(Number(e.target.value) || 0)}
          className="w-24"
        />
      </PrefRow>
      <PrefRow
        id="pref-retention"
        label="Target retention"
        desc="What share of reviews you want to answer correctly. 90% is the standard target for FSRS (the spaced-repetition scheduler that decides when to show cards)."
      >
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={70}
            max={99}
            id="pref-retention"
            value={retention}
            onChange={(e) => setRetention(Number(e.target.value) || 90)}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </PrefRow>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">New HSK words come from Learn</div>
          <p className="text-xs text-muted-foreground">
            On: Study only reviews HSK words once a Learn lesson has taught them (words you add
            yourself and scenario sentences still come through). Off: Study introduces any new card,
            up to the daily new-card limit.
          </p>
        </div>
        <ToggleSwitch
          value={fromPath}
          onChange={setFromPath}
          label="New HSK words come from Learn"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">Listening cards</div>
          <p className="text-xs text-muted-foreground">
            Once a word or sentence graduates to long-term review, add a card that plays the audio
            and asks for the meaning. Words that share a sound (他/她/它) are played in context, and
            the answer lists every word that sounds the same.
          </p>
        </div>
        <ToggleSwitch value={listening} onChange={setListening} label="Listening cards" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">Production cards</div>
          <p className="text-xs text-muted-foreground">
            Once a word graduates, add a card that shows the English and asks you to produce the
            Chinese — say it aloud, or type the pinyin to have it checked.
          </p>
        </div>
        <ToggleSwitch value={production} onChange={setProduction} label="Production cards" />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}

function PrefRow({
  id,
  label,
  desc,
  children,
}: {
  id: string;
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}
