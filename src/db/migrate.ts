import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { dbCredentials } from './config';

async function main() {
  const client = createClient(dbCredentials());
  const db = drizzle(client);
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations applied.');
  client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
