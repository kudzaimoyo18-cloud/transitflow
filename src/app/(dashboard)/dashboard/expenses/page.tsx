import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { createExpense } from "../../actions";

function money(n: number, ccy: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(n || 0);
}
const CATS = ["fuel", "maintenance", "salaries", "insurance", "fines", "other"];
const today = () => new Date().toISOString().slice(0, 10);

export default async function ExpensesPage() {
  const ctx = await requireContext();
  const org = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff")!.organizations;
  const supabase = await createClient();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

  const { data: rows } = await supabase.from("expenses").select("id, category, amount, currency, description, expense_date, buses(label)").eq("org_id", org.id).order("expense_date", { ascending: false }).limit(100);
  const { data: buses } = await supabase.from("buses").select("id, label").eq("org_id", org.id);
  const list = (rows ?? []) as unknown as Array<{ id: string; category: string; amount: number; currency: string; description: string | null; expense_date: string; buses: { label: string } | null }>;

  const byCat: Record<string, number> = {};
  let monthTotal = 0;
  list.forEach((r) => { if (r.expense_date >= monthStart) { byCat[r.category] = (byCat[r.category] ?? 0) + Number(r.amount); monthTotal += Number(r.amount); } });

  return (
    <>
      <header className="px-6 py-4 border-b border-border bg-white"><h1 className="text-xl font-bold">Expenses &amp; Accounting</h1></header>
      <div className="p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-white p-3"><p className="text-xs text-muted">This month</p><p className="text-lg font-bold">{money(monthTotal, org.currency)}</p></div>
            {["fuel","maintenance"].map((c)=>(<div key={c} className="rounded-xl border border-border bg-white p-3"><p className="text-xs text-muted capitalize">{c}</p><p className="text-lg font-bold">{money(byCat[c] ?? 0, org.currency)}</p></div>))}
            <div className="rounded-xl border border-border bg-white p-3"><p className="text-xs text-muted">Other</p><p className="text-lg font-bold">{money((monthTotal - (byCat["fuel"]??0) - (byCat["maintenance"]??0)), org.currency)}</p></div>
          </div>
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-border"><h2 className="font-semibold">Recent expenses</h2></div>
            {list.length === 0 ? <div className="p-6 text-center text-muted text-sm">No expenses recorded.</div> : (
              <table className="w-full text-sm">
                <thead className="text-left text-muted border-b border-border"><tr><th className="px-4 py-2 font-medium">Date</th><th className="px-4 py-2 font-medium">Category</th><th className="px-4 py-2 font-medium">Bus</th><th className="px-4 py-2 font-medium">Note</th><th className="px-4 py-2 font-medium text-right">Amount</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {list.map((r)=>(<tr key={r.id}><td className="px-4 py-2 text-muted">{r.expense_date}</td><td className="px-4 py-2 capitalize">{r.category}</td><td className="px-4 py-2 text-muted">{r.buses?.label ?? "-"}</td><td className="px-4 py-2 text-muted">{r.description ?? "-"}</td><td className="px-4 py-2 text-right font-medium">{money(Number(r.amount), r.currency)}</td></tr>))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <form action={createExpense} className="rounded-xl border border-border bg-white p-4 space-y-3 h-fit">
          <h2 className="font-semibold">Add expense</h2>
          <input type="hidden" name="org_id" value={org.id} />
          <input type="hidden" name="currency" value={org.currency} />
          <select name="category" className="w-full px-3 py-2 rounded-lg border border-border text-sm capitalize">{CATS.map((c)=><option key={c} value={c}>{c}</option>)}</select>
          <select name="bus_id" className="w-full px-3 py-2 rounded-lg border border-border text-sm"><option value="">No specific bus</option>{(buses ?? []).map((b)=><option key={b.id} value={b.id}>{b.label}</option>)}</select>
          <input name="amount" type="number" min="0" step="0.01" required placeholder={"Amount (" + org.currency + ")"} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <input name="expense_date" type="date" defaultValue={today()} className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <input name="description" placeholder="Note (optional)" className="w-full px-3 py-2 rounded-lg border border-border text-sm" />
          <button className="w-full py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium">Add expense</button>
        </form>
      </div>
    </>
  );
}
