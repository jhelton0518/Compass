export type BalanceSheetSection = "assets" | "liabilities" | "equity";
export type BalanceSheetClassification = "current" | "non-current";
export type NormalBalance = "debit" | "credit";
export type BalanceBehavior = "standard" | "contra-asset" | "contra-equity";
export type LiquidityClassification =
  | "cash"
  | "accounts-receivable"
  | "other-quick-asset"
  | "non-quick-current-asset"
  | "not-applicable";

export interface BalanceSheetReportingCategory {
  id: string;
  name: string;
  section: BalanceSheetSection;
  classification: BalanceSheetClassification | null;
  normalBalance: NormalBalance;
  behavior: BalanceBehavior;
  liquidityClassification: LiquidityClassification;
  sortOrder: number;
  isDefault: boolean;
  isCalculated?: boolean;
}

export interface BalanceSheetAccountBalance {
  glAccountId: string;
  endingBalance: number;
}

export interface MonthlyBalanceSheetRecord {
  companyId: string;
  period: string;
  balances: readonly BalanceSheetAccountBalance[];
}

export interface OpeningEquityAnchor {
  companyId: string;
  period: string;
  retainedEarnings: number;
  currentFiscalYearNetIncome: number;
}

export interface BalanceSheetLine {
  reportingCategoryId: string;
  label: string;
  section: BalanceSheetSection;
  classification: BalanceSheetClassification | null;
  amount: number;
  isCalculated: boolean;
}

export interface WorkingCapitalComponents {
  cash: number;
  accountsReceivable: number;
  otherCurrentAssets: number;
  accountsPayable: number;
  creditCards: number;
  otherCurrentLiabilities: number;
}

export type LiquidityUnavailableReason = "zero-current-liabilities";

export interface LiquidityMetrics {
  workingCapital: number;
  currentRatio: number | null;
  quickAssets: number;
  quickRatio: number | null;
  unavailableReason: LiquidityUnavailableReason | null;
}

export interface BalanceSheetStatement {
  status: "complete";
  companyId: string;
  period: string;
  lines: readonly BalanceSheetLine[];
  totalCurrentAssets: number;
  totalNonCurrentAssets: number;
  totalAssets: number;
  totalCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  totalLiabilities: number;
  totalEquity: number;
  liabilitiesAndEquity: number;
  accountingEquationDifference: number;
  components: WorkingCapitalComponents;
  liquidity: LiquidityMetrics;
  changes: Record<string, number | null>;
}

export interface AgingRecordBase {
  companyId: string;
  asOfDate: string;
  documentId: string;
  counterpartyId: string;
  counterpartyName: string;
  documentDate: string;
  dueDate: string;
  openAmount: number;
}

export interface AccountsReceivableAgingRecord extends AgingRecordBase {
  kind: "receivable";
}

export interface AccountsPayableAgingRecord extends AgingRecordBase {
  kind: "payable";
}

export type BalanceSheetCalculationResult =
  | BalanceSheetStatement
  | {
      status: "incomplete";
      companyId: string;
      period: string;
      reason: "missing-period" | "missing-income-statement-periods";
      missingPeriods?: readonly string[];
    };
