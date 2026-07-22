import { FileChartColumn, LockKeyhole } from "lucide-react";
import { PageShell } from "../../components/app/page-shell";
import { PageHeader } from "../../components/app/page-header";
import { Panel, SegmentedLinks } from "../../components/app/ui";
import { LineChart } from "../../components/app/line-chart";
import { financialPeriods } from "../../data/financial-periods";
import { incomeStatements } from "../../data/income-statements";
import { buildIncomeStatementViewModel } from "../../lib/services/analysis-view-models";

const viewLabels = { monthly: "Monthly", ytd: "YTD", r12m: "R12M" };

export default async function FinancialStatementsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; period?: string }>;
}) {
  const params = await searchParams;
  const view = params.view === "monthly" || params.view === "ytd" ? params.view : "r12m";
  const period = financialPeriods.some((item) => item.id === params.period) ? params.period! : "2026-06";
  const model = buildIncomeStatementViewModel({ endPeriod: period, view, statements: incomeStatements, periods: financialPeriods });

  return (
    <PageShell>
      <PageHeader eyebrow="Reporting" title="Financial Statements" description="Review closed-period financial performance using Compass reporting categories.">
        <SegmentedLinks items={Object.entries(viewLabels).map(([key, label]) => ({ label, href: `/financial-statements?view=${key}&period=${period}`, active: view === key }))} />
      </PageHeader>

      <div className="mt-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex min-w-0 gap-2 rounded-xl bg-slate-200/70 p-1">
          <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm">Income Statement</span>
          <span className="px-3 py-2 text-xs font-semibold text-slate-500">Balance Sheet · Coming next</span>
          <span className="px-3 py-2 text-xs font-semibold text-slate-500">Cash Flow · Coming next</span>
        </div>
        <form className="shrink-0">
          <input type="hidden" name="view" value={view} />
          <label className="sr-only" htmlFor="period">Closed period</label>
          <select id="period" name="period" defaultValue={period} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm">
            {financialPeriods.slice().reverse().map((item) => <option key={item.id} value={item.id}>{item.year}-{String(item.month).padStart(2, "0")} · closed</option>)}
          </select>
          <button className="ml-2 min-h-10 rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white">Apply</button>
        </form>
      </div>

      {model.status !== "complete" ? (
        <Panel title="Statement unavailable" className="mt-6"><p className="p-6 text-sm text-slate-600">{model.reason}</p></Panel>
      ) : (
        <>
          <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-3">
            {([ ["Gross Profit %", "grossProfitPercent"], ["Overhead % of Revenue", "overheadPercent"], ["Net Income %", "netIncomePercent"] ] as const).map(([label, key]) => (
              <Panel key={key} title={`${label} — rolling R12M`} description="Aggregated trailing-12-month dollars ending in each labeled month.">
                <LineChart values={model.chartSeries.map((point) => point[key] ?? 0)} labels={model.chartSeries.map((point) => point.fullLabel)} format="percentage" metricName={label} tooltipPrefix="R12M ending" tone={key === "overheadPercent" ? "green" : "blue"} />
              </Panel>
            ))}
          </div>

          <Panel title={`${viewLabels[view]} Income Statement`} description={`${model.startPeriod} through ${model.endPeriod} · monthly columns from closed periods`} className="mt-5 min-w-0">
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
                    {model.totalColumnLabel ? <th scope="col" className="border-b border-l border-blue-100 bg-blue-50 px-1 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.04em] text-blue-800 2xl:px-2 2xl:text-[10px]">{model.totalColumnLabel}</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {model.rows.map((row, index) => {
                    if (row.kind === "section") {
                      return <tr key={`${row.label}-${index}`}><th scope="rowgroup" colSpan={model.columns.length + (model.totalColumnLabel ? 2 : 1)} className="border-y border-slate-200 bg-slate-100/90 px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">{row.label}</th></tr>;
                    }
                    const rowStyle = row.kind === "final" ? "bg-slate-900 text-white" : row.kind === "profit" ? "bg-blue-50 text-blue-950" : row.kind === "ratio" ? "bg-blue-50/40 text-blue-900" : row.kind === "subtotal" ? "bg-slate-50 text-slate-900" : "bg-white text-slate-600";
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
                          <td title={row.totalValue ?? undefined} aria-label={row.totalValue ?? undefined} className={`border-b border-l border-blue-100 px-1 py-2 text-right text-[9px] font-bold tabular-nums 2xl:px-2 2xl:text-[11px] ${row.kind === "final" ? "bg-slate-900" : "bg-blue-50"}`}>
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6"><LockKeyhole className="size-5 text-slate-400" /><h2 className="mt-3 font-semibold text-slate-900">Balance Sheet coming next</h2><p className="mt-2 text-sm leading-6 text-slate-500">Balance-sheet accounts have not been added to the financial foundation.</p></div>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6"><FileChartColumn className="size-5 text-slate-400" /><h2 className="mt-3 font-semibold text-slate-900">Cash Flow coming next</h2><p className="mt-2 text-sm leading-6 text-slate-500">Cash flow will follow the balance-sheet foundation and reconciliation work.</p></div>
      </div>
    </PageShell>
  );
}
