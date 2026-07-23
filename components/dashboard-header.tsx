import { Building2, CalendarDays, ChevronDown } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex flex-col gap-6 border-b border-slate-200/80 pb-7 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">Overview</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          A clear view of your company&apos;s financial performance.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          aria-label="Select company"
          className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left shadow-sm transition-colors hover:border-slate-300"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Building2 aria-hidden="true" className="size-4" strokeWidth={1.9} />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Company
            </span>
            <span className="block truncate text-sm font-semibold text-slate-800">
              Volunteer Custom Homes
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="ml-2 size-4 shrink-0 text-slate-400"
            strokeWidth={1.9}
          />
        </button>

        <button
          type="button"
          aria-label="Select reporting period"
          className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left shadow-sm transition-colors hover:border-slate-300"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
            <CalendarDays aria-hidden="true" className="size-4" strokeWidth={1.9} />
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Reporting period
            </span>
            <span className="block text-sm font-semibold text-slate-800">
              As of June 2026
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="ml-2 size-4 shrink-0 text-slate-400"
            strokeWidth={1.9}
          />
        </button>
      </div>
    </header>
  );
}
