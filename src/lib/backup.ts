import 'server-only';
import { mkdir, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { InStatement, Value } from '@libsql/client';
import { sqlite } from '@/db/client';
import { localDateKey } from '@/lib/dates';

// Whole-database backups as JSON: every table, every row, raw column values.
// JSON rather than a copy of the .db file so it also works against a hosted
// database later, and so a backup can be inspected by eye.

export const BACKUP_FORMAT = 'xiaobai-backup';
export const BACKUP_VERSION = 1;

export type Backup = {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  tables: Record<string, Record<string, Value>[]>;
};

/** Parents before children, so inserts satisfy foreign keys. */
const TABLE_ORDER = [
  'words',
  'sentences',
  'tags',
  'word_tags',
  'sentence_tags',
  'decks',
  'cards',
  'reviews',
  'settings',
  'practice_log',
];

const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups');
const KEEP_AUTO_BACKUPS = 7;
const INSERT_CHUNK = 100;

/**
 * Reference data that can be re-imported (npm run data:dictionary). Left out
 * of backups — it's 125k rows — and left untouched by restores.
 */
const NOT_BACKED_UP = new Set(['dictionary']);

async function tableNames(): Promise<string[]> {
  const rs = await sqlite.execute(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle%'",
  );
  const names = rs.rows.map((r) => String(r.name)).filter((n) => !NOT_BACKED_UP.has(n));
  const known = TABLE_ORDER.filter((t) => names.includes(t));
  return [...known, ...names.filter((t) => !known.includes(t)).sort()];
}

async function columnsOf(table: string): Promise<string[]> {
  const rs = await sqlite.execute(`PRAGMA table_info("${table}")`);
  return rs.rows.map((r) => String(r.name));
}

export async function createBackup(): Promise<Backup> {
  const tables: Backup['tables'] = {};
  for (const table of await tableNames()) {
    const rs = await sqlite.execute(`SELECT * FROM "${table}"`);
    tables[table] = rs.rows.map((row) =>
      Object.fromEntries(rs.columns.map((col, i) => [col, row[i] ?? null])),
    );
  }
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    tables,
  };
}

/** Throws with a readable message if `data` isn't a backup this app can restore. */
export function assertBackup(data: unknown): asserts data is Backup {
  const b = data as Partial<Backup> | null;
  if (!b || typeof b !== 'object' || b.format !== BACKUP_FORMAT) {
    throw new Error("This file isn't a Xiaobai backup.");
  }
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) {
    throw new Error('This backup comes from a newer version of the app.');
  }
  if (!b.tables || typeof b.tables !== 'object') throw new Error('The backup has no tables.');
  for (const [name, rows] of Object.entries(b.tables)) {
    if (!/^[a-z_]+$/.test(name) || !Array.isArray(rows)) {
      throw new Error(`The backup's "${name}" table is malformed.`);
    }
  }
}

/**
 * Replace the whole database with `backup`, atomically: if anything fails,
 * nothing changes. Only tables and columns that exist today are restored, so
 * an older backup still loads after a schema change (new columns keep their
 * defaults).
 */
export async function restoreBackup(backup: Backup): Promise<{ rows: number }> {
  const tables = await tableNames();
  const statements: InStatement[] = [];
  for (const table of [...tables].reverse()) statements.push(`DELETE FROM "${table}"`);

  let rows = 0;
  for (const table of tables) {
    const data = backup.tables[table];
    if (!data?.length) continue;
    const cols = (await columnsOf(table)).filter((c) => c in data[0]);
    if (cols.length === 0) continue;
    for (let i = 0; i < data.length; i += INSERT_CHUNK) {
      const chunk = data.slice(i, i + INSERT_CHUNK);
      const placeholders = chunk.map(() => `(${cols.map(() => '?').join(', ')})`).join(', ');
      statements.push({
        sql: `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(', ')}) VALUES ${placeholders}`,
        args: chunk.flatMap((row) => cols.map((c) => row[c] ?? null)),
      });
      rows += chunk.length;
    }
  }
  await sqlite.batch(statements, 'write');
  return { rows };
}

/** Save a backup file under data/backups (kept out of git). Returns its name. */
export async function writeBackupFile(kind: 'auto' | 'pre-restore'): Promise<string> {
  await mkdir(BACKUP_DIR, { recursive: true });
  const stamp =
    kind === 'auto' ? localDateKey(new Date()) : new Date().toISOString().replace(/[:.]/g, '-');
  const name = `${kind}-${stamp}.json`;
  await writeFile(path.join(BACKUP_DIR, name), JSON.stringify(await createBackup()));
  if (kind === 'auto') await pruneAutoBackups();
  return name;
}

async function pruneAutoBackups() {
  const autos = (await readdir(BACKUP_DIR)).filter((f) => f.startsWith('auto-')).sort();
  for (const old of autos.slice(0, Math.max(0, autos.length - KEEP_AUTO_BACKUPS))) {
    await unlink(path.join(BACKUP_DIR, old));
  }
}

export type BackupFile = { name: string; savedAt: number; bytes: number };

/** Local backup files, newest first. */
export async function listBackupFiles(): Promise<BackupFile[]> {
  try {
    const names = (await readdir(BACKUP_DIR)).filter((f) => f.endsWith('.json'));
    const files = await Promise.all(
      names.map(async (name) => {
        const s = await stat(path.join(BACKUP_DIR, name));
        return { name, savedAt: s.mtimeMs, bytes: s.size };
      }),
    );
    return files.sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}
