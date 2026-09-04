import { useCallback, useEffect, useState } from "react";
import { MonthlyOverview } from "../../domain/types";
import { dailyRecordService } from "../../infrastructure/container";

export interface MonthAnnualSummary {
  month: Date;
  overview: MonthlyOverview;
}

export interface AnnualSummaryState {
  loading: boolean;
  monthlySummaries: MonthAnnualSummary[];
  error: string | null;
}

export function buildMonthDatesForYear(year: number): Date[] {
  return Array.from({ length: 12 }, (_, index) => new Date(year, index, 1));
}

export async function fetchAnnualMonthSummaries(
  year: number,
): Promise<MonthAnnualSummary[]> {
  const months = buildMonthDatesForYear(year);
  return Promise.all(
    months.map(async (month) => {
      const data = await dailyRecordService.getMonthlyOverview(month);
      return { month, overview: data.overview };
    }),
  );
}

export function useAnnualSummary(year: number): AnnualSummaryState {
  const [state, setState] = useState<AnnualSummaryState>({
    loading: true,
    monthlySummaries: [],
    error: null,
  });

  const load = useCallback(async () => {
    setState({ loading: true, monthlySummaries: [], error: null });
    try {
      const monthlySummaries = await fetchAnnualMonthSummaries(year);
      setState({ loading: false, monthlySummaries, error: null });
    } catch {
      setState({
        loading: false,
        monthlySummaries: [],
        error: "No se pudo cargar el resumen anual.",
      });
    }
  }, [year]);

  useEffect(() => {
    void load();
  }, [load]);

  return state;
}