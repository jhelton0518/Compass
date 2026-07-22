import type { BalanceSheetReportingCategory } from "../app/types/balance-sheet.ts";

export const balanceSheetReportingCategories: BalanceSheetReportingCategory[] = [
  { id: "bs-cash", name: "Operating Cash", section: "assets", classification: "current", normalBalance: "debit", behavior: "standard", liquidityClassification: "cash", sortOrder: 10, isDefault: true },
  { id: "bs-ar", name: "Accounts Receivable", section: "assets", classification: "current", normalBalance: "debit", behavior: "standard", liquidityClassification: "accounts-receivable", sortOrder: 20, isDefault: true },
  { id: "bs-other-current-assets", name: "Other Current Assets", section: "assets", classification: "current", normalBalance: "debit", behavior: "standard", liquidityClassification: "non-quick-current-asset", sortOrder: 30, isDefault: true },
  { id: "bs-equipment", name: "Equipment", section: "assets", classification: "non-current", normalBalance: "debit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 40, isDefault: true },
  { id: "bs-accumulated-depreciation", name: "Accumulated Depreciation", section: "assets", classification: "non-current", normalBalance: "credit", behavior: "contra-asset", liquidityClassification: "not-applicable", sortOrder: 50, isDefault: true },
  { id: "bs-other-long-term-assets", name: "Other Long-Term Assets", section: "assets", classification: "non-current", normalBalance: "debit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 60, isDefault: true },
  { id: "bs-ap", name: "Accounts Payable", section: "liabilities", classification: "current", normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 70, isDefault: true },
  { id: "bs-credit-cards", name: "Credit Cards", section: "liabilities", classification: "current", normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 80, isDefault: true },
  { id: "bs-accrued-expenses", name: "Accrued Expenses", section: "liabilities", classification: "current", normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 90, isDefault: true },
  { id: "bs-current-debt", name: "Current Portion of Long-Term Debt", section: "liabilities", classification: "current", normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 100, isDefault: true },
  { id: "bs-line-of-credit", name: "Line of Credit", section: "liabilities", classification: "current", normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 110, isDefault: true },
  { id: "bs-other-current-liabilities", name: "Other Current Liabilities", section: "liabilities", classification: "current", normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 120, isDefault: true },
  { id: "bs-long-term-debt", name: "Long-Term Debt", section: "liabilities", classification: "non-current", normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 130, isDefault: true },
  { id: "bs-owner-contributions", name: "Owner Contributions", section: "equity", classification: null, normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 140, isDefault: true },
  { id: "bs-owner-distributions", name: "Owner Distributions", section: "equity", classification: null, normalBalance: "debit", behavior: "contra-equity", liquidityClassification: "not-applicable", sortOrder: 150, isDefault: true },
  { id: "bs-retained-earnings", name: "Retained Earnings", section: "equity", classification: null, normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 160, isDefault: true },
  { id: "bs-current-net-income", name: "Current Fiscal-Year Net Income", section: "equity", classification: null, normalBalance: "credit", behavior: "standard", liquidityClassification: "not-applicable", sortOrder: 170, isDefault: true, isCalculated: true },
];
