import { DEFAULT_COMPANY_THEME_ID, getCompanyTheme, isCompanyThemeId, type CompanyThemeId } from "../company-themes.ts";

export type ThemePreferenceStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

// Temporary prototype persistence. The company-scoped key is intentionally
// isolated so this adapter can later be replaced by a company database setting.
export function companyThemeStorageKey(companyId: string) {
  return `compass:company:${companyId}:appearance-theme`;
}

export function loadCompanyThemePreference(storage: ThemePreferenceStorage, companyId: string): CompanyThemeId {
  const saved = storage.getItem(companyThemeStorageKey(companyId));
  return isCompanyThemeId(saved) ? saved : DEFAULT_COMPANY_THEME_ID;
}

export function saveCompanyThemePreference(storage: ThemePreferenceStorage, companyId: string, themeId: CompanyThemeId) {
  storage.setItem(companyThemeStorageKey(companyId), themeId);
  return getCompanyTheme(themeId);
}

export function resetCompanyThemePreference(storage: ThemePreferenceStorage, companyId: string) {
  storage.removeItem(companyThemeStorageKey(companyId));
  return getCompanyTheme(DEFAULT_COMPANY_THEME_ID);
}
