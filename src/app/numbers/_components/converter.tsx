'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { AudioButton } from '@/components/audio-button';
import { MAX_NUMBER, digitsToChinese, numberPinyin, toChinese } from '@/lib/numbers';

export function Converter() {
  const [raw, setRaw] = useState('2026');
  const cleaned = raw.replace(/[,\s_]/g, '');
  const n = /^\d{1,12}$/.test(cleaned) ? Number(cleaned) : null;
  const valid = n != null && n <= MAX_NUMBER;
  const zh = valid ? toChinese(n) : null;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium" htmlFor="num-convert">
        Type any number
      </label>
      <Input
        id="num-convert"
        inputMode="numeric"
        autoComplete="off"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="max-w-xs font-mono text-lg"
        placeholder="e.g. 10005"
      />
      {raw.trim() === '' ? null : zh ? (
        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span lang="zh-Hans" className="text-3xl">
              {zh}
            </span>
            <AudioButton text={zh} />
          </div>
          <div className="text-sm text-muted-foreground">{numberPinyin(zh)}</div>
          {cleaned.length >= 3 && (
            <div className="border-t border-border/60 pt-3 text-sm">
              <span className="text-muted-foreground">
                Read digit by digit (years, phone and room numbers):{' '}
              </span>
              <span lang="zh-Hans" className="text-base">
                {digitsToChinese(cleaned)}
              </span>
              <span className="text-muted-foreground"> · on the phone: </span>
              <span lang="zh-Hans" className="text-base">
                {digitsToChinese(cleaned, { phone: true })}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Enter a whole number from 0 to {MAX_NUMBER.toLocaleString('en-US')}.
        </p>
      )}
    </div>
  );
}
