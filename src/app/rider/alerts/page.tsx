import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { AlertsList } from "./AlertsList";

export default async function AlertsPage() {
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data } = await supabase.from("notifications").select("id, title, body, type, read, created_at").eq("user_id", ctx.userId).order("created_at", { ascending: false }).limit(50);
  return (
    <div className="p-4 pt-6">
      <h1 className="font-display text-2xl font-bold mb-5">Alerts</h1>
      <AlertsList userId={ctx.userId} initial={(data ?? []) as never} />
    </div>
  );
}