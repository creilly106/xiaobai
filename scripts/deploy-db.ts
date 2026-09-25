/**
 * Runs before every build (see "prebuild"). On a deployment with a remote
 * (Turso) database, brings it up to date: migrations, HSK words, scenarios,
 * and the dictionary if it's still empty. Every step is safe to repeat.
 * Locally (a SQLite file) it does nothing — use the db:* scripts yourself.
 */
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { isRemoteDb } from '../src/db/config';

if (!isRemoteDb()) {
  console.log('Local database — skipping deploy-time database setup.');
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
