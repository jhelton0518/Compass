import {
    ArrowLeftRight,
    BadgeDollarSign,
    ChartNoAxesCombined,
    FileChartColumn,
    Gauge,
    Landmark,
    Settings,
  } from "lucide-react";
  
  const primaryNavigation = [
    { label: "Dashboard", icon: Gauge, active: true },
    { label: "Profitability", icon: ChartNoAxesCombined },
    { label: "Cash & Working Capital", icon: Landmark },
    { label: "Financial Statements", icon: FileChartColumn },
    { label: "Accounts Receivable", icon: BadgeDollarSign },
    { label: "Accounts Payable", icon: ArrowLeftRight },
  ];
  
  export function Sidebar() {
    return (
      <aside className="flex min-h-screen w-full flex-col bg-[#0b1729] px-4 py-6 text-slate-300 md:fixed md:inset-y-0 md:left-0 md:w-64">
        <div className="flex items-center gap-3 px-3">
          <div className="grid size-10 place-items-center rounded-xl bg-blue-500 text-lg font-semibold text-white shadow-lg shadow-blue-950/30">
            C
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">Compass</p>
            <p className="text-xs text-slate-500">Financial clarity</p>
          </div>
        </div>
  
        <nav aria-label="Primary navigation" className="mt-10 flex flex-1 flex-col gap-1">
          {primaryNavigation.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="#"
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
  
        <div className="border-t border-white/10 pt-4">
          <a
            href="#"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
          >
            <Settings aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            <span>Settings</span>
          </a>
  
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-700 text-xs font-semibold text-slate-100">
              VCH
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">Volunteer Custom Homes</p>
              <p className="text-xs text-slate-500">Franklin, Tennessee</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }