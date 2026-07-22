import type { MonthlyIncomeStatement } from "../../data/income-statements.ts";
import type { FinancialPeriodMetadata } from "../../app/types/financial-period.ts";
import type { AccountMapping } from "../../app/types/finance.ts";
import type {
  BalanceSheetCalculationResult,
  BalanceSheetReportingCategory,
  BalanceSheetStatement,
  LiquidityMetrics,
  MonthlyBalanceSheetRecord,
  OpeningEquityAnchor,
} from "../../app/types/balance-sheet.ts";
import { calculateMonthlySubtotals } from "./financial-service.ts";

function fiscalYearStartPeriod(period: string, fiscalYearEndMonth: number) {
  const [year, month] = period.split("-").map(Number);
  const startMonth = fiscalYearEndMonth % 12 + 1;
  const startYear = month >= startMonth ? year : year - 1;
  return `${startYear}-${String(startMonth).padStart(2, "0")}`;
}

export function calculateCurrentFiscalYearNetIncome({
  companyId,
  period,
  fiscalYearEndMonth,
  statements,
  openingEquityAnchor,
}: {
  companyId: string;
  period: string;
  fiscalYearEndMonth: number;
  statements: readonly MonthlyIncomeStatement[];
  openingEquityAnchor: OpeningEquityAnchor;
}) {
  const startPeriod = fiscalYearStartPeriod(period, fiscalYearEndMonth);
  const usesOpeningCurrentIncome = startPeriod <= openingEquityAnchor.period;
  const effectiveStart = usesOpeningCurrentIncome ? openingEquityAnchor.period : startPeriod;
  const included = statements.filter((statement) => (usesOpeningCurrentIncome ? statement.period > effectiveStart : statement.period >= effectiveStart) && statement.period <= period);
  const expectedStart = usesOpeningCurrentIncome ? openingEquityAnchor.period : startPeriod;
  const [startYear, startMonth] = expectedStart.split("-").map(Number);
  const [endYear, endMonth] = period.split("-").map(Number);
  const expectedCount = (endYear * 12 + endMonth) - (startYear * 12 + startMonth) + (usesOpeningCurrentIncome ? 0 : 1);

  if (openingEquityAnchor.companyId !== companyId || included.length !== expectedCount) {
    return { status: "incomplete" as const, missingPeriods: [] as string[] };
  }

  return {
    status: "complete" as const,
    amount: (usesOpeningCurrentIncome ? openingEquityAnchor.currentFiscalYearNetIncome : 0)
      + included.reduce((sum, statement) => sum + calculateMonthlySubtotals(statement).netIncome, 0),
  };
}

export function calculateLiquidityMetrics(currentAssets: number, currentLiabilities: number, quickAssets: number): LiquidityMetrics {
  if (currentLiabilities === 0) {
    return { workingCapital: currentAssets, currentRatio: null, quickAssets, quickRatio: null, unavailableReason: "zero-current-liabilities" };
  }
  return {
    workingCapital: currentAssets - currentLiabilities,
    currentRatio: currentAssets / currentLiabilities,
    quickAssets,
    quickRatio: quickAssets / currentLiabilities,
    unavailableReason: null,
  };
}

type BalanceSheetRequest = {
  companyId: string;
  period: string;
  records: readonly MonthlyBalanceSheetRecord[];
  statements: readonly MonthlyIncomeStatement[];
  periods: readonly FinancialPeriodMetadata[];
  mappings: readonly AccountMapping[];
  categories: readonly BalanceSheetReportingCategory[];
  openingEquityAnchor: OpeningEquityAnchor;
  fiscalYearEndMonth: number;
};

function calculateEndpoint(request: BalanceSheetRequest, includeChanges: boolean): BalanceSheetCalculationResult {
  const record = request.records.find((item) => item.companyId === request.companyId && item.period === request.period);
  if (!record || !request.periods.some((item) => item.id === request.period && item.status === "closed")) {
    return { status: "incomplete", companyId: request.companyId, period: request.period, reason: "missing-period" };
  }
  const currentIncome = calculateCurrentFiscalYearNetIncome(request);
  if (currentIncome.status !== "complete") {
    return { status: "incomplete", companyId: request.companyId, period: request.period, reason: "missing-income-statement-periods", missingPeriods: currentIncome.missingPeriods };
  }

  const mappingByAccount = new Map(request.mappings.map((mapping) => [mapping.glAccountId, mapping.reportingCategoryId]));
  const amountByCategory = new Map<string, number>();
  for (const balance of record.balances) {
    if (!Number.isSafeInteger(balance.endingBalance)) throw new TypeError(`${record.period}.${balance.glAccountId} must be integer dollars.`);
    const categoryId = mappingByAccount.get(balance.glAccountId);
    if (!categoryId) throw new TypeError(`Unmapped Balance Sheet account: ${balance.glAccountId}`);
    amountByCategory.set(categoryId, (amountByCategory.get(categoryId) ?? 0) + balance.endingBalance);
  }
  amountByCategory.set("bs-current-net-income", currentIncome.amount);

  const lines = request.categories.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((category) => ({
    reportingCategoryId: category.id,
    label: category.name,
    section: category.section,
    classification: category.classification,
    amount: amountByCategory.get(category.id) ?? 0,
    isCalculated: category.isCalculated ?? false,
  }));
  const sum = (section: "assets" | "liabilities" | "equity", classification?: "current" | "non-current") => lines.filter((line) => line.section === section && (classification === undefined || line.classification === classification)).reduce((total, line) => total + line.amount, 0);
  const totalCurrentAssets = sum("assets", "current");
  const totalNonCurrentAssets = sum("assets", "non-current");
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
  const totalCurrentLiabilities = sum("liabilities", "current");
  const totalNonCurrentLiabilities = sum("liabilities", "non-current");
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
  const totalEquity = sum("equity");
  const get = (categoryId: string) => amountByCategory.get(categoryId) ?? 0;
  const cash = get("bs-cash");
  const accountsReceivable = get("bs-ar");
  const otherCurrentAssets = totalCurrentAssets - cash - accountsReceivable;
  const accountsPayable = get("bs-ap");
  const creditCards = get("bs-credit-cards");
  const otherCurrentLiabilities = get("bs-other-current-liabilities");
  const quickAssets = request.categories.filter((category) => category.liquidityClassification === "cash" || category.liquidityClassification === "accounts-receivable" || category.liquidityClassification === "other-quick-asset").reduce((total, category) => total + get(category.id), 0);
  const changes: Record<string, number | null> = Object.fromEntries(lines.map((line) => [line.reportingCategoryId, null]));

  if (includeChanges) {
    const recordIndex = request.records.findIndex((item) => item.companyId === request.companyId && item.period === request.period);
    const priorRecord = recordIndex > 0 ? request.records[recordIndex - 1] : null;
    if (priorRecord) {
      const prior = calculateEndpoint({ ...request, period: priorRecord.period }, false);
      if (prior.status === "complete") {
        const priorByCategory = new Map(prior.lines.map((line) => [line.reportingCategoryId, line.amount]));
        for (const line of lines) changes[line.reportingCategoryId] = line.amount - (priorByCategory.get(line.reportingCategoryId) ?? 0);
      }
    }
  }

  return {
    status: "complete",
    companyId: request.companyId,
    period: request.period,
    lines,
    totalCurrentAssets,
    totalNonCurrentAssets,
    totalAssets,
    totalCurrentLiabilities,
    totalNonCurrentLiabilities,
    totalLiabilities,
    totalEquity,
    liabilitiesAndEquity: totalLiabilities + totalEquity,
    accountingEquationDifference: totalAssets - totalLiabilities - totalEquity,
    components: { cash, accountsReceivable, otherCurrentAssets, accountsPayable, creditCards, otherCurrentLiabilities },
    liquidity: calculateLiquidityMetrics(totalCurrentAssets, totalCurrentLiabilities, quickAssets),
    changes,
  } satisfies BalanceSheetStatement;
}

export function calculateBalanceSheet(request: BalanceSheetRequest) {
  return calculateEndpoint(request, true);
}
