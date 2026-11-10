/**
 * Runs before every build (see "prebuild"). On a deployment with a remote
 * (Turso) database, brings it up to date: migrations, HSK words, scenarios,
 * and the dictionary if it's still empty. Every step is safe to repeat.
 * Locally (a SQLite file), and on preview builds, it does nothing — use the
 * db:* scripts yourself.
 */
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { isRemoteDb } from '../src/db/config';

if (!isRemoteDb()) {
  console.log('Local database — skipping deploy-time database setup.');
} else if (process.env.VERCEL && process.env.VERCEL_ENV !== 'production') {
  // A preview build (a branch or pull request) must never migrate or seed the
  // live database: its migrations aren't on master yet.
  console.log(`${process.env.VERCEL_ENV} build — skipping deploy-time database setup.`);
} else {
  for (const step of [
    'npm run db:migrate',
    'npm run db:seed',
    'npm run db:seed-scenarios',
    'npm run data:dictionary -- --if-empty',
  ]) {
    console.log(`\n> ${step}`);
    execSync(step, { stdio: 'inherit' });
  }
}
