import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabaseGeneration } from '../../../core/storage/databaseCoordinator';
import { withDatabaseAccess } from '../../../core/storage/sqlite';
import { HolidayRepository } from '../application/HolidayRepository';
import { Holiday, HolidayScope } from '../domain/types';

const LAST_SYNC_KEY = 'holidays_last_sync';

type HolidayRow = {
  date: string;
  name: string;
  type: string;
};

function mapRow(row: HolidayRow): Holiday {
  return {
    date: row.date,
    name: row.name,
    scope: row.type as HolidayScope,
  };
}

async function upsertHolidays(
  db: Pick<SQLiteDatabase, 'runAsync'>,
  holidays: Holiday[],
): Promise<void> {
  for (const holiday of holidays) {
    await db.runAsync(
      `INSERT INTO holidays (date, name, type) VALUES (?, ?, ?)
       ON CONFLICT(date) DO UPDATE SET
         name = excluded.name,
         type = excluded.type`,
      [holiday.date, holiday.name, holiday.scope]
    );
  }
}

export class SQLiteHolidayRepository implements HolidayRepository {
  async upsertMany(holidays: Holiday[]): Promise<void> {
    await withDatabaseAccess((db) => upsertHolidays(db, holidays));
  }

  async listBetween(startDate: string, endDate: string): Promise<Holiday[]> {
    const rows = await withDatabaseAccess((db) => db.getAllAsync<HolidayRow>(
      `SELECT date, name, type FROM holidays
       WHERE date >= ? AND date <= ?
       ORDER BY date ASC`,
      [startDate, endDate]
    ));

    return rows.map(mapRow);
  }

  async getAll(): Promise<Holiday[]> {
    const rows = await withDatabaseAccess((db) => db.getAllAsync<HolidayRow>(
      `SELECT date, name, type FROM holidays ORDER BY date ASC`
    ));

    return rows.map(mapRow);
  }

  async getLastSync(): Promise<string | null> {
    const row = await withDatabaseAccess((db) => db.getFirstAsync<{ value: string }>(
      `SELECT value FROM app_meta WHERE key = ?`,
      [LAST_SYNC_KEY]
    ));

    return row?.value ?? null;
  }

  async setLastSync(timestamp: string): Promise<void> {
    await withDatabaseAccess((db) => db.runAsync(
      `INSERT INTO app_meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [LAST_SYNC_KEY, timestamp]
    ));
  }

  async applySync(holidays: Holiday[], timestamp: string | null, generation: number): Promise<boolean> {
    return withDatabaseAccess(async (db) => {
      if (getDatabaseGeneration() !== generation) {
        return false;
      }

      await db.withExclusiveTransactionAsync(async (transaction) => {
        await upsertHolidays(transaction, holidays);
        if (timestamp) {
          await transaction.runAsync(
            `INSERT INTO app_meta (key, value) VALUES (?, ?)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
            [LAST_SYNC_KEY, timestamp]
          );
        }
      });

      return true;
    });
  }
}
