import type { MonthlyIncomeStatement } from "../../data/income-statements";
import type { FinancialPeriodMetadata } from "../../app/types/financial-period";
import { aggregateIncomeStatements, calculateMonthlySubtotals, calculateProfitabilityRatios, calculateR12MProfitability, getMonthlyPeriodWindow } from "./financial-service.ts";
import { formatComparisonPoints, formatDollarAbbreviation, formatDollars, formatPercentage } from "../formatters/financial.ts";

const ratioKeys = ["grossProfitPercent", "overheadPercent", "operatingProfitPercent", "netIncomePercent"] as const;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function periodLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  return `${monthNames[month - 1]} ${String(year).slice(2)}`;
}

function fullPeriodLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  return `${monthNames[month - 1]} ${year}`;
}

export function buildProfitabilityViewModel({ companyId, endPeriod, statements, periods }: { companyId: string; endPeriod: string; statements: readonly MonthlyIncomeStatement[]; periods: readonly FinancialPeriodMetadata[] }) {
  const closedPeriodIds = periods.filter(period => period.status === "closed").map(period => period.id);
  const trendEndPeriods = getMonthlyPeriodWindow(endPeriod, 12);
  const rolling = trendEndPeriods.map(period => calculateR12MProfitability({ companyId, endPeriod: period, statements, closedPeriodIds }));
  if (rolling.some(result => result.status !== "complete")) return { status: "incomplete" as const };
  const completeRolling = rolling.map(result => { if (result.status !== "complete") throw new Error("unreachable"); return result; });
  const current = completeRolling.at(-1)!;
  const prior = calculateR12MProfitability({ companyId, endPeriod: getMonthlyPeriodWindow(endPeriod, 13)[0], statements, closedPeriodIds });
  if (prior.status !== "complete") return { status: "incomplete" as const };
  const labels = { grossProfitPercent: "Gross Profit", overheadPercent: "Overhead", operatingProfitPercent: "Operating Profit", netIncomePercent: "Net Income" };
  const lowerIsBetter = (key: typeof ratioKeys[number]) => key === "overheadPercent";
  const overview = ratioKeys.map(key => {
    const value=current.ratios[key]; const priorValue=prior.ratios[key];
    const change=value===null||priorValue===null?null:value-priorValue;
    return { key, label: labels[key], value: formatPercentage(value), change: formatComparisonPoints(change), favorable: change !== null && (lowerIsBetter(key) ? change < 0 : change > 0) };
  });
  const statementMap = new Map(statements.map(statement => [statement.period, statement]));
  const monthly = trendEndPeriods.map(period => { const totals=calculateMonthlySubtotals(statementMap.get(period)!); const ratios=calculateProfitabilityRatios(totals); return { period, revenue: formatDollarAbbreviation(totals.revenue), ...Object.fromEntries(ratioKeys.map(key=>[key,formatPercentage(ratios[key])])) } as {period:string;revenue:string} & Record<typeof ratioKeys[number],string>; });
  const currentStatements=current.window.expectedPeriods.map(period=>statementMap.get(period)!);
  const driverTotals=aggregateIncomeStatements(currentStatements);
  const drivers=[{label:"Direct Costs",amount:driverTotals.directCosts},{label:"Indirect Costs",amount:driverTotals.indirectCosts},{label:"Overhead",amount:driverTotals.overhead}].map(driver=>({...driver,value:formatDollarAbbreviation(driver.amount),percent:formatPercentage(driver.amount/driverTotals.revenue*100)}));
  return { status:"complete" as const, overview, rolling: completeRolling.map(result=>({
    period:result.window.endPeriod,
    label:periodLabel(result.window.endPeriod),
    fullLabel:fullPeriodLabel(result.window.endPeriod),
    grossProfitPercent:result.ratios.grossProfitPercent,
    overheadPercent:result.ratios.overheadPercent,
    operatingProfitPercent:result.ratios.operatingProfitPercent,
    netIncomePercent:result.ratios.netIncomePercent,
  })), monthly, drivers };
}

const detailFields = [
  ["Labor", "labor"], ["Equipment", "equipment"], ["Material", "material"], ["Subcontractors", "subcontractors"], ["Other Direct Costs", "otherDirectCosts"],
  ["Fuel", "fuel"], ["Equipment Depreciation", "equipmentDepreciation"], ["Small Tools", "smallTools"], ["General Liability", "generalLiability"], ["Health Insurance", "healthInsurance"],
  ["Office Payroll", "officePayroll"], ["Payroll Taxes", "payrollTaxes"], ["Rent", "rent"], ["Utilities", "utilities"], ["Marketing", "marketing"], ["IT", "it"], ["Meals", "meals"], ["Travel", "travel"],
] as const;

export function buildIncomeStatementViewModel({ endPeriod, view, statements, periods }: { endPeriod: string; view: "monthly"|"ytd"|"r12m"; statements: readonly MonthlyIncomeStatement[]; periods: readonly FinancialPeriodMetadata[] }) {
  const endMeta=periods.find(period=>period.id===endPeriod && period.status==="closed");
  if(!endMeta) return {status:"incomplete" as const,reason:"Period is not closed"};
  const map=new Map(statements.map(statement=>[statement.period,statement]));
  const populatedPeriods=view==="monthly"?[endPeriod]:view==="ytd"?Array.from({length:endMeta.month},(_,index)=>`${endMeta.year}-${String(index+1).padStart(2,"0")}`):getMonthlyPeriodWindow(endPeriod,12);
  const missing=populatedPeriods.filter(period=>!map.has(period)); if(missing.length) return {status:"incomplete" as const,reason:`Missing ${missing.join(", ")}`};
  const displayPeriods=view==="ytd"?Array.from({length:12},(_,index)=>`${endMeta.year}-${String(index+1).padStart(2,"0")}`):populatedPeriods;
  const columns=displayPeriods.map(period=>({period,label:periodLabel(period),available:populatedPeriods.includes(period)}));
  const populatedStatements=populatedPeriods.map(period=>map.get(period)!); const totals=aggregateIncomeStatements(populatedStatements); const ratios=calculateProfitabilityRatios(totals);
  type Kind="standard"|"subtotal"|"profit"|"final"|"detail";
  type RowSpec={label:string;kind:Kind;amount:(statement:MonthlyIncomeStatement)=>number};
  const subtotal=(statement:MonthlyIncomeStatement)=>calculateMonthlySubtotals(statement);
  const specs:RowSpec[]=[
    {label:"Revenue",kind:"subtotal",amount:statement=>statement.revenue},
    {label:"Direct Costs",kind:"subtotal",amount:statement=>subtotal(statement).directCosts},...detailFields.slice(0,5).map(([label,field])=>({label,kind:"detail" as const,amount:(statement:MonthlyIncomeStatement)=>statement[field]})),
    {label:"Indirect Costs",kind:"subtotal",amount:statement=>subtotal(statement).indirectCosts},...detailFields.slice(5,10).map(([label,field])=>({label,kind:"detail" as const,amount:(statement:MonthlyIncomeStatement)=>statement[field]})),
    {label:"Gross Profit",kind:"profit",amount:statement=>subtotal(statement).grossProfit},
    {label:"Overhead",kind:"subtotal",amount:statement=>subtotal(statement).overhead},...detailFields.slice(10).map(([label,field])=>({label,kind:"detail" as const,amount:(statement:MonthlyIncomeStatement)=>statement[field]})),
    {label:"Operating Profit",kind:"profit",amount:statement=>subtotal(statement).operatingProfit},
    {label:"Other Income / Expense",kind:"subtotal",amount:statement=>subtotal(statement).netOtherIncomeExpense},
    {label:"Other Income",kind:"detail",amount:statement=>statement.otherIncome},{label:"Interest Expense",kind:"detail",amount:statement=>statement.interestExpense},
    {label:"Net Income",kind:"final",amount:statement=>subtotal(statement).netIncome},
  ];
  const rows=specs.map(spec=>{const values=displayPeriods.map(period=>populatedPeriods.includes(period)?spec.amount(map.get(period)!):null);const totalAmount=values.reduce<number>((sum,value)=>sum+(value??0),0);return {label:spec.label,kind:spec.kind,values,displayValues:values.map(value=>value===null?null:formatDollars(value)),totalAmount,totalValue:formatDollars(totalAmount)};});
  const closedPeriodIds=periods.filter(period=>period.status==="closed").map(period=>period.id);
  const chartResults=populatedPeriods.map(period=>calculateR12MProfitability({companyId:"vch",endPeriod:period,statements,closedPeriodIds}));
  const chartSeries=chartResults.flatMap(result=>result.status==="complete"?[{period:result.window.endPeriod,label:periodLabel(result.window.endPeriod),fullLabel:fullPeriodLabel(result.window.endPeriod),grossProfitPercent:result.ratios.grossProfitPercent,overheadPercent:result.ratios.overheadPercent,netIncomePercent:result.ratios.netIncomePercent}]:[]);
  const chartUnavailablePeriods=chartResults.filter(result=>result.status==="incomplete").map(result=>result.window.endPeriod);
  return {status:"complete" as const,view,endPeriod,startPeriod:populatedPeriods[0],columns,totalColumnLabel:view==="monthly"?null:view==="ytd"?"YTD Total":"R12M Total",totals,ratios,rows,chartSeries,chartUnavailablePeriods};
}
