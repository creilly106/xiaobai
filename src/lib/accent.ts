export const ACCENT_STORAGE_KEY = 'chinese-app-accent';

export const ACCENTS = [
  { key: 'default', label: 'Slate', swatch: '#334155' },
  { key: 'blue', label: 'Blue', swatch: '#2563eb' },
  { key: 'emerald', label: 'Emerald', swatch: '#059669' },
  { key: 'rose', label: 'Rose', swatch: '#e11d48' },
  { key: 'amber', label: 'Amber', swatch: '#d97706' },
] as const;

/**
 * Runs before first paint (see layout.tsx) so the saved accent never flashes.
 * Kept as a string because it executes outside React.
 */
export const ACCENT_INIT_SCRIPT = `try{var a=localStorage.getItem('${ACCENT_STORAGE_KEY}');if(a&&a!=='default')document.documentElement.setAttribute('data-accent',a)}catch(e){}`;
