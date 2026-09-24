'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type NavItem = { href: string; label: string; match?: string[] };

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Practice',
    items: [
      { href: '/study', label: 'Study' },
      { href: '/quiz', label: 'Quiz' },
      { href: '/scenarios', label: 'Scenarios' },
      { href: '/tones', label: 'Tones' },
      { href: '/numbers', label: 'Numbers' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { href: '/grammar', label: 'Grammar' },
      { href: '/radicals', label: 'Radicals' },
      { href: '/library', label: 'Library', match: ['/characters'] },
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

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-0.5 text-sm lg:flex">
      {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              active
                ? 'bg-muted font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
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
