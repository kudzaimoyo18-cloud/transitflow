import Link from "next/link";
import { Bus } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-blue-900" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Transit<span className="text-blue-200">Flow</span></span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Run your commuter
              <br />
              transport business
              <br />
              from one app.
            </h1>
            <p className="text-blue-200 text-lg max-w-md">
              Collect monthly fares, send payment reminders, broadcast pickup
              updates and track every bus live - while riders pay and ride from
              their phone.
            </p>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>Riders pay their fare in-app</li>
              <li>Live bus tracking for every route</li>
              <li>See who paid, who is overdue, and your running costs</li>
            </ul>
          </div>

          <p className="text-blue-300 text-sm">&copy; 2026 TransitFlow. All rights reserved.</p>
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
