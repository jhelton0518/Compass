import type { MonthlyIncomeStatement } from "../../data/income-statements";
import type { FinancialPeriodMetadata } from "../../app/types/financial-period";
import type {
  DashboardFinancialModel,
  DashboardTrendPoint,
  ProfitabilityRatios,
} from "../../app/types/kpi";
import {
  formatComparisonPoints,
  formatDollarAbbreviation,
  formatPercentage,
  formatPercentageComparison,
} from "../formatters/financial.ts";
import {
  calculateMonthlySubtotals,
  calculateProfitabilityRatios,
  calculateR12MProfitability,
  getMonthlyPeriodWindow,
} from "./financial-service.ts";

type DashboardFinancialRequest = {
  companyId: string;
  endPeriod: string;
  statements: readonly MonthlyIncomeStatement[];
  periods: readonly FinancialPeriodMetadata[];
};

function pointChange(current: number | null, prior: number | null) {
  return current === null || prior === null ? null : current - prior;
}

function priorR12MEndPeriod(endPeriod: string) {
  return getMonthlyPeriodWindow(endPeriod, 13)[0];
}

function toTrendPoint(
  statement: MonthlyIncomeStatement,
): DashboardTrendPoint {
  const ratios = calculateProfitabilityRatios(
    calculateMonthlySubtotals(statement),
  );

  return {
    period: statement.period,
    grossProfitPercent: ratios.grossProfitPercent,
    overheadPercent: ratios.overheadPercent,
    operatingProfitPercent: ratios.operatingProfitPercent,
    netIncomePercent: ratios.netIncomePercent,
    unavailableReason: ratios.unavailableReason,
  };
}

export function calculateDashboardFinancialModel({
  companyId,
  endPeriod,
  statements,
  periods,
}: DashboardFinancialRequest): DashboardFinancialModel {
  const closedPeriodIds = periods
    .filter((period) => period.status === "closed")
    .map((period) => period.id);
  const current = calculateR12MProfitability({
    companyId,
    endPeriod,
    statements,
    closedPeriodIds,
  });

  if (current.status === "incomplete") {
    return current;
  }

  const prior = calculateR12MProfitability({
    companyId,
    endPeriod: priorR12MEndPeriod(endPeriod),
    statements,
    closedPeriodIds,
  });

  if (prior.status === "incomplete") {
    return prior;
  }

  const ratioChange = (key: keyof ProfitabilityRatios) => {
    const currentValue = current.ratios[key];
    const priorValue = prior.ratios[key];
    return typeof currentValue === "number" && typeof priorValue === "number"
      ? pointChange(currentValue, priorValue)
      : null;
  };
  const revenueComparison =
    prior.totals.revenue === 0
      ? null
      : ((current.totals.revenue - prior.totals.revenue) /
          prior.totals.revenue) *
        100;
  const grossProfitComparison = ratioChange("grossProfitPercent");
  const overheadComparison = ratioChange("overheadPercent");
  const netIncomeComparison = ratioChange("netIncomePercent");
  const statementsByPeriod = new Map(
    statements.map((statement) => [statement.period, statement]),
  );
  const trends = current.window.expectedPeriods.map((period) =>
    toTrendPoint(statementsByPeriod.get(period)!),
  );
  const firstTrend = trends[0];
  const lastTrend = trends.at(-1)!;
  const monthlyTrendSummary = (
    key:
      | "grossProfitPercent"
      | "overheadPercent"
      | "operatingProfitPercent"
      | "netIncomePercent",
    lowerIsBetter = false,
  ) => {
    const startValue = firstTrend[key];
    const endValue = lastTrend[key];
    const comparison = pointChange(endValue, startValue);

    return {
      startPercent: formatPercentage(startValue),
      endPercent: formatPercentage(endValue),
      comparison: formatComparisonPoints(comparison),
      favorable:
        comparison === null
          ? null
          : lowerIsBetter
            ? comparison < 0
            : comparison > 0,
    };
  };

  return {
    status: "complete",
    companyId,
    current,
    prior,
    kpis: {
      revenue: {
        value: formatDollarAbbreviation(current.totals.revenue),
        comparison: formatPercentageComparison(revenueComparison),
      },
      grossProfit: {
        dollars: formatDollarAbbreviation(current.totals.grossProfit),
        percent: formatPercentage(current.ratios.grossProfitPercent),
        comparison: formatComparisonPoints(grossProfitComparison),
      },
      overhead: {
        percent: formatPercentage(current.ratios.overheadPercent),
        comparison: formatComparisonPoints(overheadComparison),
        favorable: overheadComparison !== null && overheadComparison < 0,
      },
      netIncome: {
        dollars: formatDollarAbbreviation(current.totals.netIncome),
        percent: formatPercentage(current.ratios.netIncomePercent),
        comparison: formatComparisonPoints(netIncomeComparison),
      },
    },
    trendSummaries: {
      grossProfitPercent: monthlyTrendSummary("grossProfitPercent"),
      overheadPercent: monthlyTrendSummary("overheadPercent", true),
      operatingProfitPercent: monthlyTrendSummary("operatingProfitPercent"),
      netIncomePercent: monthlyTrendSummary("netIncomePercent"),
    },
    trends,
  };
}
