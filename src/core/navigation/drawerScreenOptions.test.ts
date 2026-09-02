import { describe, expect, it } from "vitest";
import {
  calendarDrawerScreenOptions,
  createCalendarDrawerScreenOptions,
  createDrawerScreenOptions,
  drawerRouteLabels,
  drawerScreenOptions,
} from "./drawerScreenOptions";
import { resolveTheme, Theme } from "../../ui/theme";

describe("drawerScreenOptions", () => {
  it("keeps drawer visuals aligned with app theme", () => {
    expect(drawerScreenOptions.headerStyle).toEqual({
      backgroundColor: Theme.colors.surface,
    });
    expect(drawerScreenOptions.headerTintColor).toBe(Theme.colors.text);
    expect(drawerScreenOptions.sceneStyle).toEqual({
      backgroundColor: Theme.colors.background,
    });
  });

  it("defines first-level drawer labels for main app routes", () => {
    expect(drawerRouteLabels.index).toBe("Pagina Principal");
    expect(drawerRouteLabels.calendar).toBe("Calendario");
  });

  it("hardens drawer gesture and transition polish defaults", () => {
    expect(drawerScreenOptions.swipeEdgeWidth).toBe(24);
    expect(drawerScreenOptions.keyboardDismissMode).toBe("on-drag");
    expect(drawerScreenOptions.overlayColor).toBe("rgba(17,17,17,0.2)");
    expect(calendarDrawerScreenOptions.swipeEdgeWidth).toBe(16);
    expect(calendarDrawerScreenOptions.headerTitle).toBe("");
    expect(calendarDrawerScreenOptions.headerStyle).toEqual({
      backgroundColor: Theme.colors.surface,
    });
    expect(calendarDrawerScreenOptions.headerTintColor).toBe(Theme.colors.text);
  });

  it("derives dark-mode navigation colors from provided theme", () => {
    const darkTheme = resolveTheme("dark");
    const darkDrawerOptions = createDrawerScreenOptions(darkTheme);
    const darkCalendarOptions = createCalendarDrawerScreenOptions(darkTheme);

    expect(darkDrawerOptions.headerStyle).toEqual({
      backgroundColor: darkTheme.colors.surface,
    });
    expect(darkDrawerOptions.sceneStyle).toEqual({
      backgroundColor: darkTheme.colors.background,
    });
    expect(darkDrawerOptions.overlayColor).toBe(darkTheme.colors.drawerOverlay);
    expect(darkCalendarOptions.headerStyle).toEqual({
      backgroundColor: darkTheme.colors.surface,
    });
    expect(darkCalendarOptions.headerTintColor).toBe(darkTheme.colors.text);
  });
});
