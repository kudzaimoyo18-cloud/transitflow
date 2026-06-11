import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { reportPayment } from "../actions";
import { ExternalLink, CheckCircle2, Clock } from "lucide-react";

function money(n: number, ccy: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy, maximumFractionDigits: 0 }).format(n || 0);
}

export default async function PayPage({ searchParams }: { searchParams: Promise<{ reported?: string }> }) {
  const sp = await searchParams;
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: sub } = await supabase
    .from("rider_subscriptions")
    .select("id, status, next_due_date, monthly_price, org_id, organizations(name, currency, stripe_payment_link, ziina_payment_link)")
    .eq("rider_id", ctx.userId).neq("status", "cancelled").order("started_at", { ascending: false }).limit(1).maybeSingle();

  if (!sub) return <div className="p-6 pt-24 text-center"><p className="text-muted">No subscription.</p><Link href="/rider/subscribe" className="text-foreground font-medium underline">Choose a route</Link></div>;

  const s = sub as unknown as { id: string; status: string; next_due_date: string; monthly_price: number; org_id: string; organizations: { name: string; currency: string; stripe_payment_link: string | null; ziina_payment_link: string | null } };
  const o = s.organizations;

  const { data: history } = await supabase.from("payments").select("id, amount, currency, status, created_at, method").eq("subscription_id", s.id).order("created_at", { ascending: false }).limit(10);

  return (
    <div className="p-4 pt-6 space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Pay {o.name}</h1>
        <p className="text-sm text-muted">{s.status === "active" ? "Paid until " + s.next_due_date : "Due " + s.next_due_date}</p>
      </div>

      {sp.reported && (
        <div className="rounded-2xl bg-warn-soft text-warn text-sm font-medium p-4 flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0" /> Payment reported. Waiting for {o.name} to confirm.
        </div>
      )}

      <div className="rounded-3xl bg-primary text-primary-on p-7 text-center">
        <p className="text-xs uppercase tracking-widest opacity-60 font-bold">This month</p>
        <p className="font-display text-5xl font-bold mt-2">{money(Number(s.monthly_price), o.currency)}</p>
      </div>

      <div className="space-y-2.5">
        {o.stripe_payment_link && (
          <a href={o.stripe_payment_link} target="_blank" rel="noopener noreferrer"
            className="pill flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-on font-semibold hover:bg-primary-dark transition-colors">
            Pay with card (Stripe) <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {o.ziina_payment_link && (
          <a href={o.ziina_payment_link} target="_blank" rel="noopener noreferrer"
            className="pill flex items-center justify-center gap-2 w-full py-4 bg-surface-2 text-foreground font-semibold hover:bg-surface transition-colors">
            Pay with Ziina <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {!o.stripe_payment_link && !o.ziina_payment_link && (
          <p className="text-sm text-muted text-center">Your company hasn&apos;t added an online payment link yet. Pay them directly, then report it below.</p>
        )}
      </div>

      <form action={reportPayment} className="rounded-3xl bg-surface p-5 space-y-3">
        <p className="font-display font-semibold text-sm">Already paid? Tell your company</p>
        <input type="hidden" name="org_id" value={s.org_id} />
        <input type="hidden" name="subscription_id" value={s.id} />
        <input type="hidden" name="amount" value={s.monthly_price} />
        <input type="hidden" name="currency" value={o.currency} />
        <select name="method" className="pill w-full px-4 py-3 bg-background border border-border text-sm">
          <option value="stripe_link">Stripe / card</option>
          <option value="ziina_link">Ziina</option>
          <option value="bank_transfer">Bank transfer</option>
          <option value="cash">Cash</option>
          <option value="other">Other</option>
        </select>
        <input name="reference" placeholder="Reference / receipt no. (optional)" className="pill w-full px-4 py-3 bg-background border border-border text-sm" />
        <button className="pill w-full py-3.5 border-2 border-primary text-foreground font-semibold hover:bg-primary hover:text-primary-on transition-colors">I have paid</button>
      </form>

      {(history ?? []).length > 0 && (
        <div className="space-y-2">
          <p className="font-display text-sm font-semibold px-1">Payment history</p>
          {(history ?? []).map((h) => (
            <div key={h.id} className="flex items-center gap-3 text-sm bg-surface rounded-2xl px-4 py-3">
              {h.status === "confirmed" ? <CheckCircle2 className="w-4 h-4 text-signal" /> : <Clock className="w-4 h-4 text-warn" />}
              <span className="flex-1 font-medium">{money(Number(h.amount), h.currency)}</span>
              <span className="text-meta">{new Date(h.created_at).toLocaleDateString()}</span>
              <span className="text-xs capitalize text-meta">{h.status.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}