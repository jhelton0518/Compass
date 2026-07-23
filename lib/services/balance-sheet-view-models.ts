import type { BalanceSheetStatement } from "../../app/types/balance-sheet.ts";
import type { FinancialPeriodMetadata } from "../../app/types/financial-period.ts";
import { financialPeriods } from "../../data/financial-periods.ts";
import { incomeStatements } from "../../data/income-statements.ts";
import { volunteerCustomHomesBalanceSheetRecords, volunteerCustomHomesOpeningEquityAnchor } from "../../data/balance-sheet-records.ts";
import { balanceSheetReportingCategories } from "../../data/balance-sheet-reporting-categories.ts";
import { volunteerCustomHomesBalanceSheetAccountMappings } from "../../data/account-mappings.ts";
import { calculateBalanceSheet } from "./balance-sheet-service.ts";
import { formatDollarAbbreviation, formatDollars } from "../formatters/financial.ts";
import { formatClosedPeriodLabel } from "./period-selection.ts";

const COMPANY_ID = "vch";
export const ACCOUNTING_EQUATION_ROUNDING_TOLERANCE_DOLLARS = 1;

export function fullPeriodLabel(period: string) {
  return formatClosedPeriodLabel(period);
}

function calculate(period: string) {
  return calculateBalanceSheet({ companyId: COMPANY_ID, period, records: volunteerCustomHomesBalanceSheetRecords, statements: incomeStatements, periods: financialPeriods, mappings: volunteerCustomHomesBalanceSheetAccountMappings, categories: balanceSheetReportingCategories, openingEquityAnchor: volunteerCustomHomesOpeningEquityAnchor, fiscalYearEndMonth: 12 });
}

function tableDollars(value: number) {
  if (value === 0) return "—";
  return value < 0 ? `(${formatDollars(Math.abs(value))})` : formatDollars(value);
}

function dollarChange(value: number | null) {
  if (value === null) return null;
  if (value === 0) return "$0";
  return `${value > 0 ? "+" : "−"}${formatDollarAbbreviation(Math.abs(value))}`;
}

function ratioChange(value: number | null) {
  if (value === null) return null;
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(2)} pts`;
}

function ratioValue(value: number | null) {
  return value === null ? "—" : `${value.toFixed(2)}×`;
}

function completeStatements(periods: readonly FinancialPeriodMetadata[]) {
  return periods.filter((period) => period.status === "closed").map((period) => calculate(period.id)).flatMap((result) => result.status === "complete" ? [result] : []);
}

type StatementRow = { label: string; kind: "section" | "group" | "detail" | "subtotal" | "total"; amount?: number; displayValue?: string; accessibleValue?: string };

export function buildAccountingEquationWarning(difference: number, period: string) {
  if (Math.abs(difference) <= ACCOUNTING_EQUATION_ROUNDING_TOLERANCE_DOLLARS) return null;
  return {
    title: "Balance Sheet Out of Balance",
    difference,
    displayDifference: formatDollars(difference),
    period,
    periodLabel: fullPeriodLabel(period),
  };
}

function statementRows(statement: BalanceSheetStatement): StatementRow[] {
  const lines = (section: "assets" | "liabilities" | "equity", classification?: "current" | "non-current") => statement.lines.filter((line) => line.section === section && (classification === undefined || line.classification === classification));
  const detailRows = (section: "assets" | "liabilities", classification: "current" | "non-current") => lines(section, classification).map((line) => ({ label: line.label, kind: "detail" as const, amount: line.amount, displayValue: tableDollars(line.amount), accessibleValue: formatDollars(line.amount) }));
  const amountRow = (label: string, kind: StatementRow["kind"], amount: number): StatementRow => ({ label, kind, amount, displayValue: tableDollars(amount), accessibleValue: formatDollars(amount) });
  return [
    { label: "Assets", kind: "section" },
    { label: "Current Assets", kind: "group" }, ...detailRows("assets", "current"), amountRow("Total Current Assets", "subtotal", statement.totalCurrentAssets),
    { label: "Non-Current Assets", kind: "group" }, ...detailRows("assets", "non-current"), amountRow("Total Non-Current Assets", "subtotal", statement.totalNonCurrentAssets), amountRow("Total Assets", "total", statement.totalAssets),
    { label: "Liabilities", kind: "section" },
    { label: "Current Liabilities", kind: "group" }, ...detailRows("liabilities", "current"), amountRow("Total Current Liabilities", "subtotal", statement.totalCurrentLiabilities),
    { label: "Non-Current Liabilities", kind: "group" }, ...detailRows("liabilities", "non-current"), amountRow("Total Non-Current Liabilities", "subtotal", statement.totalNonCurrentLiabilities), amountRow("Total Liabilities", "total", statement.totalLiabilities),
    { label: "Equity", kind: "section" }, ...lines("equity").map((line) => amountRow(line.label, "detail", line.amount)), amountRow("Total Equity", "total", statement.totalEquity),
    amountRow("Total Liabilities and Equity", "total", statement.liabilitiesAndEquity),
  ];
}

export function buildBalanceSheetViewModel(selectedPeriod?: string) {
  const statements = completeStatements(financialPeriods);
  const selectedIndex = Math.max(0, statements.findIndex((statement) => statement.period === selectedPeriod));
  const current = selectedPeriod && statements[selectedIndex]?.period === selectedPeriod ? statements[selectedIndex] : statements.at(-1)!;
  const currentIndex = statements.findIndex((statement) => statement.period === current.period);
  const prior = currentIndex > 0 ? statements[currentIndex - 1] : null;
  const summaries = [
    { key: "total-assets", label: "Total Assets", value: formatDollarAbbreviation(current.totalAssets), comparison: dollarChange(prior ? current.totalAssets - prior.totalAssets : null), definition: "Period-ending Assets" },
    { key: "total-liabilities", label: "Total Liabilities", value: formatDollarAbbreviation(current.totalLiabilities), comparison: dollarChange(prior ? current.totalLiabilities - prior.totalLiabilities : null), definition: "Period-ending Liabilities" },
    { key: "total-equity", label: "Total Equity", value: formatDollarAbbreviation(current.totalEquity), comparison: dollarChange(prior ? current.totalEquity - prior.totalEquity : null), definition: "Period-ending Equity" },
    { key: "working-capital", label: "Working Capital", value: formatDollarAbbreviation(current.liquidity.workingCapital), comparison: dollarChange(prior ? current.liquidity.workingCapital - prior.liquidity.workingCapital : null), definition: "Current Assets − Current Liabilities" },
    { key: "current-ratio", label: "Current Ratio", value: ratioValue(current.liquidity.currentRatio), comparison: ratioChange(prior && current.liquidity.currentRatio !== null && prior.liquidity.currentRatio !== null ? current.liquidity.currentRatio - prior.liquidity.currentRatio : null), definition: "Current Assets ÷ Current Liabilities" },
    { key: "quick-ratio", label: "Quick Ratio", value: ratioValue(current.liquidity.quickRatio), comparison: ratioChange(prior && current.liquidity.quickRatio !== null && prior.liquidity.quickRatio !== null ? current.liquidity.quickRatio - prior.liquidity.quickRatio : null), definition: "Quick Assets ÷ Current Liabilities" },
  ];
  const trendStatements = statements.slice(Math.max(0, currentIndex - 11), currentIndex + 1);
  const trends = trendStatements.map((statement) => ({ period: statement.period, fullLabel: fullPeriodLabel(statement.period), cash: statement.components.cash, workingCapital: statement.liquidity.workingCapital, currentRatio: statement.liquidity.currentRatio, quickRatio: statement.liquidity.quickRatio }));
  return { current, priorPeriod: prior?.period ?? null, periods: statements.map((statement) => ({ id: statement.period, label: fullPeriodLabel(statement.period) })), summaries, rows: statementRows(current), trends, accountingEquationWarning: buildAccountingEquationWarning(current.accountingEquationDifference, current.period) };
}

export function buildCashViewModel(selectedPeriod?: string) {
  const balanceSheet = buildBalanceSheetViewModel(selectedPeriod);
  const { current } = balanceSheet;
  return {
    period: current.period,
    periodLabel: fullPeriodLabel(current.period),
    periods: balanceSheet.periods,
    cash: current.components.cash,
    workingCapital: current.liquidity.workingCapital,
    currentRatio: current.liquidity.currentRatio,
    quickRatio: current.liquidity.quickRatio,
    currentAssets: current.lines.filter((line) => line.section === "assets" && line.classification === "current").map((line) => ({ label: line.label, amount: line.amount })),
    currentLiabilities: current.lines.filter((line) => line.section === "liabilities" && line.classification === "current").map((line) => ({ label: line.label, amount: line.amount })),
    cashTrend: balanceSheet.trends.map((point) => ({ period: point.period, fullLabel: point.fullLabel, value: point.cash })),
  };
}
