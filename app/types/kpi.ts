export type PercentageUnavailableReason = "zero-revenue";

export type IncomeStatementTotals = {
  revenue: number;
  directCosts: number;
  indirectCosts: number;
  grossProfit: number;
  overhead: number;
  operatingProfit: number;
  otherIncome: number;
  interestExpense: number;
  netOtherIncomeExpense: number;
  netIncome: number;
};

export type ProfitabilityRatios = {
  grossProfitPercent: number | null;
  overheadPercent: number | null;
  operatingProfitPercent: number | null;
  netOtherIncomeExpensePercent: number | null;
  netIncomePercent: number | null;
  unavailableReason: PercentageUnavailableReason | null;
};

export type MonthlyPeriodWindow = {
  startPeriod: string;
  endPeriod: string;
  expectedPeriods: string[];
  includedPeriods: string[];
  missingPeriods: string[];
};

export type R12MIncompleteReason =
  | "end-period-not-closed"
  | "missing-periods";

export type CompleteR12MResult = {
  status: "complete";
  companyId: string;
  window: MonthlyPeriodWindow;
  totals: IncomeStatementTotals;
  ratios: ProfitabilityRatios;
};

export type IncompleteR12MResult = {
  status: "incomplete";
  companyId: string;
  reason: R12MIncompleteReason;
  window: MonthlyPeriodWindow;
};

export type R12MResult = CompleteR12MResult | IncompleteR12MResult;
