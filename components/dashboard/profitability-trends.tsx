import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { DashboardFinancialModel } from "../../app/types/kpi";

const trendPresentation = [
  {
    label: "Gross Profit %",
    key: "grossProfitPercent" as const,
    direction: "Margin is narrowing",
  },
  {
    label: "Overhead % of Revenue",
    key: "overheadPercent" as const,
    lowerIsBetter: true,
    direction: "Overhead pressure is easing",
  },
  {
    label: "Operating Profit %",
    key: "operatingProfitPercent" as const,
    direction: "Operating margin is narrowing",
  },
  {
    label: "Net Income %",
    key: "netIncomePercent" as const,
    direction: "Bottom line margin is narrowing",
  },
];

const toneStyles = {
  positive: {
    badge: "bg-emerald-50 text-emerald-700",
    line: "text-emerald-600",
    Icon: ArrowUpRight,
  },
  attention: {
    badge: "bg-amber-50 text-amber-700",
    line: "text-amber-600",
    Icon: ArrowDownRight,
  },
};

function sparklinePath(values: readonly (number | null)[], lowerIsBetter = false) {
  if (values.some((value) => value === null)) {
    return null;
  }

  const numericValues = values as number[];
  const minimum = Math.min(...numericValues);
  const maximum = Math.max(...numericValues);
  const range = maximum - minimum || 1;

  return numericValues
    .map((value, index) => {
      const x = 2 + (index / (numericValues.length - 1)) * 116;
      const normalized = (value - minimum) / range;
      const visualValue = lowerIsBetter ? 1 - normalized : normalized;
      const y = 35 - visualValue * 28;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function ProfitabilityTrends({ model }: { model: DashboardFinancialModel }) {
  const trends = trendPresentation.map((trend) => {
    if (model.status === "incomplete") {
      return {
        ...trend,
        value: "—",
        change: "—",
        tone: "attention" as const,
        path: null,
        displayedDirection: "R12M data unavailable",
      };
    }

    const summary = model.trendSummaries[trend.key];
    const path = sparklinePath(
      model.trends.map((point) => point[trend.key]),
      trend.lowerIsBetter,
    );
    return {
      ...trend,
      value: summary.endPercent,
      change: summary.comparison,
      tone: summary.favorable ? ("positive" as const) : ("attention" as const),
      path,
      displayedDirection: path
        ? trend.direction
        : "Monthly ratio unavailable due to zero revenue",
    };
  });

  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
      aria-labelledby="profitability-trends-heading"
    >
      <div className="flex flex-col gap-3 border-b border-slate-200/80 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <div className="flex items-center gap-2 text-blue-700">
            <TrendingUp aria-hidden="true" className="size-4" strokeWidth={2} />
            <p className="text-xs font-semibold uppercase tracking-[0.09em]">
              Profitability trends
            </p>
          </div>
          <h2
            id="profitability-trends-heading"
            className="mt-2 text-lg font-semibold tracking-tight text-slate-950"
          >
            A clear view of margin direction
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monthly results from July 2025 through June 2026.
          </p>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-500 sm:text-right">
          Overhead control is helping, but gross margin remains the area to watch.
        </p>
      </div>

      <div className="grid divide-y divide-slate-200/80 sm:grid-cols-2 sm:divide-x sm:[&>*:nth-child(3)]:border-l-0 lg:grid-cols-4 lg:divide-y-0 lg:[&>*:nth-child(3)]:border-l">
        {trends.map((trend) => {
          const style = toneStyles[trend.tone];
          const DirectionIcon = style.Icon;

          return (
            <article key={trend.label} className="p-5 sm:p-6">
              <p className="text-sm font-medium text-slate-500">{trend.label}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  {trend.value}
                </p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
                >
                  <DirectionIcon aria-hidden="true" className="size-3.5" />
                  {trend.change}
                </span>
              </div>

              <svg
                aria-hidden="true"
                className={`mt-6 h-12 w-full ${style.line}`}
                viewBox="0 0 120 42"
                fill="none"
                preserveAspectRatio="none"
              >
                <path d="M2 39 H118" className="text-slate-100" stroke="currentColor" />
                {trend.path ? (
                  <path
                    d={trend.path}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}
              </svg>

              <p className="mt-3 text-xs font-medium text-slate-500">
                {trend.displayedDirection}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
