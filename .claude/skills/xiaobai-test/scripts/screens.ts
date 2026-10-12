// Phone-sized screenshots of the running app, for checking how pages look.
//
//   npx tsx .claude/skills/xiaobai-test/scripts/screens.ts <outDir> [options] [/path …]
//
// Options:
//   --base=http://localhost:3200   app to visit (default)
//   --dark                         dark mode
//   --touch                        report a finger, not a mouse (pointer: coarse, hover: none);
//                                  headless Chrome otherwise hides phone-only behaviour
//   --full                         whole page (capped at 2600px tall) instead of one screen
// Paths default to the main pages. Prints status, page height, horizontal overflow
// and any page errors for each, so problems show up without opening every image.
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const out = positional[0];
if (!out) {
  console.log('Usage: screens.ts <outDir> [--base=URL] [--dark] [--touch] [--full] [/path …]');
  process.exit(1);
}
const base = (
  args.find((a) => a.startsWith('--base='))?.slice(7) ?? 'http://localhost:3200'
).replace(/\/$/, '');
const dark = args.includes('--dark');
const touch = args.includes('--touch');
const full = args.includes('--full');
/**
 * Git Bash rewrites "/level" into "C:/Program Files/Git/level" before Node sees it;
 * undo that, and accept "level" without the slash too.
 */
const asPath = (arg: string) => {
  const msys = /^[A-Za-z]:[\\/].*?[\\/]Git([\\/].*)$/.exec(arg);
  const p = (msys ? msys[1] : arg).replace(/\\/g, '/');
  return p.startsWith('/') ? p : `/${p}`;
};
const paths = positional.slice(1).map(asPath);
const DEFAULT = [
  '/',
  '/learn',
  '/study',
  '/quiz',
  '/read',
  '/tones',
  '/scenarios',
  '/library',
  '/breakdown',
  '/find',
  '/grammar',
  '/radicals',
  '/numbers',
  '/level',
  '/problem-words',
  '/stats',
  '/settings',
];

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

(async () => {
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME.find((p) => existsSync(p)) });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    colorScheme: dark ? 'dark' : 'light',
  });
  for (const path of paths.length ? paths : DEFAULT) {
    const page = await context.newPage();
    if (touch) {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setEmulatedMedia', {
        features: [
          { name: 'pointer', value: 'coarse' },
          { name: 'hover', value: 'none' },
        ],
      });
    }
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    const res = await page.goto(base + path, { waitUntil: 'networkidle' }).catch((e) => e);
    await page.waitForTimeout(600);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    const name =
      (path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home') + (dark ? '-dark' : '');
    await page.screenshot({
      path: `${out}/${name}.png`,
      ...(full ? { clip: { x: 0, y: 0, width: 390, height: Math.min(height, 2600) } } : {}),
      fullPage: full,
    });
    console.log(
      `${name}.png  ${res?.status?.() ?? res}  h=${height}${width > 390 ? `  OVERFLOW w=${width}` : ''}${errors.length ? `  ERRORS: ${errors.join(' | ')}` : ''}`,
    );
    await page.close();
  }
  await browser.close();
})();
