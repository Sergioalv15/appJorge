import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { monthKeysForWindow, parseIsoDate } from "../../../../core/utils/date";
import { dailyRecordService } from "../../infrastructure/container";
import { DailyRecord } from "../../domain/types";
import { createFocusRefreshGuard } from "./focusRefreshGuard";

interface BiweeklyRecordsState {
  loading: boolean;
  error: string | null;
  recordsByIso: Map<string, DailyRecord>;
}

interface UseBiweeklyRecordsResult extends BiweeklyRecordsState {
  refresh: () => Promise<void>;
}

function monthKeyToDate(monthKey: string): Date {
  return parseIsoDate(`${monthKey}-01`);
}

export function useBiweeklyRecords(windowStartIso: string): UseBiweeklyRecordsResult {
  const [state, setState] = useState<BiweeklyRecordsState>({
    loading: true,
    error: null,
    recordsByIso: new Map<string, DailyRecord>(),
  });

  const monthKeys = useMemo(
    () => monthKeysForWindow(windowStartIso),
    [windowStartIso],
  );
  const shouldRefreshOnFocus = useMemo(createFocusRefreshGuard, []);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const monthResults = await Promise.all(
        monthKeys.map((monthKey) =>
          dailyRecordService.getMonthlyOverview(monthKeyToDate(monthKey)),
        ),
      );

      const merged = new Map<string, DailyRecord>();
      for (const result of monthResults) {
        for (const record of result.records) {
          merged.set(record.date, record);
        }
      }

      setState({
        loading: false,
        error: null,
        recordsByIso: merged,
      });
    } catch (cause) {
      const message =
        cause instanceof Error && cause.message.trim().length > 0
          ? cause.message
          : "No se pudo cargar el calendario.";

      setState({
        loading: false,
        error: message,
        recordsByIso: new Map<string, DailyRecord>(),
      });
    }
  }, [monthKeys]);

  useFocusEffect(
    useCallback(() => {
      if (shouldRefreshOnFocus()) {
        void load();
      }
    }, [load, shouldRefreshOnFocus]),
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    ...state,
    refresh: load,
  };
}
