export type ThemeMode = 'light' | 'dark';

const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

const radius = {
  sm: 8,
  md: 12,
  lg: 18,
} as const;

const lightColors = {
  background: '#F5EFE6',
  surface: '#FFFDF8',
  card: '#F1E4D1',
  primary: '#5B3A29',
  primarySoft: '#8C6143',
  text: '#1F1B18',
  mutedText: '#6B6158',
  border: '#D5C4AD',
  success: '#264D2F',
  danger: '#8B2E2E',
  white: '#FFFFFF',
  black: '#111111',
  inputBackground: '#FFFFFF',
  drawerOverlay: 'rgba(17,17,17,0.2)',
  calendarBackground: '#FBF7F0',
  calendarSurface: '#FFFDF8',
  calendarText: '#1F1B18',
  calendarMutedText: '#6B6158',
  calendarBorder: 'rgba(91,58,41,0.22)',
  calendarHighlight: 'rgba(110,110,110,0.28)',
  calendarLoadingOverlay: 'rgba(245,239,230,0.86)',
} as const;

const darkColors = {
  background: '#111111',
  surface: '#1A1A1A',
  card: '#242424',
  primary: '#D8A07A',
  primarySoft: '#B8855F',
  text: '#F5EEE7',
  mutedText: '#B9AFA4',
  border: '#3D342E',
  success: '#7BD18E',
  danger: '#F08C8C',
  white: '#FFFFFF',
  black: '#111111',
  inputBackground: '#1F1F1F',
  drawerOverlay: 'rgba(0,0,0,0.45)',
  calendarBackground: '#080808',
  calendarSurface: '#121212',
  calendarText: 'rgba(255,255,255,0.95)',
  calendarMutedText: 'rgba(255,255,255,0.56)',
  calendarBorder: 'rgba(255,255,255,0.16)',
  calendarHighlight: 'rgba(176,176,176,0.42)',
  calendarLoadingOverlay: 'rgba(8,8,8,0.85)',
} as const;

export type ThemeColorKey = keyof typeof lightColors;
export type ThemeColors = Record<ThemeColorKey, string>;

export type AppTheme = {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
};

export function normalizeThemePreference(value: string | null | undefined): ThemeMode {
  return value === 'dark' ? 'dark' : 'light';
}

export function resolveTheme(mode: ThemeMode): AppTheme {
  const colors = mode === 'dark' ? darkColors : lightColors;

  return {
    mode,
    isDark: mode === 'dark',
    colors,
    spacing,
    radius,
  };
}

export const Theme = resolveTheme('light');
