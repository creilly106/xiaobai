import 'server-only';
import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { dbCredentials } from './config';

type Db = LibSQLDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __libsql?: Client; __db?: Db };

/**
 * Connect on first use, not on import: Next loads route modules while
 * building, and a build shouldn't need (or try to open) a database.
 */
function connect(): { client: Client; db: Db } {
  if (!globalForDb.__libsql || !globalForDb.__db) {
    const { url, authToken } = dbCredentials();
    if (process.env.VERCEL && url.startsWith('file:')) {
      throw new Error(
        'No database configured for this deployment. Set TURSO_DATABASE_URL and ' +
          'TURSO_AUTH_TOKEN for this environment in Vercel, then redeploy.',
      );
    }
    globalForDb.__libsql = createClient({ url, authToken });
    globalForDb.__db = drizzle(globalForDb.__libsql, { schema });
  }
  return { client: globalForDb.__libsql, db: globalForDb.__db };
}

/** Forwards to the real object, created on first property access. */
function lazy<T extends object>(get: () => T): T {
  return new Proxy({} as T, {
    get(_, prop) {
      const target = get();
      const value = Reflect.get(target, prop, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

export const db: Db = lazy(() => connect().db);
/** The raw libsql client, for whole-database work like backups. */
export const sqlite: Client = lazy(() => connect().client);
export { schema };
