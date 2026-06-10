import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TransitFlow — Transport Management Software",
  description:
    "Simplify your transport business. Manage fleet, drivers, bookings, trips, and payments — all from one platform.",
  keywords: [
    "transport management",
    "fleet management",
    "logistics software",
    "trucking ERP",
    "driver management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
