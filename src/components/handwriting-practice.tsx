'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { celebrate } from '@/lib/celebrate';

type HanziWriterInstance = {
  quiz: (opts: {
    onMistake?: (data: { totalMistakes: number }) => void;
    onCorrectStroke?: (data: { strokesRemaining: number }) => void;
    onComplete?: (data: { totalMistakes: number; character: string }) => void;
  }) => void;
  cancelQuiz: () => void;
};

type HanziWriterModule = {
  default: {
    create: (
      target: HTMLElement | string,
      character: string,
      options?: Record<string, unknown>,
    ) => HanziWriterInstance;
  };
};

export function HandwritingPractice({ hanzi }: { hanzi: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        Practice writing
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Trace: {hanzi}</DialogTitle>
          </DialogHeader>
          {open && (
            <HandwritingQuiz
              hanzi={hanzi}
              onDone={() => {
                celebrate('small');
                setOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function HandwritingQuiz({ hanzi, onDone }: { hanzi: string; onDone: () => void }) {
  const chars = Array.from(hanzi);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriterInstance | null>(null);

  const current = chars[charIndex];
  const done = charIndex >= chars.length;

  useEffect(() => {
    if (done || !current) return;
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    (async () => {
      const mod = (await import('hanzi-writer')) as unknown as HanziWriterModule;
      if (cancelled || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      const isDark = document.documentElement.classList.contains('dark');
      const writer = mod.default.create(containerRef.current, current, {
        width: 240,
        height: 240,
        padding: 12,
        showCharacter: false,
        showOutline: true,
        strokeColor: isDark ? '#e2e8f0' : '#0f172a',
        outlineColor: isDark ? '#334155' : '#e2e8f0',
        drawingColor: '#0ea5e9',
        highlightColor: '#22c55e',
      });
      writerRef.current = writer;
      setMistakes(0);
      writer.quiz({
        onMistake: (d) => setMistakes(d.totalMistakes),
        onComplete: (summary) => {
          setTotalMistakes((t) => t + (summary?.totalMistakes ?? 0));
          setCharIndex((i) => i + 1);
        },
      });
    })();

    return () => {
      cancelled = true;
      writerRef.current?.cancelQuiz();
    };
  }, [charIndex, current, done]);

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-2">
        <p className="text-lg font-medium">Nice.</p>
        <p className="text-sm text-muted-foreground">
          {totalMistakes} mistake{totalMistakes === 1 ? '' : 's'} total.
        </p>
        <Button onClick={onDone}>Close</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <p className="text-xs text-muted-foreground">
        Character {charIndex + 1} of {chars.length}
      </p>
      <div
        ref={containerRef}
        className="rounded border border-border/60 bg-background"
        style={{ width: 240, height: 240 }}
      />
      <p className="text-xs text-muted-foreground">
        Draw the strokes in order. Mistakes: {mistakes}
      </p>
    </div>
  );
}
