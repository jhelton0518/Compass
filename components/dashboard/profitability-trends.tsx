import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

const trends = [
  {
    label: "Gross Profit %",
    value: "25.8%",
    change: "−3.2 pts",
    direction: "Margin is narrowing",
    tone: "attention" as const,
    path: "M2 9 C18 10, 26 16, 40 14 S61 23, 76 22 S99 31, 118 33",
  },
  {
    label: "Overhead % of Revenue",
    value: "14.6%",
    change: "−3.8 pts",
    direction: "Overhead pressure is easing",
    tone: "positive" as const,
    path: "M2 31 C19 29, 27 31, 41 25 S61 24, 76 19 S99 17, 118 10",
  },
  {
    label: "Operating Profit %",
    value: "11.2%",
    change: "+0.6 pts",
    direction: "Profitability is strengthening",
    tone: "positive" as const,
    path: "M2 30 C17 28, 27 31, 40 26 S61 24, 76 20 S99 16, 118 17",
  },
  {
    label: "Net Income %",
    value: "10.4%",
    change: "+0.3 pts",
    direction: "Bottom line is holding firm",
    tone: "positive" as const,
    path: "M2 31 C18 29, 27 32, 41 27 S61 23, 76 24 S98 17, 118 18",
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

export function ProfitabilityTrends() {
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
                <path
                  d={trend.path}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <p className="mt-3 text-xs font-medium text-slate-500">
                {trend.direction}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
