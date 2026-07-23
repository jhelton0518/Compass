"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { navItems } from "../lib/navigation";
  
  export function Sidebar() {
    const pathname = usePathname();
    const primaryNavigation = navItems.filter((item) => item.href !== "/settings");
    const settings = navItems.find((item) => item.href === "/settings")!;

    return (
      <aside className="flex w-full flex-col bg-sidebar px-4 py-5 text-nav-text md:fixed md:inset-y-0 md:left-0 md:min-h-screen md:w-64 md:py-6">
        <div className="flex items-center gap-3 px-3">
          <div className="grid size-10 place-items-center rounded-xl bg-brand-500 text-lg font-semibold text-brand-contrast shadow-lg shadow-black/20">
            C
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-nav-text">Compass</p>
            <p className="text-xs text-nav-muted">Financial clarity</p>
          </div>
        </div>
  
        <nav aria-label="Primary navigation" className="mt-5 flex gap-1 overflow-x-auto pb-1 md:mt-10 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
          {primaryNavigation.map(({ label, href, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-nav-active text-control-selected-text shadow-sm"
                  : "text-nav-muted hover:bg-nav-hover hover:text-nav-text"
              }`}
            >
              <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
              <span className="whitespace-nowrap">{label}</span>
            </Link>;
          })}
        </nav>
  
        <div className="border-t border-sidebar-border pt-4">
          <Link
            href={settings.href}
            aria-current={pathname.startsWith(settings.href) ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith(settings.href) ? "bg-nav-active text-control-selected-text" : "text-nav-muted hover:bg-nav-hover hover:text-nav-text"}`}
          >
            <Settings aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            <span>Settings</span>
          </Link>
  
          <div className="mt-4 hidden items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-elevated px-3 py-3 md:flex">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-nav-hover text-xs font-semibold text-nav-text">
              VCH
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-nav-text">Volunteer Custom Homes</p>
              <p className="text-xs text-nav-muted">Franklin, Tennessee</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }
