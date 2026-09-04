import { InvestmentAdjustment } from '../domain/types';

export interface AddInvestmentAdjustmentInput {
  date: string;
  amount: number;
  note: string;
}

export interface InvestmentAdjustmentRepository {
  add(input: AddInvestmentAdjustmentInput): Promise<InvestmentAdjustment>;
  listAll(): Promise<InvestmentAdjustment[]>;
  sumAmount(): Promise<number>;
}
