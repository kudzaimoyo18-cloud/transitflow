"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Truck,
  LayoutDashboard,
  CarFront,
  Users,
  Package,
  Route,
  CreditCard,
  Megaphone,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const mainNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/fleet", label: "Fleet", icon: CarFront },
  { href: "/dashboard/drivers", label: "Drivers", icon: Users },
  { href: "/dashboard/bookings", label: "Bookings", icon: Package },
  { href: "/dashboard/trips", label: "Trips", icon: Route },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/load-board", label: "Load Board", icon: Megaphone },
];

const bottomNav: NavItem[] = [
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: 3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted hover:bg-surface hover:text-foreground"
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
      {item.badge && !collapsed && (
        <span className="ml-auto bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
      {item.badge && collapsed && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
      )}
    </Link>
  );
}

export function Sidebar({ userName }: { userName: string }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r border-border bg-white transition-all duration-200",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">
              Transit<span className="text-primary">Flow</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-surface text-muted hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="p-3 space-y-1 border-t border-border">
        {bottomNav.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} />
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userName}
              </p>
            </div>
          )}
          {!collapsed && (
            <form action="/api/logout" method="POST">
              <button
                type="submit"
                className="p-1 rounded text-muted hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </aside>
  );
}
