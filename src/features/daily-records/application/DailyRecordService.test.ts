import { describe, expect, it } from 'vitest';
import { DailyRecordService } from './DailyRecordService';
import { DailyRecordRepository } from './DailyRecordRepository';
import { DailyRecord } from '../domain/types';

class InMemoryDailyRecordRepository implements DailyRecordRepository {
  private readonly map = new Map<string, DailyRecord>();

  async upsert(record: DailyRecord): Promise<void> {
    this.map.set(record.date, record);
  }

  async findByDate(date: string): Promise<DailyRecord | null> {
    return this.map.get(date) ?? null;
  }

  async findByMonth(month: string): Promise<DailyRecord[]> {
    return [...this.map.values()]
      .filter((item) => item.date.startsWith(month))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

describe('DailyRecordService', () => {
  it('saves normalized records from form input with comma decimals', async () => {
    const repo = new InMemoryDailyRecordRepository();
    const service = new DailyRecordService(repo);

    const result = await service.saveFromForm({
      date: '2026-07-12',
      totalSold: '230,50',
      investmentCost: '100,10',
      additionalExpenses: '10,2',
      notes: '  market day ',
    });

    expect(result.record).toEqual({
      date: '2026-07-12',
      totalSold: 230.5,
      investmentCost: 100.1,
      additionalExpenses: 10.2,
      notes: 'market day',
    });
    expect(result.profit).toEqual({
      grossProfit: 230.5,
      netProfit: 120.2,
    });
  });

  it('returns zero profit when no record exists', async () => {
    const service = new DailyRecordService(new InMemoryDailyRecordRepository());

    const result = await service.getDailyRecord('2026-07-13');

    expect(result.record).toBeNull();
    expect(result.profit).toEqual({ grossProfit: 0, netProfit: 0 });
  });

  it('builds monthly overview from persisted records', async () => {
    const repo = new InMemoryDailyRecordRepository();
    const service = new DailyRecordService(repo);

    await service.saveFromForm({
      date: '2026-07-01',
      totalSold: '100',
      investmentCost: '40',
      additionalExpenses: '10',
      notes: '',
    });
    await service.saveFromForm({
      date: '2026-07-02',
      totalSold: '300',
      investmentCost: '150',
      additionalExpenses: '20',
      notes: '',
    });

    const result = await service.getMonthlyOverview(new Date(2026, 6, 25));

    expect(result.overview.month).toBe('2026-07');
    expect(result.records).toHaveLength(2);
    expect(result.overview.totalSold).toBe(400);
    expect(result.overview.grossProfit).toBe(400);
    expect(result.overview.netProfit).toBe(180);
  });
});
