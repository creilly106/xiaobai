'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HanziStrokes } from '@/components/hanzi-strokes';
import { HandwritingPractice } from '@/components/handwriting-practice';

/** Stroke order + handwriting tools for a word. Key it by card so it resets per card. */
export function WordTools({ hanzi }: { hanzi: string }) {
  const [showStrokes, setShowStrokes] = useState(false);
  return showStrokes ? (
    <HanziStrokes hanzi={hanzi} />
  ) : (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="outline" size="sm" type="button" onClick={() => setShowStrokes(true)}>
        Show stroke order
      </Button>
      <HandwritingPractice hanzi={hanzi} />
    </div>
  );
}
