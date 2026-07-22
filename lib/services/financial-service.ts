import type { MonthlyIncomeStatement } from "../../data/income-statements";
import type {
  IncomeStatementTotals,
  MonthlyPeriodWindow,
  ProfitabilityRatios,
  R12MResult,
} from "../../app/types/kpi";

const R12M_MONTH_COUNT = 12;

const currencyFields: (keyof Omit<MonthlyIncomeStatement, "period">)[] = [
  "revenue",
  "labor",
  "equipment",
  "material",
  "subcontractors",
  "otherDirectCosts",
  "fuel",
  "equipmentDepreciation",
  "smallTools",
  "generalLiability",
  "healthInsurance",
  "officePayroll",
  "payrollTaxes",
  "rent",
  "utilities",
  "marketing",
  "it",
  "meals",
  "travel",
  "otherIncome",
  "interestExpense",
];

function assertIntegerDollars(statement: MonthlyIncomeStatement) {
  for (const field of currencyFields) {
    if (!Number.isSafeInteger(statement[field])) {
      throw new TypeError(
        `${statement.period}.${field} must be stored as integer dollars.`,
      );
    }
  }
}

function parsePeriod(period: string) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(period);

  if (!match) {
    throw new TypeError(`Invalid monthly period: ${period}`);
  }

  return { year: Number(match[1]), month: Number(match[2]) };
}

function toPeriod(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function getMonthlyPeriodWindow(endPeriod: string, monthCount: number) {
  if (!Number.isSafeInteger(monthCount) || monthCount < 1) {
    throw new RangeError("monthCount must be a positive integer.");
  }

  const { year, month } = parsePeriod(endPeriod);
  const endMonthIndex = year * 12 + month - 1;

  return Array.from({ length: monthCount }, (_, index) => {
    const monthIndex = endMonthIndex - monthCount + index + 1;
    const periodYear = Math.floor(monthIndex / 12);
    const periodMonth = (monthIndex % 12) + 1;
    return toPeriod(periodYear, periodMonth);
  });
}

export function getR12MPeriodWindow(endPeriod: string) {
  return getMonthlyPeriodWindow(endPeriod, R12M_MONTH_COUNT);
}

export function calculateMonthlySubtotals(
  statement: MonthlyIncomeStatement,
): IncomeStatementTotals {
  assertIntegerDollars(statement);

  const directCosts =
    statement.labor +
    statement.equipment +
    statement.material +
    statement.subcontractors +
    statement.otherDirectCosts;

  const indirectCosts =
    statement.fuel +
    statement.equipmentDepreciation +
    statement.smallTools +
    statement.generalLiability +
    statement.healthInsurance;

  const grossProfit = statement.revenue - directCosts - indirectCosts;

  const overhead =
    statement.officePayroll +
    statement.payrollTaxes +
    statement.rent +
    statement.utilities +
    statement.marketing +
    statement.it +
    statement.meals +
    statement.travel;

  const operatingProfit = grossProfit - overhead;
  const netOtherIncomeExpense =
    statement.otherIncome - statement.interestExpense;
  const netIncome = operatingProfit + netOtherIncomeExpense;

  return {
    revenue: statement.revenue,
    directCosts,
    indirectCosts,
    grossProfit,
    overhead,
    operatingProfit,
    otherIncome: statement.otherIncome,
    interestExpense: statement.interestExpense,
    netOtherIncomeExpense,
    netIncome,
  };
}

export function aggregateIncomeStatements(
  statements: readonly MonthlyIncomeStatement[],
): IncomeStatementTotals {
  return statements.reduce<IncomeStatementTotals>(
    (totals, statement) => {
      const month = calculateMonthlySubtotals(statement);

      for (const key of Object.keys(totals) as (keyof IncomeStatementTotals)[]) {
        totals[key] += month[key];
      }

      return totals;
    },
    {
      revenue: 0,
      directCosts: 0,
      indirectCosts: 0,
      grossProfit: 0,
      overhead: 0,
      operatingProfit: 0,
      otherIncome: 0,
      interestExpense: 0,
      netOtherIncomeExpense: 0,
      netIncome: 0,
    },
  );
}

export function calculateProfitabilityRatios(
  totals: IncomeStatementTotals,
): ProfitabilityRatios {
  if (totals.revenue === 0) {
    return {
      grossProfitPercent: null,
      overheadPercent: null,
      operatingProfitPercent: null,
      netOtherIncomeExpensePercent: null,
      netIncomePercent: null,
      unavailableReason: "zero-revenue",
    };
  }

  const asPercent = (amount: number) => (amount / totals.revenue) * 100;

  return {
    grossProfitPercent: asPercent(totals.grossProfit),
    overheadPercent: asPercent(totals.overhead),
    operatingProfitPercent: asPercent(totals.operatingProfit),
    netOtherIncomeExpensePercent: asPercent(totals.netOtherIncomeExpense),
    netIncomePercent: asPercent(totals.netIncome),
    unavailableReason: null,
  };
}

export type R12MRequest = {
  companyId: string;
  endPeriod: string;
  statements: readonly MonthlyIncomeStatement[];
  closedPeriodIds: readonly string[];
};

export function calculateR12MProfitability({
  companyId,
  endPeriod,
  statements,
  closedPeriodIds,
}: R12MRequest): R12MResult {
  if (!companyId.trim()) {
    throw new TypeError("companyId is required.");
  }

  const expectedPeriods = getR12MPeriodWindow(endPeriod);
  const statementsByPeriod = new Map<string, MonthlyIncomeStatement>();

  for (const statement of statements) {
    parsePeriod(statement.period);

    if (statementsByPeriod.has(statement.period)) {
      throw new TypeError(`Duplicate monthly period: ${statement.period}`);
    }

    statementsByPeriod.set(statement.period, statement);
  }

  const includedPeriods = expectedPeriods.filter((period) =>
    statementsByPeriod.has(period),
  );
  const missingPeriods = expectedPeriods.filter(
    (period) => !statementsByPeriod.has(period),
  );
  const window: MonthlyPeriodWindow = {
    startPeriod: expectedPeriods[0],
    endPeriod,
    expectedPeriods,
    includedPeriods,
    missingPeriods,
  };

  if (!closedPeriodIds.includes(endPeriod)) {
    return {
      status: "incomplete",
      companyId,
      reason: "end-period-not-closed",
      window,
    };
  }

  if (missingPeriods.length > 0) {
    return {
      status: "incomplete",
      companyId,
      reason: "missing-periods",
      window,
    };
  }

  const windowStatements = expectedPeriods.map(
    (period) => statementsByPeriod.get(period)!,
  );
  const totals = aggregateIncomeStatements(windowStatements);

  return {
    status: "complete",
    companyId,
    window,
    totals,
    ratios: calculateProfitabilityRatios(totals),
  };
}
