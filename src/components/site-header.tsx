import Link from 'next/link';
import { Settings2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { AppearanceMenu } from '@/components/appearance';
import { MainNav, MobileNav } from '@/components/main-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-1.5 focus:text-sm focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-baseline gap-2" aria-label="Xiaobai home">
          <span lang="zh-Hans" className="text-xl font-semibold leading-none">
            小白
          </span>
          <span className="text-sm font-medium tracking-tight text-muted-foreground">Xiaobai</span>
        </Link>
        <div className="flex items-center gap-1">
          <MainNav />
          <div className="mx-1 hidden h-6 w-px bg-border/60 lg:block" aria-hidden />
          <AppearanceMenu />
          <Link
            href="/settings"
            aria-label="Settings"
            title="Settings"
            className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}
          >
            <Settings2 />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
