'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type NavItem = { href: string; label: string; desc?: string; match?: string[] };

/** Groups shown as a dropdown on wide screens; the rest are plain links. */
export const NAV_GROUPS: { label: string; menu?: boolean; items: NavItem[] }[] = [
  {
    label: 'Learn',
    items: [{ href: '/learn', label: 'Learn' }],
  },
  {
    label: 'Practice',
    menu: true,
    items: [
      { href: '/study', label: 'Review', desc: 'Your spaced-repetition reviews for today' },
      { href: '/quiz', label: 'Quiz', desc: 'Flashcards, typed meanings, fill in the blank' },
      { href: '/tones', label: 'Tones', desc: 'Hear it, pick the tones' },
    ],
  },
  {
    label: 'Explore',
    menu: true,
    items: [
      { href: '/scenarios', label: 'Scenarios', desc: 'Real-life phrases by situation' },
      {
        href: '/library',
        label: 'Library',
        desc: 'Your words and the full dictionary',
        match: ['/characters'],
      },
      { href: '/grammar', label: 'Grammar', desc: 'Sentence patterns with examples' },
      { href: '/radicals', label: 'Radicals', desc: 'The building blocks of characters' },
      { href: '/numbers', label: 'Numbers', desc: 'Counting, prices, dates and times' },
    ],
  },
  {
    label: 'Progress',
    items: [{ href: '/stats', label: 'Stats' }],
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
              <div className="font-medium">{item.label}</div>
              {item.desc && <div className="text-xs text-muted-foreground">{item.desc}</div>}
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
        <nav aria-label="Main" className="flex flex-col gap-5 px-4 pb-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-current={pathname === '/' ? 'page' : undefined}
            className={`rounded-md px-3 py-2 text-sm ${
              pathname === '/' ? 'bg-muted font-medium' : 'hover:bg-muted/60'
            }`}
          >
            Home
          </Link>
          {NAV_GROUPS.map((g) => (
            <div key={g.label}>
              <div className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {g.label}
              </div>
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
                      {item.label}
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
