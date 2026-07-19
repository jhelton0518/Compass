import { GLAccount, GLAccountType } from "../app/types/finance";

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