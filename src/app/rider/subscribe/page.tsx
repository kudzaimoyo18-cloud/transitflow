import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { SubscribeForm } from "./SubscribeForm";

export default async function SubscribePage() {
  const ctx = await requireContext();
  const rider = ctx.memberships.find((m) => m.role === "rider");
  const supabase = await createClient();
  let routes: unknown[] = [];
  let currency = "AED";
  if (rider) {
    currency = rider.organizations.currency;
    const { data } = await supabase.from("routes").select("id, name, origin, destination, monthly_price, departure_time, stops(id, name)").eq("org_id", rider.org_id).eq("active", true).order("name");
    routes = data ?? [];
  }
  return (
    <div className="p-4 pt-6">
      <h1 className="font-display text-2xl font-bold mb-1">Choose your route</h1>
      <p className="text-sm text-muted mb-5">{rider?.organizations.name}</p>
      <SubscribeForm routes={routes as never} currency={currency} />
    </div>
  );
}