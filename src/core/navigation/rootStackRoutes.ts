export type RootStackRouteConfig = {
  name: string;
  options: {
    headerShown: boolean;
    title?: string;
  };
};

export const rootStackRoutes: RootStackRouteConfig[] = [
  {
    name: '(drawer)',
    options: { headerShown: false },
  },
  {
    name: 'day/[date]',
    options: {
      headerShown: true,
      title: 'Registro del dia',
    },
  },
  {
    name: 'supplier/new',
    options: {
      headerShown: true,
      title: 'Nuevo proveedor',
    },
  },
  {
    name: 'supplier/[id]',
    options: {
      headerShown: true,
      title: 'Editar proveedor',
    },
  },
  {
    name: 'investment/purchase',
    options: {
      headerShown: true,
      title: 'Registrar inversión',
    },
  },
  {
    name: 'investment/balance',
    options: {
      headerShown: true,
      title: 'Capital para invertir',
    },
  },
  {
    name: 'dataphone/[yearMonth]',
    options: {
      headerShown: true,
      title: 'Ventas datafono',
    },
  },
];
