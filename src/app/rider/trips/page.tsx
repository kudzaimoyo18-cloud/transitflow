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
  if (!sub) return <div className="p-6 pt-20 text-center text-muted">No route yet. <Link href="/rider/subscribe" className="text-primary">Subscribe</Link></div>;
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
      <h1 className="text-xl font-bold mb-1">Trip updates</h1>
      <p className="text-sm text-muted mb-4">{routeName}</p>

      {!t ? <p className="text-muted text-sm">No trips yet for your route.</p> : (
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bus className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold">{t.buses?.label ?? "Bus"} - {t.trip_date}</p>
              <p className="text-xs text-muted capitalize">{t.status.replace("_", " ")}</p>
            </div>
          </div>
          {events.length === 0 ? <p className="text-sm text-muted">Waiting for the first update.</p> : (
            <ol className="space-y-3">
              {events.map((e) => (
                <li key={e.id} className="flex gap-3">
                  {e.type === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /> : <Circle className="w-4 h-4 text-primary mt-0.5" />}
                  <div>
                    <p className="text-sm font-medium">{LABEL[e.type] ?? e.type}</p>
                    {e.note && <p className="text-xs text-muted">{e.note}</p>}
                    <p className="text-xs text-muted">{new Date(e.created_at).toLocaleTimeString()}</p>
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
