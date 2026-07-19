import { incomeStatements } from "../../data/income-statements";

export function getIncomeStatement(period: string) {
  return incomeStatements.find(
    (statement) => statement.period === period
  );
}

export function getAllIncomeStatements() {
  return incomeStatements;
}