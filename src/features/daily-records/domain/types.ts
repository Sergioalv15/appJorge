export interface DailyRecord {
  date: string;
  totalSold: number;
  investmentCost: number;
  additionalExpenses: number;
  notes: string;
}

export interface DailyProfit {
  grossProfit: number;
  netProfit: number;
}

export interface MonthlyOverview {
  month: string;
  totalSold: number;
  totalInvested: number;
  totalAdditionalExpenses: number;
  grossProfit: number;
  netProfit: number;
  averageDailyNetProfit: number;
  estimatedSalary: number;
  trackedDays: number;
}
