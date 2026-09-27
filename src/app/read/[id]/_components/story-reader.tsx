'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Languages, Pause, Play, RotateCcw, Volume2, X } from 'lucide-react';
import { OptionButton } from '@/app/learn/_components/steps';
import { Pinyin } from '@/components/pinyin';
import { Button, buttonVariants } from '@/components/ui/button';
import { logPractice } from '@/lib/actions/practice';
import { audioFor } from '@/lib/audio-text';
import type { PathSentence } from '@/lib/curriculum';
import { alignPinyin } from '@/lib/pinyin-split';
import type { DictEntry, Dictionary } from '@/lib/queries/dictionary';
import type { Story } from '@/lib/story-data';
import { tokenize } from '@/lib/tokenize';
import { speak, speakAndWait, stopSpeaking } from '@/lib/tts';
import { useStoredPref } from '@/lib/use-client';

const PINYIN_PREF = 'xiaobai:read-pinyin';

type Word = { text: string; pinyin: string | null; entry?: DictEntry };
type Line = PathSentence & { index: number; words: Word[] };

/** Split a sentence into tappable words, each with its pinyin in context. */
function toLine(sentence: PathSentence, index: number, dict: Dictionary): Line {
  const syllables = alignPinyin(sentence.hanzi, sentence.pinyin);
  let at = 0;
  const words = tokenize(sentence.hanzi, dict).map((t): Word => {
    if (!t.isChinese) return { text: t.text, pinyin: null };
    const n = Array.from(t.text).length;
    const pinyin = syllables ? syllables.slice(at, at + n).join('') : (t.entry?.pinyin ?? null);
    at += n;
    return { text: t.text, pinyin, entry: t.entry };
  });
  return { ...sentence, index, words };
}

export function StoryReader({
  story,
  dict,
  next,
}: {
  story: Story;
  dict: Dictionary;
  next: { id: string; title: string } | null;
}) {
  const paragraphs = useMemo(() => {
    let index = 0;
    return story.paragraphs.map((p) => p.map((s) => toLine(s, index++, dict)));
  }, [story, dict]);
  const lines = paragraphs.flat();

  const [pinyinPref, setPinyinPref] = useStoredPref(PINYIN_PREF, '0');
  const showPinyin = pinyinPref === '1';
  const [english, setEnglish] = useState(false);
  const [selected, setSelected] = useState<{ line: number; word: number } | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const run = useRef(0);

  useEffect(() => {
    const runs = run;
    return () => {
      runs.current++;
      stopSpeaking();
    };
  }, []);

  async function playFrom(start: number) {
    const token = ++run.current;
    for (let i = start; i < lines.length; i++) {
      setPlaying(i);
      await speakAndWait(lines[i].hanzi);
      if (run.current !== token) return;
      await new Promise((r) => setTimeout(r, 350));
      if (run.current !== token) return;
    }
    setPlaying(null);
  }

  function stop() {
    run.current++;
    stopSpeaking();
    setPlaying(null);
  }

  const pick = selected ? lines[selected.line] : null;
  const word = pick && selected ? pick.words[selected.word] : null;

  return (
    <div className="pb-40">
      <header className="text-center">
        <h1 lang="zh-Hans" className="text-3xl font-semibold">
          {story.title.hanzi}
        </h1>
        <Pinyin text={story.title.pinyin} className="mt-1 block text-sm text-muted-foreground" />
        <p className="mt-1 text-sm text-muted-foreground">
          {story.title.meaning} · HSK {story.hskLevel}
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-4 mt-4 flex flex-wrap items-center justify-center gap-1.5 border-b border-border/60 bg-background/95 px-4 py-2 backdrop-blur">
        {playing === null ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void playFrom(selected?.line ?? 0)}
          >
            <Play /> {selected ? 'Read aloud from here' : 'Read aloud'}
          </Button>
        ) : (
          <Button type="button" size="sm" variant="outline" onClick={stop}>
            <Pause /> Stop
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant={showPinyin ? 'default' : 'ghost'}
          aria-pressed={showPinyin}
          onClick={() => setPinyinPref(showPinyin ? '0' : '1')}
        >
          Pinyin
        </Button>
        <Button
          type="button"
          size="sm"
          variant={english ? 'default' : 'ghost'}
          aria-pressed={english}
          onClick={() => setEnglish(!english)}
        >
          <Languages /> English
        </Button>
      </div>

      <article lang="zh-Hans" className="mt-6 space-y-6">
        {paragraphs.map((paragraph, p) => (
          <p
            key={p}
            className={
              english
                ? 'space-y-3'
                : `text-2xl ${showPinyin ? 'leading-[2.6]' : 'leading-[1.9]'} tracking-wide`
            }
          >
            {paragraph.map((line) => {
              const body = line.words.map((w, i) =>
                w.pinyin === null && !w.entry ? (
                  <span key={i}>{w.text}</span>
                ) : (
                  <button
                    key={i}
                    type="button"
                    data-word={w.text}
                    onClick={() => setSelected({ line: line.index, word: i })}
                    className={`rounded-sm transition-colors hover:bg-primary/10 ${
                      selected?.line === line.index && selected.word === i ? 'bg-primary/20' : ''
                    }`}
                  >
                    {showPinyin && w.pinyin ? (
                      <ruby>
                        {w.text}
                        <rt className="text-[0.45em] font-normal tracking-normal text-muted-foreground">
                          {w.pinyin}
                        </rt>
                      </ruby>
                    ) : (
                      w.text
                    )}
                  </button>
                ),
              );
              const highlight = playing === line.index ? 'bg-primary/10' : '';
              return english ? (
                <span key={line.index} className={`block rounded-md ${highlight}`}>
                  <span className="block text-2xl leading-[1.9]">{body}</span>
                  <span lang="en" className="block text-sm text-muted-foreground">
                    {line.meaning}
                  </span>
                </span>
              ) : (
                <span key={line.index} className={`rounded-md ${highlight}`}>
                  {body}
                </span>
              );
            })}
          </p>
        ))}
      </article>

      {story.extras.length > 0 && (
        <p className="mt-6 text-xs text-muted-foreground">
          New in this story:{' '}
          {story.extras.map((e, i) => (
            <span key={e.hanzi}>
              {i > 0 && ' · '}
              <span lang="zh-Hans">{e.hanzi}</span> {e.pinyin} ({e.meaning})
            </span>
          ))}
        </p>
      )}

      <StoryQuestions story={story} next={next} />

      {pick && word && (
        <div
          role="dialog"
          aria-label={`${word.text}: meaning`}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/98 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur"
        >
          <div className="mx-auto max-w-2xl">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span lang="zh-Hans" className="text-3xl">
                    {word.text}
                  </span>
                  {word.pinyin && <Pinyin text={word.pinyin} className="text-base" />}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Play ${word.text}`}
                    onClick={() => speak(audioFor(word.text, word.entry?.pinyin).text)}
                  >
                    <Volume2 />
                  </Button>
                </div>
                <p className="text-sm">
                  {word.entry?.meaning ?? 'Not in the dictionary.'}
                  {word.entry?.hskLevel ? (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      HSK {word.entry.hskLevel}
                    </span>
                  ) : null}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close"
                onClick={() => setSelected(null)}
              >
                <X />
              </Button>
            </div>
            <div className="mt-2 flex items-start gap-2 border-t border-border/60 pt-2 text-sm text-muted-foreground">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Play the sentence"
                onClick={() => {
                  stop();
                  speak(pick.hanzi);
                }}
              >
                <Volume2 />
              </Button>
              <span className="flex-1 pt-1">{pick.meaning}</span>
              <Link
                href={`/characters/${encodeURIComponent(word.text)}`}
                className={buttonVariants({ variant: 'outline', size: 'sm' })}
              >
                Word page
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StoryQuestions({
  story,
  next,
}: {
  story: Story;
  next: { id: string; title: string } | null;
}) {
  const [answers, setAnswers] = useState<(string | null)[]>(() => story.questions.map(() => null));
  const [attempt, setAttempt] = useState(0);
  const done = answers.every((a) => a !== null);
  const right = story.questions.filter((q, i) => answers[i] === q.answer).length;

  function answer(qi: number, option: string) {
    if (answers[qi] !== null) return;
    const nextAnswers = answers.map((a, i) => (i === qi ? option : a));
    setAnswers(nextAnswers);
    if (nextAnswers.every((a) => a !== null)) {
      void logPractice(
        story.questions.map((q, i) => ({
          kind: 'reading',
          item: story.id,
          correct: nextAnswers[i] === q.answer,
          detail: { question: i },
        })),
      ).catch(() => {});
    }
  }

  return (
    <section key={attempt} className="mt-10 border-t border-border/60 pt-6">
      <h2 className="text-lg font-semibold">Did you follow it?</h2>
      <ol className="mt-4 space-y-6">
        {story.questions.map((q, qi) => (
          <li key={q.question} data-question={qi}>
            <p className="mb-2 text-sm font-medium">
              {qi + 1}. {q.question}
            </p>
            <div className="grid gap-2">
              {q.options.map((option, oi) => (
                <OptionButton
                  key={option}
                  index={oi}
                  disabled={answers[qi] !== null}
                  onClick={() => answer(qi, option)}
                  state={
                    answers[qi] === null
                      ? 'idle'
                      : option === q.answer
                        ? 'right'
                        : option === answers[qi]
                          ? 'wrong'
                          : 'dim'
                  }
                >
                  {option}
                </OptionButton>
              ))}
            </div>
          </li>
        ))}
      </ol>
      {done && (
        <div className="mt-6 rounded-lg border border-border/60 p-4 text-center">
          <div className="text-2xl font-semibold tabular-nums">
            {right} / {story.questions.length}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {right === story.questions.length
              ? 'You understood all of it.'
              : 'Have another read of the parts you missed — tap English to check.'}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {right < story.questions.length && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAnswers(story.questions.map(() => null));
                  setAttempt(attempt + 1);
                }}
              >
                <RotateCcw /> Try the questions again
              </Button>
            )}
            {next ? (
              <Link href={`/read/${next.id}`} className={buttonVariants()}>
                Next: {next.title} <ArrowRight />
              </Link>
            ) : (
              <Link href="/read" className={buttonVariants()}>
                All stories
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
