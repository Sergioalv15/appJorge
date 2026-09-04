import { describe, expect, it } from 'vitest';
import { validateAndNormalizeDailyRecord } from './validation';
import { ValidationError } from './errors';

describe('validateAndNormalizeDailyRecord', () => {
  it('accepts valid record and rounds to 2 decimals', () => {
    const result = validateAndNormalizeDailyRecord({
      date: '2026-07-10',
      totalSold: 200.129,
      additionalExpenses: 12.999,
      profitPercent: 0.3,
      notes: '  done  ',
    });

    expect(result).toEqual({
      date: '2026-07-10',
      totalSold: 200.13,
      additionalExpenses: 13,
      profitPercent: 0.3,
      notes: 'done',
    });
  });

  it('defaults notes to empty string when omitted', () => {
    const result = validateAndNormalizeDailyRecord({
      date: '2026-07-10',
      totalSold: 0,
      additionalExpenses: 0,
      profitPercent: 0.3,
      
    });

    expect(result.notes).toBe('');
  });

  it('rejects invalid date format', () => {
    expect(() =>
      validateAndNormalizeDailyRecord({
        date: '10-07-2026',
        totalSold: 10,
        additionalExpenses: 1,
        profitPercent: 0.3,
        
      })
    ).toThrowError(new ValidationError('date must use YYYY-MM-DD format'));
  });

  it('rejects negative total sold', () => {
    expect(() =>
      validateAndNormalizeDailyRecord({
        date: '2026-07-10',
        totalSold: -1,
        additionalExpenses: 0,
        profitPercent: 0.3,
        
      })
    ).toThrowError(new ValidationError('totalSold cannot be negative'));
  });

  it('rejects NaN or non-finite values', () => {
    expect(() =>
      validateAndNormalizeDailyRecord({
        date: '2026-07-10',
        totalSold: Number.NaN,
        additionalExpenses: 0,
        profitPercent: 0.3,
        
      })
    ).toThrowError(new ValidationError('totalSold must be a valid number'));
  });

  it('rejects notes above 300 chars', () => {
    expect(() =>
      validateAndNormalizeDailyRecord({
        date: '2026-07-10',
        totalSold: 1,
        additionalExpenses: 1,
        profitPercent: 0.3,
        
        notes: 'a'.repeat(301),
      })
    ).toThrowError(new ValidationError('notes cannot be longer than 300 characters'));
  });

  it('rejects profit percent outside 0-1 range', () => {
    expect(() =>
      validateAndNormalizeDailyRecord({
        date: '2026-07-10',
        totalSold: 10,
        additionalExpenses: 1,
        profitPercent: 1.5,
        
      })
    ).toThrowError(new ValidationError('profitPercent must be between 0 and 1'));
  });
});
