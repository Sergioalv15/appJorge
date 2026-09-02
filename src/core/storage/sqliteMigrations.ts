export interface MigratableDatabase {
  getFirstAsync<T>(source: string): Promise<T | null>;
  execAsync(source: string): Promise<void>;
}

type UserVersionRow = {
  user_version: number;
};

type Migration = {
  version: number;
  name: string;
  up: (db: MigratableDatabase) => Promise<void>;
};

const schemaMigrations: Migration[] = [
  {
    version: 1,
    name: 'create-daily-records-table',
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS daily_records (
          date TEXT PRIMARY KEY NOT NULL,
          total_sold REAL NOT NULL,
          investment_cost REAL NOT NULL,
          additional_expenses REAL NOT NULL,
          notes TEXT NOT NULL DEFAULT ''
        );

        CREATE INDEX IF NOT EXISTS idx_daily_records_date ON daily_records(date);
      `);
    },
  },
];

async function getUserVersion(db: MigratableDatabase): Promise<number> {
  const row = await db.getFirstAsync<UserVersionRow>('PRAGMA user_version;');
  return row?.user_version ?? 0;
}

async function runMigrationTransaction(db: MigratableDatabase, migration: Migration): Promise<void> {
  await db.execAsync('BEGIN IMMEDIATE;');

  try {
    await migration.up(db);
    await db.execAsync(`PRAGMA user_version = ${migration.version};`);
    await db.execAsync('COMMIT;');
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    throw new Error(`Migration ${migration.version} (${migration.name}) failed`, {
      cause: error,
    });
  }
}

export async function runMigrations(db: MigratableDatabase): Promise<void> {
  const currentVersion = await getUserVersion(db);
  const pending = schemaMigrations
    .filter((migration) => migration.version > currentVersion)
    .sort((left, right) => left.version - right.version);

  for (const migration of pending) {
    await runMigrationTransaction(db, migration);
  }
}
