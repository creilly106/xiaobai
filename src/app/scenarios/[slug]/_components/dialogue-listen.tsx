'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { OptionButton } from '@/app/learn/_components/steps';
import { Pinyin } from '@/components/pinyin';
import { TokenizedHanzi } from '@/components/tokenized-hanzi';
import { Button } from '@/components/ui/button';
import { logPractice } from '@/lib/actions/practice';
import type { DialogueLine } from '@/lib/curriculum';
import { buildListeningQuiz } from '@/lib/listening';
import { seededRandom } from '@/lib/path/lesson-builder';
import type { Dictionary } from '@/lib/queries/dictionary';
import { speak, speakAndWait, stopSpeaking } from '@/lib/tts';

export type PoolLine = { hanzi: string; pinyin: string; meaning: string };

/** Pause between lines, like a breath between speakers. */
const GAP_MS = 700;

/**
 * Listening practice for a dialogue: the conversation plays line by line with
 * the text hidden, then a few questions check what you caught.
 */
export function DialogueListen({
  slug,
  lines,
  pool,
  dict,
  onExit,
}: {
  slug: string;
  lines: DialogueLine[];
  pool: PoolLine[];
  dict: Dictionary;
  onExit: () => void;
}) {
  // The quiz seed is picked when it starts (an event), keeping render pure.
  const [quizSeed, setQuizSeed] = useState<number | null>(null);
  const [round, setRound] = useState(0);

  if (quizSeed !== null) {
    return (
      <ListeningQuiz
        slug={slug}
        lines={lines}
        pool={pool}
        seed={quizSeed}
        onListenAgain={() => {
          setQuizSeed(null);
          setRound(round + 1);
        }}
        onExit={onExit}
      />
    );
  }
  return (
    <ListenPlayer
      key={round}
      lines={lines}
      dict={dict}
      onQuiz={() => setQuizSeed(Math.floor(Math.random() * 2 ** 32))}
    />
  );
}

function ListenPlayer({
  lines,
  dict,
  onQuiz,
}: {
  lines: DialogueLine[];
  dict: Dictionary;
  onQuiz: () => void;
}) {
  /** How many lines have been reached so far (they appear as they're played). */
  const [upTo, setUpTo] = useState(0);
  const [current, setCurrent] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  // Bumped to cancel a playback loop that's in progress.
  const run = useRef(0);
  const finished = upTo === lines.length && current === null;

  async function playFrom(start: number) {
    const token = ++run.current;
    setPlaying(true);
    for (let i = start; i < lines.length; i++) {
      setUpTo((n) => Math.max(n, i + 1));
      setCurrent(i);
      await speakAndWait(lines[i].hanzi);
      if (run.current !== token) return;
      await new Promise((r) => setTimeout(r, GAP_MS));
      if (run.current !== token) return;
    }
    setCurrent(null);
    setPlaying(false);
  }

  function pause() {
    run.current++;
    stopSpeaking();
    setPlaying(false);
  }

  useEffect(() => {
    const runs = run;
    const start = setTimeout(() => void playFrom(0), 300);
    return () => {
      clearTimeout(start);
      runs.current++;
      stopSpeaking();
    };
    // Starts once when listening begins.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Listen to the conversation without reading along. Tap a line to see it.
      </p>
      {lines.slice(0, upTo).map((line, i) => {
        const you = line.speaker === 'you';
        const visible = showText || revealed.has(i);
        return (
          <div key={i} className={`flex ${you ? 'justify-end' : 'justify-start'}`}>
            <div
              data-line={i}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 transition-shadow ${
                you ? 'rounded-br-sm bg-primary/10' : 'rounded-bl-sm bg-muted'
              } ${current === i ? 'ring-2 ring-primary/50' : ''}`}
            >
              <div className="mb-0.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {you ? 'You' : 'Them'}
                {current === i && <Volume2 className="size-3 animate-pulse" aria-label="Playing" />}
              </div>
              <div className="flex items-start gap-1">
                {visible ? (
                  <div className="min-w-0">
                    <div lang="zh-Hans" className="text-lg leading-snug">
                      <TokenizedHanzi hanzi={line.hanzi} dict={dict} />
                    </div>
                    <Pinyin text={line.pinyin} className="block text-xs text-muted-foreground" />
                    <div className="text-sm">{line.meaning}</div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevealed(new Set(revealed).add(i))}
                    className="py-1 text-left text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    <span aria-hidden className="tracking-[0.3em]">
                      {'•'.repeat(Math.min(12, Math.max(3, [...line.hanzi].length)))}
                    </span>{' '}
                    Show
                  </button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Play line ${i + 1} again`}
                  onClick={() => {
                    pause();
                    speak(line.hanzi);
                  }}
                >
                  <Volume2 />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-1.5 pt-2">
        {playing ? (
          <Button type="button" size="sm" variant="outline" onClick={pause}>
            <Pause /> Pause
          </Button>
        ) : (
          !finished && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void playFrom(current ?? upTo)}
            >
              <Play /> Resume
            </Button>
          )
        )}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setUpTo(0);
            setRevealed(new Set());
            void playFrom(0);
          }}
        >
          <RotateCcw /> From the start
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setShowText(!showText)}
          aria-pressed={showText}
        >
          {showText ? <EyeOff /> : <Eye />} {showText ? 'Hide' : 'Show'} text
        </Button>
        {finished && (
          <Button type="button" size="sm" className="ml-auto" onClick={onQuiz}>
            Check what you understood
          </Button>
        )}
      </div>
    </div>
  );
}

function ListeningQuiz({
  slug,
  lines,
  pool,
  seed,
  onListenAgain,
  onExit,
}: {
  slug: string;
  lines: DialogueLine[];
  pool: PoolLine[];
  seed: number;
  onListenAgain: () => void;
  onExit: () => void;
}) {
  const [questions] = useState(() => buildListeningQuiz(lines, pool, seededRandom(seed)));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const byHanzi = new Map([...pool, ...lines].map((l) => [l.hanzi, l]));
  const done = index >= questions.length;
  const q = questions[index];

  // Play each question's line as it comes up.
  useEffect(() => {
    if (q) speak(q.hanzi);
  }, [q]);
  useEffect(() => () => stopSpeaking(), []);

  function choose(option: string) {
    if (picked !== null) return;
    setPicked(option);
    const correct = option === q.answer;
    const next = [...results, correct];
    setResults(next);
    if (next.length === questions.length) {
      void logPractice(
        questions.map((question, i) => ({
          kind: 'listening',
          item: question.hanzi.slice(0, 60),
          correct: next[i],
          detail: { question: question.kind, scenario: slug },
        })),
      ).catch(() => {});
    }
  }

  if (done) {
    const right = results.filter(Boolean).length;
    return (
      <div className="space-y-3 py-2 text-center">
        <div className="text-3xl font-semibold tabular-nums">
          {right} / {questions.length}
        </div>
        <p className="text-sm text-muted-foreground">
          {right === questions.length
            ? 'You caught all of it.'
            : right >= questions.length / 2
              ? 'Most of it — listen once more and see if the rest clicks.'
              : 'Tricky one. Try it again with the text showing, then without.'}
        </p>
        <div className="flex justify-center gap-2">
          <Button type="button" variant="outline" onClick={onListenAgain}>
            <RotateCcw /> Listen again
          </Button>
          <Button type="button" onClick={onExit}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  const line = byHanzi.get(q.hanzi);
  const answerLine = byHanzi.get(q.answer);
  return (
    <div data-listening-question={q.kind} className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {index + 1} of {questions.length}
        </span>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {q.kind === 'reply' ? 'They say this. What do you reply?' : 'What does this mean?'}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-2 size-14 rounded-full"
          onClick={() => speak(q.hanzi)}
          aria-label="Play again"
        >
          <Volume2 className="size-6" />
        </Button>
      </div>
      <div className="grid gap-2">
        {q.options.map((option, i) => (
          <OptionButton
            key={option}
            index={i}
            disabled={picked !== null}
            lang={q.kind === 'reply' ? 'zh-Hans' : undefined}
            onClick={() => choose(option)}
            state={
              picked === null
                ? 'idle'
                : option === q.answer
                  ? 'right'
                  : option === picked
                    ? 'wrong'
                    : 'dim'
            }
          >
            <span className={q.kind === 'reply' ? 'text-lg' : ''}>{option}</span>
          </OptionButton>
        ))}
      </div>
      {picked !== null && (
        <div className="space-y-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
          {line && (
            <div>
              <span lang="zh-Hans" className="text-base">
                {line.hanzi}
              </span>{' '}
              <Pinyin text={line.pinyin} className="text-xs text-muted-foreground" />
              <div>{line.meaning}</div>
            </div>
          )}
          {q.kind === 'reply' && answerLine && (
            <div className="border-t border-border/60 pt-2">
              <span className="text-xs text-muted-foreground">You: </span>
              <span lang="zh-Hans" className="text-base">
                {answerLine.hanzi}
              </span>{' '}
              <Pinyin text={answerLine.pinyin} className="text-xs text-muted-foreground" />
              <div>{answerLine.meaning}</div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setPicked(null);
                setIndex(index + 1);
              }}
            >
              {index + 1 === questions.length ? 'See results' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
