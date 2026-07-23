"use client";

import { Check } from "lucide-react";
import { companyThemes, DEFAULT_COMPANY_THEME_ID, type CompanyThemeId } from "../../lib/company-themes";
import { useCompanyTheme } from "../theme-provider";
import { Panel } from "./ui";

export function AppearanceSettings() {
  const { themeId, selectTheme, resetTheme } = useCompanyTheme();
  return (
    <Panel title="Appearance" description="Choose a restrained company accent for charts and shared interface highlights. Prototype selections are stored in this browser only." className="mt-6">
      <div className="p-5 sm:p-6">
        <div role="radiogroup" aria-label="Company color theme" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companyThemes.map((theme) => {
            const selected = theme.id === themeId;
            return <button key={theme.id} type="button" role="radio" aria-checked={selected} onClick={() => selectTheme(theme.id as CompanyThemeId)} className={`flex min-h-20 items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? "border-control-selected-border bg-brand-50 ring-2 ring-brand-500/20" : "border-slate-200 bg-white hover:border-slate-300"}`}>
              <span className="flex shrink-0 overflow-hidden rounded-lg border border-black/5" aria-hidden="true"><span className="size-8" style={{ backgroundColor: theme.primary }} /><span className="size-8" style={{ backgroundColor: theme.brandSurface }} /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{theme.name}</span><span className="mt-1 block text-xs text-slate-500">{selected ? "Selected" : "Select theme"}</span></span>
              {selected ? <Check className="size-4 shrink-0 text-brand-700" aria-hidden="true" /> : null}
            </button>;
          })}
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">Temporary prototype preference for Volunteer Custom Homes. Company database storage will replace localStorage later.</p>
          <button type="button" onClick={resetTheme} disabled={themeId === DEFAULT_COMPANY_THEME_ID} className="min-h-10 shrink-0 rounded-xl border border-control-selected-border bg-control-selected px-4 text-sm font-semibold text-control-selected-text transition hover:brightness-95 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500">Reset to Compass Blue</button>
        </div>
      </div>
    </Panel>
  );
}
