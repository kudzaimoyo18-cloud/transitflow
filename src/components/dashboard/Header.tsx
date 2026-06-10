"use client";

import { Bell, Search, Menu } from "lucide-react";

export function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-surface rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted/50 focus:outline-none w-48"
          />
          <kbd className="text-[10px] text-muted bg-white border border-border px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>

        <button
          type="button"
          className="relative p-2 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>
      </div>
    </header>
  );
}
