'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  AudioLines,
  BarChart3,
  BookOpen,
  BookOpenText,
  ChevronDown,
  Dices,
  GraduationCap,
  Hash,
  House,
  Languages,
  Layers,
  Menu,
  MessagesSquare,
  PenLine,
  Puzzle,
  SquareSplitHorizontal,
  Target,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  desc?: string;
  match?: string[];
};

/** Groups shown as a dropdown on wide screens; the rest are plain links. */
export const NAV_GROUPS: { label: string; menu?: boolean; items: NavItem[] }[] = [
  {
    label: 'Learn',
    items: [{ href: '/learn', label: 'Learn', icon: GraduationCap }],
  },
  {
    label: 'Practice',
    menu: true,
    items: [
      {
        href: '/study',
        label: 'Review',
        icon: Layers,
        desc: 'Your spaced-repetition reviews for today',
      },
      {
        href: '/quiz',
        label: 'Quiz',
        icon: Dices,
        desc: 'Flashcards, typed meanings, fill in the blank',
      },
      {
        href: '/read',
        label: 'Read',
        icon: BookOpen,
        desc: 'Short stories with the words you know',
      },
      { href: '/tones', label: 'Tones', icon: AudioLines, desc: 'Hear it, pick the tones' },
      {
        href: '/problem-words',
        label: 'Problem words',
        icon: Target,
        desc: 'The ones you keep missing',
      },
    ],
  },
  {
    label: 'Explore',
    menu: true,
    items: [
      {
        href: '/scenarios',
        label: 'Scenarios',
        icon: MessagesSquare,
        desc: 'Real-life phrases by situation',
      },
      {
        href: '/library',
        label: 'Library',
        icon: BookOpenText,
        desc: 'Your words and the full dictionary',
        match: ['/characters'],
      },
      {
        href: '/breakdown',
        label: 'Break it down',
        icon: SquareSplitHorizontal,
        desc: 'Paste Chinese to read it word by word',
      },
      {
        href: '/find',
        label: 'Find a character',
        icon: PenLine,
        desc: 'Draw it, or pick the parts you can see',
      },
      {
        href: '/grammar',
        label: 'Grammar',
        icon: Languages,
        desc: 'Sentence patterns with examples',
      },
      {
        href: '/radicals',
        label: 'Radicals',
        icon: Puzzle,
        desc: 'The building blocks of characters',
      },
      { href: '/numbers', label: 'Numbers', icon: Hash, desc: 'Counting, prices, dates and times' },
    ],
  },
  {
    label: 'Progress',
    menu: true,
    items: [
      {
        href: '/level',
        label: 'Level & rank',
        icon: Trophy,
        desc: 'Weekly Level check, ranks and milestones',
      },
      {
        href: '/stats',
        label: 'Stats',
        icon: BarChart3,
        desc: "Reviews, retention and what's coming up",
      },
    ],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  const prefixes = [item.href, ...(item.match ?? [])];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

const linkClass = (active: boolean) =>
  `rounded-md px-3 py-1.5 transition-colors ${
    active
      ? 'bg-muted font-medium text-foreground'
      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
  }`;

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-0.5 text-sm lg:flex">
      {NAV_GROUPS.map((group) =>
        group.menu ? (
          <NavMenu key={group.label} label={group.label} items={group.items} pathname={pathname} />
        ) : (
          group.items.map((item) => {
            const active = isActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            );
          })
        ),
      )}
    </nav>
  );
}

function NavMenu({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const active = items.some((item) => isActive(pathname, item));
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={`${linkClass(active)} inline-flex items-center gap-1`}>
        {label}
        <ChevronDown className="size-3.5 opacity-60" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 gap-0.5 p-1.5">
        {items.map((item) => {
          const current = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={current ? 'page' : undefined}
              className={`rounded-md px-3 py-2 transition-colors hover:bg-muted/70 ${current ? 'bg-muted' : ''}`}
            >
              <div className="flex items-start gap-3">
                <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div>
                  <div className="font-medium">{item.label}</div>
                  {item.desc && <div className="text-xs text-muted-foreground">{item.desc}</div>}
                </div>
              </div>
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>
            <span lang="zh-Hans">小白</span> Xiaobai
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Main" className="flex flex-col gap-3 px-4 pb-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-current={pathname === '/' ? 'page' : undefined}
            className={`rounded-md px-3 py-2 text-sm ${
              pathname === '/' ? 'bg-muted font-medium' : 'hover:bg-muted/60'
            }`}
          >
            <span className="flex items-center gap-3">
              <House className="size-4 text-muted-foreground" aria-hidden />
              Home
            </span>
          </Link>
          {NAV_GROUPS.map((g) => (
            <div key={g.label}>
              {/* A heading over a single link (Learn, Stats) only adds noise. */}
              {g.items.length > 1 && (
                <div className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {g.label}
                </div>
              )}
              <div className="flex flex-col">
                {g.items.map((item) => {
                  const active = isActive(pathname, item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`rounded-md px-3 py-2 text-sm transition-colors ${
                        active ? 'bg-muted font-medium' : 'hover:bg-muted/60'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="size-4 text-muted-foreground" aria-hidden />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
