import { Banknote, CircleGauge, Gauge, Scale } from "lucide-react";
import { PageShell } from "../../components/app/page-shell";
import { PageHeader } from "../../components/app/page-header";
import { Panel, StatCard } from "../../components/app/ui";
import { LineChart } from "../../components/app/line-chart";
import { formatDollarAbbreviation } from "../../lib/formatters/financial";
import { buildCashViewModel } from "../../lib/services/balance-sheet-view-models";
import { PeriodSelector } from "../../components/app/period-selector";

export default async function CashPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const params = await searchParams;
  const model = buildCashViewModel(params.period);
  const ratio = (value: number | null) => value === null ? "—" : `${value.toFixed(2)}×`;
  return <PageShell>
    <PageHeader eyebrow="Liquidity" title="Cash & Working Capital" description="See period-ending resources available to fund active jobs and upcoming obligations." reportingPeriod={null}>
      <PeriodSelector id="cash-period" selectedPeriod={model.period} periods={model.periods} ariaLabel="Cash and Working Capital as-of period" />
    </PageHeader>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Cash balance" value={formatDollarAbbreviation(model.cash)} detail="Period-ending Operating Cash" icon={Banknote} tone="blue"/><StatCard label="Working capital" value={formatDollarAbbreviation(model.workingCapital)} detail="Current Assets less Current Liabilities" icon={Scale}/><StatCard label="Current ratio" value={ratio(model.currentRatio)} detail="Current Assets ÷ Current Liabilities" icon={CircleGauge} tone="green"/><StatCard label="Quick ratio" value={ratio(model.quickRatio)} detail="Quick Assets ÷ Current Liabilities" icon={Gauge} tone="green"/></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><Panel title="Period-ending cash" description="Authoritative monthly Operating Cash endpoints through the selected period, up to 12 months."><LineChart values={model.cashTrend.map((point) => point.value)} labels={model.cashTrend.map((point) => point.fullLabel)} format="currency" metricName="Operating Cash" tooltipPrefix="Period ending" /></Panel><Panel title="Liquidity composition" description={`Period-ending Current Assets and Current Liabilities as of ${model.periodLabel}`}><div className="grid gap-6 p-5 sm:grid-cols-2"><div><h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current Assets</h3>{model.currentAssets.map((item) => <div key={item.label} className="mt-4 flex justify-between gap-4 text-sm"><span className="text-slate-600">{item.label}</span><strong>{formatDollarAbbreviation(item.amount)}</strong></div>)}</div><div><h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current Liabilities</h3>{model.currentLiabilities.map((item) => <div key={item.label} className="mt-4 flex justify-between gap-4 text-sm"><span className="text-slate-600">{item.label}</span><strong>{formatDollarAbbreviation(item.amount)}</strong></div>)}</div></div></Panel></div>
    <Panel title="Liquidity priorities" className="mt-6"><div className="grid gap-4 p-5 md:grid-cols-3"><p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Collections remain the fastest lever for converting Current Assets into available cash.</p><p className="rounded-xl bg-brand-50 p-4 text-sm leading-6 text-table-section-text">Sequence vendor payments around customer receipts to protect operating liquidity.</p><p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">Current and Quick Ratios measure liquidity at the selected period endpoint.</p></div></Panel>
  </PageShell>;
}
