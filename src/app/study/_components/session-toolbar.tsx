'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  MoonStar,
  MoreHorizontal,
  PauseCircle,
  TriangleAlert,
  Undo2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';

type ToolbarProps = {
  done: number;
  remaining: number;
  pending: boolean;
  canUndo: boolean;
  onUndo: () => void;
  pinyinAlways: boolean;
  onTogglePinyin: () => void;
  autoplay: boolean;
  onToggleAutoplay: () => void;
  onBury: () => void;
  onSuspend: () => void;
};

/** Undo, pinyin/audio toggles, progress and the card options menu. */
export function SessionToolbar({
  done,
  remaining,
  pending,
  canUndo,
  onUndo,
  pinyinAlways,
  onTogglePinyin,
  autoplay,
  onToggleAutoplay,
  onBury,
  onSuspend,
}: ToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const percent = Math.round((done / Math.max(done + remaining, 1)) * 100);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Undo last rating"
        aria-keyshortcuts="Control+Z"
        disabled={!canUndo || pending}
        onClick={onUndo}
        title="Undo last rating (Ctrl+Z)"
      >
        <Undo2 />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Always show pinyin before revealing the answer"
        aria-pressed={pinyinAlways}
        onClick={onTogglePinyin}
        title={
          pinyinAlways
            ? 'Pinyin always shown — click to hide'
            : 'Pinyin hidden until flip — click to always show'
        }
      >
        {pinyinAlways ? <Eye /> : <EyeOff />}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Play audio automatically when the answer is shown"
        aria-pressed={autoplay}
        onClick={onToggleAutoplay}
        title={
          autoplay
            ? 'Audio plays on reveal — click to turn off (P replays)'
            : 'Audio off on reveal — click to turn on (P still plays)'
        }
      >
        {autoplay ? <Volume2 /> : <VolumeX />}
      </Button>
      <Progress value={percent} className="flex-1" aria-label="Session progress" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={done}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="min-w-12 text-right text-sm tabular-nums text-muted-foreground"
        >
          {done} / {done + remaining}
        </motion.span>
      </AnimatePresence>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Card options"
              title="Card options"
              disabled={pending}
            />
          }
        >
          <MoreHorizontal />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 gap-1 p-1.5">
          <CardOption
            icon={<MoonStar />}
            label="Skip until tomorrow"
            desc="Hide this card for today. No rating is recorded."
            onClick={() => {
              setMenuOpen(false);
              onBury();
            }}
          />
          <CardOption
            icon={<PauseCircle />}
            label="Suspend card"
            desc="Stop showing it until you unsuspend it in Settings."
            onClick={() => {
              setMenuOpen(false);
              onSuspend();
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function CardOption({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
    >
      {icon}
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

/** "2 new · 1 learning · 0 review" under the progress bar. */
export function QueueCounts({
  counts,
}: {
  counts: { new: number; learning: number; review: number };
}) {
  return (
    <div
      className="mb-4 mt-2 flex justify-center gap-3 text-xs text-muted-foreground"
      aria-label="Cards left"
    >
      <span>
        <span className="font-medium text-primary tabular-nums">{counts.new}</span> new
      </span>
      <span>
        <span className="font-medium text-foreground tabular-nums">{counts.learning}</span> learning
      </span>
      <span>
        <span className="font-medium text-foreground tabular-nums">{counts.review}</span> review
      </span>
    </div>
  );
}

/** Offered when a card has been missed repeatedly. */
export function LeechBanner({
  fails,
  pending,
  onBury,
  onSuspend,
}: {
  fails: number;
  pending: boolean;
  onBury: () => void;
  onSuspend: () => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
      <TriangleAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <span className="min-w-0 flex-1">
        This one keeps slipping ({fails} misses). Try the hint, or give it a rest.
      </span>
      <span className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={onBury} disabled={pending}>
          Skip today
        </Button>
        <Button size="sm" variant="ghost" onClick={onSuspend} disabled={pending}>
          Suspend
        </Button>
      </span>
    </div>
  );
}
