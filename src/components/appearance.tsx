'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Check, Monitor, Moon, Palette, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ACCENTS, ACCENT_STORAGE_KEY } from '@/lib/accent';
import { useHydrated, useStoredPref } from '@/lib/use-client';

const THEMES = [
  { key: 'system', label: 'System', icon: Monitor },
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
] as const;

function useAccent() {
  const [accent, setAccent] = useStoredPref(ACCENT_STORAGE_KEY, 'default');
  useEffect(() => {
    const el = document.documentElement;
    if (accent === 'default') el.removeAttribute('data-accent');
    else el.setAttribute('data-accent', accent);
  }, [accent]);
  return [accent, setAccent] as const;
}

export function ThemeChoice() {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const current = hydrated ? (theme ?? 'system') : undefined;
  return (
    <div role="radiogroup" aria-label="Color mode" className="grid grid-cols-3 gap-1.5">
      {THEMES.map(({ key, label, icon: Icon }) => {
        const active = current === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(key)}
            className={`flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
              active
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function AccentChoice() {
  const [accent, setAccent] = useAccent();
  return (
    <div role="radiogroup" aria-label="Accent color" className="grid grid-cols-5 gap-1.5">
      {ACCENTS.map((a) => {
        const active = accent === a.key;
        return (
          <button
            key={a.key}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={a.label}
            title={a.label}
            onClick={() => setAccent(a.key)}
            className={`flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-[11px] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
              active
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border/70 text-muted-foreground hover:bg-muted'
            }`}
          >
            <span
              className="flex size-5 items-center justify-center rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: a.swatch }}
            >
              {active && <Check className="size-3 text-white" />}
            </span>
            {a.label}
          </button>
        );
      })}
    </div>
  );
}

/** Header control: one button, one popover for both theme and accent. */
export function AppearanceMenu() {
  useAccent();
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Appearance settings"
            title="Appearance"
          />
        }
      >
        <Palette />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 gap-3 p-3">
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground">Mode</div>
          <ThemeChoice />
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground">Accent</div>
          <AccentChoice />
        </div>
      </PopoverContent>
    </Popover>
  );
}
