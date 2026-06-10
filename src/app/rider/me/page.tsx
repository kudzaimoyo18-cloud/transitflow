import Link from "next/link";
import { requireContext } from "@/lib/session";
import { LogOut, User, Building2, Ticket } from "lucide-react";

export default async function MePage() {
  const ctx = await requireContext();
  const rider = ctx.memberships.find((m) => m.role === "rider");
  return (
    <div className="p-4 pt-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">{(ctx.profile?.full_name || ctx.email).charAt(0).toUpperCase()}</div>
        <div><p className="font-bold text-lg">{ctx.profile?.full_name || "Rider"}</p><p className="text-sm text-muted">{ctx.email}</p></div>
      </div>

      <div className="rounded-xl border border-border bg-white divide-y divide-border">
        <div className="flex items-center gap-3 p-4"><Building2 className="w-5 h-5 text-muted" /><div><p className="text-xs text-muted">Transport company</p><p className="font-medium">{rider?.organizations.name ?? "None"}</p></div></div>
        <div className="flex items-center gap-3 p-4"><User className="w-5 h-5 text-muted" /><div><p className="text-xs text-muted">Phone</p><p className="font-medium">{ctx.profile?.phone ?? "Not set"}</p></div></div>
        <Link href="/rider/subscribe" className="flex items-center gap-3 p-4 hover:bg-surface"><Ticket className="w-5 h-5 text-muted" /><span className="font-medium">Change / add route</span></Link>
      </div>

      <form action="/auth/signout" method="POST">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium"><LogOut className="w-4 h-4" /> Sign out</button>
      </form>
    </div>
  );
}
