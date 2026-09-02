import { describe, expect, it } from "vitest";
import {
  biweeklyWindowReducer,
  createInitialBiweeklyWindowState,
} from "./biweeklyWindowState";
import { deriveDayCellStatus } from "./dayCellStatus";
import { buildDayRouteFromIso } from "./dayRoute";

describe("biweeklyWindowReducer", () => {
  it("moves to next and previous windows preserving 14-day jumps", () => {
    const initial = {
      windowStartIso: "2026-02-04",
      selectedIso: null,
    };

    const next = biweeklyWindowReducer(initial, { type: "next" });
    const previous = biweeklyWindowReducer(next, { type: "prev" });

    expect(next.windowStartIso).toBe("2026-02-18");
    expect(previous.windowStartIso).toBe(initial.windowStartIso);
  });

  it("selects a day and can reset window around today", () => {
    const initial = createInitialBiweeklyWindowState(new Date(2026, 1, 10));

    const selected = biweeklyWindowReducer(initial, {
      type: "select",
      iso: "2026-02-11",
    });

    const reset = biweeklyWindowReducer(selected, {
      type: "today",
      today: new Date(2026, 2, 2),
    });

    expect(selected.selectedIso).toBe("2026-02-11");
    expect(reset.windowStartIso).toBe("2026-02-24");
    expect(reset.selectedIso).toBe("2026-03-02");
  });
});

describe("deriveDayCellStatus", () => {
  it("returns filled when record exists and empty when missing", () => {
    expect(deriveDayCellStatus(undefined)).toBe("empty");
    expect(
      deriveDayCellStatus({
        date: "2026-02-10",
        totalSold: 100,
        investmentCost: 40,
        additionalExpenses: 10,
        notes: "ok",
      }),
    ).toBe("filled");
  });
});

describe("buildDayRouteFromIso", () => {
  it("creates route compatible with existing day screen", () => {
    expect(buildDayRouteFromIso("2026-02-10")).toBe("/day/2026-02-10");
    expect(buildDayRouteFromIso("2026-12-01")).toBe("/day/2026-12-01");
  });
});
