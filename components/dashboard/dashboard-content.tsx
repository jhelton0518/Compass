import { MetricCard } from "@/components/dashboard/metric-card";
import { FinancialBriefing } from "@/components/dashboard/financial-briefing";

const metrics = [
  { label: "Revenue (R12M)" },
  { label: "Gross Profit %" },
  { label: "Overhead %" },
  { label: "Net Income %" },
];

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} />
        ))}
      </div>

      <FinancialBriefing />
    </div>
  );
}
