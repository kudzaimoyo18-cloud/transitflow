import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { RiderRouteMap } from "@/components/rider/RiderRouteMap";
import { CreditCard, ArrowRight } from "lucide-react";

function money(n: number, ccy: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(n || 0);
}
const BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  due: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

export default async function RiderHome() {
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: sub } = await supabase
    .from("rider_subscriptions")
    .select("id, status, next_due_date, monthly_price, home_lat, home_lng, organizations(name, currency), routes(id, name, origin, destination, stops(id, name, lat, lng))")
    .eq("rider_id", ctx.userId).neq("status", "cancelled").order("started_at", { ascending: false }).limit(1).maybeSingle();

  if (!sub) {
    return (
      <div className="p-6 text-center space-y-4 pt-20">
        <h1 className="text-xl font-bold">Welcome aboard</h1>
        <p className="text-muted">You are not subscribed to a route yet.</p>
        <Link href="/rider/subscribe" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium">Choose your route <ArrowRight className="w-4 h-4" /></Link>
      </div>
    );
  }

  const s = sub as unknown as { id: string; status: string; next_due_date: string; monthly_price: number; home_lat: number | null; home_lng: number | null; organizations: { name: string; currency: string }; routes: { id: string; name: string; origin: string; destination: string; stops: { id: string; name: string; lat: number | null; lng: number | null }[] } };

  return (
    <div>
      <header className="px-4 pt-5 pb-3">
        <p className="text-xs text-muted">{s.organizations.name}</p>
        <h1 className="text-lg font-bold">{s.routes.name}</h1>
        <p className="text-sm text-muted">{s.routes.origin} to {s.routes.destination}</p>
      </header>

      <div className="rounded-xl overflow-hidden border-y border-border">
        <RiderRouteMap routeId={s.routes.id} stops={s.routes.stops ?? []} home={{ lat: s.home_lat, lng: s.home_lng }} />
      </div>

      <div className="p-4">
        <Link href="/rider/pay" className={"block rounded-xl border p-4 " + (BADGE[s.status] ?? "")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide font-medium">Payment {s.status}</p>
              <p className="text-2xl font-bold mt-1">{money(Number(s.monthly_price), s.organizations.currency)}<span className="text-sm font-normal">/mo</span></p>
              <p className="text-sm mt-0.5">{s.status === "active" ? "Paid until " : "Due "}{s.next_due_date}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CreditCard className="w-6 h-6" />
              <span className="text-xs font-medium">{s.status === "active" ? "View" : "Pay now"}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
