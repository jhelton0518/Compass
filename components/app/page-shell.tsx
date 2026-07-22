import { Sidebar } from "../sidebar";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6f8] md:pl-64">
      <Sidebar />
      <main className="min-w-0 min-h-screen px-4 py-7 sm:px-6 lg:px-8 lg:py-10 xl:px-10">
        <div className="min-w-0">{children}</div>
      </main>
    </div>
  );
}
