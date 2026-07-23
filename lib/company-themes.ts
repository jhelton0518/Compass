export const DEFAULT_COMPANY_THEME_ID = "compass-blue";
export const PROTOTYPE_COMPANY_ID = "vch";

export type CompanyTheme = {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  primarySoft: string;
  primaryBorder: string;
  primaryForeground: string;
  brandSurface: string;
  brandSurfaceElevated: string;
  brandSurfaceBorder: string;
  navigationText: string;
  navigationMutedText: string;
  navigationHoverBackground: string;
  navigationActiveBackground: string;
  focusRing: string;
  linkColor: string;
  tableSectionBackground: string;
  tableSectionBorder: string;
  tableSectionText: string;
  tableHighlightBackground: string;
  selectedControlBackground: string;
  selectedControlBorder: string;
  selectedControlText: string;
};

type ThemePalette = {
  primary: string;
  hover: string;
  deep: string;
  soft: string;
  border: string;
  surface: string;
  elevated: string;
  surfaceBorder: string;
  navigationText: string;
  navigationMuted: string;
  navigationHover: string;
};

function createTheme<const Id extends string>(id: Id, name: string, palette: ThemePalette): CompanyTheme & { id: Id } {
  return {
    id,
    name,
    primary: palette.primary,
    primaryHover: palette.hover,
    primarySoft: palette.soft,
    primaryBorder: palette.border,
    primaryForeground: "#ffffff",
    brandSurface: palette.surface,
    brandSurfaceElevated: palette.elevated,
    brandSurfaceBorder: palette.surfaceBorder,
    navigationText: palette.navigationText,
    navigationMutedText: palette.navigationMuted,
    navigationHoverBackground: palette.navigationHover,
    navigationActiveBackground: palette.hover,
    focusRing: palette.primary,
    linkColor: palette.hover,
    tableSectionBackground: palette.soft,
    tableSectionBorder: palette.border,
    tableSectionText: palette.deep,
    tableHighlightBackground: palette.soft,
    selectedControlBackground: palette.hover,
    selectedControlBorder: palette.primary,
    selectedControlText: "#ffffff",
  };
}

export const companyThemes = [
  createTheme("compass-blue", "Compass Blue", { primary: "#2563eb", hover: "#1d4ed8", deep: "#1e40af", soft: "#eff6ff", border: "#bfdbfe", surface: "#0b1729", elevated: "#13243b", surfaceBorder: "#263b55", navigationText: "#e2e8f0", navigationMuted: "#94a3b8", navigationHover: "#172941" }),
  createTheme("navy", "Navy", { primary: "#475569", hover: "#334155", deep: "#1e293b", soft: "#f1f5f9", border: "#cbd5e1", surface: "#111827", elevated: "#1f2937", surfaceBorder: "#374151", navigationText: "#f1f5f9", navigationMuted: "#94a3b8", navigationHover: "#273449" }),
  createTheme("sky", "Sky", { primary: "#0284c7", hover: "#0369a1", deep: "#075985", soft: "#f0f9ff", border: "#bae6fd", surface: "#082433", elevated: "#0c3448", surfaceBorder: "#15516b", navigationText: "#e0f2fe", navigationMuted: "#7dd3fc", navigationHover: "#0d3c53" }),
  createTheme("teal", "Teal", { primary: "#0d9488", hover: "#0f766e", deep: "#115e59", soft: "#f0fdfa", border: "#99f6e4", surface: "#062a28", elevated: "#0a3b37", surfaceBorder: "#155e57", navigationText: "#ccfbf1", navigationMuted: "#5eead4", navigationHover: "#0d4641" }),
  createTheme("emerald", "Emerald", { primary: "#059669", hover: "#047857", deep: "#065f46", soft: "#ecfdf5", border: "#a7f3d0", surface: "#06261c", elevated: "#0a3828", surfaceBorder: "#145c43", navigationText: "#d1fae5", navigationMuted: "#6ee7b7", navigationHover: "#0d4532" }),
  createTheme("forest", "Forest", { primary: "#15803d", hover: "#166534", deep: "#14532d", soft: "#f0fdf4", border: "#bbf7d0", surface: "#0b2113", elevated: "#12331d", surfaceBorder: "#245c35", navigationText: "#dcfce7", navigationMuted: "#86efac", navigationHover: "#173d24" }),
  createTheme("purple", "Purple", { primary: "#9333ea", hover: "#7e22ce", deep: "#6b21a8", soft: "#faf5ff", border: "#e9d5ff", surface: "#1f0b30", elevated: "#301247", surfaceBorder: "#552075", navigationText: "#f3e8ff", navigationMuted: "#d8b4fe", navigationHover: "#3a1654" }),
  createTheme("indigo", "Indigo", { primary: "#4f46e5", hover: "#4338ca", deep: "#3730a3", soft: "#eef2ff", border: "#c7d2fe", surface: "#151630", elevated: "#22254a", surfaceBorder: "#3b3f75", navigationText: "#e0e7ff", navigationMuted: "#a5b4fc", navigationHover: "#2a2d57" }),
  createTheme("burgundy", "Burgundy", { primary: "#9f1239", hover: "#881337", deep: "#4c0519", soft: "#fff1f2", border: "#fecdd3", surface: "#260810", elevated: "#3a0d19", surfaceBorder: "#67162b", navigationText: "#ffe4e6", navigationMuted: "#fda4af", navigationHover: "#471020" }),
  createTheme("red", "Red", { primary: "#dc2626", hover: "#b91c1c", deep: "#991b1b", soft: "#fef2f2", border: "#fecaca", surface: "#260909", elevated: "#3b1010", surfaceBorder: "#681d1d", navigationText: "#fee2e2", navigationMuted: "#fca5a5", navigationHover: "#481414" }),
  createTheme("orange", "Orange", { primary: "#ea580c", hover: "#c2410c", deep: "#9a3412", soft: "#fff7ed", border: "#fed7aa", surface: "#2a1508", elevated: "#42230d", surfaceBorder: "#713b17", navigationText: "#ffedd5", navigationMuted: "#fdba74", navigationHover: "#502a10" }),
  createTheme("slate", "Slate", { primary: "#64748b", hover: "#475569", deep: "#334155", soft: "#f8fafc", border: "#cbd5e1", surface: "#151b24", elevated: "#232d3a", surfaceBorder: "#3b4a5c", navigationText: "#e2e8f0", navigationMuted: "#94a3b8", navigationHover: "#2b3746" }),
] as const;

export type CompanyThemeId = (typeof companyThemes)[number]["id"];

export function isCompanyThemeId(value: string | null): value is CompanyThemeId {
  return companyThemes.some((theme) => theme.id === value);
}

export function getCompanyTheme(themeId: string | null | undefined): CompanyTheme {
  return companyThemes.find((theme) => theme.id === themeId) ?? companyThemes[0];
}

export function companyThemeVariables(theme: CompanyTheme) {
  return {
    "--company-primary-accent": theme.primary,
    "--company-primary-accent-hover": theme.primaryHover,
    "--company-primary-accent-soft": theme.primarySoft,
    "--company-primary-accent-border": theme.primaryBorder,
    "--company-primary-accent-foreground": theme.primaryForeground,
    "--company-brand-surface": theme.brandSurface,
    "--company-brand-surface-elevated": theme.brandSurfaceElevated,
    "--company-brand-surface-border": theme.brandSurfaceBorder,
    "--company-navigation-text": theme.navigationText,
    "--company-navigation-muted-text": theme.navigationMutedText,
    "--company-navigation-hover-background": theme.navigationHoverBackground,
    "--company-navigation-active-background": theme.navigationActiveBackground,
    "--company-focus-ring": theme.focusRing,
    "--company-link-color": theme.linkColor,
    "--company-table-section-background": theme.tableSectionBackground,
    "--company-table-section-border": theme.tableSectionBorder,
    "--company-table-section-text": theme.tableSectionText,
    "--company-table-highlight-background": theme.tableHighlightBackground,
    "--company-selected-control-background": theme.selectedControlBackground,
    "--company-selected-control-border": theme.selectedControlBorder,
    "--company-selected-control-text": theme.selectedControlText,
  } as const;
}
