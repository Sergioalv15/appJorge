import { describe, expect, it } from 'vitest';
import { runMigrations } from './sqliteMigrations';

class FakeDb {
  private version: number;
  readonly executedSql: string[] = [];
  shouldFail = false;
  netProfitColumnExists = false;

  constructor(initialVersion: number) {
    this.version = initialVersion;
  }

  async getFirstAsync<T>(source: string): Promise<T | null> {
    this.executedSql.push(source.trim());
    if (source.includes('PRAGMA user_version')) {
      return { user_version: this.version } as T;
    }
    if (source.includes('pragma_table_info')) {
      return { hasColumn: this.netProfitColumnExists ? 1 : 0 } as T;
    }

    return null;
  }

  async execAsync(source: string): Promise<void> {
    const normalized = source.trim();
    this.executedSql.push(normalized);

    if (normalized.startsWith('PRAGMA user_version =')) {
      const match = normalized.match(/PRAGMA user_version = (\d+);/);
      if (match) {
        this.version = Number(match[1]);
      }
    }

    if (this.shouldFail && normalized.includes('CREATE TABLE IF NOT EXISTS daily_records')) {
      throw new Error('boom');
    }
  }
}

describe('runMigrations', () => {
  it('runs pending migrations inside transaction and updates user_version', async () => {
    const db = new FakeDb(0);

    await runMigrations(db);

    expect(db.executedSql).toContain('BEGIN IMMEDIATE;');
    expect(db.executedSql).toContain('COMMIT;');
    expect(db.executedSql).toContain('PRAGMA user_version = 1;');
    expect(db.executedSql).toContain('PRAGMA user_version = 2;');
    expect(db.executedSql).toContain('PRAGMA user_version = 3;');
    expect(db.executedSql).toContain('PRAGMA user_version = 4;');
  });

  it('skips migrations when user_version is up to date', async () => {
    const db = new FakeDb(4);

    await runMigrations(db);

    expect(db.executedSql).toEqual(['PRAGMA user_version;']);
  });

  it('runs only pending migrations when partially migrated', async () => {
    const db = new FakeDb(1);

    await runMigrations(db);

    expect(db.executedSql.some((sql) => sql.includes('CREATE TABLE IF NOT EXISTS investment_adjustments'))).toBe(true);
    expect(db.executedSql).toContain('PRAGMA user_version = 2;');
    expect(db.executedSql).toContain('PRAGMA user_version = 3;');
    expect(db.executedSql).toContain('PRAGMA user_version = 4;');
    expect(db.executedSql.some((sql) => sql.includes('CREATE TABLE IF NOT EXISTS daily_records'))).toBe(false);
  });

  it('rolls back when migration fails', async () => {
    const db = new FakeDb(0);
    db.shouldFail = true;

    await expect(runMigrations(db)).rejects.toThrow('Migration 1 (create-daily-records-table) failed');
    expect(db.executedSql).toContain('ROLLBACK;');
  });

  it('reparar v4 agrega net_profit cuando falta', async () => {
    const db = new FakeDb(3);
    db.netProfitColumnExists = false;

    await runMigrations(db);

    expect(db.executedSql).toContain('PRAGMA user_version = 4;');
    expect(db.executedSql.some((sql) => sql.toLowerCase().includes('add column net_profit'))).toBe(true);
  });

  it('reparar v4 omite el ALTER cuando net_profit ya existe', async () => {
    const db = new FakeDb(3);
    db.netProfitColumnExists = true;

    await runMigrations(db);

    expect(db.executedSql).toContain('PRAGMA user_version = 4;');
    expect(db.executedSql.some((sql) => sql.toLowerCase().includes('add column net_profit'))).toBe(false);
  });
});
