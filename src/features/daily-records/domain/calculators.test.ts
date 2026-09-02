import { describe, expect, it } from 'vitest';
import { computeDailyProfit, computeMonthlyOverview } from './calculators';
import { DailyRecord } from './types';

describe('computeDailyProfit', () => {
  it('computes gross and net profit correctly', () => {
    const result = computeDailyProfit({
      totalSold: 1000,
      investmentCost: 400,
      additionalExpenses: 50,
    });

    expect(result).toEqual({
      grossProfit: 1000,
      netProfit: 550,
    });
  });

  it('allows net negative values when expenses are above sales', () => {
    const result = computeDailyProfit({
      totalSold: 120,
      investmentCost: 100,
      additionalExpenses: 80,
    });

    expect(result.grossProfit).toBe(120);
    expect(result.netProfit).toBe(-60);
  });
});

describe('computeMonthlyOverview', () => {
  const records: DailyRecord[] = [
    {
      date: '2026-07-01',
      totalSold: 200,
      investmentCost: 80,
      additionalExpenses: 20,
      notes: '',
    },
    {
      date: '2026-07-02',
      totalSold: 0,
      investmentCost: 0,
      additionalExpenses: 0,
      notes: '',
    },
    {
      date: '2026-07-03',
      totalSold: 350,
      investmentCost: 150,
      additionalExpenses: 40,
      notes: 'rainy day',
    },
  ];

  it('aggregates all monthly totals and derived values', () => {
    const result = computeMonthlyOverview('2026-07', records);

    expect(result.month).toBe('2026-07');
    expect(result.totalSold).toBe(550);
    expect(result.totalInvested).toBe(230);
    expect(result.totalAdditionalExpenses).toBe(60);
    expect(result.grossProfit).toBe(550);
    expect(result.netProfit).toBe(260);
    expect(result.averageDailyNetProfit).toBeCloseTo(86.6666667, 6);
    expect(result.estimatedSalary).toBe(165);
    expect(result.trackedDays).toBe(3);
  });

  it('returns zeroed derived values for empty months', () => {
    const result = computeMonthlyOverview('2026-08', []);

    expect(result.totalSold).toBe(0);
    expect(result.totalInvested).toBe(0);
    expect(result.totalAdditionalExpenses).toBe(0);
    expect(result.grossProfit).toBe(0);
    expect(result.netProfit).toBe(0);
    expect(result.averageDailyNetProfit).toBe(0);
    expect(result.estimatedSalary).toBe(0);
    expect(result.trackedDays).toBe(0);
  });
});
