import { GLAccountType, type GLAccount } from "../app/types/finance.ts";

export const volunteerCustomHomesGLAccounts: GLAccount[] = [
  // Revenue
  {
    id: "gl-4000",
    accountNumber: "4000",
    accountName: "Job Income",
    accountType: GLAccountType.Income,
  },

  // Direct Costs
  {
    id: "gl-5000",
    accountNumber: "5000",
    accountName: "Labor",
    accountType: GLAccountType.CostOfGoodsSold,
  },
  {
    id: "gl-5100",
    accountNumber: "5100",
    accountName: "Equipment",
    accountType: GLAccountType.CostOfGoodsSold,
  },
  {
    id: "gl-5200",
    accountNumber: "5200",
    accountName: "Material",
    accountType: GLAccountType.CostOfGoodsSold,
  },
  {
    id: "gl-5300",
    accountNumber: "5300",
    accountName: "Subcontractors",
    accountType: GLAccountType.CostOfGoodsSold,
  },
  {
    id: "gl-5400",
    accountNumber: "5400",
    accountName: "Other Direct Costs",
    accountType: GLAccountType.CostOfGoodsSold,
  },

  // Indirect Costs
  {
    id: "gl-6000",
    accountNumber: "6000",
    accountName: "Fuel",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-6010",
    accountNumber: "6010",
    accountName: "Equipment Depreciation",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-6020",
    accountNumber: "6020",
    accountName: "Small Tools",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-6030",
    accountNumber: "6030",
    accountName: "General Liability Insurance",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-6040",
    accountNumber: "6040",
    accountName: "Health Insurance",
    accountType: GLAccountType.Expense,
  },

  // Overhead
  {
    id: "gl-7000",
    accountNumber: "7000",
    accountName: "Office Payroll",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-7010",
    accountNumber: "7010",
    accountName: "Payroll Taxes",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-7020",
    accountNumber: "7020",
    accountName: "Rent",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-7030",
    accountNumber: "7030",
    accountName: "Utilities",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-7040",
    accountNumber: "7040",
    accountName: "Marketing",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-7050",
    accountNumber: "7050",
    accountName: "IT",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-7060",
    accountNumber: "7060",
    accountName: "Meals",
    accountType: GLAccountType.Expense,
  },
  {
    id: "gl-7070",
    accountNumber: "7070",
    accountName: "Travel",
    accountType: GLAccountType.Expense,
  },

  // Other
  {
    id: "gl-8000",
    accountNumber: "8000",
    accountName: "Other Income",
    accountType: GLAccountType.Income,
  },
  {
    id: "gl-9000",
    accountNumber: "9000",
    accountName: "Interest Expense",
    accountType: GLAccountType.Expense,
  },
];

export const volunteerCustomHomesBalanceSheetGLAccounts: GLAccount[] = [
  { id: "gl-1000", accountNumber: "1000", accountName: "Operating Cash", accountType: GLAccountType.Bank },
  { id: "gl-1100", accountNumber: "1100", accountName: "Accounts Receivable", accountType: GLAccountType.AccountsReceivable },
  { id: "gl-1200", accountNumber: "1200", accountName: "Other Current Assets", accountType: GLAccountType.OtherCurrentAsset },
  { id: "gl-1500", accountNumber: "1500", accountName: "Equipment", accountType: GLAccountType.FixedAsset },
  { id: "gl-1510", accountNumber: "1510", accountName: "Accumulated Depreciation", accountType: GLAccountType.FixedAsset },
  { id: "gl-1600", accountNumber: "1600", accountName: "Other Long-Term Assets", accountType: GLAccountType.OtherAsset },
  { id: "gl-2000", accountNumber: "2000", accountName: "Accounts Payable", accountType: GLAccountType.AccountsPayable },
  { id: "gl-2100", accountNumber: "2100", accountName: "Credit Cards", accountType: GLAccountType.CreditCard },
  { id: "gl-2200", accountNumber: "2200", accountName: "Accrued Expenses", accountType: GLAccountType.OtherCurrentLiability },
  { id: "gl-2300", accountNumber: "2300", accountName: "Current Portion of Long-Term Debt", accountType: GLAccountType.OtherCurrentLiability },
  { id: "gl-2400", accountNumber: "2400", accountName: "Line of Credit", accountType: GLAccountType.OtherCurrentLiability },
  { id: "gl-2500", accountNumber: "2500", accountName: "Other Current Liabilities", accountType: GLAccountType.OtherCurrentLiability },
  { id: "gl-2700", accountNumber: "2700", accountName: "Long-Term Debt", accountType: GLAccountType.LongTermLiability },
  { id: "gl-3000", accountNumber: "3000", accountName: "Owner Contributions", accountType: GLAccountType.Equity },
  { id: "gl-3100", accountNumber: "3100", accountName: "Owner Distributions", accountType: GLAccountType.Equity },
  { id: "gl-3200", accountNumber: "3200", accountName: "Retained Earnings", accountType: GLAccountType.Equity },
  { id: "gl-3300", accountNumber: "3300", accountName: "Current Fiscal-Year Net Income", accountType: GLAccountType.Equity },
];
