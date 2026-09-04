export interface InvestmentAdjustment {
  id: number;
  date: string;
  amount: number;
  note: string;
}

export interface InvestmentBalance {
  available: number;
  adjustmentsTotal: number;
  investedTotal: number;
}
