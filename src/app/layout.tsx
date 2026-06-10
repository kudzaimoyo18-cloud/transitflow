import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TransitFlow - Commuter transport, paid and tracked",
  description: "TransitFlow lets transport companies collect rider payments, send reminders, broadcast pickup updates, track buses live, and manage running costs - all in one platform.",
  manifest: "/manifest.webmanifest",
  keywords: ["commuter transport", "bus subscription", "fleet tracking", "transport payments", "GCC transport"],
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
