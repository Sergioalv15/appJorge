import { DailyProfit, DailyRecord, MonthlyOverview } from './types';

export function computeDailyProfit(input: Pick<DailyRecord, 'totalSold' | 'investmentCost' | 'additionalExpenses'>): DailyProfit {
  const grossProfit = input.totalSold;
  const netProfit = grossProfit - input.investmentCost - input.additionalExpenses;

  return {
    grossProfit,
    netProfit,
  };
}

export function computeMonthlyOverview(month: string, records: DailyRecord[]): MonthlyOverview {
  const totals = records.reduce(
    (acc, record) => {
      const profit = computeDailyProfit(record);
      acc.totalSold += record.totalSold;
      acc.totalInvested += record.investmentCost;
      acc.totalAdditionalExpenses += record.additionalExpenses;
      acc.grossProfit += profit.grossProfit;
      acc.netProfit += profit.netProfit;
      return acc;
    },
    {
      totalSold: 0,
      totalInvested: 0,
      totalAdditionalExpenses: 0,
      grossProfit: 0,
      netProfit: 0,
    }
  );

  const trackedDays = records.length;
  const averageDailyNetProfit = trackedDays > 0 ? totals.netProfit / trackedDays : 0;
  const estimatedSalary = totals.totalSold * 0.3;

  return {
    month,
    ...totals,
    averageDailyNetProfit,
    estimatedSalary,
    trackedDays,
  };
}
