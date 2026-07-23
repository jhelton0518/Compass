import { FileChartColumn } from "lucide-react";
import Link from "next/link";
import { PageShell } from "../../components/app/page-shell";
import { PageHeader } from "../../components/app/page-header";
import { Panel, SegmentedLinks } from "../../components/app/ui";
import { LineChart } from "../../components/app/line-chart";
import { financialPeriods } from "../../data/financial-periods";
import { incomeStatements } from "../../data/income-statements";
import { buildIncomeStatementViewModel } from "../../lib/services/analysis-view-models";
import { BalanceSheetView } from "../../components/app/balance-sheet-view";
import { PeriodSelector } from "../../components/app/period-selector";
import { formatClosedPeriodLabel } from "../../lib/services/period-selection";

const viewLabels = { monthly: "Monthly", ytd: "YTD", r12m: "R12M" };

export default async function FinancialStatementsPage({
  searchParams,
}: {
  searchParams: Promise<{ statement?: string; view?: string; period?: string }>;
}) {
  const params = await searchParams;
  if (params.statement === "balance-sheet") return <BalanceSheetView period={params.period} />;
  const view = params.view === "monthly" || params.view === "ytd" ? params.view : "r12m";
  const period = financialPeriods.some((item) => item.id === params.period) ? params.period! : "2026-06";
  const model = buildIncomeStatementViewModel({ endPeriod: period, view, statements: incomeStatements, periods: financialPeriods });

  return (
    <PageShell>
      <PageHeader eyebrow="Reporting" title="Financial Statements" description="Review period-ending financial performance using Compass reporting categories." reportingPeriod={null}>
        <SegmentedLinks items={Object.entries(viewLabels).map(([key, label]) => ({ label, href: `/financial-statements?view=${key}&period=${period}`, active: view === key }))} />
      </PageHeader>

      <div className="mt-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex min-w-0 gap-2 rounded-xl bg-slate-200/70 p-1">
          <Link href={`/financial-statements?statement=income-statement&view=${view}&period=${period}`} aria-current="page" className="rounded-lg border border-control-selected-border bg-control-selected px-3 py-2 text-xs font-semibold text-control-selected-text shadow-sm">Income Statement</Link>
          <Link href={`/financial-statements?statement=balance-sheet&period=${period}`} className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900">Balance Sheet</Link>
          <span className="px-3 py-2 text-xs font-semibold text-slate-500">Cash Flow · Coming next</span>
        </div>
        <PeriodSelector id="financial-statement-period" selectedPeriod={period} periods={financialPeriods.map((item) => ({ id: item.id, label: formatClosedPeriodLabel(item.id) }))} ariaLabel="Financial statement as-of period" />
      </div>

      {model.status !== "complete" ? (
        <Panel title="Statement unavailable" className="mt-6"><p className="p-6 text-sm text-slate-600">{model.reason}</p></Panel>
      ) : (
        <>
          <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-3">
            {([ ["Gross Profit %", "grossProfitPercent"], ["Overhead % of Revenue", "overheadPercent"], ["Net Income %", "netIncomePercent"] ] as const).map(([label, key]) => (
              <Panel key={key} title={`${label} — rolling R12M`} description="Aggregated trailing-12-month dollars ending in each labeled month.">
                <LineChart values={model.chartSeries.map((point) => point[key] ?? 0)} labels={model.chartSeries.map((point) => point.fullLabel)} format="percentage" metricName={label} tooltipPrefix="R12M ending" />
              </Panel>
            ))}
          </div>

          <Panel title={`${viewLabels[view]} Income Statement`} description={`${model.startPeriod} through ${model.endPeriod} · monthly columns through the selected period`} className="mt-5 min-w-0">
            <div className="max-w-full overflow-x-auto xl:overflow-x-visible" data-income-statement-scroll>
              <table className="w-full min-w-[900px] table-fixed border-collapse xl:min-w-0">
                <colgroup>
                  <col className="w-[190px] 2xl:w-[220px]" />
                  {model.columns.map((column) => <col key={column.period} />)}
                  {model.totalColumnLabel ? <col /> : null}
                </colgroup>
                <thead>
                  <tr className="bg-slate-50">
                    <th scope="col" className="sticky left-0 z-20 border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Category</th>
                    {model.columns.map((column) => <th scope="col" key={column.period} className={`border-b border-slate-200 px-1 py-2.5 text-right text-[9px] font-semibold uppercase tracking-[0.04em] 2xl:px-2 2xl:text-[10px] ${column.available ? "text-slate-500" : "text-slate-300"}`}>{column.label}</th>)}
                    {model.totalColumnLabel ? <th scope="col" className="border-b border-l border-table-section-border bg-table-section px-1 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.04em] text-table-section-text 2xl:px-2 2xl:text-[10px]">{model.totalColumnLabel}</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {model.rows.map((row, index) => {
                    if (row.kind === "section") {
                      return <tr key={`${row.label}-${index}`}><th scope="rowgroup" colSpan={model.columns.length + (model.totalColumnLabel ? 2 : 1)} className="border-y border-table-section-border bg-table-section px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-table-section-text">{row.label}</th></tr>;
                    }
                    const rowStyle = row.kind === "final" ? "bg-slate-900 text-white" : row.kind === "profit" || row.kind === "ratio" ? "bg-table-highlight text-table-section-text" : row.kind === "subtotal" ? "bg-slate-50 text-slate-900" : "bg-white text-slate-600";
                    const weight = row.kind === "detail" ? "font-normal" : "font-semibold";
                    return (
                      <tr key={`${row.label}-${index}`} className={`${rowStyle} transition-colors hover:brightness-[0.98]`}>
                        <th scope="row" className={`sticky left-0 z-10 border-b border-slate-100 px-3 py-2 text-left text-[11px] 2xl:text-xs ${rowStyle} ${weight} ${row.kind === "detail" ? "pl-6" : ""}`}>{row.label}</th>
                        {row.displayValues.map((value, valueIndex) => (
                          <td key={model.columns[valueIndex].period} title={value ?? undefined} aria-label={value ?? undefined} className={`border-b border-slate-100 px-1 py-2 text-right text-[9px] tabular-nums 2xl:px-2 2xl:text-[11px] ${weight}`}>
                            {value === null ? "—" : <><span className="2xl:hidden">{row.compactDisplayValues[valueIndex]}</span><span className="hidden 2xl:inline">{value}</span></>}
                          </td>
                        ))}
                        {model.totalColumnLabel ? (
                          <td title={row.totalValue ?? undefined} aria-label={row.totalValue ?? undefined} className={`border-b border-l border-table-section-border px-1 py-2 text-right text-[9px] font-bold tabular-nums 2xl:px-2 2xl:text-[11px] ${row.kind === "final" ? "bg-slate-900" : "bg-table-highlight text-table-section-text"}`}>
                            <span className="2xl:hidden">{row.compactTotalValue}</span><span className="hidden 2xl:inline">{row.totalValue}</span>
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}

      <div className="mt-6">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6"><FileChartColumn className="size-5 text-slate-400" /><h2 className="mt-3 font-semibold text-slate-900">Cash Flow coming next</h2><p className="mt-2 text-sm leading-6 text-slate-500">Cash flow will follow the balance-sheet foundation and reconciliation work.</p></div>
      </div>
    </PageShell>
  );
}
