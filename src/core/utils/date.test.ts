import { describe, expect, it } from "vitest";
import {
  addMonths,
  biweekWindowDays,
  buildMonthGrid,
  daysInMonthCount,
  initialBiweekStart,
  isIsoTodayLocal,
  monthKeysForWindow,
  nextBiweekStart,
  parseIsoDate,
  prevBiweekStart,
  toIsoDate,
  weekdayIndexMondayFirst,
} from "./date";

describe("biweekly date helpers", () => {
  it("returns exactly 14 consecutive iso dates for a window", () => {
    const days = biweekWindowDays("2026-01-28");

    expect(days).toHaveLength(14);
    expect(days[0]).toBe("2026-01-28");
    expect(days[13]).toBe("2026-02-10");
  });

  it("moves forward and backward by exact biweekly windows", () => {
    const start = "2026-02-10";

    expect(nextBiweekStart(start)).toBe("2026-02-24");
    expect(prevBiweekStart(start)).toBe("2026-01-27");
    expect(prevBiweekStart(nextBiweekStart(start))).toBe(start);
  });

  it("returns one or two month keys depending on the window span", () => {
    expect(monthKeysForWindow("2026-01-28")).toEqual(["2026-01", "2026-02"]);
    expect(monthKeysForWindow("2026-02-01")).toEqual(["2026-02"]);
  });

  it("anchors initial window so today is visible", () => {
    const startIso = initialBiweekStart(new Date(2026, 1, 10));

    expect(startIso).toBe("2026-02-04");
    expect(biweekWindowDays(startIso)).toContain("2026-02-10");
  });
});

describe("monthly calendar date helpers", () => {
  it("uses Monday as weekday index zero", () => {
    expect(weekdayIndexMondayFirst(new Date(2026, 1, 2))).toBe(0);
    expect(weekdayIndexMondayFirst(new Date(2026, 1, 1))).toBe(6);
  });

  it("handles month arithmetic including December/January transitions", () => {
    expect(toIsoDate(addMonths(new Date(2026, 11, 1), 1))).toBe("2027-01-01");
    expect(toIsoDate(addMonths(new Date(2026, 0, 1), -1))).toBe("2025-12-01");
  });

  it("returns proper days count for leap and non-leap February", () => {
    expect(daysInMonthCount(new Date(2026, 1, 1))).toBe(28);
    expect(daysInMonthCount(new Date(2028, 1, 1))).toBe(29);
  });

  it("builds complete month grid for month starting on Monday", () => {
    const cells = buildMonthGrid(new Date(2026, 5, 1));

    expect(cells).toHaveLength(35);
    expect(cells[0].iso).toBe("2026-06-01");
    expect(cells[34].iso).toBe("2026-07-05");
  });

  it("builds complete month grid for month starting on Sunday including previous month days", () => {
    const cells = buildMonthGrid(new Date(2026, 10, 1));

    expect(cells[0].iso).toBe("2026-10-26");
    expect(cells[6].iso).toBe("2026-11-01");
    expect(cells).toHaveLength(42);
  });

  it("creates six-row month grids when required", () => {
    const cells = buildMonthGrid(new Date(2026, 2, 1));

    expect(cells).toHaveLength(42);
    expect(cells[0].iso).toBe("2026-02-23");
    expect(cells[41].iso).toBe("2026-04-05");
  });

  it("preserves local date keys without UTC drift", () => {
    const local = parseIsoDate("2026-08-04");

    expect(toIsoDate(local)).toBe("2026-08-04");
    expect(isIsoTodayLocal("2026-08-04", new Date(2026, 7, 4, 23, 59, 59))).toBe(true);
    expect(isIsoTodayLocal("2026-08-05", new Date(2026, 7, 4, 23, 59, 59))).toBe(false);
  });
});
