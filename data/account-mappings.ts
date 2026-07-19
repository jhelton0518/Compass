import { AccountMapping } from "../app/types/finance";

export const volunteerCustomHomesAccountMappings: AccountMapping[] = [
  // Revenue
  {
    glAccountId: "gl-4000",
    reportingCategoryId: "rev-job-income",
  },

  // Direct Costs
  {
    glAccountId: "gl-5000",
    reportingCategoryId: "dc-labor",
  },
  {
    glAccountId: "gl-5100",
    reportingCategoryId: "dc-equipment",
  },
  {
    glAccountId: "gl-5200",
    reportingCategoryId: "dc-material",
  },
  {
    glAccountId: "gl-5300",
    reportingCategoryId: "dc-subcontractors",
  },
  {
    glAccountId: "gl-5400",
    reportingCategoryId: "dc-other",
  },

  // Indirect Costs
  {
    glAccountId: "gl-6000",
    reportingCategoryId: "ic-fuel",
  },
  {
    glAccountId: "gl-6010",
    reportingCategoryId: "ic-equipment-depreciation",
  },
  {
    glAccountId: "gl-6020",
    reportingCategoryId: "ic-small-tools",
  },
  {
    glAccountId: "gl-6030",
    reportingCategoryId: "ic-general-liability",
  },
  {
    glAccountId: "gl-6040",
    reportingCategoryId: "ic-health-insurance",
  },

  // Overhead
  {
    glAccountId: "gl-7000",
    reportingCategoryId: "oh-office-payroll",
  },
  {
    glAccountId: "gl-7010",
    reportingCategoryId: "oh-payroll-taxes",
  },
  {
    glAccountId: "gl-7020",
    reportingCategoryId: "oh-rent",
  },
  {
    glAccountId: "gl-7030",
    reportingCategoryId: "oh-utilities",
  },
  {
    glAccountId: "gl-7040",
    reportingCategoryId: "oh-marketing",
  },
  {
    glAccountId: "gl-7050",
    reportingCategoryId: "oh-it",
  },
  {
    glAccountId: "gl-7060",
    reportingCategoryId: "oh-meals",
  },
  {
    glAccountId: "gl-7070",
    reportingCategoryId: "oh-travel",
  },

  // Other
  {
    glAccountId: "gl-8000",
    reportingCategoryId: "oi-other-income",
  },
  {
    glAccountId: "gl-9000",
    reportingCategoryId: "oe-interest-expense",
  },
];