/**
 * Visits every page of a running app and reports any that fail — an HTTP
 * error, or the app's error screen. Routes come from the app's own content,
 * so new lessons, scenarios and grammar points are covered automatically.
 *
 *   npm run smoke                      (http://localhost:3000)
 *   npm run smoke -- http://localhost:3200
 *
 * Needs the password gate off (no APP_PASSWORD), as it is locally.
 */
import { LESSONS, UNITS } from '../src/lib/curriculum';
import { grammarPoints } from '../src/lib/grammar-data';
import { scenarios } from '../src/lib/scenario-data';

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
const PARALLEL = 4;

const routes: string[] = [
  '/',
  '/learn',
  ...LESSONS.map((l) => `/learn/${l.id}`),
  ...UNITS.map((u) => `/learn/checkpoint/${u.id}`),
  '/study',
  '/quiz',
  '/quiz/session?type=both&count=5',
  '/quiz/session?type=word&count=5&answer=type',
  '/quiz/session?type=sentence&count=5&states=review&srs=1',
  '/quiz/cloze?count=5&answer=choose&scen=1&grammar=1&examples=1',
  '/quiz/cloze?count=5&answer=type&examples=1',
  '/scenarios',
  ...scenarios.flatMap((s) => [`/scenarios/${s.slug}`, `/scenarios/${s.slug}?view=dialogues`]),
  '/grammar',
  '/grammar/time',
  ...grammarPoints.map((g) => `/grammar/${g.slug}`),
  '/radicals',
  '/numbers',
  '/tones',
  '/library',
  '/library?tab=hsk&q=ni',
  '/library?tab=mine',
  '/library?tab=dictionary',
  '/library?tab=dictionary&q=hotel',
  '/library?tab=dictionary&q=jiu3dian4',
  '/library?tab=dictionary&q=%E9%85%92%E5%BA%97',
  ...['你', '好', '店', '酒店', '了', '忄', '爱'].map(
    (c) => `/characters/${encodeURIComponent(c)}`,
  ),
  '/stats',
  '/settings',
  '/api/backup',
  '/manifest.webmanifest',
  '/icon.svg',
  '/audio/index.json',
];

const ERROR_SCREEN = /Something went wrong|Application error|Internal Server Error/;

type Result = { route: string; status: number; ms: number; problem?: string };

async function check(route: string): Promise<Result> {
  const started = Date.now();
  try {
    const res = await fetch(base + route, { redirect: 'manual' });
    const body = await res.text();
    const ms = Date.now() - started;
    if (res.status >= 400) return { route, status: res.status, ms, problem: `HTTP ${res.status}` };
    if (ERROR_SCREEN.test(body)) return { route, status: res.status, ms, problem: 'error screen' };
    return { route, status: res.status, ms };
  } catch (err) {
    return { route, status: 0, ms: Date.now() - started, problem: (err as Error).message };
  }
}

async function main() {
  const queue = [...routes];
  const results: Result[] = [];
  await Promise.all(
    Array.from({ length: PARALLEL }, async () => {
      for (let r = queue.shift(); r; r = queue.shift()) results.push(await check(r));
    }),
  );
  const failed = results.filter((r) => r.problem);
  const slow = [...results].sort((a, b) => b.ms - a.ms).slice(0, 5);
  console.log(`${results.length - failed.length}/${results.length} pages OK on ${base}`);
  console.log(`Slowest: ${slow.map((r) => `${decodeURIComponent(r.route)} ${r.ms}ms`).join(', ')}`);
  for (const f of failed) console.log(`FAIL ${decodeURIComponent(f.route)} — ${f.problem}`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
