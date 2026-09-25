'use client';

import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AudioButton } from '@/components/audio-button';
import { Pinyin } from '@/components/pinyin';
import { PinyinKeyboard } from '@/components/pinyin-keyboard';
import { WordTools } from '@/components/card-parts/word-tools';
import { audioFor } from '@/lib/audio-text';
import { gradeWord } from '@/lib/meaning-grade';
import { EMPTY_DRAFT, draftIsEmpty, gradeDraft, type PinyinDraft } from '@/lib/pinyin-draft';
import type { LessonStep, LessonWord, Tile } from '@/lib/path/lesson-builder';
import { isTypingLocked } from '@/lib/typing-lock';
import { speak } from '@/lib/tts';

/** How a question went. `note` explains a near miss; `missed` lists words to count as mistakes. */
export type Answer = { correct: boolean; note?: string; missed?: string[] };

type StepProps<K extends LessonStep['kind']> = {
  step: Extract<LessonStep, { kind: K }>;
  answered: boolean;
  onAnswer: (answer: Answer) => void;
};

export const play = (hanzi: string, pinyin?: string) => speak(audioFor(hanzi, pinyin).text);

function Prompt({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-muted-foreground">{children}</p>;
}

/* ─── Teaching ─────────────────────────────────────────────────────────── */

export function TeachStep({ step }: { step: Extract<LessonStep, { kind: 'teach' }> }) {
  const { word } = step;
  useEffect(() => play(word.hanzi, word.pinyin), [word.hanzi, word.pinyin]);
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Prompt>{step.review ? 'Remember this one?' : 'New word'}</Prompt>
      <div lang="zh-Hans" className="text-7xl font-medium sm:text-8xl">
        {word.hanzi}
      </div>
      <div className="flex items-center gap-1">
        <Pinyin text={word.pinyin} className="text-2xl text-muted-foreground" />
        <AudioButton text={word.hanzi} reading={word.pinyin} />
      </div>
      <div className="max-w-md text-xl">{word.meaning}</div>
      <WordTools key={word.hanzi} hanzi={word.hanzi} />
    </div>
  );
}

export function GrammarStep({ step }: { step: Extract<LessonStep, { kind: 'grammar' }> }) {
  const { point } = step;
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <Prompt>Grammar</Prompt>
      <div>
        <h2 className="text-2xl font-semibold">{point.englishTitle}</h2>
        <p lang="zh-Hans" className="text-muted-foreground">
          {point.name}
        </p>
      </div>
      {point.formula && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 font-medium">
          {point.formula}
        </div>
      )}
      <p className="text-sm leading-relaxed">{point.description}</p>
      <ul className="space-y-2">
        {point.examples.map((ex) => (
          <li key={ex.hanzi} className="flex items-start gap-2 rounded-lg border px-3 py-2">
            <div className="min-w-0 flex-1">
              <div lang="zh-Hans" className="text-xl">
                {ex.hanzi}
              </div>
              <Pinyin text={ex.pinyin} className="text-sm text-muted-foreground" />
              <div className="text-sm">{ex.meaning}</div>
            </div>
            <AudioButton text={ex.hanzi} label={`Play ${ex.hanzi}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Multiple choice ──────────────────────────────────────────────────── */

function useNumberKeys(count: number, enabled: boolean, pick: (i: number) => void) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || isTypingLocked()) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return;
      const i = Number(e.key) - 1;
      if (i >= 0 && i < count) {
        e.preventDefault();
        pick(i);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, enabled, pick]);
}

function OptionButton({
  index,
  state,
  onClick,
  disabled,
  children,
  lang,
}: {
  index: number;
  state: 'idle' | 'right' | 'wrong' | 'dim';
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  lang?: string;
}) {
  const tone = {
    idle: 'border-border hover:border-primary/50 hover:bg-muted/50',
    right: 'border-emerald-500 bg-emerald-500/15',
    wrong: 'border-red-500 bg-red-500/15',
    dim: 'border-border opacity-50',
  }[state];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      lang={lang}
      className={`flex min-h-16 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors disabled:cursor-default ${tone}`}
    >
      <span className="font-mono text-xs text-muted-foreground pointer-coarse:hidden">
        {index + 1}
      </span>
      <span className="flex-1">{children}</span>
    </button>
  );
}

function useChoice(
  answered: boolean,
  onAnswer: (a: Answer) => void,
  isRight: (i: number) => boolean,
) {
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (i: number) => {
    if (answered || picked !== null) return;
    setPicked(i);
    onAnswer({ correct: isRight(i) });
  };
  const stateOf = (i: number): 'idle' | 'right' | 'wrong' | 'dim' =>
    picked === null ? 'idle' : isRight(i) ? 'right' : i === picked ? 'wrong' : 'dim';
  return { pick, stateOf, locked: answered || picked !== null };
}

export function ChooseStep({ step, answered, onAnswer }: StepProps<'choose'>) {
  const { word, options, prompt } = step;
  const { pick, stateOf, locked } = useChoice(
    answered,
    onAnswer,
    (i) => options[i].hanzi === word.hanzi,
  );
  useNumberKeys(options.length, !locked, pick);
  useEffect(() => {
    if (prompt === 'listen') play(word.hanzi, word.pinyin);
  }, [prompt, word.hanzi, word.pinyin]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Prompt>
          {prompt === 'meaning'
            ? 'What does this mean?'
            : prompt === 'hanzi'
              ? 'Which is the Chinese for…'
              : 'What did you hear?'}
        </Prompt>
        {prompt === 'meaning' && (
          <div className="flex items-center gap-2">
            <span lang="zh-Hans" className="text-6xl font-medium">
              {word.hanzi}
            </span>
            <AudioButton text={word.hanzi} reading={word.pinyin} />
          </div>
        )}
        {prompt === 'hanzi' && <div className="text-3xl font-medium">{word.meaning}</div>}
        {prompt === 'listen' && (
          <Button
            type="button"
            variant="outline"
            className="size-20 rounded-full"
            onClick={() => play(word.hanzi, word.pinyin)}
            aria-label="Play again"
          >
            <Volume2 className="size-8" />
          </Button>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => (
          <OptionButton
            key={o.hanzi}
            index={i}
            state={stateOf(i)}
            onClick={() => pick(i)}
            disabled={locked}
            lang={prompt === 'meaning' ? undefined : 'zh-Hans'}
          >
            {prompt === 'meaning' ? o.meaning : <span className="text-2xl">{o.hanzi}</span>}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

export function TranslateStep({ step, answered, onAnswer }: StepProps<'translate'>) {
  const { sentence, options } = step;
  const { pick, stateOf, locked } = useChoice(
    answered,
    onAnswer,
    (i) => options[i] === sentence.meaning,
  );
  useNumberKeys(options.length, !locked, pick);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Prompt>What does this sentence mean?</Prompt>
        <div className="flex items-center gap-2">
          <span lang="zh-Hans" className="text-4xl font-medium">
            {sentence.hanzi}
          </span>
          <AudioButton text={sentence.hanzi} label="Play sentence" />
        </div>
      </div>
      <div className="grid gap-2">
        {options.map((o, i) => (
          <OptionButton
            key={o}
            index={i}
            state={stateOf(i)}
            onClick={() => pick(i)}
            disabled={locked}
          >
            {o}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

export function FillStep({ step, answered, onAnswer }: StepProps<'fill'>) {
  const { sentence, blank, options, word } = step;
  const { pick, stateOf, locked } = useChoice(
    answered,
    onAnswer,
    (i) => options[i].hanzi === word.hanzi,
  );
  useNumberKeys(options.length, !locked, pick);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Prompt>Fill in the blank</Prompt>
        <div lang="zh-Hans" className="text-4xl font-medium leading-relaxed">
          {sentence.tokens.map((t, i) =>
            i === blank ? (
              <span
                key={i}
                className={`mx-1 inline-block min-w-16 border-b-2 ${locked ? 'border-emerald-500' : 'border-primary'}`}
              >
                {locked ? t.text : ' '}
              </span>
            ) : (
              <span key={i}>{t.text}</span>
            ),
          )}
        </div>
        <p className="text-muted-foreground">{sentence.meaning}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o, i) => (
          <OptionButton
            key={o.hanzi}
            index={i}
            state={stateOf(i)}
            onClick={() => pick(i)}
            disabled={locked}
            lang="zh-Hans"
          >
            <span className="text-2xl">{o.hanzi}</span>
          </OptionButton>
        ))}
      </div>
    </div>
  );
}

/* ─── Match pairs ──────────────────────────────────────────────────────── */

export function MatchStep({ step, answered, onAnswer }: StepProps<'match'>) {
  const { words, order } = step;
  const [left, setLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState<number | null>(null);

  function pickRight(wordIndex: number) {
    if (left === null || answered) return;
    if (left === wordIndex) {
      const next = new Set(matched).add(wordIndex);
      setMatched(next);
      setLeft(null);
      play(words[wordIndex].hanzi, words[wordIndex].pinyin);
      if (next.size === words.length) {
        onAnswer({ correct: missed.size === 0, missed: [...missed] });
      }
    } else {
      setMissed(new Set(missed).add(words[left].hanzi));
      setFlash(wordIndex);
      setTimeout(() => setFlash(null), 400);
    }
  }

  const cell = (active: boolean, done: boolean, wrong: boolean) =>
    `min-h-14 rounded-xl border-2 px-3 py-2 transition-colors ${
      done
        ? 'border-emerald-500/50 bg-emerald-500/10 opacity-60'
        : wrong
          ? 'border-red-500 bg-red-500/15'
          : active
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50'
    }`;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <Prompt>Match the pairs</Prompt>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {words.map((w, i) => (
            <button
              key={w.hanzi}
              type="button"
              lang="zh-Hans"
              disabled={matched.has(i) || answered}
              onClick={() => {
                setLeft(i);
                play(w.hanzi, w.pinyin);
              }}
              className={`${cell(left === i, matched.has(i), false)} text-2xl`}
            >
              {w.hanzi}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {order.map((wi) => (
            <button
              key={words[wi].hanzi}
              type="button"
              disabled={matched.has(wi) || answered}
              onClick={() => pickRight(wi)}
              className={`${cell(false, matched.has(wi), flash === wi)} text-sm`}
            >
              {words[wi].meaning}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Typing ───────────────────────────────────────────────────────────── */

export function TypeMeaningStep({ step, answered, onAnswer }: StepProps<'type-meaning'>) {
  const { word } = step;
  const [text, setText] = useState('');
  function check() {
    if (!text.trim() || answered) return;
    const { verdict } = gradeWord(text, word.accepted);
    onAnswer({
      correct: verdict !== 'wrong',
      note: verdict === 'close' ? `Close enough — it means “${word.meaning}”.` : undefined,
    });
  }
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <Prompt>Type what this means in English</Prompt>
      <div className="flex items-center gap-2">
        <span lang="zh-Hans" className="text-6xl font-medium">
          {word.hanzi}
        </span>
        <AudioButton text={word.hanzi} reading={word.pinyin} />
      </div>
      <form
        className="flex w-full max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <Input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={answered}
          placeholder="Meaning…"
          aria-label="Your English answer"
          autoComplete="off"
          spellCheck={false}
          className="h-11 text-base"
        />
        <Button type="submit" className="h-11" disabled={answered || !text.trim()}>
          Check
        </Button>
      </form>
    </div>
  );
}

export function TypePinyinStep({ step, answered, onAnswer }: StepProps<'type-pinyin'>) {
  const { word } = step;
  const [draft, setDraft] = useState<PinyinDraft>(EMPTY_DRAFT);
  function check() {
    if (answered || draftIsEmpty(draft)) return;
    const { grade, given } = gradeDraft(draft, word.syllables, word.pinyin);
    onAnswer({
      correct: grade === 'correct',
      note: grade === 'tones' ? `Right sounds, wrong tones — you typed ${given}.` : undefined,
    });
  }
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <Prompt>How do you say this? Type the pinyin with tones</Prompt>
      <div>
        <div lang="zh-Hans" className="text-6xl font-medium">
          {word.hanzi}
        </div>
        <div className="mt-1 text-muted-foreground">{word.meaning}</div>
      </div>
      <div className="w-full max-w-lg">
        <PinyinKeyboard value={draft} onChange={setDraft} onSubmit={check} disabled={answered} />
      </div>
    </div>
  );
}

/* ─── Sentence building ────────────────────────────────────────────────── */

export function ArrangeStep({ step, answered, onAnswer }: StepProps<'arrange'>) {
  const { sentence, tiles } = step;
  const [chosen, setChosen] = useState<number[]>([]);
  const [showPinyin, setShowPinyin] = useState(true);
  const bank = tiles.map((t, i) => ({ t, i })).filter(({ i }) => !chosen.includes(i));

  function check() {
    if (answered || chosen.length === 0) return;
    const built = chosen.map((i) => tiles[i].text).join('');
    onAnswer({ correct: built === sentence.tokens.map((t) => t.text).join('') });
  }

  const tileClass =
    'flex flex-col items-center rounded-lg border-2 border-border bg-card px-3 py-1.5 shadow-sm transition-colors hover:border-primary/50 disabled:opacity-70';
  const TileLabel = ({ tile }: { tile: Tile }) => (
    <>
      <span lang="zh-Hans" className="text-2xl">
        {tile.text}
      </span>
      {showPinyin && <span className="text-xs text-muted-foreground">{tile.pinyin}</span>}
    </>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <Prompt>Build this sentence in Chinese</Prompt>
        <div className="mt-2 text-2xl font-medium">{sentence.meaning}</div>
      </div>
      <div className="flex min-h-20 flex-wrap items-center gap-2 border-b-2 border-dashed border-border pb-3">
        {chosen.map((i) => (
          <button
            key={i}
            type="button"
            disabled={answered}
            className={tileClass}
            onClick={() => setChosen(chosen.filter((c) => c !== i))}
          >
            <TileLabel tile={tiles[i]} />
          </button>
        ))}
      </div>
      <div className="flex min-h-16 flex-wrap justify-center gap-2">
        {bank.map(({ t, i }) => (
          <button
            key={i}
            type="button"
            disabled={answered}
            className={tileClass}
            onClick={() => {
              setChosen([...chosen, i]);
              play(t.text, t.pinyin);
            }}
          >
            <TileLabel tile={t} />
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setShowPinyin(!showPinyin)}
        >
          {showPinyin ? 'Hide pinyin' : 'Show pinyin'}
        </button>
        <Button type="button" onClick={check} disabled={answered || chosen.length === 0}>
          Check
        </Button>
      </div>
    </div>
  );
}

/** The answer, shown in the feedback bar after a question. */
export function solutionOf(
  step: LessonStep,
): { hanzi: string; pinyin: string; meaning: string } | null {
  switch (step.kind) {
    case 'choose':
    case 'type-meaning':
    case 'type-pinyin':
      return step.word;
    case 'fill':
    case 'arrange':
    case 'translate':
      return step.sentence;
    default:
      return null;
  }
}

export type { LessonWord };
