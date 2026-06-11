"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Bus } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Bus className="w-5 h-5 text-primary-on" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">TransitFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                className="pill px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="pill px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors">Log in</Link>
            <Link href="/signup" className="pill px-5 py-2.5 text-sm font-semibold bg-primary text-primary-on hover:bg-primary-dark transition-colors">
              Start your company
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button type="button" className="p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block text-sm font-medium text-muted hover:text-foreground py-1.5" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link href="/login" className="pill text-sm font-medium text-center py-2.5 border border-border">Log in</Link>
              <Link href="/signup" className="pill text-sm font-semibold bg-primary text-primary-on text-center py-2.5">Start your company</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}