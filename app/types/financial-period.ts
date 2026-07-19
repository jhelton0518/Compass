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