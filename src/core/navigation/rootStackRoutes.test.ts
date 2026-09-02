import { describe, expect, it } from "vitest";
import { rootStackRoutes } from "./rootStackRoutes";

describe("rootStackRoutes", () => {
  it("sets drawer as the default root shell", () => {
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
});
