import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { DriverConsole } from "./DriverConsole";

export default async function DriverPage() {
  const ctx = await requireContext();
  const member = ctx.memberships.find((m) => m.role === "driver" || m.role === "org_owner" || m.role === "org_staff")!;
  const supabase = await createClient();

  const { data: routes } = await supabase
    .from("routes").select("id, name, origin, destination, bus_id, buses(label), stops(id, name, position)")
    .eq("org_id", member.org_id).eq("active", true).order("name");

  const { data: active } = await supabase
    .from("trips").select("id, route_id, status, routes(name, stops(id, name, position))")
    .eq("driver_id", ctx.userId).eq("status", "in_progress").order("started_at", { ascending: false }).limit(1).maybeSingle();

  return (
    <DriverConsole
      orgId={member.org_id}
      driverName={ctx.profile?.full_name ?? "Driver"}
      routes={(routes ?? []) as never}
      activeTrip={(active ?? null) as never}
    />
  );
}
