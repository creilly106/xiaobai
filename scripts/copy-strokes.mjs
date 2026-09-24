// Copies stroke-order data from the hanzi-writer-data package into
// public/strokes/ so it's served as static files — stroke animations and
// handwriting practice then work without an internet connection.
// Runs automatically before `npm run dev` and `npm run build`; the output is
// generated, so it's git-ignored.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const source = path.dirname(require.resolve('hanzi-writer-data/package.json'));
const target = path.join('public', 'strokes');

const files = readdirSync(source).filter((f) => f.endsWith('.json') && f !== 'package.json');
const present = existsSync(target) ? readdirSync(target).length : 0;
if (present >= files.length) process.exit(0);

mkdirSync(target, { recursive: true });
for (const f of files) copyFileSync(path.join(source, f), path.join(target, f));
console.log(`Copied ${files.length} stroke files to ${target}`);
