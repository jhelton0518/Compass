import { Building2, CalendarDays } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  reportingPeriod = "As of June 2026",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  reportingPeriod?: string;
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-slate-200/80 pb-7 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {children}
        <div className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm">
          <Building2 className="size-4 text-blue-700" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-800">Volunteer Custom Homes</span>
        </div>
        <div className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm">
          <CalendarDays className="size-4 text-slate-500" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-800">{reportingPeriod}</span>
        </div>
      </div>
    </header>
  );
}
