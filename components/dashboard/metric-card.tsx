import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  context: string;
  change: string;
  changeLabel: string;
  trend: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  chartPath: string;
  featured?: boolean;
};

const trendStyles = {
  positive: "bg-emerald-50 text-emerald-700",
  negative: "bg-amber-50 text-amber-700",
  neutral: "bg-slate-100 text-slate-600",
};

export function MetricCard({
  label,
  value,
  context,
  change,
  changeLabel,
  trend,
  icon: Icon,
  chartPath,
  featured = false,
}: MetricCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${
        featured ? "border-brand-200" : "border-slate-200/80"
      }`}
    >
      {featured ? (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-brand-500" />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-[2rem] font-semibold leading-none tracking-[-0.035em] text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">{context}</p>
        </div>

        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${
            featured ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${trendStyles[trend]}`}
          >
            {change}
          </span>
          <p className="mt-2 text-xs text-slate-400">{changeLabel}</p>
        </div>

        <svg
          aria-hidden="true"
          className="h-10 w-24 text-slate-600"
          viewBox="0 0 96 40"
          fill="none"
        >
          <path
            d={chartPath}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </article>
  );
}
