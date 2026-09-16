import { HolidayRepository } from './HolidayRepository';
import { HolidayApi } from '../infrastructure/HolidayApiService';

const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

export interface HolidaySyncResult {
  synced: boolean;
  error: string | null;
}

export class HolidaySyncService {
  constructor(
    private readonly repository: HolidayRepository,
    private readonly api: HolidayApi
  ) {}

  async syncSilently(now = new Date()): Promise<HolidaySyncResult> {
    try {
      const shouldSync = await this.needsSync(now);
      if (!shouldSync) {
        return { synced: false, error: null };
      }

      const years = [now.getFullYear(), now.getFullYear() + 1];
      const holidays = await this.api.fetchNationalHolidays(years);
      await this.repository.upsertMany(holidays);
      await this.repository.setLastSync(now.toISOString());

      return { synced: true, error: null };
    } catch (cause) {
      const message =
        cause instanceof Error && cause.message.trim().length > 0
          ? cause.message
          : 'Unknown holiday sync failure';
      return { synced: false, error: message };
    }
  }

  private async needsSync(now: Date): Promise<boolean> {
    const lastSync = await this.repository.getLastSync();
    if (!lastSync) {
      return true;
    }

    const lastSyncTime = new Date(lastSync).getTime();
    if (Number.isNaN(lastSyncTime)) {
      return true;
    }

    return now.getTime() - lastSyncTime >= SYNC_INTERVAL_MS;
  }
}