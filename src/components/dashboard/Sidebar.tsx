"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bus, LayoutDashboard, Route, Users, Receipt,
  Megaphone, Settings, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface NavItem { href: string; label: string; icon: React.ElementType; }

const nav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/routes", label: "Routes", icon: Route },
  { href: "/dashboard/fleet", label: "Buses", icon: Bus },
  { href: "/dashboard/riders", label: "Riders & Payments", icon: Users },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
];
const bottom: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
  return (
    <Link href={item.href} title={collapsed ? item.label : undefined}
      className={cn("pill flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
        isActive ? "bg-primary text-primary-on" : "text-muted hover:bg-surface hover:text-foreground")}>
      <item.icon className="w-[18px] h-[18px] shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function Sidebar({ userName, orgName }: { userName: string; orgName: string }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={cn("h-screen sticky top-0 flex flex-col border-r border-border bg-background transition-all duration-200", collapsed ? "w-[76px]" : "w-64")}>
      <div className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <Bus className="w-5 h-5 text-primary-on" />
          </div>
          {!collapsed && <span className="font-display text-lg font-bold tracking-tight whitespace-nowrap">TransitFlow</span>}
        </Link>
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-full hover:bg-surface text-meta hover:text-foreground">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="mx-4 mb-2 px-4 py-3 rounded-2xl bg-surface">
          <p className="text-[10px] uppercase tracking-widest text-meta font-bold">Company</p>
          <p className="text-sm font-semibold truncate">{orgName}</p>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((item) => <NavLink key={item.href} item={item} collapsed={collapsed} />)}
      </nav>

      <div className="p-3 space-y-1 border-t border-border">
        {bottom.map((item) => <NavLink key={item.href} item={item} collapsed={collapsed} />)}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary text-primary-on flex items-center justify-center font-bold text-sm shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{userName}</p></div>}
          {!collapsed && <ThemeToggle className="!w-8 !h-8" />}
          {!collapsed && (
            <form action="/auth/signout" method="POST">
              <button type="submit" title="Sign out" className="p-1.5 rounded-full text-meta hover:text-danger transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </aside>
  );
}