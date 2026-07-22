import { Sidebar } from "../sidebar";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6f8] md:pl-64">
      <Sidebar />
      <main className="min-h-screen px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1440px]">{children}</div>
      </main>
    </div>
  );
}
