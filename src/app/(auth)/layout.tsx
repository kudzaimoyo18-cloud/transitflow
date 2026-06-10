import Link from "next/link";
import { Truck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-blue-900" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              Transit<span className="text-blue-200">Flow</span>
            </span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Manage your entire
              <br />
              transport business
              <br />
              from one platform.
            </h1>
            <p className="text-blue-200 text-lg max-w-md">
              Fleet tracking, driver management, bookings, invoicing, and
              real-time analytics — everything you need to scale.
            </p>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-blue-200 text-sm">Active Fleets</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-blue-200 text-sm">Trips Managed</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-blue-200 text-sm">Uptime</div>
              </div>
            </div>
          </div>

          <p className="text-blue-300 text-sm">
            &copy; 2025 TransitFlow. All rights reserved.
          </p>
        </div>

        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-20 -right-10 w-40 h-40 bg-white/5 rounded-full" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
