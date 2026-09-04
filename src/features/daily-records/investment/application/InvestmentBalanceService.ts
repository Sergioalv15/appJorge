import { DailyRecordRepository } from '../../application/DailyRecordRepository';
import { InvestmentAdjustment } from '../domain/types';
import { InvestmentAdjustmentRepository } from './InvestmentAdjustmentRepository';

export class InvestmentBalanceService {
  constructor(
    private readonly adjustmentRepository: InvestmentAdjustmentRepository,
    private readonly dailyRecordRepository: DailyRecordRepository
  ) {}

  async getBalance(): Promise<{ available: number; adjustmentsTotal: number; investedTotal: number }> {
    const [adjustmentsTotal, investedTotal] = await Promise.all([
      this.adjustmentRepository.sumAmount(),
      this.dailyRecordRepository.sumInvestmentCost(),
    ]);

    return {
      available: adjustmentsTotal + investedTotal,
      adjustmentsTotal,
      investedTotal,
    };
  }

  async addAdjustment(input: {
    date: string;
    amount: number;
    note: string;
  }): Promise<InvestmentAdjustment> {
    return this.adjustmentRepository.add(input);
  }

  async listAdjustments(): Promise<InvestmentAdjustment[]> {
    return this.adjustmentRepository.listAll();
  }
}
