export interface Company {
    id: string;
  
    // Basic Information
    name: string;
    legalName?: string;
  
    // Industry
    industry: ConstructionIndustry;
  
    // Fiscal Calendar
    fiscalYearEndMonth: number;
  
    // Accounting System
    accountingSystem: AccountingSystem;
  }
  
  export enum ConstructionIndustry {
    GeneralContractor = "General Contractor",
    ResidentialBuilder = "Residential Builder",
    CommercialBuilder = "Commercial Builder",
    HeavyCivil = "Heavy Civil",
    HVAC = "HVAC",
    Electrical = "Electrical",
    Plumbing = "Plumbing",
    Roofing = "Roofing",
    Landscaping = "Landscaping",
    Other = "Other",
  }
  
  export enum AccountingSystem {
    QuickBooksOnline = "QuickBooks Online",
    QuickBooksDesktop = "QuickBooks Desktop",
    Sage = "Sage",
    Foundation = "Foundation",
    Viewpoint = "Viewpoint",
    Other = "Other",
  }