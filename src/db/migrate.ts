import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

async function main() {
  const url = process.env.DATABASE_URL ?? 'file:./data/app.db';
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  const client = createClient({ url, authToken });
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations applied.');
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
