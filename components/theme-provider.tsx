"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { companyThemeVariables, DEFAULT_COMPANY_THEME_ID, getCompanyTheme, PROTOTYPE_COMPANY_ID, type CompanyThemeId } from "../lib/company-themes";
import { loadCompanyThemePreference, resetCompanyThemePreference, saveCompanyThemePreference } from "../lib/services/theme-preference";

type ThemeContextValue = { themeId: CompanyThemeId; selectTheme: (themeId: CompanyThemeId) => void; resetTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(themeId: CompanyThemeId) {
  const root = document.documentElement;
  const theme = getCompanyTheme(themeId);
  root.dataset.companyTheme = theme.id;
  for (const [token, value] of Object.entries(companyThemeVariables(theme))) root.style.setProperty(token, value);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useSyncExternalStore<CompanyThemeId>(
    (notify) => {
      const handleStorage = (event: StorageEvent) => { if (event.key?.includes("appearance-theme")) notify(); };
      window.addEventListener("storage", handleStorage);
      window.addEventListener("compass-theme-change", notify);
      return () => { window.removeEventListener("storage", handleStorage); window.removeEventListener("compass-theme-change", notify); };
    },
    () => loadCompanyThemePreference(localStorage, PROTOTYPE_COMPANY_ID),
    () => DEFAULT_COMPANY_THEME_ID,
  );

  useEffect(() => applyTheme(themeId), [themeId]);

  const selectTheme = useCallback((nextThemeId: CompanyThemeId) => {
    saveCompanyThemePreference(localStorage, PROTOTYPE_COMPANY_ID, nextThemeId);
    applyTheme(nextThemeId);
    window.dispatchEvent(new Event("compass-theme-change"));
  }, []);

  const resetTheme = useCallback(() => {
    resetCompanyThemePreference(localStorage, PROTOTYPE_COMPANY_ID);
    applyTheme(DEFAULT_COMPANY_THEME_ID);
    window.dispatchEvent(new Event("compass-theme-change"));
  }, []);

  const value = useMemo(() => ({ themeId, selectTheme, resetTheme }), [resetTheme, selectTheme, themeId]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useCompanyTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useCompanyTheme must be used inside ThemeProvider.");
  return context;
}
