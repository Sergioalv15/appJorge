export type RootStackRouteConfig = {
  name: "(drawer)" | "day/[date]";
  options: {
    headerShown: boolean;
    title?: string;
  };
};

export const rootStackRoutes: RootStackRouteConfig[] = [
  {
    name: "(drawer)",
    options: { headerShown: false },
  },
  {
    name: "day/[date]",
    options: {
      headerShown: true,
      title: "Registro del dia",
    },
  },
];
