// Where the database lives. Locally a SQLite file; deployed, a Turso (libsql)
// database. Accepts both the Turso/Vercel integration's variable names and
// our own. No 'server-only' here: scripts and drizzle.config use it too.

export function dbCredentials(): { url: string; authToken: string | undefined } {
  return {
    url: process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? 'file:./data/app.db',
    authToken: process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN,
  };
}

export const isRemoteDb = () => !dbCredentials().url.startsWith('file:');
