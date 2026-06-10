"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Bus } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Transit<span className="text-primary">Flow</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors px-4 py-2">Log in</Link>
            <Link href="/signup" className="text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors px-5 py-2.5 rounded-lg">Start your company</Link>
          </div>

          <button type="button" className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block text-sm font-medium text-muted hover:text-foreground" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link href="/login" className="text-sm font-medium text-center py-2">Log in</Link>
              <Link href="/signup" className="text-sm font-medium text-white bg-primary text-center py-2.5 rounded-lg">Start your company</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
