import { getDb, initializeDatabase } from '../../../../core/storage/sqlite';
import {
  AddInvestmentAdjustmentInput,
  InvestmentAdjustmentRepository,
} from '../application/InvestmentAdjustmentRepository';
import { InvestmentAdjustment } from '../domain/types';

type InvestmentAdjustmentRow = {
  id: number;
  date: string;
  amount: number;
  note: string;
};

function mapRow(row: InvestmentAdjustmentRow): InvestmentAdjustment {
  return {
    id: row.id,
    date: row.date,
    amount: row.amount,
    note: row.note,
  };
}

export class SQLiteInvestmentAdjustmentRepository implements InvestmentAdjustmentRepository {
  async add(input: AddInvestmentAdjustmentInput): Promise<InvestmentAdjustment> {
    await initializeDatabase();
    const db = await getDb();

    const result = await db.runAsync(
      `INSERT INTO investment_adjustments (date, amount, note) VALUES (?, ?, ?)`,
      [input.date, input.amount, input.note]
    );

    return {
      id: result.lastInsertRowId,
      date: input.date,
      amount: input.amount,
      note: input.note,
    };
  }

  async listAll(): Promise<InvestmentAdjustment[]> {
    await initializeDatabase();
    const db = await getDb();

    const rows = await db.getAllAsync<InvestmentAdjustmentRow>(
      `SELECT id, date, amount, note FROM investment_adjustments ORDER BY date ASC, id ASC`
    );

    return rows.map(mapRow);
  }

  async sumAmount(): Promise<number> {
    await initializeDatabase();
    const db = await getDb();

    const row = await db.getFirstAsync<{ total: number | null }>(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM investment_adjustments`
    );

    return row?.total ?? 0;
  }
}
