import { getDb, initializeDatabase } from '../../../core/storage/sqlite';
import { DailyRecordRepository } from '../application/DailyRecordRepository';
import { DailyRecord } from '../domain/types';

type DailyRecordRow = {
  date: string;
  total_sold: number;
  investment_cost: number;
  additional_expenses: number;
  notes: string;
};

function mapRow(row: DailyRecordRow): DailyRecord {
  return {
    date: row.date,
    totalSold: row.total_sold,
    investmentCost: row.investment_cost,
    additionalExpenses: row.additional_expenses,
    notes: row.notes,
  };
}

export class SQLiteDailyRecordRepository implements DailyRecordRepository {
  async upsert(record: DailyRecord): Promise<void> {
    await initializeDatabase();
    const db = await getDb();

    await db.runAsync(
      `
      INSERT INTO daily_records (date, total_sold, investment_cost, additional_expenses, notes)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        total_sold = excluded.total_sold,
        investment_cost = excluded.investment_cost,
        additional_expenses = excluded.additional_expenses,
        notes = excluded.notes
      `,
      [
        record.date,
        record.totalSold,
        record.investmentCost,
        record.additionalExpenses,
        record.notes,
      ]
    );
  }

  async findByDate(date: string): Promise<DailyRecord | null> {
    await initializeDatabase();
    const db = await getDb();
    const row = await db.getFirstAsync<DailyRecordRow>(
      `SELECT date, total_sold, investment_cost, additional_expenses, notes FROM daily_records WHERE date = ?`,
      [date]
    );

    return row ? mapRow(row) : null;
  }

  async findByMonth(month: string): Promise<DailyRecord[]> {
    await initializeDatabase();
    const db = await getDb();

    const rows = await db.getAllAsync<DailyRecordRow>(
      `
      SELECT date, total_sold, investment_cost, additional_expenses, notes
      FROM daily_records
      WHERE substr(date, 1, 7) = ?
      ORDER BY date ASC
      `,
      [month]
    );

    return rows.map(mapRow);
  }
}
