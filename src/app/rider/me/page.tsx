import Link from "next/link";
import { requireContext } from "@/lib/session";
import { LogOut, User, Building2, Ticket } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default async function MePage() {
  const ctx = await requireContext();
  const rider = ctx.memberships.find((m) => m.role === "rider");
  return (
    <div className="p-4 pt-6 space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary text-primary-on flex items-center justify-center font-display text-2xl font-bold">
          {(ctx.profile?.full_name || ctx.email).charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-xl">{ctx.profile?.full_name || "Rider"}</p>
          <p className="text-sm text-muted">{ctx.email}</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="rounded-3xl bg-surface divide-y divide-border overflow-hidden">
        <div className="flex items-center gap-3 p-4"><Building2 className="w-5 h-5 text-meta" /><div><p className="text-xs text-meta">Transport company</p><p className="font-medium">{rider?.organizations.name ?? "None"}</p></div></div>
        <div className="flex items-center gap-3 p-4"><User className="w-5 h-5 text-meta" /><div><p className="text-xs text-meta">Phone</p><p className="font-medium">{ctx.profile?.phone ?? "Not set"}</p></div></div>
        <Link href="/rider/subscribe" className="flex items-center gap-3 p-4 hover:bg-surface-2 transition-colors"><Ticket className="w-5 h-5 text-meta" /><span className="font-medium">Change / add route</span></Link>
      </div>

      <form action="/auth/signout" method="POST">
        <button className="pill w-full flex items-center justify-center gap-2 py-3.5 bg-danger-soft text-danger font-semibold">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </form>
    </div>
  );
}