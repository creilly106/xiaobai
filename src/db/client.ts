import 'server-only';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { dbCredentials } from './config';

const { url, authToken } = dbCredentials();

const globalForDb = globalThis as unknown as {
  __libsql?: ReturnType<typeof createClient>;
};

const client = globalForDb.__libsql ?? createClient({ url, authToken });
if (process.env.NODE_ENV !== 'production') globalForDb.__libsql = client;

export const db = drizzle(client, { schema });
/** The raw libsql client, for whole-database work like backups. */
export const sqlite = client;
export { schema };
