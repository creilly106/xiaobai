'use client';

import { useEffect } from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';
import { markTone, TONE_TEXT, type Syllable, type Tone } from '@/lib/pinyin';

/** Finished syllables plus the one being typed (tone not chosen yet). */
export type PinyinDraft = { done: Syllable[]; current: string };

export const EMPTY_DRAFT: PinyinDraft = { done: [], current: '' };

/** Everything typed so far as syllables; an untoned last syllable is neutral. */
export function draftSyllables(d: PinyinDraft): Syllable[] {
  return d.current ? [...d.done, { letters: d.current, tone: 5 }] : d.done;
}

export function draftIsEmpty(d: PinyinDraft): boolean {
  return d.done.length === 0 && d.current === '';
}

function typeLetter(d: PinyinDraft, ch: string): PinyinDraft {
  if (d.current.length >= 6) return d;
  return { ...d, current: d.current + ch };
}

/** A tone ends the syllable being typed; with nothing typed it retones the last one. */
function typeTone(d: PinyinDraft, tone: Tone): PinyinDraft {
  if (d.current) return { done: [...d.done, { letters: d.current, tone }], current: '' };
  if (d.done.length === 0) return d;
  const last = d.done[d.done.length - 1];
  return { ...d, done: [...d.done.slice(0, -1), { ...last, tone }] };
}

function backspace(d: PinyinDraft): PinyinDraft {
  if (d.current) return { ...d, current: d.current.slice(0, -1) };
  const last = d.done[d.done.length - 1];
  if (!last) return d;
  // Reopen the previous syllable without its tone.
  return { done: d.done.slice(0, -1), current: last.letters };
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const TONE_KEYS: { tone: Tone; label: string; hint: string }[] = [
  { tone: 1, label: 'ā', hint: '1' },
  { tone: 2, label: 'á', hint: '2' },
  { tone: 3, label: 'ǎ', hint: '3' },
  { tone: 4, label: 'à', hint: '4' },
  { tone: 5, label: 'a', hint: '5' },
];

type Props = {
  value: PinyinDraft;
  onChange: (d: PinyinDraft) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

/**
 * Pinyin entry without an input method: type letters, then press a tone
 * (1–5 or the tone keys) to finish each syllable. v types ü.
 */
export function PinyinKeyboard({ value, onChange, onSubmit, disabled }: Props) {
  useEffect(() => {
    if (disabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return;
      const k = e.key.toLowerCase();
      if (/^[a-z]$/.test(k)) {
        e.preventDefault();
        onChange(typeLetter(value, k));
      } else if (/^[1-5]$/.test(k)) {
        e.preventDefault();
        onChange(typeTone(value, Number(k) as Tone));
      } else if (k === ' ') {
        e.preventDefault();
        onChange(typeTone(value, 5));
      } else if (k === 'backspace') {
        e.preventDefault();
        onChange(backspace(value));
      } else if (k === 'enter') {
        e.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [value, onChange, onSubmit, disabled]);

  const key =
    'flex h-10 min-w-0 items-center justify-center rounded-md border border-border/70 bg-card text-sm font-medium transition-colors hover:bg-muted active:scale-95 disabled:opacity-50 sm:h-11';

  return (
    <div className="space-y-3">
      <div
        aria-live="polite"
        aria-label="Your pinyin"
        className="flex min-h-12 flex-wrap items-center justify-center gap-x-1 rounded-lg border-2 border-border/70 bg-background px-3 py-2 text-2xl"
      >
        {value.done.map((s, i) => (
          <span key={i} className={TONE_TEXT[s.tone]}>
            {markTone(s.letters, s.tone)}
          </span>
        ))}
        <span className="text-foreground">{value.current.replace(/v/g, 'ü')}</span>
        {!disabled && <span className="h-7 w-0.5 animate-pulse bg-primary" aria-hidden />}
        {draftIsEmpty(value) && (
          <span className="text-base text-muted-foreground">type letters, then a tone</span>
        )}
      </div>

      <div className="space-y-1.5" aria-label="Pinyin keyboard">
        <div className="grid grid-cols-5 gap-1.5">
          {TONE_KEYS.map((t) => (
            <button
              key={t.tone}
              type="button"
              disabled={disabled}
              onClick={() => onChange(typeTone(value, t.tone))}
              className={`${key} flex-col gap-0 ${TONE_TEXT[t.tone]}`}
              title={t.tone === 5 ? 'Neutral tone (or Space)' : `Tone ${t.tone}`}
            >
              <span className="text-base leading-none">{t.label}</span>
              <span className="text-[10px] text-muted-foreground">
                {t.tone === 5 ? 'neutral' : `tone ${t.tone}`}
              </span>
            </button>
          ))}
        </div>
        {ROWS.map((row, r) => (
          <div
            key={row}
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${r === 2 ? row.length + 2 : row.length}, minmax(0, 1fr))` }}
          >
            {r === 2 && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(backspace(value))}
                className={key}
                aria-label="Backspace"
              >
                <Delete className="size-4" />
              </button>
            )}
            {Array.from(row).map((ch) => (
              <button
                key={ch}
                type="button"
                disabled={disabled}
                onClick={() => onChange(typeLetter(value, ch))}
                className={key}
              >
                {ch === 'v' ? 'ü' : ch}
              </button>
            ))}
            {r === 2 && (
              <button
                type="button"
                disabled={disabled}
                onClick={onSubmit}
                className={`${key} border-primary bg-primary text-primary-foreground hover:bg-primary/90`}
                aria-label="Check answer"
              >
                <CornerDownLeft className="size-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
