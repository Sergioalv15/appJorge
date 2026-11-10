import { describe, expect, it } from "vitest";
import { rootStackRoutes } from "./rootStackRoutes";

describe("rootStackRoutes", () => {
  it("keeps the existing route group as the default tab shell", () => {
    expect(rootStackRoutes[0]).toEqual({
      name: "(drawer)",
      options: { headerShown: false },
    });
  });

  it("keeps day date route outside drawer with stack header", () => {
    expect(rootStackRoutes).toContainEqual({
      name: "day/[date]",
      options: {
        headerShown: true,
        title: "Registro del dia",
      },
    });
  });

  it("keeps the investment balance and history outside the tab bar", () => {
    expect(rootStackRoutes).toContainEqual({
      name: "investment/balance",
      options: {
        headerShown: true,
        title: "Capital para invertir",
      },
    });
  });
});
