/**
 * Builds src/app/icon.svg — the app icon — from the stroke outlines of 小 and
 * 白 in hanzi-writer-data, so it needs no font and renders crisply at any size.
 *
 *   npx tsx scripts/build-icon.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const dataDir = path.join('node_modules', 'hanzi-writer-data');
const strokes = (ch: string): string[] =>
  (JSON.parse(readFileSync(path.join(dataDir, `${ch}.json`), 'utf8')) as { strokes: string[] })
    .strokes;

// hanzi-writer glyphs live in a 1024 box with y pointing up (top at y = 900).
// Scale each to SCALE and place its top-left at (x, TOP) in the icon.
const SCALE = 0.42;
const TOP = Math.round((1024 - 1024 * SCALE) / 2);
const glyph = (ch: string, x: number) =>
  `<g transform="translate(${x} ${TOP}) scale(${SCALE} -${SCALE}) translate(0 -900)">${strokes(ch)
    .map((d) => `<path d="${d}"/>`)
    .join('')}</g>`;

const glyphWidth = Math.round(1024 * SCALE);
const left = Math.round((1024 - 2 * glyphWidth) / 2);

// The outline thickens the brush-style strokes so the icon reads at 16–32px.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
<rect width="1024" height="1024" rx="224" fill="#0f172a"/>
<g fill="#f8fafc" stroke="#f8fafc" stroke-width="28" stroke-linejoin="round">${glyph('小', left)}${glyph('白', left + glyphWidth)}</g>
</svg>
`;

writeFileSync(path.join('src', 'app', 'icon.svg'), svg);
console.log('Wrote src/app/icon.svg');
