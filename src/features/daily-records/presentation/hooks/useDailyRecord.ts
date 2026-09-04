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
  const [additionalExpenses, setAdditionalExpenses] = useState('');
  const [profitPercent, setProfitPercent] = useState('30');
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dailyRecordService.getDailyRecord(date);
      setRecord(result.record);

      if (result.record) {
        setTotalSold(String(result.record.totalSold));
        setAdditionalExpenses(String(result.record.additionalExpenses));
        setProfitPercent(String(Math.round(result.record.profitPercent * 100)));
        setNotes(result.record.notes);
      } else {
        setTotalSold('');
        setAdditionalExpenses('');
        setProfitPercent('30');
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

  const parse = useCallback((value: string) => Number(value.replace(',', '.')) || 0, []);

  const previewProfit = useMemo(
    () =>
      computeDailyProfit({
        totalSold: parse(totalSold),
        profitPercent: (parse(profitPercent) / 100 || 0),
        additionalExpenses: parse(additionalExpenses),
      }),
    [additionalExpenses, parse, profitPercent, totalSold],
  );

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const result = await dailyRecordService.saveFromForm({
        date,
        totalSold,
        additionalExpenses,
        profitPercent,
        notes,
      });

      setRecord(result.record);
      setNotice('el registro del día se ha guardado');
    } catch (e) {
      if (e instanceof ValidationError) {
        setError(e.message);
      } else {
        setError('Could not save record');
      }
    } finally {
      setSaving(false);
    }
  }, [additionalExpenses, date, notes, profitPercent, totalSold]);

  return {
    loading,
    saving,
    error,
    notice,
    record,
    totalSold,
    additionalExpenses,
    profitPercent,
    notes,
    setTotalSold,
    setAdditionalExpenses,
    setProfitPercent,
    setNotes,
    setNotice,
    save,
    previewProfit,
  };
}