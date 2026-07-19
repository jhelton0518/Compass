import {
    AccountingSystem,
    Company,
    ConstructionIndustry,
  } from "../app/types/company";
  
  export const volunteerCustomHomes: Company = {
    id: "vch",
  
    name: "Volunteer Custom Homes",
  
    legalName: "Volunteer Custom Homes LLC",
  
    industry: ConstructionIndustry.ResidentialBuilder,
  
    fiscalYearEndMonth: 12,
  
    accountingSystem: AccountingSystem.QuickBooksOnline,
  };