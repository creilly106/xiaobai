'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chip, ToggleSwitch } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';

type Props = {
  scenarios: { slug: string; name: string }[];
  hskLevels: number[];
};

type ItemType = 'both' | 'word' | 'sentence';

export function QuizForm({ scenarios, hskLevels }: Props) {
  const router = useRouter();
  const [itemType, setItemType] = useState<ItemType>('both');
  const [selectedHsk, setSelectedHsk] = useState<Set<number>>(new Set());
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());
  const [srsMode, setSrsMode] = useState(false);
  const [pinyinFront, setPinyinFront] = useState(false);
  const [count, setCount] = useState<number>(10);
  const [format, setFormat] = useState<'cards' | 'cloze'>('cards');
  const [answerMode, setAnswerMode] = useState<'choose' | 'type'>('choose');
  const [includeScenarioSentences, setIncludeScenarioSentences] = useState(true);
  const [includeGrammar, setIncludeGrammar] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [knownOnly, setKnownOnly] = useState(false);

  function toggle<T>(set: Set<T>, val: T) {
    const next = new Set(set);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    return next;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (format === 'cloze') {
      params.set('answer', answerMode);
      params.set('count', String(Math.max(1, Math.min(count, 50))));
      if (includeScenarioSentences) {
        params.set('scen', '1');
        if (selectedScenarios.size > 0)
          params.set('scenarios', Array.from(selectedScenarios).join(','));
      }
      if (includeGrammar) params.set('grammar', '1');
      if (includeExamples) params.set('examples', '1');
      if (knownOnly) params.set('known', '1');
      router.push(`/quiz/cloze?${params.toString()}`);
      return;
    }
    params.set('type', itemType);
    params.set('count', String(Math.max(1, Math.min(count, 100))));
    if (selectedHsk.size > 0) {
      params.set('hsk', Array.from(selectedHsk).join(','));
    }
    if (selectedScenarios.size > 0) {
      params.set('scenarios', Array.from(selectedScenarios).join(','));
    }
    if (selectedStates.size > 0) {
      params.set('states', Array.from(selectedStates).join(','));
    }
    if (srsMode) params.set('srs', '1');
    if (pinyinFront) params.set('pinyinFront', '1');
    router.push(`/quiz/session?${params.toString()}`);
  }

  function startPreset(query: Record<string, string>) {
    const p = new URLSearchParams(query);
    router.push(`/quiz/session?${p.toString()}`);
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="size-4" />
              Refresher
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Spot-check 10 mature cards (graduated review-state) you haven&apos;t seen in a few
              days. Practice only — nothing changes in your queue.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              startPreset({
                type: 'both',
                states: 'review',
                olderThanDays: '3',
                count: '10',
              })
            }
          >
            Start refresher
          </Button>
        </div>
      </div>

      <div role="radiogroup" aria-label="Quiz format" className="grid gap-2 sm:grid-cols-2">
        {(
          [
            {
              key: 'cards',
              label: 'Flashcards',
              desc: 'See the Chinese, recall the meaning, rate yourself.',
            },
            {
              key: 'cloze',
              label: 'Fill in the blank',
              desc: 'A word is missing from a sentence — pick it or type its pinyin.',
            },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            type="button"
            role="radio"
            aria-checked={format === f.key}
            onClick={() => setFormat(f.key)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              format === f.key
                ? 'border-primary bg-primary/10'
                : 'border-border/70 hover:bg-muted/50'
            }`}
          >
            <div className="font-medium">{f.label}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
          </button>
        ))}
      </div>

      {format === 'cloze' && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Answer by</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Chip selected={answerMode === 'choose'} onClick={() => setAnswerMode('choose')}>
                Choosing the characters
              </Chip>
              <Chip selected={answerMode === 'type'} onClick={() => setAnswerMode('type')}>
                Typing pinyin (on-screen keyboard)
              </Chip>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sentences from</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Chip
                  selected={includeScenarioSentences}
                  onClick={() => setIncludeScenarioSentences(!includeScenarioSentences)}
                >
                  Scenarios
                </Chip>
                <Chip selected={includeGrammar} onClick={() => setIncludeGrammar(!includeGrammar)}>
                  Grammar examples
                </Chip>
                <Chip
                  selected={includeExamples}
                  onClick={() => setIncludeExamples(!includeExamples)}
                  title="Real sentences from Tatoeba using your vocabulary"
                >
                  Example sentences
                </Chip>
              </div>
              {includeScenarioSentences && scenarios.length > 0 && (
                <div>
                  <div className="mb-1.5 text-xs text-muted-foreground">
                    Only these scenarios (none picked = all):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scenarios.map((s) => (
                      <Chip
                        key={s.slug}
                        selected={selectedScenarios.has(s.slug)}
                        onClick={() => setSelectedScenarios(toggle(selectedScenarios, s.slug))}
                      >
                        {s.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <ToggleRow
            label="Only blank words I've studied"
            desc="Tests words you've already met in Study. Off: any word can be the blank (studied ones are still picked more often)."
            value={knownOnly}
            onChange={setKnownOnly}
          />
        </>
      )}

      {format === 'cards' && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Item type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(['both', 'word', 'sentence'] as const).map((v) => (
                  <Chip key={v} selected={itemType === v} onClick={() => setItemType(v)}>
                    {v === 'both'
                      ? 'Words + sentences'
                      : v === 'word'
                        ? 'Words only'
                        : 'Sentences only'}
                  </Chip>
                ))}
              </div>
            </CardContent>
          </Card>

          {itemType !== 'sentence' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  HSK levels{' '}
                  <span className="text-xs font-normal text-muted-foreground">(empty = any)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hskLevels.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No HSK data yet. Add HSK 1 from the home page.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {hskLevels.map((lvl) => (
                      <Chip
                        key={lvl}
                        selected={selectedHsk.has(lvl)}
                        onClick={() => setSelectedHsk(toggle(selectedHsk, lvl))}
                      >
                        HSK {lvl}
                      </Chip>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {itemType !== 'word' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Scenarios{' '}
                  <span className="text-xs font-normal text-muted-foreground">(empty = any)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scenarios.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No scenarios seeded.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {scenarios.map((s) => (
                      <Chip
                        key={s.slug}
                        selected={selectedScenarios.has(s.slug)}
                        onClick={() => setSelectedScenarios(toggle(selectedScenarios, s.slug))}
                      >
                        {s.name}
                      </Chip>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Card states{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  (only counts items already in your study queue)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { key: 'new', label: 'New', hint: 'never seen yet' },
                    { key: 'learning', label: 'Learning', hint: 'in short-interval steps' },
                    { key: 'review', label: 'Review', hint: 'graduated, long-term' },
                    { key: 'relearning', label: 'Relearning', hint: 'failed, being re-taught' },
                  ] as const
                ).map((s) => (
                  <Chip
                    key={s.key}
                    selected={selectedStates.has(s.key)}
                    onClick={() => setSelectedStates(toggle(selectedStates, s.key))}
                    title={s.hint}
                  >
                    {s.label}{' '}
                    <span className="ml-1 text-[10px] font-normal opacity-70">({s.hint})</span>
                  </Chip>
                ))}
              </div>
            </CardContent>
          </Card>

          <ToggleRow
            label="Update spaced-repetition memory"
            desc="When on, your Missed/Hard/Got it/Easy taps update the scheduler (FSRS) — so this drill also becomes real study. Otherwise it's practice only. Requires a card-states filter above so the items are already in your queue."
            value={srsMode}
            onChange={setSrsMode}
          />

          <ToggleRow
            label="Show pinyin on front"
            desc="Reveal the pronunciation before you flip. Useful for meaning-only drills."
            value={pinyinFront}
            onChange={setPinyinFront}
          />
        </>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">How many?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {[5, 10, 20, 50].map((n) => (
              <Chip key={n} selected={count === n} onClick={() => setCount(n)}>
                {n}
              </Chip>
            ))}
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Start quiz
        </Button>
      </div>
    </form>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ToggleSwitch value={value} onChange={onChange} label={label} />
    </div>
  );
}
