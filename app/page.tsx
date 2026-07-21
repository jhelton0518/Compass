import { Sidebar } from "../components/sidebar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] md:pl-64">
      <Sidebar />

      <main className="min-h-screen px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-sm font-medium text-slate-500">Overview</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Dashboard
          </h1>

          <div className="mt-8 min-h-[420px] rounded-2xl border border-slate-200/80 bg-white shadow-sm" />
        </div>
      </main>
    </div>
  );
}