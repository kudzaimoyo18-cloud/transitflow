import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { createBus, deleteBus } from "../../actions";
import { Bus, Trash2 } from "lucide-react";

export default async function FleetPage() {
  const ctx = await requireContext();
  const org = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff")!.organizations;
  const supabase = await createClient();
  const { data: buses } = await supabase.from("buses").select("id, label, plate_number, capacity, active").eq("org_id", org.id).order("created_at", { ascending: false });

  return (
    <>
      <header className="px-6 py-4 border-b border-border bg-background"><h1 className="font-display text-xl font-bold">Buses</h1><p className="text-sm text-muted">Riders see each bus as &quot;Label - {org.name}&quot;</p></header>
      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
          {(buses ?? []).length === 0 && <p className="text-muted text-sm">No buses yet.</p>}
          {(buses ?? []).map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Bus className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{b.label}</p>
                <p className="text-xs text-muted">{org.name}{b.plate_number ? " - " + b.plate_number : ""}{b.capacity ? " - " + b.capacity + " seats" : ""}</p>
              </div>
              <form action={deleteBus}><input type="hidden" name="id" value={b.id} /><button className="text-muted hover:text-danger"><Trash2 className="w-4 h-4" /></button></form>
            </div>
          ))}
        </div>
        <form action={createBus} className="rounded-xl border border-border bg-background p-4 space-y-3 h-fit">
          <h2 className="font-semibold">Add bus</h2>
          <input type="hidden" name="org_id" value={org.id} />
          <input name="label" required placeholder="Label (e.g. Bus 28)" className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <input name="plate_number" placeholder="Plate number (optional)" className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <input name="capacity" type="number" min="1" placeholder="Capacity (optional)" className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <button className="w-full py-2 rounded-lg bg-primary hover:bg-primary-dark text-primary-on text-sm font-medium">Add bus</button>
        </form>
      </div>
    </>
  );
}
