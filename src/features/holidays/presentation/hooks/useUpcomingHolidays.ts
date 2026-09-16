import { useCallback, useEffect, useState } from 'react';
import { toIsoDate } from '../../../../core/utils/date';
import { UpcomingHoliday } from '../../domain/types';
import { computeUpcomingHolidays } from '../../domain/upcoming';
import { holidayRepository } from '../../infrastructure/container';

interface UseUpcomingHolidaysState {
  loading: boolean;
  holidays: UpcomingHoliday[];
}

export function useUpcomingHolidays(withinDays = 14, limit = 3) {
  const [state, setState] = useState<UseUpcomingHolidaysState>({
    loading: true,
    holidays: [],
  });

  const refresh = useCallback(
    async (now = new Date()) => {
      try {
        const all = await holidayRepository.getAll();
        const upcoming = computeUpcomingHolidays(all, now, withinDays);

        setState({
          loading: false,
          holidays: upcoming.slice(0, limit),
        });
      } catch {
        setState({
          loading: false,
          holidays: [],
        });
      }
    },
    [limit, withinDays]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function holidaysByIso(holidays: { date: string; name: string }[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const holiday of holidays) {
    if (!map.has(holiday.date)) {
      map.set(holiday.date, holiday.name);
    }
  }
  return map;
}

export function upcomingHolidayKey(date: Date): string {
  return toIsoDate(date);
}