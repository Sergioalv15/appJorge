import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getDocumentAsync } from 'expo-document-picker';
import { backupDatabaseAsync, deserializeDatabaseAsync } from 'expo-sqlite';
import { getDb, initializeDatabase } from './sqlite';

export interface BackupService {
  exportBackup(): Promise<BackupResult>;
  restoreFromBackup(): Promise<BackupResult>;
}

export interface BackupResult {
  ok: boolean;
  message: string;
}

const BACKUP_DIRECTORY_NAME = 'backups';
const BACKUP_FILE_NAME = 'modas-nicolas-backup.sqlite';

export function createBackupService(): BackupService {
  return { exportBackup, restoreFromBackup };
}

async function exportBackup(): Promise<BackupResult> {
  try {
    await initializeDatabase();
    const liveDb = await getDb();
    const bytes = await liveDb.serializeAsync();

    const dir = new Directory(Paths.cache, BACKUP_DIRECTORY_NAME);
    dir.create({ overwrite: true, intermediates: true });
    const file = new File(dir, BACKUP_FILE_NAME);
    file.create({ overwrite: true });
    file.write(bytes);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, { mimeType: 'application/x-sqlite3' });
    }

    return { ok: true, message: 'Copia de seguridad exportada' };
  } catch {
    return { ok: false, message: 'No se pudo exportar la copia de seguridad' };
  }
}

async function restoreFromBackup(): Promise<BackupResult> {
  let pickedFile: File | null = null;
  try {
    const picked = await getDocumentAsync({
      type: ['application/x-sqlite3', 'application/octet-stream', '*/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (picked.canceled) {
      return { ok: false, message: 'Restauración cancelada' };
    }

    const asset = picked.assets[0];
    if (!asset) {
      return { ok: false, message: 'No se seleccionó ningún archivo' };
    }

    pickedFile = new File(asset.uri);
    const bytes = await pickedFile.bytes();
    await applyBackupBytes(bytes);

    return { ok: true, message: 'Copia de seguridad restaurada' };
  } catch {
    return { ok: false, message: 'No se pudo restaurar la copia de seguridad' };
  }
}

async function applyBackupBytes(bytes: Uint8Array): Promise<void> {
  await initializeDatabase();
  const memoryDb = await deserializeDatabaseAsync(bytes);
  const liveDb = await getDb();
  try {
    await backupDatabaseAsync({
      sourceDatabase: memoryDb,
      sourceDatabaseName: 'main',
      destDatabase: liveDb,
      destDatabaseName: 'main',
    });
  } finally {
    await memoryDb.closeAsync();
  }
}