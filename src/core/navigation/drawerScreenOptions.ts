import { AppTheme, Theme } from '../../ui/theme';

export const drawerRouteLabels = {
  index: 'Pagina Principal',
  calendar: 'Calendario',
  annual: 'Resumen anual',
} as const;

export function createDrawerScreenOptions(theme: AppTheme = Theme) {
  return {
    headerStyle: { backgroundColor: theme.colors.surface },
    headerTintColor: theme.colors.text,
    headerTitleStyle: {
      fontWeight: '700' as const,
    },
    headerShadowVisible: false,
    sceneStyle: { backgroundColor: theme.colors.background },
    drawerActiveTintColor: theme.colors.primary,
    drawerInactiveTintColor: theme.colors.mutedText,
    drawerType: 'front' as const,
    overlayColor: theme.colors.drawerOverlay,
    keyboardDismissMode: 'on-drag' as const,
    swipeEdgeWidth: 24,
    drawerStyle: {
      backgroundColor: theme.colors.surface,
    },
  };
}

export function createCalendarDrawerScreenOptions(theme: AppTheme = Theme) {
  return {
    swipeEdgeWidth: 16,
    headerTitle: '',
    headerStyle: { backgroundColor: theme.colors.surface },
    headerTintColor: theme.colors.text,
  } as const;
}

export const drawerScreenOptions = createDrawerScreenOptions();
export const calendarDrawerScreenOptions = createCalendarDrawerScreenOptions();
