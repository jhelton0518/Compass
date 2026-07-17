import { RefreshCw } from "lucide-react";

type HeaderProps = {
  companyName: string;
  reportingPeriod: string;
};

export function Header({ companyName, reportingPeriod }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-6">
        <h1 className="text-[15px] font-semibold text-slate-900">
          {companyName}
        </h1>
        <div className="h-4 w-px bg-slate-200" />
        <p className="text-[13px] text-slate-500">
          Reporting Period:{" "}
          <span className="font-medium text-slate-700">{reportingPeriod}</span>
        </p>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
      >
        <RefreshCw className="h-3.5 w-3.5 text-slate-500" strokeWidth={2} />
        Refresh Data
      </button>
    </header>
  );
}
