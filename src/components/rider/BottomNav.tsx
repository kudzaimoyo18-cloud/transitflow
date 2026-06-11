"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, CreditCard, Route, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/rider", label: "Map", icon: MapPin },
  { href: "/rider/pay", label: "Pay", icon: CreditCard },
  { href: "/rider/trips", label: "Trips", icon: Route },
  { href: "/rider/alerts", label: "Alerts", icon: Bell },
  { href: "/rider/me", label: "Me", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border grid grid-cols-5 max-w-md mx-auto pb-[env(safe-area-inset-bottom)]">
      {tabs.map((t) => {
        const active = t.href === "/rider" ? pathname === "/rider" : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href}
            className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors", active ? "text-foreground" : "text-meta hover:text-muted")}>
            <span className={cn("pill px-4 py-1 transition-colors", active ? "bg-primary text-primary-on" : "")}>
              <t.icon className="w-[18px] h-[18px]" />
            </span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}