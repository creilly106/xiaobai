'use client';

import type { ButtonHTMLAttributes } from 'react';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  as?: 'button';
};

export function Chip({
  selected = false,
  className = '',
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 disabled:pointer-events-none ${
        selected
          ? 'border-primary bg-primary/10 text-foreground shadow-sm'
          : 'border-border/70 bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function ToggleSwitch({
  value,
  onChange,
  label,
  size = 'md',
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  const dims =
    size === 'sm'
      ? { track: 'h-5 w-9', knob: 'size-3.5 top-[3px]', on: 'left-[19px]', off: 'left-[3px]' }
      : { track: 'h-6 w-11', knob: 'size-4 top-0.5', on: 'left-6', off: 'left-0.5' };
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      aria-label={label}
      className={`relative rounded-full border transition-colors ${dims.track} ${
        value ? 'border-primary bg-primary' : 'border-border bg-muted'
      }`}
    >
      <span
        className={`absolute rounded-full bg-background shadow transition-all ${dims.knob} ${
          value ? dims.on : dims.off
        }`}
      />
    </button>
  );
}
