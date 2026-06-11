import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { Circle, CheckCircle2, Bus } from "lucide-react";

const LABEL: Record<string, string> = {
  departed: "Bus departed", arrived_stop: "Arrived at stop", picked_up: "Picked up passengers",
  dropped_off: "Dropped off", delayed: "Delayed", completed: "Trip completed",
};

export default async function TripsPage() {
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: sub } = await supabase.from("rider_subscriptions").select("route_id, routes(name)").eq("rider_id", ctx.userId).neq("status", "cancelled").limit(1).maybeSingle();
  if (!sub) return <div className="p-6 pt-24 text-center text-muted">No route yet. <Link href="/rider/subscribe" className="text-foreground font-medium underline">Subscribe</Link></div>;
  const routeId = (sub as { route_id: string }).route_id;
  const routeName = (sub as unknown as { routes: { name: string } | null }).routes?.name ?? "";

  const { data: trip } = await supabase.from("trips").select("id, status, trip_date, buses(label)").eq("route_id", routeId).order("trip_date", { ascending: false }).limit(1).maybeSingle();
  let events: { id: string; type: string; note: string | null; created_at: string }[] = [];
  if (trip) {
    const { data } = await supabase.from("trip_events").select("id, type, note, created_at").eq("trip_id", (trip as { id: string }).id).order("created_at", { ascending: false });
    events = data ?? [];
  }
  const t = trip as unknown as { status: string; trip_date: string; buses: { label: string } | null } | null;

  return (
    <div className="p-4 pt-6">
      <h1 className="font-display text-2xl font-bold mb-1">Trip updates</h1>
      <p className="text-sm text-muted mb-5">{routeName}</p>

      {!t ? <p className="text-muted text-sm">No trips yet for your route.</p> : (
        <div className="rounded-3xl bg-surface p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="pill bg-primary text-primary-on p-3"><Bus className="w-5 h-5" /></div>
            <div>
              <p className="font-display font-semibold">{t.buses?.label ?? "Bus"} - {t.trip_date}</p>
              <p className="text-xs text-meta capitalize">{t.status.replace("_", " ")}</p>
            </div>
            {t.status === "in_progress" && (
              <span className="pill ml-auto bg-signal-soft text-signal text-xs font-bold px-3 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />Live
              </span>
            )}
          </div>
          {events.length === 0 ? <p className="text-sm text-muted">Waiting for the first update.</p> : (
            <ol className="space-y-4">
              {events.map((e) => (
                <li key={e.id} className="flex gap-3">
                  {e.type === "completed" ? <CheckCircle2 className="w-4 h-4 text-signal mt-0.5" /> : <Circle className="w-4 h-4 text-foreground mt-0.5" />}
                  <div>
                    <p className="text-sm font-medium">{LABEL[e.type] ?? e.type}</p>
                    {e.note && <p className="text-xs text-muted">{e.note}</p>}
                    <p className="text-xs text-meta">{new Date(e.created_at).toLocaleTimeString()}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}