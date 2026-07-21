import {
  ArrowDownRight,
  CircleAlert,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const briefingPoints = [
  {
    title: "Margin needs attention",
    description:
      "Gross profit margin is weakening as the company grows. Review job pricing and direct costs before the gap widens.",
    icon: ArrowDownRight,
    iconStyle: "bg-amber-50 text-amber-700",
  },
  {
    title: "Overhead is improving",
    description:
      "Better overhead discipline is helping protect operating profit and supporting the bottom line.",
    icon: ShieldCheck,
    iconStyle: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Cash remains tight",
    description:
      "Slow customer collections and pre-buying materials are tying up cash needed to run active jobs.",
    icon: WalletCards,
    iconStyle: "bg-blue-50 text-blue-700",
  },
];

export function FinancialBriefing() {
  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
      aria-labelledby="financial-briefing-heading"
    >
      <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
            <CircleAlert
              aria-hidden="true"
              className="size-[18px]"
              strokeWidth={1.9}
            />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.09em] text-blue-700">
              Owner&apos;s briefing
            </p>
            <h2
              id="financial-briefing-heading"
              className="mt-0.5 text-lg font-semibold tracking-tight text-slate-950"
            >
              Growth is exposing operational pressure
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          Volunteer Custom Homes is growing, but cracks are developing beneath
          the top line. Margin and cash need attention even as stronger overhead
          control helps protect the bottom line.
        </p>
      </div>

      <div className="grid divide-y divide-slate-200/80 md:grid-cols-3 md:divide-x md:divide-y-0">
        {briefingPoints.map(({ title, description, icon: Icon, iconStyle }) => (
          <article key={title} className="px-5 py-5 sm:px-6 sm:py-6">
            <span
              className={`grid size-9 place-items-center rounded-lg ${iconStyle}`}
            >
              <Icon
                aria-hidden="true"
                className="size-4"
                strokeWidth={2}
              />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
