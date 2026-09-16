import { getDb, initializeDatabase } from '../../../core/storage/sqlite';
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

export class SQLiteHolidayRepository implements HolidayRepository {
  async upsertMany(holidays: Holiday[]): Promise<void> {
    await initializeDatabase();
    const db = await getDb();

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

  async listBetween(startDate: string, endDate: string): Promise<Holiday[]> {
    await initializeDatabase();
    const db = await getDb();

    const rows = await db.getAllAsync<HolidayRow>(
      `SELECT date, name, type FROM holidays
       WHERE date >= ? AND date <= ?
       ORDER BY date ASC`,
      [startDate, endDate]
    );

    return rows.map(mapRow);
  }

  async getAll(): Promise<Holiday[]> {
    await initializeDatabase();
    const db = await getDb();

    const rows = await db.getAllAsync<HolidayRow>(
      `SELECT date, name, type FROM holidays ORDER BY date ASC`
    );

    return rows.map(mapRow);
  }

  async getLastSync(): Promise<string | null> {
    await initializeDatabase();
    const db = await getDb();

    const row = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM app_meta WHERE key = ?`,
      [LAST_SYNC_KEY]
    );

    return row?.value ?? null;
  }

  async setLastSync(timestamp: string): Promise<void> {
    await initializeDatabase();
    const db = await getDb();

    await db.runAsync(
      `INSERT INTO app_meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [LAST_SYNC_KEY, timestamp]
    );
  }
}