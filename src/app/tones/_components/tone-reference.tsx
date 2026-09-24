'use client';

import { speak } from '@/lib/tts';
import { TONE_BORDER, TONE_NAMES, TONE_TEXT, type Tone } from '@/lib/pinyin';
import { ToneContour } from './tone-contour';

const EXAMPLES: { tone: Tone; hanzi: string; pinyin: string; meaning: string; tip: string }[] = [
  { tone: 1, hanzi: '妈', pinyin: 'mā', meaning: 'mum', tip: 'Hold one high note, like singing.' },
  { tone: 2, hanzi: '麻', pinyin: 'má', meaning: 'hemp; numb', tip: 'Rise like asking "huh?"' },
  { tone: 3, hanzi: '马', pinyin: 'mǎ', meaning: 'horse', tip: 'Drop low, creaky. In speech it often stays low.' },
  { tone: 4, hanzi: '骂', pinyin: 'mà', meaning: 'to scold', tip: 'Fall sharply, like "No!"' },
  { tone: 5, hanzi: '吗', pinyin: 'ma', meaning: 'question particle', tip: 'Short and light, never stressed.' },
];

export function ToneReference() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {EXAMPLES.map((e) => (
        <button
          key={e.tone}
          type="button"
          onClick={() => speak(e.hanzi, 0.7)}
          className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-transform hover:-translate-y-0.5 ${TONE_BORDER[e.tone]}`}
          title={`Play ${e.hanzi}`}
        >
          <span className={`flex w-full items-center justify-between ${TONE_TEXT[e.tone]}`}>
            <span className="text-sm font-semibold">
              {e.tone === 5 ? 'Neutral' : `Tone ${e.tone}`}
            </span>
            <ToneContour tone={e.tone} />
          </span>
          <span className="text-xs text-muted-foreground">{TONE_NAMES[e.tone]}</span>
          <span className="mt-1 flex items-baseline gap-2">
            <span lang="zh-Hans" className="text-2xl">
              {e.hanzi}
            </span>
            <span className={`font-medium ${TONE_TEXT[e.tone]}`}>{e.pinyin}</span>
          </span>
          <span className="text-xs text-muted-foreground">{e.meaning}</span>
          <span className="mt-1 text-xs">{e.tip}</span>
        </button>
      ))}
    </div>
  );
}
