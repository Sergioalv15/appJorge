import { describe, expect, it } from "vitest";
import { MonthlyOverview, DailyRecord } from "../../domain/types";
import { deriveHomeKpis } from "./deriveHomeKpis";

function createOverview(overrides: Partial<MonthlyOverview> = {}): MonthlyOverview {
  return {
    month: "2026-08",
    totalSold: 0,
    totalInvested: 0,
    totalAdditionalExpenses: 0,
    grossProfit: 0,
    netProfit: 0,
    averageDailyNetProfit: 0,
    estimatedSalary: 0,
    trackedDays: 0,
    ...overrides,
  };
}

describe("deriveHomeKpis", () => {
  it("maps clarified KPI meanings using latest record and monthly overview", () => {
    const overview = createOverview({
      grossProfit: 1250,
      netProfit: 940,
    });

    const records: DailyRecord[] = [
      {
        date: "2026-08-01",
        totalSold: 120,
        investmentCost: 50,
        additionalExpenses: 10,
        notes: "",
      },
      {
        date: "2026-08-04",
        totalSold: 310,
        investmentCost: 140,
        additionalExpenses: 25,
        notes: "",
      },
      {
        date: "2026-08-03",
        totalSold: 250,
        investmentCost: 100,
        additionalExpenses: 20,
        notes: "",
      },
    ];

    expect(deriveHomeKpis(overview, records)).toEqual({
      ventasUltimoDia: 310,
      ultimaInversion: 140,
      beneficioBrutoTotalMes: 1250,
      beneficioNetoMesActual: 940,
      lastRecordDate: "2026-08-04",
    });
  });

  it("returns zeroed daily KPIs when month has no records", () => {
    const overview = createOverview({
      grossProfit: 300,
      netProfit: 180,
    });

    expect(deriveHomeKpis(overview, [])).toEqual({
      ventasUltimoDia: 0,
      ultimaInversion: 0,
      beneficioBrutoTotalMes: 300,
      beneficioNetoMesActual: 180,
      lastRecordDate: null,
    });
  });
});
