import {
  Banknote,
  CircleDollarSign,
  Landmark,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { MetricCard } from "./metric-card";
import { FinancialBriefing } from "./financial-briefing";
import { incomeStatements } from "../../data/income-statements";
import { financialPeriods } from "../../data/financial-periods";
import { volunteerCustomHomes } from "../../data/volunteer-custom-homes";
import { calculateDashboardFinancialModel } from "../../lib/services/dashboard-financial-service";

const dashboardFinancials = calculateDashboardFinancialModel({
  companyId: volunteerCustomHomes.id,
  endPeriod: "2026-06",
  statements: incomeStatements,
  periods: financialPeriods,
});

const metricPresentation = [
  {
    label: "Revenue",
    value: "—",
    context: "Rolling 12 months",
    change: "—",
    changeLabel: "vs. prior 12 months",
    trend: "positive" as const,
    icon: Banknote,
    chartPath: "M4 31 C17 29, 21 21, 33 24 S51 17, 61 19 S78 9, 92 12",
    featured: true,
  },
  {
    label: "Gross Profit %",
    value: "—",
    context: "R12M data unavailable",
    change: "—",
    changeLabel: "vs. prior 12 months",
    trend: "negative" as const,
    icon: TrendingUp,
    chartPath: "M4 10 C17 11, 21 15, 33 13 S51 21, 61 20 S78 28, 92 30",
  },
  {
    label: "Overhead % of Revenue",
    value: "—",
    context: "Overhead discipline is improving",
    change: "—",
    changeLabel: "vs. prior 12 months",
    trend: "positive" as const,
    icon: ShieldCheck,
    chartPath: "M4 10 C17 12, 23 9, 34 15 S50 18, 61 20 S78 27, 92 29",
  },
  {
    label: "Net Income %",
    value: "—",
    context: "R12M data unavailable",
    change: "—",
    changeLabel: "vs. prior 12 months",
    trend: "positive" as const,
    icon: CircleDollarSign,
    chartPath: "M4 28 C17 27, 22 30, 33 25 S49 22, 60 23 S76 17, 92 18",
  },
  {
    label: "Cash",
    value: "$418K",
    context: "Current cash balance",
    change: "−$96K",
    changeLabel: "since May 2026",
    trend: "negative" as const,
    icon: Landmark,
    chartPath: "M4 12 C16 13, 23 10, 34 15 S50 18, 61 17 S77 27, 92 29",
  },
];

export function DashboardContent() {
  const unavailable = dashboardFinancials.status === "incomplete";
  const calculatedMetrics = unavailable
    ? [
        { value: "—", context: "R12M data unavailable", change: "—" },
        { value: "—", context: "R12M data unavailable", change: "—" },
        { value: "—", context: "R12M data unavailable", change: "—" },
        { value: "—", context: "R12M data unavailable", change: "—" },
      ]
    : [
        {
          value: dashboardFinancials.kpis.revenue.value,
          context: "Rolling 12 months",
          change: dashboardFinancials.kpis.revenue.comparison,
        },
        {
          value: dashboardFinancials.kpis.grossProfit.percent,
          context: `${dashboardFinancials.kpis.grossProfit.dollars} gross profit`,
          change: dashboardFinancials.kpis.grossProfit.comparison,
        },
        {
          value: dashboardFinancials.kpis.overhead.percent,
          context: "Overhead discipline is improving",
          change: dashboardFinancials.kpis.overhead.comparison,
        },
        {
          value: dashboardFinancials.kpis.netIncome.percent,
          context: `${dashboardFinancials.kpis.netIncome.dollars} net income`,
          change: dashboardFinancials.kpis.netIncome.comparison,
        },
      ];
  const metrics = metricPresentation.map((metric, index) =>
    index < calculatedMetrics.length
      ? { ...metric, ...calculatedMetrics[index] }
      : metric,
  );

  return (
    <section className="mt-7" aria-labelledby="financial-overview-heading">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="financial-overview-heading"
            className="text-base font-semibold tracking-tight text-slate-900"
          >
            Financial overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Performance through the last closed month.
          </p>
        </div>
        <p className="text-xs font-medium text-slate-400">Updated July 15, 2026</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={
              index < 3
                ? "xl:col-span-2"
                : index === 3
                  ? "xl:col-span-3"
                  : "sm:col-span-2 xl:col-span-3"
            }
          >
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      <FinancialBriefing />
    </section>
  );
}
