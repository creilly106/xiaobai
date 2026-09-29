'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { ArrowRight, ClipboardPaste, Plus, Volume2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Pinyin } from '@/components/pinyin';
import { Button, buttonVariants } from '@/components/ui/button';
import { analyseText } from '@/lib/actions/breakdown';
import { addToStudy } from '@/lib/actions/library';
import type { Breakdown, BreakdownWord, WordStatus } from '@/lib/queries/breakdown';
import { speak, speakWord } from '@/lib/tts';
import { useStoredPref } from '@/lib/use-client';

const TEXT_KEY = 'xiaobai:breakdown-text';
const PINYIN_KEY = 'xiaobai:breakdown-pinyin';
const MAX_CHARS = 3000;

const STATUS: Record<WordStatus, { label: string; mark: string; dot: string }> = {
  known: { label: 'Known', mark: '', dot: 'bg-emerald-500' },
  learning: { label: 'Learning', mark: 'bg-amber-500/20', dot: 'bg-amber-500' },
  queued: { label: 'In your queue', mark: 'bg-sky-500/20', dot: 'bg-sky-500' },
  new: { label: 'New to you', mark: 'bg-rose-500/15', dot: 'bg-rose-500' },
};

/**
 * Paste any Chinese and read it word by word: each word's pinyin and meaning,
 * how well you know it, and a way to study the ones you don't.
 */
export function BreakdownTool() {
  const [text, setText] = useStoredPref(TEXT_KEY, '');
  const [pinyinPref, setPinyinPref] = useStoredPref(PINYIN_KEY, '1');
  const showPinyin = pinyinPref === '1';
  const [result, setResult] = useState<Breakdown | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function analyse(source = text) {
    if (!source.trim()) return;
    setSelected(null);
    startTransition(async () => {
      try {
        setResult(await analyseText(source));
      } catch {
        toast.error("Couldn't break that down. Check your connection and try again.");
      }
    });
  }

  async function paste() {
    try {
      const clip = (await navigator.clipboard.readText()).slice(0, MAX_CHARS);
      if (!clip.trim()) return toast('Nothing to paste.');
      setText(clip);
      analyse(clip);
    } catch {
      toast("Couldn't read the clipboard. Long-press the box and choose Paste instead.");
    }
  }

  function markQueued(hanzi: string) {
    setResult((r) =>
      r ? { ...r, words: { ...r.words, [hanzi]: { ...r.words[hanzi], status: 'queued' } } } : r,
    );
  }

  const words = result ? Object.values(result.words) : [];
  const counts = words.reduce((c, w) => ({ ...c, [w.status]: c[w.status] + 1 }), {
    known: 0,
    learning: 0,
    queued: 0,
    new: 0,
  } as Record<WordStatus, number>);
  const pick = selected && result ? result.words[selected] : null;

  return (
    <div className="pb-48">
      <textarea
        aria-label="Chinese text"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        placeholder="粘贴中文… Paste a message, a menu, a paragraph — anything in Chinese."
        rows={5}
        lang="zh-Hans"
        className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-lg leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => analyse()} disabled={pending || !text.trim()}>
          {pending ? 'Working…' : 'Break it down'}
        </Button>
        <Button type="button" variant="outline" onClick={paste} disabled={pending}>
          <ClipboardPaste /> Paste
        </Button>
        {text && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setText('');
              setResult(null);
            }}
          >
            Clear
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {Array.from(text).length} / {MAX_CHARS}
        </span>
      </div>

      {result && words.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No Chinese found. This works with simplified characters.
        </p>
      )}

      {result && words.length > 0 && (
        <section className="mt-6" aria-label="Breakdown">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="font-medium">
              You know {counts.known} of {words.length} word{words.length === 1 ? '' : 's'}
            </span>
            {(Object.keys(STATUS) as WordStatus[]).map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span className={`size-2 rounded-full ${STATUS[s].dot}`} aria-hidden />
                {STATUS[s].label} {counts[s]}
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={showPinyin ? 'default' : 'ghost'}
              aria-pressed={showPinyin}
              onClick={() => setPinyinPref(showPinyin ? '0' : '1')}
            >
              Pinyin
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => speak(text)}>
              <Volume2 /> Read aloud
            </Button>
          </div>
          <p
            lang="zh-Hans"
            className={`mt-4 whitespace-pre-wrap text-2xl tracking-wide ${showPinyin ? 'leading-[2.6]' : 'leading-[1.9]'}`}
          >
            {result.pieces.map((p, i) => {
              if (!p.word) return <span key={i}>{p.text}</span>;
              const w = result.words[p.word];
              return (
                <button
                  key={i}
                  type="button"
                  data-word={p.word}
                  data-status={w.status}
                  onClick={() => setSelected(p.word!)}
                  className={`mx-px rounded-sm px-px transition-colors hover:ring-1 hover:ring-primary/40 ${STATUS[w.status].mark} ${
                    selected === p.word ? 'ring-2 ring-primary/60' : ''
                  }`}
                >
                  {showPinyin && w.pinyin ? (
                    <ruby>
                      {p.text}
                      <rt className="text-[0.45em] font-normal tracking-normal text-muted-foreground">
                        {w.pinyin}
                      </rt>
                    </ruby>
                  ) : (
                    p.text
                  )}
                </button>
              );
            })}
          </p>
        </section>
      )}

      {pick && <WordPanel word={pick} onClose={() => setSelected(null)} onAdded={markQueued} />}
    </div>
  );
}

function WordPanel({
  word,
  onClose,
  onAdded,
}: {
  word: BreakdownWord;
  onClose: () => void;
  onAdded: (hanzi: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const canAdd = word.status === 'new' && !word.lesson && (word.wordId || word.dictionaryId);

  function add() {
    startTransition(async () => {
      const result = await addToStudy(
        word.wordId ? { wordId: word.wordId } : { dictionaryId: word.dictionaryId! },
      );
      if (result.ok) {
        onAdded(word.hanzi);
        toast.success(result.message);
      } else toast.error(result.message);
    });
  }

  return (
    <div
      role="dialog"
      aria-label={`${word.hanzi}: meaning`}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg"
    >
      <div className="mx-auto flex max-w-2xl items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span lang="zh-Hans" className="text-3xl">
              {word.hanzi}
            </span>
            {word.pinyin && <Pinyin text={word.pinyin} className="text-base" />}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Play ${word.hanzi}`}
              onClick={() => speakWord(word.hanzi, word.pinyin)}
            >
              <Volume2 />
            </Button>
          </div>
          <p className="text-sm">{word.meaning || 'Not in the dictionary.'}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`size-2 rounded-full ${STATUS[word.status].dot}`} aria-hidden />
            {STATUS[word.status].label}
            {word.hskLevel ? ` · HSK ${word.hskLevel}` : ''}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {canAdd && (
              <Button type="button" size="sm" onClick={add} disabled={pending}>
                <Plus /> Add to study
              </Button>
            )}
            {word.status === 'new' && word.lesson && (
              <Link
                href={`/learn/${word.lesson.id}`}
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
              >
                Taught in “{word.lesson.title}” <ArrowRight />
              </Link>
            )}
            <Link
              href={`/characters/${encodeURIComponent(word.hanzi)}`}
              className={buttonVariants({ size: 'sm', variant: 'ghost' })}
            >
              Word page
            </Link>
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
          <X />
        </Button>
      </div>
    </div>
  );
}
