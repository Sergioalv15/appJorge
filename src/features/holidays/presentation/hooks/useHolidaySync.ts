import { useEffect, useRef } from 'react';
import { holidaySyncService } from '../../infrastructure/container';

export function useHolidaySync() {
  const hasSynced = useRef(false);

  useEffect(() => {
    if (hasSynced.current) {
      return;
    }
    hasSynced.current = true;

    void holidaySyncService.syncSilently();
  }, []);
}