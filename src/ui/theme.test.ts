import { describe, expect, it } from 'vitest';
import { normalizeThemePreference, resolveTheme } from './theme';

describe('theme helpers', () => {
  it('normalizes unknown or empty preferences to light', () => {
    expect(normalizeThemePreference(null)).toBe('light');
    expect(normalizeThemePreference(undefined)).toBe('light');
    expect(normalizeThemePreference('')).toBe('light');
    expect(normalizeThemePreference('system')).toBe('light');
  });

  it('preserves dark preference explicitly', () => {
    expect(normalizeThemePreference('dark')).toBe('dark');
  });

  it('resolves light and dark palettes deterministically', () => {
    const light = resolveTheme('light');
    const dark = resolveTheme('dark');

    expect(light.isDark).toBe(false);
    expect(dark.isDark).toBe(true);
    expect(light.colors.background).toBe('#F5EFE6');
    expect(dark.colors.background).toBe('#111111');
    expect(light.spacing.md).toBe(16);
    expect(dark.radius.md).toBe(12);
  });

  it('exposes subtle gray today-cell highlight in both themes', () => {
    const light = resolveTheme('light');
    const dark = resolveTheme('dark');

    expect(light.colors.calendarHighlight).toBe('rgba(110,110,110,0.28)');
    expect(dark.colors.calendarHighlight).toBe('rgba(176,176,176,0.42)');
  });
});
