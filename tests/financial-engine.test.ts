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
import { calculateDashboardFinancialModel } from "../lib/services/dashboard-financial-service.ts";
import {
  buildIncomeStatementViewModel,
  buildProfitabilityViewModel,
} from "../lib/services/analysis-view-models.ts";
import { navItems } from "../lib/navigation.ts";
import { receivablesFixture } from "../data/prototype-fixtures.ts";
import {
  buildReceivablesViewModel,
  calculateDaysPastDue,
} from "../lib/services/prototype-view-models.ts";
import { calculatePercentageChartDomain } from "../lib/services/chart-domain.ts";
import { volunteerCustomHomesBalanceSheetRecords, volunteerCustomHomesOpeningEquityAnchor } from "../data/balance-sheet-records.ts";
import { balanceSheetReportingCategories } from "../data/balance-sheet-reporting-categories.ts";
import { volunteerCustomHomesBalanceSheetAccountMappings } from "../data/account-mappings.ts";
import { calculateBalanceSheet, calculateCurrentFiscalYearNetIncome, calculateLiquidityMetrics } from "../lib/services/balance-sheet-service.ts";
import { buildBalanceSheetViewModel, buildCashViewModel } from "../lib/services/balance-sheet-view-models.ts";
import { payablesFixture } from "../data/prototype-fixtures.ts";

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

test("builds the approved dashboard-facing calculated model", () => {
  const model = calculateDashboardFinancialModel({
    companyId: "vch",
    endPeriod: "2026-06",
    statements: incomeStatements,
    periods: financialPeriods,
  });

  if (model.status !== "complete") {
    assert.fail("Expected a complete dashboard financial model.");
  }

  assert.equal(model.companyId, "vch");
  assert.equal(model.current.window.startPeriod, "2025-07");
  assert.equal(model.current.window.endPeriod, "2026-06");
  assert.equal(model.prior.window.startPeriod, "2024-07");
  assert.equal(model.prior.window.endPeriod, "2025-06");
  assert.deepEqual(model.kpis, {
    revenue: { value: "$5.24M", comparison: "+8.4%" },
    grossProfit: {
      dollars: "$1.35M",
      percent: "25.8%",
      comparison: "−3.2 pts",
    },
    overhead: {
      percent: "14.6%",
      comparison: "−3.8 pts",
      favorable: true,
    },
    netIncome: {
      dollars: "$545K",
      percent: "10.4%",
      comparison: "+0.3 pts",
    },
  });
});

test("builds all 12 dashboard monthly trend points through June 2026", () => {
  const model = calculateDashboardFinancialModel({
    companyId: "vch",
    endPeriod: "2026-06",
    statements: incomeStatements,
    periods: financialPeriods,
  });

  if (model.status !== "complete") {
    assert.fail("Expected a complete dashboard financial model.");
  }

  assert.equal(model.trends.length, 12);
  assert.deepEqual(
    model.trends.map((point) => point.period),
    getMonthlyPeriodWindow("2026-06", 12),
  );
  assert.equal(
    formatPercentage(model.trends.at(-1)!.grossProfitPercent),
    "22.9%",
  );
  assert.equal(
    model.trends.every((point) => point.unavailableReason === null),
    true,
  );
  assert.deepEqual(model.trendSummaries, {
    grossProfitPercent: {
      startPercent: "29.0%",
      endPercent: "22.9%",
      comparison: "−6.1 pts",
      favorable: false,
    },
    overheadPercent: {
      startPercent: "15.8%",
      endPercent: "13.8%",
      comparison: "−2.0 pts",
      favorable: true,
    },
    operatingProfitPercent: {
      startPercent: "13.2%",
      endPercent: "9.1%",
      comparison: "−4.1 pts",
      favorable: false,
    },
    netIncomePercent: {
      startPercent: "12.1%",
      endPercent: "8.6%",
      comparison: "−3.5 pts",
      favorable: false,
    },
  });
});

test("keeps dashboard profitability unavailable for an incomplete window", () => {
  const model = calculateDashboardFinancialModel({
    companyId: "vch",
    endPeriod: "2026-06",
    statements: incomeStatements.slice(0, -1),
    periods: financialPeriods,
  });

  assert.equal(model.status, "incomplete");
  if (model.status === "incomplete") {
    assert.equal(model.reason, "missing-periods");
    assert.deepEqual(model.window.missingPeriods, ["2026-06"]);
  }
});

test("builds 12 reconciled rolling-R12M profitability endpoints", () => {
  const model = buildProfitabilityViewModel({
    companyId: "vch",
    endPeriod: "2026-06",
    statements: incomeStatements,
    periods: financialPeriods,
  });

  if (model.status !== "complete") {
    assert.fail("Expected complete profitability analysis.");
  }

  assert.equal(model.rolling.length, 12);
  assert.equal(model.rolling[0].period, "2025-07");
  assert.equal(model.rolling.at(-1)?.period, "2026-06");
  assert.equal(
    formatPercentage(model.rolling.at(-1)!.grossProfitPercent),
    "25.8%",
  );
  assert.equal(
    formatPercentage(model.rolling.at(-1)!.overheadPercent),
    "14.6%",
  );
  assert.equal(model.monthly.length, 12);
  for (const point of model.rolling) {
    const expected = requireCompleteR12M(point.period);
    assert.equal(point.grossProfitPercent, expected.ratios.grossProfitPercent);
    assert.equal(point.overheadPercent, expected.ratios.overheadPercent);
    assert.equal(point.operatingProfitPercent, expected.ratios.operatingProfitPercent);
    assert.equal(point.netIncomePercent, expected.ratios.netIncomePercent);
  }
  assert.deepEqual(
    model.drivers.map((driver) => driver.label),
    ["Direct Costs", "Indirect Costs", "Overhead"],
  );
});

test("builds monthly, YTD, and R12M Income Statement views", () => {
  const monthly = buildIncomeStatementViewModel({
    endPeriod: "2026-06",
    view: "monthly",
    statements: incomeStatements,
    periods: financialPeriods,
  });
  const ytd = buildIncomeStatementViewModel({
    endPeriod: "2026-06",
    view: "ytd",
    statements: incomeStatements,
    periods: financialPeriods,
  });
  const r12m = buildIncomeStatementViewModel({
    endPeriod: "2026-06",
    view: "r12m",
    statements: incomeStatements,
    periods: financialPeriods,
  });

  if (monthly.status !== "complete" || ytd.status !== "complete" || r12m.status !== "complete") {
    assert.fail("Expected every Income Statement view to be complete.");
  }

  assert.equal(monthly.startPeriod, "2026-06");
  assert.equal(monthly.totals.revenue, 900_000);
  assert.equal(ytd.startPeriod, "2026-01");
  assert.equal(ytd.totals.revenue, 3_400_000);
  assert.equal(r12m.startPeriod, "2025-07");
  assert.equal(r12m.totals.revenue, 5_240_000);
  assert.equal(r12m.totals.netIncome, 544_960);
  assert.equal(r12m.rows.some((row) => row.label === "Operating Profit"), true);
});

test("builds YTD monthly columns from January and leaves future months blank", () => {
  const model = buildIncomeStatementViewModel({
    endPeriod: "2026-06",
    view: "ytd",
    statements: incomeStatements,
    periods: financialPeriods,
  });

  if (model.status !== "complete") assert.fail("Expected complete YTD statement.");
  assert.equal(model.columns.length, 12);
  assert.equal(model.columns[0].period, "2026-01");
  assert.equal(model.columns.at(-1)?.period, "2026-12");
  assert.deepEqual(model.columns.map((column) => column.available), [
    true, true, true, true, true, true,
    false, false, false, false, false, false,
  ]);
  assert.equal(model.totalColumnLabel, "YTD Total");
  const revenue = model.rows.find((row) => row.label === "Total Revenue")!;
  assert.deepEqual(revenue.values.slice(6), [null, null, null, null, null, null]);
  assert.equal(revenue.totalAmount, 3_400_000);
  assert.deepEqual(
    model.chartSeries.map((point) => point.period),
    ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"],
  );
});

test("builds exactly 12 ordered R12M columns plus reconciled totals", () => {
  const model = buildIncomeStatementViewModel({
    endPeriod: "2026-06",
    view: "r12m",
    statements: incomeStatements,
    periods: financialPeriods,
  });

  if (model.status !== "complete") assert.fail("Expected complete R12M statement.");
  assert.equal(model.columns.length, 12);
  assert.deepEqual(model.columns.map((column) => column.period), getMonthlyPeriodWindow("2026-06", 12));
  assert.equal(model.totalColumnLabel, "R12M Total");
  assert.equal(model.rows.find((row) => row.label === "Total Revenue")?.totalAmount, 5_240_000);
  assert.equal(model.rows.find((row) => row.label === "Net Income")?.totalAmount, 544_960);
});

test("orders Income Statement detail before section subtotals", () => {
  const model = buildIncomeStatementViewModel({ endPeriod: "2026-06", view: "r12m", statements: incomeStatements, periods: financialPeriods });
  if (model.status !== "complete") assert.fail("Expected complete R12M statement.");
  const index = (label: string) => model.rows.findIndex((row) => row.label === label);

  assert.ok(index("Revenue") < index("Contract Revenue"));
  assert.ok(index("Contract Revenue") < index("Total Revenue"));
  assert.ok(index("Direct Costs") < index("Labor"));
  assert.ok(index("Other Direct Costs") < index("Total Direct Costs"));
  assert.ok(index("Indirect Costs") < index("Fuel"));
  assert.ok(index("Health Insurance") < index("Total Indirect Costs"));
  assert.ok(index("Overhead") < index("Office Payroll"));
  assert.ok(index("Travel") < index("Total Overhead"));
  assert.ok(index("Other Income / Expense") < index("Other Income"));
  assert.ok(index("Interest Expense") < index("Total Other Income / Expense"));
  assert.equal(model.rows[index("Gross Profit") + 1].label, "Gross Profit %");
  assert.equal(model.rows[index("Operating Profit") + 1].label, "Operating Profit %");
  assert.equal(model.rows[index("Net Income") + 1].label, "Net Income %");
});

test("reconciles statement section totals and profit rows for every displayed month", () => {
  const model = buildIncomeStatementViewModel({ endPeriod: "2026-06", view: "r12m", statements: incomeStatements, periods: financialPeriods });
  if (model.status !== "complete") assert.fail("Expected complete R12M statement.");
  const row = (label: string) => model.rows.find((item) => item.label === label)!;

  model.columns.forEach((_, columnIndex) => {
    const directDetail = ["Labor", "Equipment", "Material", "Subcontractors", "Other Direct Costs"].reduce((sum, label) => sum + (row(label).values[columnIndex] ?? 0), 0);
    const indirectDetail = ["Fuel", "Equipment Depreciation", "Small Tools", "General Liability", "Health Insurance"].reduce((sum, label) => sum + (row(label).values[columnIndex] ?? 0), 0);
    const overheadDetail = ["Office Payroll", "Payroll Taxes", "Rent", "Utilities", "Marketing", "IT", "Meals", "Travel"].reduce((sum, label) => sum + (row(label).values[columnIndex] ?? 0), 0);
    assert.equal(row("Total Direct Costs").values[columnIndex], directDetail);
    assert.equal(row("Total Indirect Costs").values[columnIndex], indirectDetail);
    assert.equal(row("Total Overhead").values[columnIndex], overheadDetail);
    assert.equal(row("Gross Profit").values[columnIndex], row("Total Revenue").values[columnIndex]! - directDetail - indirectDetail);
    assert.equal(row("Operating Profit").values[columnIndex], row("Gross Profit").values[columnIndex]! - overheadDetail);
    assert.equal(row("Net Income").values[columnIndex], row("Operating Profit").values[columnIndex]! + row("Total Other Income / Expense").values[columnIndex]!);
  });
});

test("uses one identical ordered R12M series for Profitability and Income Statement", () => {
  const profitability = buildProfitabilityViewModel({ companyId: "vch", endPeriod: "2026-06", statements: incomeStatements, periods: financialPeriods });
  const statement = buildIncomeStatementViewModel({ endPeriod: "2026-06", view: "r12m", statements: incomeStatements, periods: financialPeriods });
  if (profitability.status !== "complete" || statement.status !== "complete") assert.fail("Expected complete analysis models.");

  assert.equal(statement.chartSeries.length, 12);
  assert.deepEqual(statement.chartSeries.map((point) => point.period), getMonthlyPeriodWindow("2026-06", 12));
  assert.deepEqual(statement.chartSeries.map((point) => point.fullLabel), ["July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025", "January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026"]);
  for (let index = 0; index < 12; index += 1) {
    for (const key of ["grossProfitPercent", "overheadPercent", "operatingProfitPercent", "netIncomePercent"] as const) {
      assert.equal(statement.chartSeries[index][key], profitability.rolling[index][key]);
    }
  }
});

test("reconciles every displayed R12M endpoint through Net Income", () => {
  const model = buildIncomeStatementViewModel({ endPeriod: "2026-06", view: "r12m", statements: incomeStatements, periods: financialPeriods });
  if (model.status !== "complete") assert.fail("Expected complete statement charts.");
  for (const point of model.chartSeries) {
    const { totals, grossProfitPercent, overheadPercent, operatingProfitPercent, netOtherIncomeExpensePercent, netIncomePercent } = point;
    assert.equal(totals.grossProfit, totals.revenue - totals.directCosts - totals.indirectCosts);
    assert.equal(totals.operatingProfit, totals.grossProfit - totals.overhead);
    assert.equal(totals.netOtherIncomeExpense, totals.otherIncome - totals.interestExpense);
    assert.equal(totals.netIncome, totals.operatingProfit + totals.netOtherIncomeExpense);
    assert.equal(grossProfitPercent, totals.grossProfit / totals.revenue * 100);
    assert.equal(overheadPercent, totals.overhead / totals.revenue * 100);
    assert.equal(operatingProfitPercent, totals.operatingProfit / totals.revenue * 100);
    assert.equal(netOtherIncomeExpensePercent, totals.netOtherIncomeExpense / totals.revenue * 100);
    assert.equal(netIncomePercent, totals.netIncome / totals.revenue * 100);
  }
  const june = model.chartSeries.at(-1)!;
  assert.equal(june.totals.revenue, 5_240_000);
  assert.equal(june.totals.netIncome, 544_960);
  assert.equal(formatPercentage(june.grossProfitPercent), "25.8%");
  assert.equal(formatPercentage(june.overheadPercent), "14.6%");
  assert.equal(formatPercentage(june.netIncomePercent), "10.4%");
});

test("changes Income Statement windows with the selected as-of period", () => {
  const r12m = buildIncomeStatementViewModel({ endPeriod: "2026-03", view: "r12m", statements: incomeStatements, periods: financialPeriods });
  const ytd = buildIncomeStatementViewModel({ endPeriod: "2026-03", view: "ytd", statements: incomeStatements, periods: financialPeriods });
  if (r12m.status !== "complete" || ytd.status !== "complete") assert.fail("Expected complete shifted statements.");
  assert.equal(r12m.columns[0].period, "2025-04");
  assert.equal(r12m.columns.at(-1)?.period, "2026-03");
  assert.deepEqual(ytd.columns.map((column) => column.available), [true, true, true, false, false, false, false, false, false, false, false, false]);
});

test("calculates every statement P&L chart point from aggregated R12M dollars", () => {
  const model = buildIncomeStatementViewModel({ endPeriod: "2026-06", view: "r12m", statements: incomeStatements, periods: financialPeriods });
  if (model.status !== "complete") assert.fail("Expected complete statement charts.");
  assert.equal(model.chartSeries.length, 12);
  for (const point of model.chartSeries) {
    const expected = requireCompleteR12M(point.period);
    assert.equal(point.grossProfitPercent, expected.ratios.grossProfitPercent);
    assert.equal(point.overheadPercent, expected.ratios.overheadPercent);
    assert.equal(point.netIncomePercent, expected.ratios.netIncomePercent);
  }
  assert.equal(formatPercentage(model.chartSeries.at(-1)!.netIncomePercent), "10.4%");
  const juneMonthly = calculateProfitabilityRatios(calculateMonthlySubtotals(incomeStatements.at(-1)!));
  assert.equal(formatPercentage(juneMonthly.netIncomePercent), "8.6%");
  assert.notEqual(model.chartSeries.at(-1)!.netIncomePercent, juneMonthly.netIncomePercent);
});

test("derives the July 22 AR aging model entirely from invoice due dates", () => {
  const model = buildReceivablesViewModel(receivablesFixture, "2026-07-22");
  assert.deepEqual(model.invoices.map((invoice) => invoice.daysPastDue), [81, 59, 44, 31, 12]);
  assert.deepEqual(model.invoices.map((invoice) => invoice.status), ["Escalate", "Escalate", "Follow up", "Follow up", "Follow up"]);
  assert.equal(model.total, 517_000);
  assert.equal(model.current, 0);
  assert.equal(model.over45, 220_000);
  assert.equal(model.averageDaysPastDue, 46);
  assert.deepEqual(model.aging, [
    { label: "Current", amount: 0 },
    { label: "1–30", amount: 108_000 },
    { label: "31–45", amount: 189_000 },
    { label: "46–60", amount: 92_000 },
    { label: "61–90", amount: 128_000 },
    { label: "90+", amount: 0 },
  ]);
  assert.deepEqual(model.customers.map((customer) => customer.risk), ["High", "Watch", "Watch", "High", "Watch"]);
  assert.equal(calculateDaysPastDue("2026-08-10", "2026-07-22"), 0);
});

test("defines unique working routes for every application destination", () => {
  const expectedRoutes = [
    "/",
    "/profitability",
    "/cash",
    "/financial-statements",
    "/accounts-receivable",
    "/accounts-payable",
    "/settings",
  ];

  assert.deepEqual(navItems.map((item) => item.href), expectedRoutes);
  assert.equal(new Set(navItems.map((item) => item.href)).size, expectedRoutes.length);
});

test("calculates dynamic percentage domains with minimum padding and clean outward rounding", () => {
  assert.deepEqual(calculatePercentageChartDomain([25.8, 27.4, 29]), { lower: 25, upper: 30 });
  assert.deepEqual(calculatePercentageChartDomain([14.6, 16.2, 18.2]), { lower: 13.5, upper: 19 });
  assert.deepEqual(calculatePercentageChartDomain([0, 10]), { lower: -2, upper: 12 });
  assert.deepEqual(calculatePercentageChartDomain([1.1, 2.3]), { lower: 0, upper: 3.5 });

  const values = [10.2, 10.9];
  const domain = calculatePercentageChartDomain(values);
  assert.deepEqual(domain, { lower: 9, upper: 12 });
  assert.ok(Math.min(...values) - domain.lower >= 0.75);
  assert.ok(domain.upper - Math.max(...values) >= 0.75);
  assert.ok((domain.upper - domain.lower) - (Math.max(...values) - Math.min(...values)) >= 1.5);
});

test("supports negative and flat percentage domains without forcing zero", () => {
  assert.deepEqual(calculatePercentageChartDomain([-5, -4, -3]), { lower: -6, upper: -2 });
  assert.deepEqual(calculatePercentageChartDomain([10, 10, 10]), { lower: 9, upper: 11 });
  assert.deepEqual(calculatePercentageChartDomain([-2, -2]), { lower: -3, upper: -1 });
});

const balanceSheetRequest = (period: string) => ({ companyId: "vch", period, records: volunteerCustomHomesBalanceSheetRecords, statements: incomeStatements, periods: financialPeriods, mappings: volunteerCustomHomesBalanceSheetAccountMappings, categories: balanceSheetReportingCategories, openingEquityAnchor: volunteerCustomHomesOpeningEquityAnchor, fiscalYearEndMonth: 12 });

function requireCompleteBalanceSheet(period: string) {
  const result = calculateBalanceSheet(balanceSheetRequest(period));
  if (result.status !== "complete") assert.fail(`Expected ${period} Balance Sheet to be complete.`);
  return result;
}

test("defines the complete mapped VCH Balance Sheet account hierarchy", () => {
  assert.equal(balanceSheetReportingCategories.length, 17);
  assert.equal(volunteerCustomHomesBalanceSheetAccountMappings.length, 17);
  assert.equal(new Set(volunteerCustomHomesBalanceSheetAccountMappings.map((mapping) => mapping.glAccountId)).size, 17);
  assert.equal(balanceSheetReportingCategories.find((category) => category.id === "bs-accumulated-depreciation")?.behavior, "contra-asset");
  assert.equal(balanceSheetReportingCategories.find((category) => category.id === "bs-owner-distributions")?.behavior, "contra-equity");
  assert.equal(balanceSheetReportingCategories.find((category) => category.id === "bs-other-current-assets")?.liquidityClassification, "non-quick-current-asset");
  assert.equal(balanceSheetReportingCategories.find((category) => category.id === "bs-current-net-income")?.isCalculated, true);
});

test("contains 24 ordered monthly period-ending Balance Sheet records", () => {
  assert.equal(volunteerCustomHomesBalanceSheetRecords.length, 24);
  assert.deepEqual(volunteerCustomHomesBalanceSheetRecords.map((record) => record.period), getMonthlyPeriodWindow("2026-06", 24));
  for (const record of volunteerCustomHomesBalanceSheetRecords) {
    assert.equal(record.balances.length, 16, "Current Fiscal-Year Net Income must be calculated, not stored.");
    assert.equal(record.balances.every((balance) => Number.isSafeInteger(balance.endingBalance)), true);
    assert.equal(record.balances.some((balance) => balance.glAccountId === "gl-3300"), false);
  }
});

test("balances every monthly endpoint exactly and returns period changes", () => {
  for (const record of volunteerCustomHomesBalanceSheetRecords) {
    const result = requireCompleteBalanceSheet(record.period);
    assert.equal(result.totalAssets, result.liabilitiesAndEquity, record.period);
    assert.equal(result.accountingEquationDifference, 0, record.period);
  }
  const june = requireCompleteBalanceSheet("2026-06");
  assert.equal(june.changes["bs-cash"], -13_000);
  assert.equal(june.changes["bs-ar"], 22_000);
});

test("rolls classifications, contra assets, and owner distributions correctly", () => {
  const june = requireCompleteBalanceSheet("2026-06");
  const line = (id: string) => june.lines.find((item) => item.reportingCategoryId === id)!.amount;
  assert.equal(line("bs-equipment"), 1_590_000);
  assert.equal(line("bs-accumulated-depreciation"), -540_000);
  assert.equal(june.totalNonCurrentAssets, 1_100_000);
  assert.equal(june.totalCurrentAssets + june.totalNonCurrentAssets, june.totalAssets);
  assert.equal(june.totalCurrentLiabilities + june.totalNonCurrentLiabilities, june.totalLiabilities);
  assert.ok(line("bs-owner-distributions") < 0);
  assert.equal(june.totalEquity, line("bs-owner-contributions") + line("bs-owner-distributions") + line("bs-retained-earnings") + line("bs-current-net-income"));
});

test("derives current-year Net Income and closes it into retained earnings in January", () => {
  for (const period of getMonthlyPeriodWindow("2026-06", 24)) {
    const calculated = calculateCurrentFiscalYearNetIncome({ companyId: "vch", period, fiscalYearEndMonth: 12, statements: incomeStatements, openingEquityAnchor: volunteerCustomHomesOpeningEquityAnchor });
    if (calculated.status !== "complete") assert.fail(`Expected ${period} current-year income.`);
    assert.equal(requireCompleteBalanceSheet(period).lines.find((line) => line.reportingCategoryId === "bs-current-net-income")?.amount, calculated.amount);
  }
  const amount = (period: string, id: string) => requireCompleteBalanceSheet(period).lines.find((line) => line.reportingCategoryId === id)!.amount;
  assert.equal(amount("2025-01", "bs-retained-earnings"), amount("2024-12", "bs-retained-earnings") + amount("2024-12", "bs-current-net-income"));
  assert.equal(amount("2026-01", "bs-retained-earnings"), amount("2025-12", "bs-retained-earnings") + amount("2025-12", "bs-current-net-income"));
  assert.equal(amount("2025-01", "bs-current-net-income"), calculateMonthlySubtotals(incomeStatements.find((statement) => statement.period === "2025-01")!).netIncome);
  assert.equal(amount("2026-01", "bs-current-net-income"), calculateMonthlySubtotals(incomeStatements.find((statement) => statement.period === "2026-01")!).netIncome);
});

test("reconciles every approved June Balance Sheet and liquidity anchor", () => {
  const june = requireCompleteBalanceSheet("2026-06");
  assert.deepEqual(june.components, { cash: 418_000, accountsReceivable: 782_000, otherCurrentAssets: 96_000, accountsPayable: 524_000, creditCards: 118_000, otherCurrentLiabilities: 42_000 });
  assert.equal(june.totalCurrentAssets, 1_296_000);
  assert.equal(june.totalCurrentLiabilities, 684_000);
  assert.equal(june.liquidity.workingCapital, 612_000);
  assert.equal(june.liquidity.currentRatio, 1.894736842105263);
  assert.equal(june.liquidity.quickAssets, 1_200_000);
  assert.equal(june.liquidity.quickRatio, 1.7543859649122806);
  assert.equal(june.liquidity.quickAssets, june.components.cash + june.components.accountsReceivable);
});

test("uses historical endpoint balances rather than aggregating them as R12M", () => {
  const july = requireCompleteBalanceSheet("2024-07");
  const june = requireCompleteBalanceSheet("2026-06");
  assert.equal(july.components.cash, 620_000);
  assert.equal(july.changes["bs-cash"], null);
  assert.equal(june.components.cash, 418_000);
  const summedCash = volunteerCustomHomesBalanceSheetRecords.slice(-12).reduce((sum, record) => sum + record.balances.find((balance) => balance.glAccountId === "gl-1000")!.endingBalance, 0);
  assert.notEqual(june.components.cash, summedCash);
});

test("returns explicit unavailable liquidity ratios for zero current liabilities", () => {
  assert.deepEqual(calculateLiquidityMetrics(100_000, 0, 75_000), { workingCapital: 100_000, currentRatio: null, quickAssets: 75_000, quickRatio: null, unavailableReason: "zero-current-liabilities" });
});

test("builds the selected Balance Sheet hierarchy with details before subtotals", () => {
  const model = buildBalanceSheetViewModel("2024-09");
  assert.equal(model.current.period, "2024-09");
  assert.equal(model.periods.length, 24);
  assert.deepEqual(model.periods.map((period) => period.id), getMonthlyPeriodWindow("2026-06", 24));
  const index = (label: string) => model.rows.findIndex((row) => row.label === label);
  assert.ok(index("Operating Cash") < index("Total Current Assets"));
  assert.ok(index("Accumulated Depreciation") < index("Total Non-Current Assets"));
  assert.ok(index("Accounts Payable") < index("Total Current Liabilities"));
  assert.ok(index("Long-Term Debt") < index("Total Non-Current Liabilities"));
  assert.ok(index("Current Fiscal-Year Net Income") < index("Total Equity"));
  assert.equal(model.rows[index("Accumulated Depreciation")].displayValue?.startsWith("("), true);
  assert.equal(model.rows[index("Owner Distributions")].displayValue?.startsWith("("), true);
  assert.equal(model.rows.at(-1)?.displayValue, "Balanced");
});

test("builds approved June summaries and May prior-month comparisons", () => {
  const model = buildBalanceSheetViewModel("2026-06");
  assert.equal(model.priorPeriod, "2026-05");
  assert.deepEqual(Object.fromEntries(model.summaries.map((summary) => [summary.key, summary.value])), {
    "total-assets": "$2.4M",
    "total-liabilities": "$1.07M",
    "total-equity": "$1.32M",
    "working-capital": "$612K",
    "current-ratio": "1.89×",
    "quick-ratio": "1.75×",
  });
  const may = requireCompleteBalanceSheet("2026-05");
  assert.equal(model.current.totalAssets - may.totalAssets, 25_000);
  assert.equal(model.summaries.find((summary) => summary.key === "total-assets")?.comparison, "+$25K");
  assert.equal(model.summaries.every((summary) => summary.comparison !== null), true);
});

test("builds 24 authoritative Cash and liquidity trend endpoints", () => {
  const cash = buildCashViewModel("2026-06");
  const balanceSheet = buildBalanceSheetViewModel("2026-06");
  assert.equal(cash.cash, 418_000);
  assert.equal(cash.cash, balanceSheet.current.components.cash);
  assert.equal(cash.cashTrend.length, 24);
  assert.deepEqual(cash.cashTrend.map((point) => point.period), getMonthlyPeriodWindow("2026-06", 24));
  assert.equal(cash.cashTrend.at(-1)?.value, 418_000);
  assert.equal(balanceSheet.trends.length, 24);
  for (const point of balanceSheet.trends) {
    const statement = requireCompleteBalanceSheet(point.period);
    assert.equal(point.workingCapital, statement.liquidity.workingCapital);
    assert.equal(point.currentRatio, statement.liquidity.currentRatio);
    assert.equal(point.quickRatio, statement.liquidity.quickRatio);
  }
});

test("keeps July operational AR and AP distinct from June control balances", () => {
  const operationalAr = buildReceivablesViewModel(receivablesFixture, "2026-07-22");
  const june = requireCompleteBalanceSheet("2026-06");
  assert.equal(operationalAr.total, 517_000);
  assert.equal(june.components.accountsReceivable, 782_000);
  assert.equal(payablesFixture.total, 524_000);
  assert.equal(june.components.accountsPayable, 524_000);
  assert.equal(operationalAr.asOfDate, "2026-07-22");
});
