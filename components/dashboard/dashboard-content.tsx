import {
  BadgeDollarSign,
  Banknote,
  CircleDollarSign,
  Landmark,
  TrendingUp,
} from "lucide-react";

import { MetricCard } from "./metric-card";
import { FinancialBriefing } from "./financial-briefing";

const metrics = [
  {
    label: "Revenue",
    value: "$5.24M",
    context: "Rolling 12 months",
    change: "+8.4%",
    changeLabel: "vs. prior 12 months",
    trend: "positive" as const,
    icon: Banknote,
    chartPath: "M4 31 C17 29, 21 21, 33 24 S51 17, 61 19 S78 9, 92 12",
    featured: true,
  },
  {
    label: "Gross Profit",
    value: "25.8%",
    context: "$1.35M gross profit",
    change: "−3.2 pts",
    changeLabel: "vs. prior 12 months",
    trend: "negative" as const,
    icon: TrendingUp,
    chartPath: "M4 10 C17 11, 21 15, 33 13 S51 21, 61 20 S78 28, 92 30",
  },
  {
    label: "Operating Profit",
    value: "11.2%",
    context: "$587K operating profit",
    change: "+0.6 pts",
    changeLabel: "vs. prior 12 months",
    trend: "positive" as const,
    icon: BadgeDollarSign,
    chartPath: "M4 27 C15 25, 23 29, 33 24 S49 23, 60 20 S78 16, 92 17",
  },
  {
    label: "Net Income",
    value: "10.4%",
    context: "$545K net income",
    change: "+0.3 pts",
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
