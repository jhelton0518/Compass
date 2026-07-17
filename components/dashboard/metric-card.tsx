type MetricCardProps = {
  label: string;
  value?: string;
};

export function MetricCard({ label, value = "—" }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-[13px] font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}
