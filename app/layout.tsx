import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { companyThemes, companyThemeVariables, PROTOTYPE_COMPANY_ID } from "../lib/company-themes";
import { companyThemeStorageKey } from "../lib/services/theme-preference";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compass",
  description: "Financial intelligence for construction contractors",
};

const serializedThemeTokens = companyThemes.map((theme) => ({ id: theme.id, tokens: companyThemeVariables(theme) }));
const themeBootScript = `(()=>{try{const themes=${JSON.stringify(serializedThemeTokens)};const saved=localStorage.getItem(${JSON.stringify(companyThemeStorageKey(PROTOTYPE_COMPANY_ID))});const theme=themes.find((item)=>item.id===saved)||themes[0];const root=document.documentElement;root.dataset.companyTheme=theme.id;for(const [token,value] of Object.entries(theme.tokens))root.style.setProperty(token,value);}catch{}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head><script dangerouslySetInnerHTML={{ __html: themeBootScript }} /></head>
      <body className="min-h-full font-sans"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
