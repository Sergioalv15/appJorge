import { ValidationError } from './errors';
import { DailyRecord } from './types';

type DailyRecordInput = Omit<DailyRecord, 'notes'> & { notes?: string };

function assertNonNegative(value: number, label: string): void {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    throw new ValidationError(`${label} must be a valid number`);
  }

  if (value < 0) {
    throw new ValidationError(`${label} cannot be negative`);
  }
}

function assertDateFormat(value: string): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    throw new ValidationError('date must use YYYY-MM-DD format');
  }
}

export function validateAndNormalizeDailyRecord(input: DailyRecordInput): DailyRecord {
  assertDateFormat(input.date);
  assertNonNegative(input.totalSold, 'totalSold');
  assertNonNegative(input.investmentCost, 'investmentCost');
  assertNonNegative(input.additionalExpenses, 'additionalExpenses');

  const notes = (input.notes ?? '').trim();
  if (notes.length > 300) {
    throw new ValidationError('notes cannot be longer than 300 characters');
  }

  return {
    date: input.date,
    totalSold: round2(input.totalSold),
    investmentCost: round2(input.investmentCost),
    additionalExpenses: round2(input.additionalExpenses),
    notes,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
