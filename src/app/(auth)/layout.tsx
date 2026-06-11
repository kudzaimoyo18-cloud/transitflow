import Link from "next/link";
import { Bus } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Bus className="w-6 h-6 text-black" />
            </div>
            <span className="font-display text-2xl font-bold">TransitFlow</span>
          </Link>

          <div className="space-y-6">
            <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-tight">
              Run your commuter
              <br />
              transport business
              <br />
              from one app.
            </h1>
            <p className="text-white/50 text-lg max-w-md">
              Collect monthly fares, send payment reminders, broadcast pickup
              updates and track every bus live - while riders pay and ride from
              their phone.
            </p>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-signal" />Riders pay their fare in-app</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-signal" />Live bus tracking for every route</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-signal" />See who paid, who is overdue, and your running costs</li>
            </ul>
          </div>

          <p className="text-white/30 text-sm">&copy; 2026 TransitFlow. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}