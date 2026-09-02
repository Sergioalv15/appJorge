import * as SQLite from 'expo-sqlite';
import { runMigrations } from './sqliteMigrations';

const DB_NAME = 'appjorge.db';

let singletonDb: SQLite.SQLiteDatabase | null = null;
let initialized = false;
let initializationPromise: Promise<void> | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!singletonDb) {
    singletonDb = await SQLite.openDatabaseAsync(DB_NAME);
  }

  return singletonDb;
}

export async function initializeDatabase(): Promise<void> {
  if (initialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    const db = await getDb();
    await runMigrations(db);
    initialized = true;
  })().catch((error) => {
    initializationPromise = null;
    throw error;
  });

  await initializationPromise;
}
