import { useCallback, useEffect, useMemo, useState } from 'react';
import { computeDailyProfit } from '../../domain/calculators';
import { DailyRecord } from '../../domain/types';
import { ValidationError } from '../../domain/errors';
import { dailyRecordService } from '../../infrastructure/container';

export function useDailyRecord(date: string) {
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [totalSold, setTotalSold] = useState('');
  const [investmentCost, setInvestmentCost] = useState('');
  const [additionalExpenses, setAdditionalExpenses] = useState('');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dailyRecordService.getDailyRecord(date);
      setRecord(result.record);

      if (result.record) {
        setTotalSold(String(result.record.totalSold));
        setInvestmentCost(String(result.record.investmentCost));
        setAdditionalExpenses(String(result.record.additionalExpenses));
        setNotes(result.record.notes);
      } else {
        setTotalSold('');
        setInvestmentCost('');
        setAdditionalExpenses('');
        setNotes('');
      }
    } catch {
      setError('Could not load this day');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void load();
  }, [load]);

  const previewProfit = useMemo(() => {
    const parse = (value: string) => Number(value.replace(',', '.')) || 0;

    return computeDailyProfit({
      totalSold: parse(totalSold),
      investmentCost: parse(investmentCost),
      additionalExpenses: parse(additionalExpenses),
    });
  }, [additionalExpenses, investmentCost, totalSold]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const result = await dailyRecordService.saveFromForm({
        date,
        totalSold,
        investmentCost,
        additionalExpenses,
        notes,
      });

      setRecord(result.record);
      setNotice('Saved');
    } catch (e) {
      if (e instanceof ValidationError) {
        setError(e.message);
      } else {
        setError('Could not save record');
      }
    } finally {
      setSaving(false);
    }
  }, [additionalExpenses, date, investmentCost, notes, totalSold]);

  return {
    loading,
    saving,
    error,
    notice,
    record,
    totalSold,
    investmentCost,
    additionalExpenses,
    notes,
    setTotalSold,
    setInvestmentCost,
    setAdditionalExpenses,
    setNotes,
    save,
    previewProfit,
  };
}
