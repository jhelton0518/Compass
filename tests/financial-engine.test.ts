import assert from "node:assert/strict";
import test from "node:test";

import {
  incomeStatements,
  type MonthlyIncomeStatement,
} from "../data/income-statements.ts";
import { financialPeriods } from "../data/financial-periods.ts";
import {
  aggregateIncomeStatements,
  calculateMonthlySubtotals,
  calculateProfitabilityRatios,
  calculateR12MProfitability,
  getMonthlyPeriodWindow,
} from "../lib/services/financial-service.ts";
import {
  formatComparisonPoints,
  formatDollarAbbreviation,
  formatPercentage,
} from "../lib/formatters/financial.ts";

// Synthetic test fixtures verify engine behavior only. They are not approved
// Volunteer Custom Homes prototype data and are never imported by the app.
function fixture(
  period: string,
  overrides: Partial<MonthlyIncomeStatement> = {},
): MonthlyIncomeStatement {
  return {
    period,
    revenue: 0,
    labor: 0,
    equipment: 0,
    material: 0,
    subcontractors: 0,
    otherDirectCosts: 0,
    fuel: 0,
    equipmentDepreciation: 0,
    smallTools: 0,
    generalLiability: 0,
    healthInsurance: 0,
    officePayroll: 0,
    payrollTaxes: 0,
    rent: 0,
    utilities: 0,
    marketing: 0,
    it: 0,
    meals: 0,
    travel: 0,
    otherIncome: 0,
    interestExpense: 0,
    ...overrides,
  };
}

test("calculates the approved monthly subtotal formulas", () => {
  const totals = calculateMonthlySubtotals(
    fixture("2026-06", {
      revenue: 1_000,
      labor: 100,
      equipment: 50,
      material: 100,
      subcontractors: 25,
      otherDirectCosts: 25,
      fuel: 10,
      equipmentDepreciation: 10,
      smallTools: 10,
      generalLiability: 10,
      healthInsurance: 10,
      officePayroll: 100,
      payrollTaxes: 20,
      rent: 30,
      utilities: 10,
      marketing: 10,
      it: 10,
      meals: 5,
      travel: 15,
      otherIncome: 5,
      interestExpense: 25,
    }),
  );

  assert.deepEqual(totals, {
    revenue: 1_000,
    directCosts: 300,
    indirectCosts: 50,
    grossProfit: 650,
    overhead: 200,
    operatingProfit: 450,
    otherIncome: 5,
    interestExpense: 25,
    netOtherIncomeExpense: -20,
    netIncome: 430,
  });
});

test("generates ordered monthly windows across year boundaries", () => {
  assert.deepEqual(getMonthlyPeriodWindow("2026-02", 4), [
    "2025-11",
    "2025-12",
    "2026-01",
    "2026-02",
  ]);
});

test("returns explicit missing periods instead of calculating a partial R12M", () => {
  const result = calculateR12MProfitability({
    companyId: "fixture-company",
    endPeriod: "2026-06",
    statements: [fixture("2026-06", { revenue: 100 })],
    closedPeriodIds: ["2026-06"],
  });

  if (result.status !== "incomplete") {
    assert.fail("Expected an incomplete R12M result.");
  }
  assert.equal(result.reason, "missing-periods");
  assert.equal(result.window.missingPeriods.length, 11);
  assert.equal("totals" in result, false);
});

test("requires a closed R12M endpoint", () => {
  const periods = getMonthlyPeriodWindow("2026-06", 12);
  const result = calculateR12MProfitability({
    companyId: "fixture-company",
    endPeriod: "2026-06",
    statements: periods.map((period) => fixture(period)),
    closedPeriodIds: [],
  });

  if (result.status !== "incomplete") {
    assert.fail("Expected an incomplete R12M result.");
  }
  assert.equal(result.reason, "end-period-not-closed");
});

test("retains zero-revenue totals and returns null percentages with a reason", () => {
  const totals = calculateMonthlySubtotals(
    fixture("2026-06", { revenue: 0, labor: 20, otherIncome: 5 }),
  );
  const ratios = calculateProfitabilityRatios(totals);

  assert.equal(totals.netIncome, -15);
  assert.deepEqual(ratios, {
    grossProfitPercent: null,
    overheadPercent: null,
    operatingProfitPercent: null,
    netOtherIncomeExpensePercent: null,
    netIncomePercent: null,
    unavailableReason: "zero-revenue",
  });
});

test("preserves signed negative credits, reversals, and net other expense", () => {
  const totals = calculateMonthlySubtotals(
    fixture("2026-06", {
      revenue: 1_000,
      labor: -100,
      officePayroll: 200,
      otherIncome: -10,
      interestExpense: 40,
    }),
  );

  assert.equal(totals.directCosts, -100);
  assert.equal(totals.grossProfit, 1_100);
  assert.equal(totals.netOtherIncomeExpense, -50);
  assert.equal(totals.netIncome, 850);
});

test("reconciles the exact approved integer-dollar R12M totals", () => {
  const periods = getMonthlyPeriodWindow("2026-06", 12);
  const statements = periods.map((period) => fixture(period));

  // Aggregate-equivalent fixture: exact approved totals are concentrated in
  // one test month to avoid inventing a monthly prototype distribution.
  statements[0] = fixture(periods[0], {
    revenue: 5_240_000,
    labor: 3_888_080,
    officePayroll: 765_040,
    interestExpense: 41_920,
  });

  const result = calculateR12MProfitability({
    companyId: "fixture-company",
    endPeriod: "2026-06",
    statements,
    closedPeriodIds: ["2026-06"],
  });

  if (result.status !== "complete") {
    assert.fail("Expected a complete R12M result.");
  }
  assert.deepEqual(result.totals, {
    revenue: 5_240_000,
    directCosts: 3_888_080,
    indirectCosts: 0,
    grossProfit: 1_351_920,
    overhead: 765_040,
    operatingProfit: 586_880,
    otherIncome: 0,
    interestExpense: 41_920,
    netOtherIncomeExpense: -41_920,
    netIncome: 544_960,
  });
  assert.equal(formatPercentage(result.ratios.grossProfitPercent), "25.8%");
  assert.equal(formatPercentage(result.ratios.overheadPercent), "14.6%");
  assert.equal(formatPercentage(result.ratios.operatingProfitPercent), "11.2%");
  assert.equal(
    formatPercentage(Math.abs(result.ratios.netOtherIncomeExpensePercent!)),
    "0.8%",
  );
  assert.equal(formatPercentage(result.ratios.netIncomePercent), "10.4%");
});

test("rejects fractional currency inputs", () => {
  assert.throws(
    () => calculateMonthlySubtotals(fixture("2026-06", { revenue: 1.5 })),
    /integer dollars/,
  );
});

test("formats financial presentation values", () => {
  assert.equal(formatDollarAbbreviation(5_240_000), "$5.24M");
  assert.equal(formatDollarAbbreviation(544_960), "$545K");
  assert.equal(formatDollarAbbreviation(-41_920), "−$42K");
  assert.equal(formatPercentage(null), "—");
  assert.equal(formatComparisonPoints(0.64), "+0.6 pts");
  assert.equal(formatComparisonPoints(-3.76), "−3.8 pts");
});

test("aggregates only integer-dollar monthly results", () => {
  const totals = aggregateIncomeStatements([
    fixture("2026-05", { revenue: 100, labor: 40 }),
    fixture("2026-06", { revenue: 200, labor: 50 }),
  ]);

  assert.equal(totals.revenue, 300);
  assert.equal(totals.directCosts, 90);
  assert.equal(totals.grossProfit, 210);
});

const closedPeriodIds = financialPeriods
  .filter((period) => period.status === "closed")
  .map((period) => period.id);

function requireCompleteR12M(endPeriod: string) {
  const result = calculateR12MProfitability({
    companyId: "vch",
    endPeriod,
    statements: incomeStatements,
    closedPeriodIds,
  });

  if (result.status !== "complete") {
    assert.fail(`Expected ${endPeriod} R12M to be complete.`);
  }

  return result;
}

test("contains exactly 24 ordered, closed prototype months", () => {
  const expectedPeriods = getMonthlyPeriodWindow("2026-06", 24);

  assert.equal(incomeStatements.length, 24);
  assert.deepEqual(
    incomeStatements.map((statement) => statement.period),
    expectedPeriods,
  );
  assert.deepEqual(
    financialPeriods.map((period) => period.id),
    expectedPeriods,
  );
  assert.equal(financialPeriods.every((period) => period.status === "closed"), true);
  assert.equal(financialPeriods.at(-1)?.id, "2026-06");
});

test("stores every prototype currency field as integer dollars", () => {
  for (const statement of incomeStatements) {
    for (const [field, value] of Object.entries(statement)) {
      if (field !== "period") {
        assert.equal(
          Number.isSafeInteger(value),
          true,
          `${statement.period}.${field} must be an integer`,
        );
      }
    }
  }
});

test("reconciles the approved prior R12M window", () => {
  const result = requireCompleteR12M("2025-06");

  assert.deepEqual(result.totals, {
    revenue: 4_834_000,
    directCosts: 3_190_440,
    indirectCosts: 241_700,
    grossProfit: 1_401_860,
    overhead: 889_456,
    operatingProfit: 512_404,
    otherIncome: 6_000,
    interestExpense: 30_170,
    netOtherIncomeExpense: -24_170,
    netIncome: 488_234,
  });
  assert.equal(formatPercentage(result.ratios.grossProfitPercent), "29.0%");
  assert.equal(formatPercentage(result.ratios.overheadPercent), "18.4%");
  assert.equal(formatPercentage(result.ratios.operatingProfitPercent), "10.6%");
  assert.equal(formatPercentage(result.ratios.netOtherIncomeExpensePercent), "-0.5%");
  assert.equal(formatPercentage(result.ratios.netIncomePercent), "10.1%");
});

test("reconciles the approved current R12M window", () => {
  const result = requireCompleteR12M("2026-06");

  assert.deepEqual(result.totals, {
    revenue: 5_240_000,
    directCosts: 3_626_080,
    indirectCosts: 262_000,
    grossProfit: 1_351_920,
    overhead: 765_040,
    operatingProfit: 586_880,
    otherIncome: 6_000,
    interestExpense: 47_920,
    netOtherIncomeExpense: -41_920,
    netIncome: 544_960,
  });
  assert.equal(result.totals.directCosts + result.totals.indirectCosts, 3_888_080);
  assert.equal(formatPercentage(result.ratios.grossProfitPercent), "25.8%");
  assert.equal(formatPercentage(result.ratios.overheadPercent), "14.6%");
  assert.equal(formatPercentage(result.ratios.operatingProfitPercent), "11.2%");
  assert.equal(formatPercentage(result.ratios.netOtherIncomeExpensePercent), "-0.8%");
  assert.equal(formatPercentage(result.ratios.netIncomePercent), "10.4%");
});

test("produces every approved rounded R12M comparison", () => {
  const prior = requireCompleteR12M("2025-06");
  const current = requireCompleteR12M("2026-06");
  const pointChange = (currentValue: number | null, priorValue: number | null) => {
    assert.notEqual(currentValue, null);
    assert.notEqual(priorValue, null);
    return currentValue! - priorValue!;
  };

  const revenueChange =
    ((current.totals.revenue - prior.totals.revenue) / prior.totals.revenue) * 100;
  const overheadPointChange = pointChange(
    current.ratios.overheadPercent,
    prior.ratios.overheadPercent,
  );

  assert.equal(formatPercentage(revenueChange), "8.4%");
  assert.equal(
    formatComparisonPoints(
      pointChange(
        current.ratios.grossProfitPercent,
        prior.ratios.grossProfitPercent,
      ),
    ),
    "−3.2 pts",
  );
  assert.equal(
    formatComparisonPoints(overheadPointChange),
    "−3.8 pts",
  );
  assert.ok(overheadPointChange < 0, "Lower Overhead must be favorable.");
  assert.equal(
    formatComparisonPoints(
      pointChange(
        current.ratios.operatingProfitPercent,
        prior.ratios.operatingProfitPercent,
      ),
    ),
    "+0.6 pts",
  );
  assert.equal(
    formatComparisonPoints(
      pointChange(current.ratios.netIncomePercent, prior.ratios.netIncomePercent),
    ),
    "+0.3 pts",
  );
});

test("matches the approved monthly Gross Profit sequence", () => {
  const expected = [
    "29.0%",
    "29.0%",
    "28.0%",
    "27.5%",
    "28.0%",
    "27.0%",
    "26.5%",
    "26.0%",
    "26.0%",
    "25.0%",
    "23.8%",
    "22.9%",
  ];
  const currentMonths = incomeStatements.slice(12);
  const actual = currentMonths.map((statement) => {
    const totals = calculateMonthlySubtotals(statement);
    return formatPercentage(calculateProfitabilityRatios(totals).grossProfitPercent);
  });

  assert.deepEqual(actual, expected);
});

test("models steady monthly Overhead improvement and seasonal revenue", () => {
  const currentMonths = incomeStatements.slice(12);
  const overheadSequence = currentMonths.map((statement) => {
    const totals = calculateMonthlySubtotals(statement);
    return formatPercentage(calculateProfitabilityRatios(totals).overheadPercent);
  });

  assert.deepEqual(overheadSequence, [
    "15.8%",
    "15.6%",
    "15.4%",
    "15.3%",
    "15.1%",
    "14.9%",
    "14.7%",
    "14.5%",
    "14.4%",
    "14.2%",
    "14.0%",
    "13.8%",
  ]);
  assert.equal(currentMonths[4].period, "2025-11");
  assert.equal(currentMonths[5].period, "2025-12");
  assert.ok(currentMonths[5].revenue < currentMonths[4].revenue);
});

test("monthly prototype subtotals sum exactly to each R12M result", () => {
  for (const [start, end] of [[0, 12], [12, 24]]) {
    const months = incomeStatements.slice(start, end);
    const monthlyTotals = months.map(calculateMonthlySubtotals);
    const r12m = requireCompleteR12M(end === 12 ? "2025-06" : "2026-06");

    for (const key of Object.keys(r12m.totals) as (keyof typeof r12m.totals)[]) {
      assert.equal(
        monthlyTotals.reduce((sum, month) => sum + month[key], 0),
        r12m.totals[key],
      );
    }
  }
});
