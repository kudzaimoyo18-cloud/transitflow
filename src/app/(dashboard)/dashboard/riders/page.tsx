import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { confirmPayment, rejectPayment, recordCashPayment } from "../../actions";
import { Check, X, MapPin } from "lucide-react";

function money(n: number, ccy: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(n || 0);
}
const BADGE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  due: "bg-amber-50 text-amber-700",
  overdue: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-500",
};

export default async function RidersPage() {
  const ctx = await requireContext();
  const org = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff")!.organizations;
  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("payments")
    .select("id, amount, currency, method, created_at, reference, profiles!payments_rider_id_fkey(full_name), rider_subscriptions(routes(name))")
    .eq("org_id", org.id).eq("status", "pending_confirmation").order("created_at", { ascending: true });

  const { data: subs } = await supabase
    .from("rider_subscriptions")
    .select("id, rider_id, status, next_due_date, monthly_price, home_address, profiles!rider_subscriptions_rider_id_fkey(full_name, phone), routes(name)")
    .eq("org_id", org.id).order("status", { ascending: true });

  const pend = (pending ?? []) as unknown as Array<{ id: string; amount: number; currency: string; method: string; reference: string | null; profiles: { full_name: string } | null; rider_subscriptions: { routes: { name: string } | null } | null }>;
  const roster = (subs ?? []) as unknown as Array<{ id: string; rider_id: string; status: string; next_due_date: string; monthly_price: number; home_address: string | null; profiles: { full_name: string; phone: string | null } | null; routes: { name: string } | null }>;

  return (
    <>
      <header className="px-6 py-4 border-b border-border bg-white"><h1 className="text-xl font-bold">Riders &amp; Payments</h1></header>
      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <h2 className="font-semibold">Payments to confirm</h2>
            <span className="ml-auto text-sm text-muted">{pend.length} pending</span>
          </div>
          {pend.length === 0 ? <div className="p-6 text-center text-muted text-sm">Nothing waiting.</div> : (
            <ul className="divide-y divide-border">
              {pend.map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.profiles?.full_name ?? "Rider"}</p>
                    <p className="text-xs text-muted">{p.rider_subscriptions?.routes?.name} - {p.method.replace("_", " ")}{p.reference ? " - ref " + p.reference : ""}</p>
                  </div>
                  <span className="font-semibold">{money(Number(p.amount), p.currency)}</span>
                  <form action={confirmPayment}><input type="hidden" name="id" value={p.id} /><button className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100" title="Confirm"><Check className="w-4 h-4" /></button></form>
                  <form action={rejectPayment}><input type="hidden" name="id" value={p.id} /><button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Reject"><X className="w-4 h-4" /></button></form>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-border"><h2 className="font-semibold">Rider roster ({roster.length})</h2></div>
          {roster.length === 0 ? <div className="p-6 text-center text-muted text-sm">No riders yet. Share your invite code (Settings) so riders can join.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted border-b border-border">
                  <tr><th className="px-4 py-2 font-medium">Rider</th><th className="px-4 py-2 font-medium">Route</th><th className="px-4 py-2 font-medium">Home</th><th className="px-4 py-2 font-medium">Status</th><th className="px-4 py-2 font-medium">Next due</th><th className="px-4 py-2 font-medium text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {roster.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3"><p className="font-medium">{s.profiles?.full_name ?? "Rider"}</p><p className="text-xs text-muted">{s.profiles?.phone}</p></td>
                      <td className="px-4 py-3 text-muted">{s.routes?.name}</td>
                      <td className="px-4 py-3 text-muted">{s.home_address ? <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.home_address}</span> : "-"}</td>
                      <td className="px-4 py-3"><span className={"px-2 py-0.5 rounded-full text-xs font-medium " + (BADGE[s.status] ?? "")}>{s.status}</span></td>
                      <td className="px-4 py-3 text-muted">{s.next_due_date}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={recordCashPayment} className="inline-flex items-center gap-1 justify-end">
                          <input type="hidden" name="org_id" value={org.id} />
                          <input type="hidden" name="subscription_id" value={s.id} />
                          <input type="hidden" name="rider_id" value={s.rider_id} />
                          <input type="hidden" name="amount" value={s.monthly_price} />
                          <input type="hidden" name="currency" value={org.currency} />
                          <input type="hidden" name="method" value="cash" />
                          <button className="px-2.5 py-1 rounded-lg border border-border hover:bg-surface text-xs font-medium">Record {money(Number(s.monthly_price), org.currency)}</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
