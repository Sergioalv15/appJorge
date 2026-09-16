import { getDb, initializeDatabase } from '../../../core/storage/sqlite';
import { toIsoDate } from '../../../core/utils/date';
import { SupplierRepository } from '../application/SupplierRepository';
import { NewSupplier, Supplier } from '../domain/types';

type SupplierRow = {
  id: number;
  name: string;
  phone: string;
  notes: string;
  created_at: string;
};

function mapRow(row: SupplierRow): Supplier {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export class SQLiteSupplierRepository implements SupplierRepository {
  async list(): Promise<Supplier[]> {
    await initializeDatabase();
    const db = await getDb();

    const rows = await db.getAllAsync<SupplierRow>(
      `SELECT id, name, phone, notes, created_at FROM suppliers ORDER BY name COLLATE NOCASE ASC`
    );

    return rows.map(mapRow);
  }

  async findById(id: number): Promise<Supplier | null> {
    await initializeDatabase();
    const db = await getDb();

    const row = await db.getFirstAsync<SupplierRow>(
      `SELECT id, name, phone, notes, created_at FROM suppliers WHERE id = ?`,
      [id]
    );

    return row ? mapRow(row) : null;
  }

  async create(input: NewSupplier): Promise<Supplier> {
    await initializeDatabase();
    const db = await getDb();

    const createdAt = toIsoDate(new Date());
    const result = await db.runAsync(
      `INSERT INTO suppliers (name, phone, notes, created_at) VALUES (?, ?, ?, ?)`,
      [input.name, input.phone, input.notes, createdAt]
    );

    return {
      id: result.lastInsertRowId,
      name: input.name,
      phone: input.phone,
      notes: input.notes,
      createdAt,
    };
  }

  async update(id: number, input: NewSupplier): Promise<Supplier | null> {
    await initializeDatabase();
    const db = await getDb();

    await db.runAsync(
      `UPDATE suppliers SET name = ?, phone = ?, notes = ? WHERE id = ?`,
      [input.name, input.phone, input.notes, id]
    );

    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await initializeDatabase();
    const db = await getDb();

    await db.runAsync(`DELETE FROM suppliers WHERE id = ?`, [id]);
  }
}