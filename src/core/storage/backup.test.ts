import { beforeEach, describe, expect, it, vi } from 'vitest';

// Simulated on-disk content keyed by file uri. `write` completes asynchronously
// (SDK 58 semantics) while `writeSync` stores the bytes immediately.
const disk = vi.hoisted(() => new Map<string, Uint8Array>());
const shareCalls = vi.hoisted(() => [] as { uri: string; bytesOnDisk: number }[]);

vi.mock('expo-file-system', () => {
  const uriOf = (parts: unknown[]) =>
    parts.map((part) => (typeof part === 'string' ? part : (part as { uri: string }).uri)).join('/');

  class Directory {
    uri: string;
    constructor(...parts: unknown[]) {
      this.uri = uriOf(parts);
    }
    create() {}
  }

  class File {
    uri: string;
    constructor(...parts: unknown[]) {
      this.uri = uriOf(parts);
    }
    create() {
      disk.set(this.uri, new Uint8Array());
    }
    get exists() {
      return disk.has(this.uri);
    }
    info() {
      return { exists: this.exists, size: disk.get(this.uri)?.byteLength };
    }
    write(bytes: Uint8Array) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          disk.set(this.uri, bytes);
          resolve();
        }, 0);
      });
    }
    writeSync(bytes: Uint8Array) {
      disk.set(this.uri, bytes);
    }
    async bytes() {
      return disk.get(this.uri) ?? new Uint8Array([9, 9, 9]);
    }
  }

  return { Directory, File, Paths: { cache: 'cache:/', document: 'document:/' } };
});

vi.mock('expo-sharing', () => ({
  isAvailableAsync: async () => true,
  shareAsync: async (uri: string) => {
    shareCalls.push({ uri, bytesOnDisk: disk.get(uri)?.byteLength ?? 0 });
  },
}));

vi.mock('expo-document-picker', () => ({
  getDocumentAsync: async () => ({ canceled: false, assets: [{ uri: 'picked:/backup.sqlite' }] }),
}));

vi.mock('expo-sqlite', () => ({
  backupDatabaseAsync: vi.fn(),
  deserializeDatabaseAsync: vi.fn(),
}));

const liveBytes = new Uint8Array([1, 2, 3, 4, 5]);

vi.mock('./sqlite', () => ({
  advanceDatabaseGeneration: vi.fn(),
  blockDatabaseOperations: vi.fn(),
  withDatabaseAccess: (operation: (db: unknown) => unknown) =>
    operation({ serializeAsync: async () => liveBytes }),
}));

vi.mock('./sqliteMigrations', () => ({ runMigrations: vi.fn() }));
vi.mock('./backupValidation', () => ({ validateBackupDatabase: vi.fn() }));

// Drive only the recovery snapshot step and report a failed restore so the
// public message exposes whether the snapshot was persisted.
vi.mock('./restoreCoordinator', () => ({
  restoreWithRecovery: async (
    _bytes: Uint8Array,
    adapter: { serializeLive(): Promise<Uint8Array>; persistRecovery(bytes: Uint8Array): Promise<string> },
  ) => {
    const recoveryPath = await adapter.persistRecovery(await adapter.serializeLive());
    return { ok: false, recovered: false, recoveryPath };
  },
}));

import { createBackupService } from './backup';

describe('createBackupService', () => {
  beforeEach(() => {
    disk.clear();
    shareCalls.length = 0;
  });

  it('writes the whole backup file before sharing it', async () => {
    const result = await createBackupService().exportBackup();

    expect(result).toEqual({ ok: true, message: 'Copia de seguridad exportada' });
    expect(shareCalls).toEqual([
      { uri: 'cache://backups/appjorge-backup.sqlite', bytesOnDisk: liveBytes.byteLength },
    ]);
  });

  it('persists the complete recovery snapshot before reporting its path', async () => {
    const result = await createBackupService().restoreFromBackup();

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(
      /^No se pudo restaurar ni recuperar la base local\. .* Se conservó la copia de recuperación en document:\/\/backups\/pre-restore-.+\.sqlite\.$/,
    );
    const snapshots = [...disk.entries()].filter(([uri]) => uri.includes('pre-restore-'));
    expect(snapshots).toHaveLength(1);
    expect(snapshots[0][1]).toEqual(liveBytes);
  });
});
