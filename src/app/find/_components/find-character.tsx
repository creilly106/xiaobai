'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Eraser, Undo2, X } from 'lucide-react';
import { AudioButton } from '@/components/audio-button';
import { Pinyin } from '@/components/pinyin';
import { Button, buttonVariants } from '@/components/ui/button';
import { describeChars, type CharInfo } from '@/lib/actions/find';
import { decodeStrokeData, recognize, type Point, type RefChar } from '@/lib/handwriting';

type FindData = { chars: string; parts: Record<string, string>; picker: Record<string, number> };

type Loaded = { refs: RefChar[]; data: FindData; rank: Map<string, number> };

/** Results shown at once in the parts view. */
const MAX_RESULTS = 60;

export function FindCharacter() {
  const [mode, setMode] = useState<'draw' | 'parts'>('draw');
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);
  const [info, setInfo] = useState<Map<string, CharInfo>>(new Map());
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/find-data/strokes.bin').then((r) => {
        if (!r.ok) throw new Error(`strokes ${r.status}`);
        return r.arrayBuffer();
      }),
      fetch('/find-data/chars.json').then((r) => {
        if (!r.ok) throw new Error(`chars ${r.status}`);
        return r.json() as Promise<FindData>;
      }),
    ])
      .then(([strokes, data]) => {
        if (cancelled) return;
        setLoaded({
          refs: decodeStrokeData(new Uint8Array(strokes)),
          data,
          rank: new Map(Array.from(data.chars).map((c, i) => [c, i])),
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  /** Fetch pinyin and meanings for characters we haven't described yet. */
  function describe(chars: string[]) {
    const missing = chars.filter((c) => !info.has(c));
    if (missing.length === 0) return;
    describeChars(missing)
      .then((rows) =>
        setInfo((prev) => {
          const next = new Map(prev);
          for (const row of rows) next.set(row.hanzi, row);
          return next;
        }),
      )
      .catch(() => {});
  }

  function pick(char: string) {
    setSelected(char);
    describe([char]);
  }

  const tabs = (
    <div role="tablist" className="inline-flex rounded-lg border p-1 text-sm">
      {(
        [
          ['draw', 'Draw it'],
          ['parts', 'Pick its parts'],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={mode === key}
          onClick={() => setMode(key)}
          className={`rounded-md px-3 py-1 transition-colors ${
            mode === key ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="pb-48">
      {tabs}
      {failed ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Couldn&apos;t load the character data. Check your connection and reload.
        </p>
      ) : mode === 'draw' ? (
        <DrawMode loaded={loaded} info={info} describe={describe} onPick={pick} />
      ) : (
        <PartsMode loaded={loaded} info={info} describe={describe} onPick={pick} />
      )}
      {selected && (
        <CharPanel hanzi={selected} info={info.get(selected)} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

type ModeProps = {
  loaded: Loaded | null;
  info: Map<string, CharInfo>;
  describe: (chars: string[]) => void;
  onPick: (char: string) => void;
};

/* ─── Drawing ──────────────────────────────────────────────────────────── */

function DrawMode({ loaded, info, describe, onPick }: ModeProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = useRef<Point[] | null>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [candidates, setCandidates] = useState<string[]>([]);

  function update(next: Point[][]) {
    setStrokes(next);
    if (!loaded) return;
    const found = recognize(next, loaded.refs, { rank: loaded.rank, limit: 12 }).map((r) => r.char);
    setCandidates(found);
    describe(found);
  }

  // Redraw the pad whenever the strokes change (undo, clear, a new stroke).
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = width * dpr;
    c.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 7;
    ctx.strokeStyle = getComputedStyle(c).color;
    for (const s of strokes) drawStroke(ctx, s);
  }, [strokes]);

  function point(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!loaded) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    current.current = [point(e)];
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const stroke = current.current;
    if (!stroke) return;
    const p = point(e);
    const last = stroke[stroke.length - 1];
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 2) return;
    stroke.push(p);
    const ctx = e.currentTarget.getContext('2d')!;
    drawStroke(ctx, [last, p]);
  }

  function onUp() {
    const stroke = current.current;
    current.current = null;
    if (!stroke) return;
    update([...strokes, stroke]);
  }

  return (
    <div className="mt-4">
      <p className="text-sm text-muted-foreground">
        Draw the character one stroke at a time. The order doesn&apos;t have to be perfect.
      </p>
      <div className="relative mx-auto mt-3 aspect-square w-full max-w-sm">
        {/* A 米字格 guide, like practice paper. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full rounded-xl border-2 border-border text-border"
        >
          <g stroke="currentColor" strokeDasharray="2 2" strokeWidth="0.4">
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="0" y1="0" x2="100" y2="100" />
            <line x1="100" y1="0" x2="0" y2="100" />
          </g>
        </svg>
        <canvas
          ref={canvas}
          aria-label="Drawing pad"
          className="absolute inset-0 size-full touch-none text-foreground"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </div>
      <div className="mx-auto mt-2 flex max-w-sm items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {strokes.length === 0
            ? loaded
              ? 'Ready'
              : 'Loading characters…'
            : `${strokes.length} stroke${strokes.length === 1 ? '' : 's'}`}
        </span>
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={strokes.length === 0}
            onClick={() => update(strokes.slice(0, -1))}
          >
            <Undo2 /> Undo
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={strokes.length === 0}
            onClick={() => update([])}
          >
            <Eraser /> Clear
          </Button>
        </div>
      </div>
      {strokes.length > 0 && candidates.length > 0 && (
        <CharGrid chars={candidates} info={info} onPick={onPick} label="Is it one of these?" />
      )}
    </div>
  );
}

function drawStroke(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  if (points.length === 1) ctx.lineTo(points[0][0] + 0.1, points[0][1]);
  for (const [x, y] of points.slice(1)) ctx.lineTo(x, y);
  ctx.stroke();
}

/* ─── Parts ────────────────────────────────────────────────────────────── */

function PartsMode({ loaded, info, describe, onPick }: ModeProps) {
  const [chosen, setChosen] = useState<string[]>([]);

  const matches = useMemo(() => {
    if (!loaded || chosen.length === 0) return [];
    const { chars, parts } = loaded.data;
    const found = Array.from(chars).filter((c) => chosen.every((p) => parts[c]?.includes(p)));
    // A part that's a character in its own right is a match too (马 for 马).
    const self = chosen.length === 1 && chars.includes(chosen[0]) ? [chosen[0]] : [];
    return [...self, ...found];
  }, [loaded, chosen]);

  // With parts chosen, only offer parts that appear alongside them.
  const offered = useMemo(() => {
    if (!loaded) return [];
    const { picker, parts } = loaded.data;
    let keys = Object.keys(picker);
    if (chosen.length > 0) {
      const together = new Set(matches.flatMap((c) => Array.from(parts[c] ?? '')));
      keys = keys.filter((k) => together.has(k) && !chosen.includes(k));
    }
    const groups = new Map<number, string[]>();
    for (const k of keys) groups.set(picker[k], [...(groups.get(picker[k]) ?? []), k]);
    return [...groups].sort((a, b) => a[0] - b[0]);
  }, [loaded, chosen, matches]);

  function toggle(part: string) {
    const next = chosen.includes(part) ? chosen.filter((p) => p !== part) : [...chosen, part];
    setChosen(next);
    if (!loaded || next.length === 0) return;
    const { chars, parts } = loaded.data;
    describe(
      Array.from(chars)
        .filter((c) => next.every((p) => parts[c]?.includes(p)))
        .slice(0, MAX_RESULTS),
    );
  }

  if (!loaded) return <p className="mt-6 text-sm text-muted-foreground">Loading characters…</p>;

  return (
    <div className="mt-4">
      <p className="text-sm text-muted-foreground">
        Tap the parts you can see in the character — a radical like 氵 or 口, or any piece you
        recognise. Each one narrows the list.
      </p>
      {chosen.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {chosen.map((p) => (
            <Button
              key={p}
              type="button"
              size="sm"
              onClick={() => toggle(p)}
              aria-label={`Remove ${p}`}
            >
              <span lang="zh-Hans" className="text-base">
                {p}
              </span>
              <X />
            </Button>
          ))}
          <Button type="button" size="sm" variant="ghost" onClick={() => setChosen([])}>
            Clear
          </Button>
        </div>
      )}
      {chosen.length > 0 &&
        (matches.length > 0 ? (
          <CharGrid
            chars={matches.slice(0, MAX_RESULTS)}
            info={info}
            onPick={onPick}
            label={
              matches.length > MAX_RESULTS
                ? `${matches.length} characters — the most common first. Pick another part to narrow it down.`
                : `${matches.length} character${matches.length === 1 ? '' : 's'}`
            }
          />
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No character has all of those. Try removing one.
          </p>
        ))}
      <div className="mt-5 space-y-3">
        {offered.map(([count, list]) => (
          <section key={count}>
            <h3 className="text-xs font-medium text-muted-foreground">
              {count} stroke{count === 1 ? '' : 's'}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {list.map((p) => (
                <button
                  key={p}
                  type="button"
                  lang="zh-Hans"
                  onClick={() => toggle(p)}
                  className="size-10 rounded-md border border-border text-xl transition-colors hover:border-primary/60 hover:bg-muted"
                >
                  {p}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/* ─── Results ──────────────────────────────────────────────────────────── */

function CharGrid({
  chars,
  info,
  onPick,
  label,
}: {
  chars: string[];
  info: Map<string, CharInfo>;
  onPick: (char: string) => void;
  label: string;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div data-results className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {chars.map((c) => (
          <button
            key={c}
            type="button"
            data-char={c}
            onClick={() => onPick(c)}
            className="flex flex-col items-center rounded-lg border border-border px-1 py-2 transition-colors hover:border-primary/60 hover:bg-muted"
          >
            <span lang="zh-Hans" className="text-3xl leading-tight">
              {c}
            </span>
            <span className="h-4 truncate text-xs text-muted-foreground">
              {info.get(c)?.pinyin ?? ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CharPanel({
  hanzi,
  info,
  onClose,
}: {
  hanzi: string;
  info: CharInfo | undefined;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label={`${hanzi}: meaning`}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg"
    >
      <div className="mx-auto flex max-w-2xl items-start gap-3">
        <span lang="zh-Hans" className="text-5xl leading-none">
          {hanzi}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            {info?.pinyin && <Pinyin text={info.pinyin} className="text-lg" />}
            <AudioButton text={hanzi} reading={info?.pinyin} />
            {info?.hskLevel ? (
              <span className="text-xs text-muted-foreground">HSK {info.hskLevel}</span>
            ) : null}
          </div>
          <p className="line-clamp-2 text-sm">{info ? info.meaning || '—' : 'Looking it up…'}</p>
          <Link
            href={`/characters/${encodeURIComponent(hanzi)}`}
            className={`${buttonVariants({ variant: 'outline', size: 'sm' })} mt-2`}
          >
            Open its page <ArrowRight />
          </Link>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
          <X />
        </Button>
      </div>
    </div>
  );
}
