"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildPeriodSelectionHref } from "../../lib/services/period-selection";

type PeriodOption = { id: string; label: string };

export function PeriodSelector({ id, selectedPeriod, periods, ariaLabel = "As of period" }: { id: string; selectedPeriod: string; periods: PeriodOption[]; ariaLabel?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [optimisticPeriod, setOptimisticPeriod] = useOptimistic(selectedPeriod);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex shrink-0 items-center gap-2" aria-busy={isPending}>
      <label htmlFor={id} className="text-sm font-semibold text-slate-600">As of</label>
      <select
        id={id}
        aria-label={ariaLabel}
        value={optimisticPeriod}
        onChange={(event) => {
          const period = event.target.value;
          startTransition(() => {
            setOptimisticPeriod(period);
            router.replace(buildPeriodSelectionHref(pathname, searchParams.toString(), period), { scroll: false });
          });
        }}
        className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        {periods.slice().reverse().map((period) => <option key={period.id} value={period.id}>{period.label}</option>)}
      </select>
    </div>
  );
}
