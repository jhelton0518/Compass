import Link from "next/link";
import { FileChartColumn } from "lucide-react";
import { PageShell } from "./page-shell";
import { PageHeader } from "./page-header";
import { LineChart } from "./line-chart";
import { Panel } from "./ui";
import { buildBalanceSheetViewModel, fullPeriodLabel } from "../../lib/services/balance-sheet-view-models";
import { PeriodSelector } from "./period-selector";

export function BalanceSheetView({ period }: { period?: string }) {
  const model = buildBalanceSheetViewModel(period);
  return <PageShell>
    <PageHeader eyebrow="Reporting" title="Financial Statements" description="Review period-ending financial position using Compass reporting categories." reportingPeriod={null} />
    <div className="mt-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Financial statement" className="inline-flex gap-2 rounded-xl bg-slate-200/70 p-1">
        <Link href={`/financial-statements?statement=income-statement&period=${model.current.period}`} className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900">Income Statement</Link>
        <Link href={`/financial-statements?statement=balance-sheet&period=${model.current.period}`} aria-current="page" className="rounded-lg border border-control-selected-border bg-control-selected px-3 py-2 text-xs font-semibold text-control-selected-text shadow-sm">Balance Sheet</Link>
        <span className="px-3 py-2 text-xs font-semibold text-slate-500">Cash Flow · Coming next</span>
      </nav>
      <PeriodSelector id="balance-sheet-period" selectedPeriod={model.current.period} periods={model.periods} ariaLabel="Balance Sheet as-of period" />
    </div>

    {model.accountingEquationWarning ? (
      <section role="alert" aria-labelledby="balance-sheet-warning-title" className="mt-6 rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-950 shadow-sm">
        <h2 id="balance-sheet-warning-title" className="text-base font-bold">{model.accountingEquationWarning.title}</h2>
        <p className="mt-2 text-sm leading-6">
          Accounting-equation difference: <strong className="tabular-nums">{model.accountingEquationWarning.displayDifference}</strong>
          {" · "}Selected period: <strong>{model.accountingEquationWarning.periodLabel}</strong>
        </p>
      </section>
    ) : null}

    <section aria-label="Balance Sheet summary" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {model.summaries.map((summary) => <article key={summary.key} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"><p className="text-xs font-medium text-slate-500">{summary.label}</p><p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{summary.value}</p><p className="mt-2 min-h-5 text-[11px] text-slate-500">{summary.comparison ? `${summary.comparison} from prior month` : "First available period"}</p><p className="mt-2 border-t border-slate-100 pt-2 text-[10px] leading-4 text-slate-400">{summary.definition}</p></article>)}
    </section>

    <div className="mt-6 grid min-w-0 gap-4 xl:grid-cols-3">
      <Panel title="Working Capital — period-ending trend" description="Monthly endpoints through the selected period, up to 12 months."><LineChart values={model.trends.map((point) => point.workingCapital)} labels={model.trends.map((point) => point.fullLabel)} format="currency" metricName="Working Capital" tooltipPrefix="Period ending" /></Panel>
      <Panel title="Current Ratio — period-ending trend" description="Current Assets divided by Current Liabilities."><LineChart values={model.trends.map((point) => point.currentRatio ?? 0)} labels={model.trends.map((point) => point.fullLabel)} format="ratio" metricName="Current Ratio" tooltipPrefix="Period ending" /></Panel>
      <Panel title="Quick Ratio — period-ending trend" description="Quick Assets divided by Current Liabilities."><LineChart values={model.trends.map((point) => point.quickRatio ?? 0)} labels={model.trends.map((point) => point.fullLabel)} format="ratio" metricName="Quick Ratio" tooltipPrefix="Period ending" /></Panel>
    </div>

    <Panel title="Balance Sheet" description={`Period-ending balances as of ${fullPeriodLabel(model.current.period)}`} className="mt-5">
      <div className="overflow-hidden">
        <table className="w-full border-collapse">
          <thead><tr className="bg-slate-50"><th scope="col" className="border-b border-slate-200 px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Category</th><th scope="col" className="border-b border-slate-200 px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">{fullPeriodLabel(model.current.period)}</th></tr></thead>
          <tbody>{model.rows.map((row, index) => {
            if (row.kind === "section") return <tr key={`${row.label}-${index}`}><th scope="rowgroup" colSpan={2} className="border-y border-table-section-border bg-table-section px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-table-section-text">{row.label}</th></tr>;
            if (row.kind === "group") return <tr key={`${row.label}-${index}`}><th scope="rowgroup" colSpan={2} className="border-b border-slate-200 bg-slate-100 px-5 py-2 text-left text-[10px] font-bold uppercase tracking-[0.1em] text-slate-700">{row.label}</th></tr>;
            const strong = row.kind === "total";
            return <tr key={`${row.label}-${index}`} className={strong ? "bg-table-highlight" : row.kind === "subtotal" ? "bg-slate-50" : "bg-white hover:bg-slate-50/70"}><th scope="row" className={`border-b border-slate-100 px-5 py-2.5 text-left text-sm ${row.kind === "detail" ? "pl-9 font-normal text-slate-600" : strong ? "font-semibold text-table-section-text" : "font-semibold text-slate-950"}`}>{row.label}</th><td title={row.accessibleValue} aria-label={row.accessibleValue} className={`border-b border-slate-100 px-5 py-2.5 text-right text-sm tabular-nums ${strong ? "font-bold text-table-section-text" : "font-semibold text-slate-800"}`}>{row.displayValue}</td></tr>;
          })}</tbody>
        </table>
      </div>
    </Panel>

    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6"><FileChartColumn className="size-5 text-slate-400"/><h2 className="mt-3 font-semibold text-slate-900">Cash Flow coming next</h2><p className="mt-2 text-sm leading-6 text-slate-500">Cash Flow remains unavailable until its accounting foundation is implemented.</p></div>
  </PageShell>;
}
