import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import { dbCredentials, isRemoteDb } from './src/db/config';

const shared = { schema: './src/db/schema.ts', out: './drizzle' };

// A Turso database needs the 'turso' dialect to send its auth token.
export default (isRemoteDb()
  ? { ...shared, dialect: 'turso', dbCredentials: dbCredentials() }
  : { ...shared, dialect: 'sqlite', dbCredentials: { url: dbCredentials().url } }) satisfies Config;
