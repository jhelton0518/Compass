import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { PageShell } from "../../components/app/page-shell";
import { PageHeader } from "../../components/app/page-header";
import { DataTable, Panel, SegmentedLinks, StatCard, StatusBadge } from "../../components/app/ui";
import { LineChart } from "../../components/app/line-chart";
import { incomeStatements } from "../../data/income-statements";
import { financialPeriods } from "../../data/financial-periods";
import { buildProfitabilityViewModel } from "../../lib/services/analysis-view-models";

const model=buildProfitabilityViewModel({companyId:"vch",endPeriod:"2026-06",statements:incomeStatements,periods:financialPeriods});
export default function ProfitabilityPage(){
  if(model.status!=="complete") return <PageShell><PageHeader eyebrow="Performance" title="Profitability" description="Profitability data is incomplete for the selected period." /></PageShell>;
  return <PageShell><PageHeader eyebrow="Performance" title="Profitability" description="Understand margin direction, cost pressure, and the drivers shaping bottom-line performance."><SegmentedLinks items={[{label:"Rolling 12 months",href:"/profitability?view=r12m",active:true},{label:"Monthly detail",href:"#monthly-performance",active:false}]} /></PageHeader>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{model.overview.map(item=><StatCard key={item.key} label={`${item.label} %`} value={item.value} detail={`${item.change} vs. prior R12M`} icon={item.favorable?ArrowUpRight:ArrowDownRight} tone={item.favorable?"green":"amber"} />)}</div>
    <div className="mt-6 grid gap-4 xl:grid-cols-2">{model.overview.map(item=><Panel key={item.key} title={`${item.label} — rolling R12M trend`} description="Each point is calculated from aggregated trailing-12-month dollars ending in the labeled month."><LineChart values={model.rolling.map(point=>point[item.key]??0)} labels={model.rolling.map(point=>point.fullLabel)} format="percentage" metricName={`${item.label} Margin`} tooltipPrefix="R12M ending" tone={item.favorable?"green":"blue"} /></Panel>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Panel title="Monthly performance" description="Individual monthly results from July 2025 through June 2026." className="scroll-mt-6" ><div id="monthly-performance"><DataTable headers={["Month","Revenue","Gross Profit","Overhead","Operating Profit","Net Income"]} rows={model.monthly.map(row=>[row.period,row.revenue,row.grossProfitPercent,row.overheadPercent,row.operatingProfitPercent,row.netIncomePercent])} /></div></Panel>
      <div className="space-y-6"><Panel title="R12M cost drivers" description="Costs grouped using Compass reporting categories."><div className="divide-y divide-slate-100">{model.drivers.map(driver=><div key={driver.label} className="flex items-center justify-between px-5 py-4"><div><p className="text-sm font-semibold text-slate-800">{driver.label}</p><p className="mt-1 text-xs text-slate-500">{driver.percent} of Revenue</p></div><p className="text-sm font-semibold text-slate-950">{driver.value}</p></div>)}</div></Panel><Panel title="Owner takeaway"><div className="space-y-3 p-5 text-sm leading-6 text-slate-600"><p><StatusBadge tone="amber">Margin watch</StatusBadge></p><p>Gross margin is weakening across the rolling view. Pricing, labor productivity, material purchasing, and subcontractor scope deserve attention.</p><p><StatusBadge tone="green">Improving control</StatusBadge></p><p>Overhead is consuming a smaller share of Revenue, partially protecting operating results.</p></div></Panel></div>
    </div>
  </PageShell>;
}
