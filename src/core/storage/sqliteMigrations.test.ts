import { describe, expect, it } from 'vitest';
import { runMigrations } from './sqliteMigrations';

class FakeDb {
  private version: number;
  readonly executedSql: string[] = [];
  shouldFail = false;

  constructor(initialVersion: number) {
    this.version = initialVersion;
  }

  async getFirstAsync<T>(source: string): Promise<T | null> {
    this.executedSql.push(source.trim());
    if (source.includes('PRAGMA user_version')) {
      return { user_version: this.version } as T;
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
  });

  it('skips migrations when user_version is up to date', async () => {
    const db = new FakeDb(1);

    await runMigrations(db);

    expect(db.executedSql).toEqual(['PRAGMA user_version;']);
  });

  it('rolls back when migration fails', async () => {
    const db = new FakeDb(0);
    db.shouldFail = true;

    await expect(runMigrations(db)).rejects.toThrow('Migration 1 (create-daily-records-table) failed');
    expect(db.executedSql).toContain('ROLLBACK;');
  });
});
