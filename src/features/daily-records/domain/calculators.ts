import { DailyProfit, DailyRecord, MonthlyOverview } from './types';

const DEFAULT_PROFIT_PERCENT = 0.3;

export function computeDailyProfit(
  input: Pick<DailyRecord, 'totalSold' | 'profitPercent' | 'additionalExpenses'>
): DailyProfit {
  const netProfit = Math.max(0, round2(input.totalSold * input.profitPercent) - input.additionalExpenses);
  const investment = round2(input.totalSold * (1 - input.profitPercent));

  return {
    grossProfit: input.totalSold,
    netProfit,
    investment,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeMonthlyOverview(month: string, records: DailyRecord[]): MonthlyOverview {
  const totals = records.reduce(
    (acc, record) => {
      const profit = computeDailyProfit(record);
      acc.totalSold += record.totalSold;
      acc.totalAdditionalExpenses += record.additionalExpenses;
      acc.grossProfit += profit.grossProfit;
      acc.netProfit += profit.netProfit;
      acc.totalInvested += profit.investment;
      acc.totalDataphoneSales += record.dataphoneSales ?? 0;
      return acc;
    },
    {
      totalSold: 0,
      totalInvested: 0,
      totalAdditionalExpenses: 0,
      grossProfit: 0,
      netProfit: 0,
      totalDataphoneSales: 0,
    }
  );

  const trackedDays = records.length;
  const averageDailyNetProfit = trackedDays > 0 ? totals.netProfit / trackedDays : 0;
  const estimatedSalary = totals.totalSold * DEFAULT_PROFIT_PERCENT;

  return {
    month,
    ...totals,
    averageDailyNetProfit,
    estimatedSalary,
    trackedDays,
  };
}
