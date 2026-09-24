'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type HanziWriterInstance = {
  animateCharacter: () => void;
  showCharacter: () => void;
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

export function HanziStrokes({ hanzi }: { hanzi: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writersRef = useRef<HanziWriterInstance[]>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    writersRef.current = [];

    (async () => {
      try {
        const mod = (await import('hanzi-writer')) as unknown as HanziWriterModule;
        if (cancelled || !containerRef.current) return;
        const chars = Array.from(hanzi);
        for (const ch of chars) {
          const slot = document.createElement('div');
          slot.className = 'inline-block';
          slot.style.width = '112px';
          slot.style.height = '112px';
          containerRef.current.appendChild(slot);
          // Read theme-aware colors from CSS custom properties so strokes
          // look intentional in both light and dark mode.
          const root = getComputedStyle(document.documentElement);
          const strokeColor =
            root.getPropertyValue('--stroke-color').trim() ||
            (document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#0f172a');
          const outlineColor =
            root.getPropertyValue('--stroke-outline').trim() ||
            (document.documentElement.classList.contains('dark') ? '#334155' : '#e2e8f0');
          const writer = mod.default.create(slot, ch, {
            width: 112,
            height: 112,
            padding: 5,
            strokeAnimationSpeed: 1.2,
            delayBetweenStrokes: 80,
            showOutline: true,
            showCharacter: false,
            strokeColor,
            outlineColor,
          });
          writersRef.current.push(writer);
        }
        if (!cancelled) {
          setReady(true);
          // Play the animation once automatically so the user sees the strokes
          // right away — replay button is still available.
          writersRef.current.forEach((w) => w.animateCharacter());
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hanzi]);

  function playAll() {
    writersRef.current.forEach((w) => w.animateCharacter());
  }

  if (failed) {
    return <p className="text-xs text-muted-foreground">Stroke data unavailable.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={containerRef} className="flex flex-wrap justify-center gap-2" />
      <Button variant="outline" size="sm" disabled={!ready} onClick={playAll} type="button">
        Replay strokes
      </Button>
    </div>
  );
}
