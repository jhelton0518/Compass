export enum FinancialStatement {
    IncomeStatement = "Income Statement",
    BalanceSheet = "Balance Sheet",
  }
  
  export enum MajorCategory {
    // Income Statement
    Revenue = "Revenue",
    DirectCosts = "Direct Costs",
    IndirectCosts = "Indirect Costs",
    Overhead = "Overhead",
    OtherIncome = "Other Income",
    OtherExpense = "Other Expense",
  
    // Balance Sheet
    Assets = "Assets",
    Liabilities = "Liabilities",
    Equity = "Equity",
  }
  
  export enum GLAccountType {
    Income = "Income",
    CostOfGoodsSold = "Cost of Goods Sold",
    Expense = "Expense",
  
    Bank = "Bank",
    AccountsReceivable = "Accounts Receivable",
    OtherCurrentAsset = "Other Current Asset",
    FixedAsset = "Fixed Asset",
    OtherAsset = "Other Asset",
  
    AccountsPayable = "Accounts Payable",
    CreditCard = "Credit Card",
    OtherCurrentLiability = "Other Current Liability",
    LongTermLiability = "Long Term Liability",
  
    Equity = "Equity",
  }
  
  export interface ReportingCategory {
    id: string;
  
    // Display name (Labor, Materials, Office Payroll, etc.)
    name: string;
  
    // Income Statement or Balance Sheet
    statement: FinancialStatement;
  
    // Revenue, Direct Costs, Assets, etc.
    majorCategory: MajorCategory;
  
    // Controls display order throughout Compass
    sortOrder: number;
  
    // True if created from a Compass template
    isDefault: boolean;
  }
  
  export interface GLAccount {
    id: string;
  
    // Original account information from QuickBooks
    accountNumber: string;
    accountName: string;
    accountType: GLAccountType;
  }
  
  export interface AccountMapping {
    glAccountId: string;
    reportingCategoryId: string;
  }
  
  export interface MonthlyBalance {
    accountId: string;
    amount: number;
  }