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
  {
    version: 2,
    name: 'create-investment-adjustments-table',
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS investment_adjustments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          amount REAL NOT NULL,
          note TEXT NOT NULL DEFAULT ''
        );

        CREATE INDEX IF NOT EXISTS idx_investment_adjustments_date ON investment_adjustments(date);
      `);
    },
  },
  {
    version: 3,
    name: 'add-profit-percent-column',
    up: async (db) => {
      await db.execAsync(
        'ALTER TABLE daily_records ADD COLUMN profit_percent REAL NOT NULL DEFAULT 0.3;'
      );
      await db.execAsync(
        'ALTER TABLE daily_records ADD COLUMN net_profit REAL NOT NULL DEFAULT 0;'
      );
    },
  },
  {
    version: 4,
    name: 'repair-net-profit-column',
    up: async (db) => {
      const row = await db.getFirstAsync<{ hasColumn: number }>(
        `SELECT COUNT(*) AS hasColumn
         FROM pragma_table_info('daily_records')
         WHERE name = 'net_profit';`
      );
      if (!row || row.hasColumn === 0) {
        await db.execAsync(
          'ALTER TABLE daily_records ADD COLUMN net_profit REAL NOT NULL DEFAULT 0;'
        );
      }
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
