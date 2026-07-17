import {
  Banknote,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Profitability", href: "/profitability", icon: TrendingUp },
  {
    label: "Cash & Working Capital",
    href: "/cash",
    icon: Wallet,
  },
  {
    label: "Financial Statements",
    href: "/financial-statements",
    icon: FileText,
  },
  {
    label: "Accounts Receivable",
    href: "/accounts-receivable",
    icon: Receipt,
  },
  {
    label: "Accounts Payable",
    href: "/accounts-payable",
    icon: Banknote,
  },
  { label: "Settings", href: "/settings", icon: Settings },
];
