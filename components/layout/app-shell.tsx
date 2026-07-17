import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

type AppShellProps = {
  children: React.ReactNode;
  companyName?: string;
  reportingPeriod?: string;
};

export function AppShell({
  children,
  companyName = "Volunteer Custom Homes",
  reportingPeriod = "Rolling 12 Months",
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-[260px]">
        <Header
          companyName={companyName}
          reportingPeriod={reportingPeriod}
        />
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
