import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { createRoute, deleteRoute } from "../../actions";
import { Trash2, MapPin } from "lucide-react";

const DAYS = [["Sun",0],["Mon",1],["Tue",2],["Wed",3],["Thu",4],["Fri",5],["Sat",6]] as const;

export default async function RoutesPage() {
  const ctx = await requireContext();
  const org = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff")!.organizations;
  const supabase = await createClient();
  const { data: routes } = await supabase.from("routes").select("id, name, origin, destination, departure_time, monthly_price, buses(label), stops(id)").eq("org_id", org.id).order("created_at", { ascending: false });
  const { data: buses } = await supabase.from("buses").select("id, label").eq("org_id", org.id).eq("active", true);

  return (
    <>
      <header className="px-6 py-4 border-b border-border bg-background"><h1 className="font-display text-xl font-bold">Routes</h1></header>
      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {(routes ?? []).length === 0 && <p className="text-muted text-sm">No routes yet. Create one to start.</p>}
          {(routes ?? []).map((r) => {
            const rr = r as unknown as { id: string; name: string; origin: string; destination: string; departure_time: string; monthly_price: number; buses: { label: string } | null; stops: { id: string }[] };
            return (
              <div key={rr.id} className="rounded-xl border border-border bg-background p-4 flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold">{rr.name}</p>
                  <p className="text-sm text-muted flex items-center gap-1"><MapPin className="w-3 h-3" />{rr.origin} to {rr.destination}</p>
                  <p className="text-xs text-muted mt-1">Departs {rr.departure_time?.slice(0,5)} - {rr.stops?.length ?? 0} stops - {rr.buses?.label ? rr.buses.label + " - " : ""}{org.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">{new Intl.NumberFormat("en-US",{style:"currency",currency:org.currency,maximumFractionDigits:0}).format(Number(rr.monthly_price))}<span className="text-xs text-muted font-normal">/mo</span></p>
                  <form action={deleteRoute}><input type="hidden" name="id" value={rr.id} /><button className="text-muted hover:text-danger mt-2"><Trash2 className="w-4 h-4" /></button></form>
                </div>
              </div>
            );
          })}
        </div>

        <form action={createRoute} className="rounded-xl border border-border bg-background p-4 space-y-3 h-fit">
          <h2 className="font-semibold">New route</h2>
          <input type="hidden" name="org_id" value={org.id} />
          <input name="name" required placeholder="Route name (e.g. City - Marina)" className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <input name="origin" required placeholder="Origin" className="px-3 py-2 rounded-lg border border-border text-sm" />
            <input name="destination" required placeholder="Destination" className="px-3 py-2 rounded-lg border border-border text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input name="departure_time" type="time" defaultValue="07:00" className="px-3 py-2 rounded-lg border border-border text-sm" />
            <input name="monthly_price" type="number" min="0" step="1" required placeholder="Monthly price" className="px-3 py-2 rounded-lg border border-border text-sm" />
          </div>
          <select name="bus_id" className="w-full px-3 py-2 rounded-lg border border-border text-sm">
            <option value="">Assign bus (optional)</option>
            {(buses ?? []).map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(([lbl, n]) => (
              <label key={n} className="flex items-center gap-1 text-xs">
                <input type="checkbox" name="days" value={n} defaultChecked={n >= 0 && n <= 4} /> {lbl}
              </label>
            ))}
          </div>
          <textarea name="stops" rows={3} placeholder="Stops, one per line (in order)" className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <button className="w-full py-2 rounded-lg bg-primary hover:bg-primary-dark text-primary-on text-sm font-medium">Create route</button>
        </form>
      </div>
    </>
  );
}
