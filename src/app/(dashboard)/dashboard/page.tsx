import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { FleetMap } from "@/components/map/FleetMap";
import { TrendingUp, Users, AlertTriangle, Wallet, Phone } from "lucide-react";

function money(n: number, ccy: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(n || 0);
}

export default async function OverviewPage() {
  const ctx = await requireContext();
  const staff = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff")!;
  const org = staff.organizations;
  const supabase = await createClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  const [subsRes, payRes, expRes, overdueRes] = await Promise.all([
    supabase.from("rider_subscriptions").select("status, monthly_price").eq("org_id", org.id),
    supabase.from("payments").select("amount").eq("org_id", org.id).eq("status", "confirmed").gte("confirmed_at", monthStart),
    supabase.from("expenses").select("amount").eq("org_id", org.id).gte("expense_date", monthStart),
    supabase.from("rider_subscriptions")
      .select("id, next_due_date, monthly_price, profiles!rider_subscriptions_rider_id_fkey(full_name, phone), routes(name)")
      .eq("org_id", org.id).eq("status", "overdue").order("next_due_date", { ascending: true }).limit(8),
  ]);

  const subs = subsRes.data ?? [];
  const mrr = subs.filter((s) => s.status !== "cancelled").reduce((a, s) => a + Number(s.monthly_price), 0);
  const paid = subs.filter((s) => s.status === "active").length;
  const unpaid = subs.filter((s) => s.status === "due" || s.status === "overdue").length;
  const collected = (payRes.data ?? []).reduce((a, p) => a + Number(p.amount), 0);
  const expenses = (expRes.data ?? []).reduce((a, e) => a + Number(e.amount), 0);
  const profit = collected - expenses;
  const overdue = (overdueRes.data ?? []) as unknown as Array<{ id: string; next_due_date: string; monthly_price: number; profiles: { full_name: string; phone: string | null } | null; routes: { name: string } | null }>;

  const cards = [
    { label: "Collected this month", value: money(collected, org.currency), icon: Wallet, tint: "text-emerald-600 bg-emerald-50" },
    { label: "Monthly recurring (MRR)", value: money(mrr, org.currency), icon: TrendingUp, tint: "text-primary bg-primary/10" },
    { label: "Paid riders", value: paid + " / " + (paid + unpaid), icon: Users, tint: "text-blue-600 bg-blue-50" },
    { label: "Profit this month", value: money(profit, org.currency), icon: TrendingUp, tint: (profit >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50") },
  ];

  return (
    <>
      <header className="px-6 py-4 border-b border-border bg-white">
        <h1 className="text-xl font-bold">Overview</h1>
        <p className="text-sm text-muted">{org.name}</p>
      </header>

      <div className="p-6 space-y-6">
        <FleetMap orgId={org.id} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-white p-4">
              <div className={"w-9 h-9 rounded-lg flex items-center justify-center mb-3 " + c.tint}>
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-sm text-muted">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="font-semibold">Overdue riders</h2>
            <span className="ml-auto text-sm text-muted">{overdue.length} to chase</span>
          </div>
          {overdue.length === 0 ? (
            <div className="p-6 text-center text-muted text-sm">No overdue riders. </div>
          ) : (
            <ul className="divide-y divide-border">
              {overdue.map((o) => (
                <li key={o.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{o.profiles?.full_name ?? "Rider"}</p>
                    <p className="text-xs text-muted">{o.routes?.name} - due {o.next_due_date}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{money(Number(o.monthly_price), org.currency)}</span>
                  {o.profiles?.phone && (
                    <a href={"tel:" + o.profiles.phone} className="p-2 rounded-lg border border-border hover:bg-surface" title="Call">
                      <Phone className="w-4 h-4 text-muted" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
