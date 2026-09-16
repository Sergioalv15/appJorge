import { useCallback, useEffect, useState } from 'react';
import { Supplier } from '../../domain/types';
import { supplierService } from '../../infrastructure/container';

interface UseSuppliersState {
  loading: boolean;
  suppliers: Supplier[];
  error: string | null;
}

export function useSuppliers() {
  const [state, setState] = useState<UseSuppliersState>({
    loading: true,
    suppliers: [],
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const suppliers = await supplierService.list();
      setState({ loading: false, suppliers, error: null });
    } catch (cause) {
      const message =
        cause instanceof Error && cause.message.trim().length > 0
          ? cause.message
          : 'Could not load suppliers';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: __DEV__ ? message : 'No se pudieron cargar los proveedores.',
      }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}