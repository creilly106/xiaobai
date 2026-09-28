'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BookCheck,
  BookOpen,
  ChevronDown,
  CircleCheck,
  CirclePlay,
  FastForward,
  Lock,
  Sparkles,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { LessonState, PathUnitView } from '@/lib/queries/path';

const STATE: Record<LessonState, { icon: typeof Lock; label: string; className: string }> = {
  done: { icon: CircleCheck, label: 'Done', className: 'text-emerald-600 dark:text-emerald-400' },
  tested: { icon: FastForward, label: 'Tested out', className: 'text-sky-600 dark:text-sky-400' },
  known: { icon: BookCheck, label: 'Already known', className: 'text-sky-600 dark:text-sky-400' },
  current: { icon: CirclePlay, label: 'Up next', className: 'text-primary' },
  new: { icon: Sparkles, label: 'New', className: 'text-amber-600 dark:text-amber-400' },
  locked: { icon: Lock, label: 'Locked', className: 'text-muted-foreground/60' },
};

/**
 * One unit on the path. Its lessons are only drawn once it's opened: with
 * 88 units, drawing every row up front made the page a megabyte of HTML.
 */
export function UnitCard({
  unit,
  number,
  stories,
}: {
  unit: PathUnitView;
  number: number;
  /** Stories this unit unlocks, shown once it's finished. */
  stories: { id: string; title: string }[];
}) {
  const complete = unit.finished === unit.lessons.length;
  const active = unit.lessons.some((l) => l.state === 'current');
  // Only the unit you're in starts open, so the path stays short on a phone.
  const [open, setOpen] = useState(active);
  return (
    <li>
      <Card className={active ? 'border-primary/40' : ''}>
        <details
          open={open}
          onToggle={(e) => setOpen(e.currentTarget.open)}
          className="group"
          data-unit={unit.id}
        >
          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Unit {number}
              </div>
              <div className="text-lg font-semibold">{unit.title}</div>
              <div className="text-sm text-muted-foreground">{unit.description}</div>
            </div>
            <div
              className={`text-right text-sm tabular-nums ${complete ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}
            >
              {complete ? '✓ ' : ''}
              {unit.finished} / {unit.lessons.length}
            </div>
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          {open && <UnitLessons unit={unit} complete={complete} stories={stories} />}
        </details>
      </Card>
    </li>
  );
}

function UnitLessons({
  unit,
  complete,
  stories,
}: {
  unit: PathUnitView;
  complete: boolean;
  stories: { id: string; title: string }[];
}) {
  return (
    <div className="border-t px-2 py-2">
      <ul>
        {unit.lessons.map((lesson) => {
          const s = STATE[lesson.state];
          const Icon = s.icon;
          const body = (
            <>
              <Icon className={`size-5 shrink-0 ${s.className}`} aria-label={s.label} />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{lesson.title}</div>
                <div lang="zh-Hans" className="truncate text-sm text-muted-foreground">
                  {lesson.words.join(' ')}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {lesson.state === 'done' && lesson.bestScore != null
                  ? `${lesson.bestScore}%`
                  : lesson.state === 'locked'
                    ? ''
                    : s.label}
              </span>
            </>
          );
          return (
            <li key={lesson.id}>
              {lesson.state === 'locked' ? (
                <div className="flex items-center gap-3 rounded-md px-3 py-2 opacity-70">
                  {body}
                </div>
              ) : (
                <Link
                  href={`/learn/${lesson.id}`}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/60 ${lesson.state === 'current' ? 'bg-primary/5' : ''}`}
                >
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
        {!complete && (
          <Link
            href={`/learn/checkpoint/${unit.id}`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <FastForward /> Already know this? Test out
          </Link>
        )}
        {unit.scenario && (
          <Link
            href={`/scenarios/${unit.scenario}?view=dialogues`}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Practise the dialogue <ArrowRight />
          </Link>
        )}
        {complete &&
          stories.map((story) => (
            <Link
              key={story.id}
              href={`/read/${story.id}`}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              <BookOpen /> Read: {story.title}
            </Link>
          ))}
      </div>
    </div>
  );
}
