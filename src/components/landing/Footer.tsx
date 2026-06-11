import Link from "next/link";
import { Bus } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "Start your company", href: "/signup" },
    { label: "Rider login", href: "/login" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-on pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-on rounded-lg flex items-center justify-center">
                <Bus className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display text-lg font-bold">TransitFlow</span>
            </Link>
            <p className="text-sm opacity-50 leading-relaxed">
              The app that lets commuter transport companies get paid, send updates and track their buses live.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-sm mb-4 opacity-80">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm opacity-40 hover:opacity-80 transition-opacity">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-primary-on/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-30">&copy; 2026 TransitFlow. All rights reserved.</p>
          <p className="text-xs opacity-30">Built for commuter transport across the GCC.</p>
        </div>
      </div>
    </footer>
  );
}