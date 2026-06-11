import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { RiderRouteMap } from "@/components/rider/RiderRouteMap";
import { CreditCard, ArrowRight, Clock, MapPin, CalendarDays } from "lucide-react";

function money(n: number, ccy: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(n || 0);
}
const BADGE: Record<string, string> = {
  active: "bg-signal-soft text-signal",
  due: "bg-warn-soft text-warn",
  overdue: "bg-danger-soft text-danger",
  cancelled: "bg-surface-2 text-meta",
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDays(days: number[]) {
  if (!days?.length) return "";
  return [...days].sort((a, b) => a - b).map((d) => DAYS[d]).join(", ");
}

export default async function RiderHome() {
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: sub } = await supabase
    .from("rider_subscriptions")
    .select("id, status, next_due_date, monthly_price, home_lat, home_lng, pickup_stop_id, organizations(name, currency), routes(id, name, origin, destination, departure_time, days_of_week, stops(id, name, lat, lng, position))")
    .eq("rider_id", ctx.userId).neq("status", "cancelled").order("started_at", { ascending: false }).limit(1).maybeSingle();

  if (!sub) {
    return (
      <div className="p-6 text-center space-y-5 pt-24">
        <h1 className="font-display text-2xl font-bold">Welcome aboard</h1>
        <p className="text-muted">You are not subscribed to a route yet.</p>
        <Link href="/rider/subscribe" className="pill inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-on font-semibold">
          Choose your route <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const s = sub as unknown as {
    id: string; status: string; next_due_date: string; monthly_price: number;
    home_lat: number | null; home_lng: number | null; pickup_stop_id: string | null;
    organizations: { name: string; currency: string };
    routes: { id: string; name: string; origin: string; destination: string; departure_time: string; days_of_week: number[]; stops: { id: string; name: string; lat: number | null; lng: number | null; position: number }[] };
  };

  const pickupStop = s.routes.stops?.find((st) => st.id === s.pickup_stop_id);
  const departure = s.routes.departure_time?.slice(0, 5);

  return (
    <div>
      <header className="px-4 pt-6 pb-4">
        <p className="text-xs font-medium text-meta uppercase tracking-wider">{s.organizations.name}</p>
        <h1 className="font-display text-2xl font-bold mt-0.5">{s.routes.name}</h1>
        <p className="text-sm text-muted">{s.routes.origin} to {s.routes.destination}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {departure && (
            <span className="pill inline-flex items-center gap-1.5 text-xs font-medium bg-surface px-3 py-1.5"><Clock className="w-3 h-3" />Departs {departure}</span>
          )}
          {pickupStop && (
            <span className="pill inline-flex items-center gap-1.5 text-xs font-medium bg-surface px-3 py-1.5"><MapPin className="w-3 h-3" />{pickupStop.name}</span>
          )}
        </div>
      </header>

      <div className="mx-4 rounded-3xl overflow-hidden shadow-card">
        <RiderRouteMap routeId={s.routes.id} stops={s.routes.stops ?? []} home={{ lat: s.home_lat, lng: s.home_lng }} />
      </div>

      <div className="p-4 space-y-3">
        <Link href="/rider/pay" className={"block rounded-3xl p-5 " + (BADGE[s.status] ?? "")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-widest font-bold opacity-80">Payment {s.status}</p>
              <p className="font-display text-3xl font-bold mt-1">{money(Number(s.monthly_price), s.organizations.currency)}<span className="text-sm font-normal opacity-70">/mo</span></p>
              <p className="text-sm mt-0.5 opacity-80">{s.status === "active" ? "Paid until " : "Due "}{s.next_due_date}</p>
            </div>
            <div className="pill bg-background/60 p-3.5">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </Link>

        <div className="rounded-3xl bg-surface p-5">
          <p className="font-display font-semibold text-sm mb-4">Your journey</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><CalendarDays className="w-4 h-4 text-meta shrink-0" /><span className="text-muted">Runs</span><span className="ml-auto font-medium">{formatDays(s.routes.days_of_week)}</span></div>
            <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-meta shrink-0" /><span className="text-muted">Departs</span><span className="ml-auto font-medium">{departure}</span></div>
            <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-meta shrink-0" /><span className="text-muted">Your stop</span><span className="ml-auto font-medium">{pickupStop?.name ?? "Not set"}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}