import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/session";
import { updateOrgSettings } from "../../actions";
import { InviteCode } from "./InviteCode";

export default async function SettingsPage() {
  const ctx = await requireContext();
  const org = ctx.memberships.find((m) => m.role === "org_owner" || m.role === "org_staff")!.organizations;
  const supabase = await createClient();
  const { data } = await supabase.from("organizations").select("*").eq("id", org.id).single();
  const o = data ?? org;

  return (
    <>
      <header className="px-6 py-4 border-b border-border bg-background"><h1 className="font-display text-xl font-bold">Settings</h1></header>
      <div className="p-6 max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-background p-5">
          <h2 className="font-semibold mb-1">Rider invite code</h2>
          <p className="text-sm text-muted mb-3">Share this code (or link) so riders & drivers can join {o.name}.</p>
          <InviteCode code={o.invite_code} />
        </div>

        <form action={updateOrgSettings} className="rounded-xl border border-border bg-background p-5 space-y-4">
          <input type="hidden" name="org_id" value={o.id} />
          <h2 className="font-semibold">Payment links</h2>
          <p className="text-sm text-muted">Paste your own Stripe and/or Ziina payment link. Riders tap Pay and money goes straight to you.</p>
          <div className="space-y-1.5"><label className="text-sm font-medium">Stripe payment link</label><input name="stripe_payment_link" defaultValue={o.stripe_payment_link ?? ""} placeholder="https://buy.stripe.com/..." className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Ziina payment link</label><input name="ziina_payment_link" defaultValue={o.ziina_payment_link ?? ""} placeholder="https://pay.ziina.com/..." className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-sm font-medium">City</label><input name="city" defaultValue={o.city ?? ""} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Contact phone</label><input name="contact_phone" defaultValue={o.contact_phone ?? ""} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-primary-on text-sm font-medium">Save</button>
        </form>
      </div>
    </>
  );
}
