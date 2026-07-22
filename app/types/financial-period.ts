export interface FinancialPeriod {
    id: string;
  
    year: number;
    month: number;
  
    accountBalances: AccountBalance[];
  }
  
export interface AccountBalance {
    accountId: string;
  
    amount: number;
  }

export type FinancialPeriodStatus = "open" | "closed";

export interface FinancialPeriodMetadata {
  id: string;
  year: number;
  month: number;
  status: FinancialPeriodStatus;
}
