'use client';

import { useMemo } from 'react';
import { TONE_TEXT } from '@/lib/pinyin';
import { splitPinyinText } from '@/lib/pinyin-split';
import { TONE_COLORS_KEY } from '@/lib/prefs';
import { useStoredPref } from '@/lib/use-client';

/**
 * Pinyin text, coloured by tone when "Colour pinyin by tone" is on
 * (Settings → Appearance). Renders plain text otherwise.
 */
export function Pinyin({ text, className }: { text: string; className?: string }) {
  const [pref] = useStoredPref(TONE_COLORS_KEY, '0');
  const segments = useMemo(() => (pref === '1' ? splitPinyinText(text) : null), [pref, text]);
  if (!segments) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {segments.map((s, i) =>
        s.tone ? (
          <span key={i} className={TONE_TEXT[s.tone]}>
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </span>
  );
}
