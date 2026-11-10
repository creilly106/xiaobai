'use client';

import { useEffect } from 'react';
import { Delete, CornerDownLeft } from 'lucide-react';
import { markTone, TONE_TEXT, type Tone } from '@/lib/pinyin';
import {
  backspace,
  draftIsEmpty,
  syllablesOf,
  typeApostrophe,
  typeLetter,
  typeTone,
  type PinyinDraft,
} from '@/lib/pinyin-draft';
import { lockTyping } from '@/lib/typing-lock';

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
 * (1–5 or the tone keys) to finish each syllable. v (or ü) types ü, and '
 * separates syllables (nǚ’ér).
 */
export function PinyinKeyboard({ value, onChange, onSubmit, disabled }: Props) {
  // Own the keyboard while active so page shortcuts (Space, 1–4, P…) stand down.
  useEffect(() => (disabled ? undefined : lockTyping()), [disabled]);

  useEffect(() => {
    if (disabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return;
      const k = e.key.toLowerCase();
      if (/^[a-z]$/.test(k) || k === 'ü') {
        e.preventDefault();
        onChange(typeLetter(value, k === 'ü' ? 'v' : k));
      } else if (k === "'" || k === '’') {
        e.preventDefault();
        onChange(typeApostrophe(value));
      } else if (/^[1-5]$/.test(k)) {
        e.preventDefault();
        onChange(typeTone(value, Number(k) as Tone));
      } else if (k === ' ') {
        // A gap between words: finishes what's typed as neutral, but never
        // wipes the tone of a syllable you've already finished ("ni3 hao3").
        e.preventDefault();
        if (value.current.replace(/'/g, '')) onChange(typeTone(value, 5));
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

  // Tone keys show the syllable being typed with each tone ("nü" → nǚ…).
  const typing = syllablesOf(value.current.replace(/'/g, '')).at(-1) ?? '';
  const toneLabel = (tone: Tone, fallback: string) =>
    typing && /[aeiouv]/.test(typing) ? markTone(typing, tone) : fallback;

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
            {markTone(s.letters, s.tone).replace(/'/g, '’')}
          </span>
        ))}
        <span className="text-foreground">
          {value.current.replace(/v/g, 'ü').replace(/'/g, '’')}
        </span>
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
              <span className="max-w-full truncate text-base leading-none">
                {toneLabel(t.tone, t.label)}
              </span>
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
            style={{
              gridTemplateColumns: `repeat(${r === 2 ? row.length + 3 : row.length}, minmax(0, 1fr))`,
            }}
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
                className={ch === 'v' ? `${key} flex-col gap-0` : key}
                aria-label={ch === 'v' ? 'ü (or type v)' : undefined}
              >
                {ch === 'v' ? (
                  <>
                    <span className="leading-none">ü</span>
                    <span className="text-[10px] leading-none text-muted-foreground">v</span>
                  </>
                ) : (
                  ch
                )}
              </button>
            ))}
            {r === 2 && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(typeApostrophe(value))}
                className={key}
                aria-label="Apostrophe (syllable break)"
                title="Syllable break, as in nǚ’ér"
              >
                ’
              </button>
            )}
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
