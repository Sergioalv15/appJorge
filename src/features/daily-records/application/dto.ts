import { DailyRecord, DailyProfit, MonthlyOverview } from '../domain/types';

export interface DailyRecordFormData {
  date: string;
  totalSold: string;
  investmentCost: string;
  additionalExpenses: string;
  notes: string;
}

export interface DailyRecordViewModel {
  record: DailyRecord | null;
  profit: DailyProfit;
}

export interface MonthlyOverviewViewModel {
  overview: MonthlyOverview;
  records: DailyRecord[];
}
