export const test = "hello";
export interface MonthlyIncomeStatement {
    period: string;
  
    revenue: number;
  
    labor: number;
    equipment: number;
    material: number;
    subcontractors: number;
    otherDirectCosts: number;
  
    fuel: number;
    equipmentDepreciation: number;
    smallTools: number;
    generalLiability: number;
    healthInsurance: number;
  
    officePayroll: number;
    payrollTaxes: number;
    rent: number;
    utilities: number;
    marketing: number;
    it: number;
    meals: number;
    travel: number;
  
    otherIncome: number;
    interestExpense: number;
  }
  
  export const incomeStatements: MonthlyIncomeStatement[] = [
    {
      period: "2025-07",
  
      revenue: 365000,
  
      labor: 64000,
      equipment: 11000,
      material: 65000,
      subcontractors: 8500,
      otherDirectCosts: 10500,
  
      fuel: 2500,
      equipmentDepreciation: 2200,
      smallTools: 1800,
      generalLiability: 1700,
      healthInsurance: 1450,
  
      officePayroll: 33000,
      payrollTaxes: 3200,
      rent: 2500,
      utilities: 900,
      marketing: 1500,
      it: 800,
      meals: 450,
      travel: 900,
  
      otherIncome: 200,
      interestExpense: 700,
    },
  
    {
      period: "2025-08",
  
      revenue: 390000,
  
      labor: 69000,
      equipment: 12000,
      material: 70000,
      subcontractors: 9000,
      otherDirectCosts: 10700,
  
      fuel: 2600,
      equipmentDepreciation: 2200,
      smallTools: 1800,
      generalLiability: 1700,
      healthInsurance: 1450,
  
      officePayroll: 33200,
      payrollTaxes: 3220,
      rent: 2500,
      utilities: 900,
      marketing: 1500,
      it: 800,
      meals: 500,
      travel: 900,
  
      otherIncome: 200,
      interestExpense: 690,
    },
  
    {
      period: "2025-09",

    revenue: 410000,

    labor: 74000,
    equipment: 12500,
    material: 73500,
    subcontractors: 9500,
    otherDirectCosts: 11200,

    fuel: 2650,
    equipmentDepreciation: 2200,
    smallTools: 1800,
    generalLiability: 1700,
    healthInsurance: 1450,

    officePayroll: 33300,
    payrollTaxes: 3230,
    rent: 2500,
    utilities: 900,
    marketing: 1450,
    it: 800,
    meals: 500,
    travel: 900,

    otherIncome: 200,
    interestExpense: 680,
  },

  {
    period: "2025-10",

    revenue: 435000,

    labor: 81000,
    equipment: 13000,
    material: 79000,
    subcontractors: 9800,
    otherDirectCosts: 11600,

    fuel: 2700,
    equipmentDepreciation: 2200,
    smallTools: 1800,
    generalLiability: 1700,
    healthInsurance: 1450,

    officePayroll: 33400,
    payrollTaxes: 3240,
    rent: 2500,
    utilities: 900,
    marketing: 1400,
    it: 800,
    meals: 500,
    travel: 900,

    otherIncome: 200,
    interestExpense: 670,
  },

  {
    period: "2025-11",

    revenue: 425000,

    labor: 78000,
    equipment: 12800,
    material: 76000,
    subcontractors: 9700,
    otherDirectCosts: 11300,

    fuel: 2700,
    equipmentDepreciation: 2200,
    smallTools: 1800,
    generalLiability: 1700,
    healthInsurance: 1450,

    officePayroll: 33400,
    payrollTaxes: 3240,
    rent: 2500,
    utilities: 900,
    marketing: 1350,
    it: 800,
    meals: 500,
    travel: 900,

    otherIncome: 200,
    interestExpense: 660,
  },

  {
    period: "2025-12",

    revenue: 355000,

    labor: 67000,
    equipment: 11500,
    material: 66000,
    subcontractors: 8600,
    otherDirectCosts: 10300,

    fuel: 2600,
    equipmentDepreciation: 2200,
    smallTools: 1800,
    generalLiability: 1700,
    healthInsurance: 1450,

    officePayroll: 33600,
    payrollTaxes: 3260,
    rent: 2500,
    utilities: 900,
    marketing: 1300,
    it: 800,
    meals: 450,
    travel: 850,

    otherIncome: 200,
    interestExpense: 650,
  },];