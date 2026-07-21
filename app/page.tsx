import { Sidebar } from "../components/sidebar";
import { DashboardHeader } from "../components/dashboard-header";
import { DashboardContent } from "../components/dashboard/dashboard-content";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] md:pl-64">
      <Sidebar />

      <main className="min-h-screen px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1440px]">
          <DashboardHeader />
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}